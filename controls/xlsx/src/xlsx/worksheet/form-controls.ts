/**
 * Worksheet form controls (VML `legacyDrawing` + `x:ClientData`).
 *
 * Scope: P2 CheckBox / ComboBox / OptionButton plus P3 Button, ListBox,
 * GroupBox, FormLabel, ScrollBar, SpinButton, EditBox.
 * Write path is VML-only. MS-XLSX `formControlPr` / ctrlProp parts are
 * read/preserve only when present as foreign VML or package content.
 *
 * Citations:
 * - docs/api/FORM-CONTROLS-PROPOSAL.md; docs/specs/form-controls.md
 * - XlsIO CheckBoxShapeSerializator / ComboBoxShapeSerializator /
 * OptionButtonShapeSerializator / Vml.cs (P2); P3 ClientData vocabulary from
 * `vml-spreadsheetDrawing.xsd` ST_ObjectType + CT_ClientData children
 * - sml CT_Worksheet `legacyDrawing` after `drawing`
 * - VML namespaces: `urn:schemas-microsoft-com:vml` (v),
 * `urn:schemas-microsoft-com:office:office` (o),
 * `urn:schemas-microsoft-com:office:excel` (x)
 *
 * Package side effects (vmlDrawing part + sheet relationship) defer to
 * flush/save (API-RULES R5.1). DrawingML text/shapes/images/charts stay on
 * `<drawing>`; this module never shares that part.
 *
 * @private
 */

import { InvalidArgumentError } from '../core/errors';
import { EMU_PER_PT, EMU_PER_PX_96DPI } from '../core/length';
import { VML_DRAWING_CONTENT_TYPE, VML_DRAWING_REL_TYPE_TRANSITIONAL, isVmlDrawingRelationshipType } from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { normalizePartName, resolveRelationshipTarget } from '../core/package/part-names';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8, escapeXml, escapeXmlText, parseAttrMap, unescapeXml } from '../core/xml/minimal-xml';
import { DRAWING_SUCCESSORS, relativeTargetFromSheetToDrawing } from './text-boxes';

/** VML (v:) namespace. Citation: XlsIO `Vml.VNamespace`. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const VML_NS: 'urn:schemas-microsoft-com:vml' = 'urn:schemas-microsoft-com:vml';
/** Office (o:) namespace. Citation: XlsIO `Vml.ONamespace`. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const OFFICE_NS: 'urn:schemas-microsoft-com:office:office' = 'urn:schemas-microsoft-com:office:office';
/** Excel (x:) namespace. Citation: XlsIO `Vml.XNamespace`. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const EXCEL_NS: 'urn:schemas-microsoft-com:office:excel' = 'urn:schemas-microsoft-com:office:excel';

/** Form-control shape instance (ShapeInstance = 201). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const FORM_CONTROL_SHAPE_INSTANCE: 201 = 201;
const FORM_CONTROL_SHAPE_TYPE_ID: string = `_x0000_t${FORM_CONTROL_SHAPE_INSTANCE}`;

/**
 * Comment / threaded-comment note shape instance (ShapeInstance = 202).
 * Citation: ECMA-376-1 Annex L / ECMA-376-4 §19.4 ClientData ObjectType="Note";
 * Excel expects `#_x0000_t202` note chrome for comments indicators.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const COMMENT_NOTE_SHAPE_INSTANCE: 202 = 202;
const COMMENT_NOTE_SHAPE_TYPE_ID: string = `_x0000_t${COMMENT_NOTE_SHAPE_INSTANCE}`;

/** Default note balloon size (pt) — Excel-ish placeholder chrome. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const COMMENT_NOTE_WIDTH_PT: 108 = 108;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const COMMENT_NOTE_HEIGHT_PT: 59.25 = 59.25;

/** Specifies the selection state of a checkbox or radio button. */
export type CheckState = 'unchecked' | 'checked' | 'mixed';

/**
 * Specifies how a dropdown behaves: a plain list, an editable combo, or a
 * list shown only while open.
 */
export type ComboDropStyle = 'combo' | 'comboedit' | 'simple';

/**
 * Horizontal caption alignment for form controls with a text label.
 * Wire: `x:TextHAlign` (Left|Center|Right|Justify) and caption div `text-align`.
 * Citation: `vml-spreadsheetDrawing.xsd` CT_ClientData/TextHAlign.
 */
export type FormControlHorizontalAlignment = 'left' | 'center' | 'right' | 'justify';

/**
 * Vertical caption alignment for form controls with a text label.
 * Wire: `x:TextVAlign` (Top|Center|Bottom|Justify).
 * Citation: `vml-spreadsheetDrawing.xsd` CT_ClientData/TextVAlign.
 */
export type FormControlVerticalAlignment = 'top' | 'center' | 'bottom' | 'justify';

/**
 * Caption typeface style for form-control labels (Excel Format Control → Font →
 * Font style). Whole-caption only — not mixed rich runs.
 * Wire: nested HTML inside VML caption `font` — plain / `<i>` / `<b>` /
 * `<b><i>…</i></b>`.
 * Citation: Excel-authored VML `output/_excel-form-font-effects.xlsx`.
 */
export type FormControlFontStyle = 'regular' | 'italic' | 'bold' | 'boldItalic';

/**
 * Caption underline for form-control labels (Excel Format Control → Font →
 * Underline). Whole-caption only.
 * Wire: none = no tag; single = `<u>`; double = `<u class="font5">`
 * (Excel double-underline class on form-control captions).
 * Citation: Excel-authored VML `output/_excel-form-font-effects.xlsx`.
 */
export type FormControlUnderline = 'none' | 'single' | 'double';

/** Excel form-control double-underline class on nested caption `<u>`. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const FORM_CONTROL_DOUBLE_UNDERLINE_CLASS: 'font5' = 'font5';

/**
 * Common settings shared by all form controls placed on a worksheet, such as
 * name, visibility, position, and size.
 */
export interface FormControlBase {
    /** The name that identifies the control — for example `'CheckBox1'`. */
    name: string;
    /** Whether the control is visible on the worksheet. */
    isVisible: boolean;
    /**
     * The alt text describing the control for accessibility tools;
     * `undefined` when not set.
     */
    alternativeText: string | undefined;
    /**
     * The row the control's top edge is anchored to — 1-based, like Excel
     * rows.
     */
    readonly row: number;
    /**
     * The column the control's left edge is anchored to — 1-based, like
     * Excel columns.
     */
    readonly column: number;
    /**
     * The width of the control in points (72 pt = 1 in).
     */
    readonly width: number;
    /**
     * The height of the control in points (72 pt = 1 in).
     */
    readonly height: number;
    /**
     * The macro that runs when the control is activated. The name is stored
     * only; this library never executes it.
     */
    onAction: string | undefined;
    /**
     * Whether the control is printed with the worksheet.
     * Wire: `x:PrintObject` (`ST_TrueFalseBlank`; default true — omitted when true).
     */
    printObject: boolean;
    /**
     * Whether the control shape is locked when the sheet is protected.
     * Wire: `x:Locked` (default true). Distinct from caption `isTextLocked` /
     * `x:LockText`.
     */
    isLocked: boolean;
    /**
     * Whether the control moves when cells under its anchor are inserted or
     * deleted. Wire: `x:MoveWithCells` (`ST_TrueFalseBlank`; default true).
     */
    moveWithCells: boolean;
    /**
     * Whether the control resizes when cells under its anchor change size.
     * Wire: `x:SizeWithCells` (`ST_TrueFalseBlank`). Defaults true for caption
     * kinds; false for combo, list, scroll, and spin (XlsIO-aligned).
     */
    sizeWithCells: boolean;
}

/**
 * Visual style for form controls that show a text label (checkbox, option,
 * button, group, label, edit). Wire: VML `fillcolor`/`filled`, caption
 * `font` face/size/color plus nested effect tags (`b`/`i`/`u`/`s`/`sup`/`sub`),
 * `x:TextHAlign` / `x:TextVAlign`, div `text-align`.
 * Citation: Excel Format Control → Font; VML fixture
 * `output/_excel-form-font-effects.xlsx`.
 */
export interface FormControlStyle {
    /**
     * Solid fill color as `RRGGBB`, or `undefined` for no fill (`filled="f"`).
     * Accepts `#RRGGBB` or `AARRGGBB` on set (alpha stripped).
     */
    fillColor: string | undefined;
    /** Caption font family (default `Calibri`). Wire: `font@face`. */
    fontName: string;
    /**
     * Caption font size in points (default `10`). Wire: `font@size` in
     * half-points (`pt * 20`).
     */
    fontSize: number;
    /**
     * Caption font color as `RRGGBB`, or `undefined` for automatic
     * (`color="auto"`). Accepts `#RRGGBB` or `AARRGGBB` on set.
     */
    fontColor: string | undefined;
    /**
     * Caption typeface style (default `'regular'`).
     * Wire: nested `<b>` / `<i>` inside caption `font`.
     */
    fontStyle: FormControlFontStyle;
    /**
     * Caption underline (default `'none'`).
     * Wire: `<u>` (single) or `<u class="font5">` (double).
     */
    underline: FormControlUnderline;
    /**
     * Whether the caption is struck through (default `false`).
     * Wire: nested `<s>` inside caption `font`.
     */
    isStrikethrough: boolean;
    /**
     * Whether the caption is superscript (default `false`). Mutually exclusive
     * with `isSubscript` — setting one true clears the other.
     * Wire: nested `<sup>`.
     */
    isSuperscript: boolean;
    /**
     * Whether the caption is subscript (default `false`). Mutually exclusive
     * with `isSuperscript` — setting one true clears the other.
     * Wire: nested `<sub>`.
     */
    isSubscript: boolean;
    /**
     * Excel Format Control → Font → **Normal font**.
     * There is no discrete VML attribute; enabling (`true`) resets face/size/
     * color and font effects to caption defaults (Calibri 10 pt, auto color,
     * regular, no underline/effects). Reading returns `true` when the caption
     * already matches those defaults.
     */
    isNormalFont: boolean;
    /**
     * Horizontal caption alignment (default `'left'`).
     */
    horizontalAlignment: FormControlHorizontalAlignment;
    /**
     * Vertical caption alignment. Default `'center'` for checkbox, option, and
     * button; `'top'` for group, label, and edit.
     */
    verticalAlignment: FormControlVerticalAlignment;
}

/**
 * Represents a checkbox placed on a worksheet, letting you set its label,
 * checked state, and the cell it is linked to.
 */
export interface CheckBox extends FormControlBase, FormControlStyle {
    /** The label shown beside the checkbox. */
    text: string;
    /** Whether the checkbox is checked, unchecked, or in the mixed state. */
    checkState: CheckState;
    /**
     * The cell that reflects the checkbox's state, such as `A1`. When the user
     * checks or clears the box, Excel writes TRUE or FALSE into this cell.
     */
    linkedCell: string | undefined;
    /** Whether the control is drawn with a 3-D shaded look. */
    isDisplay3DShading: boolean;
    /** Whether the label text is locked against editing when the sheet is protected. */
    isTextLocked: boolean;
}

/**
 * Represents a dropdown list placed on a worksheet, letting you set its
 * source range, selection, and the cell it is linked to.
 */
export interface ComboBox extends FormControlBase {
    /** The cell range the dropdown's items come from, such as `Sheet1!A1:A5`. */
    listFillRange: string | undefined;
    /**
     * The cell that receives the chosen item's text (or its index, depending
     * on the viewer), such as `B1`.
     */
    linkedCell: string | undefined;
    /** Which item is selected, counted from 1; `0` means nothing is selected. */
    selectedIndex: number;
    /** How many items the dropdown shows at once before scrolling. */
    dropDownLines: number;
    /**
     * How the dropdown behaves: a plain list, an editable combo, or a list
     * shown only while open.
     */
    dropStyle: ComboDropStyle;
    /** Whether the control is drawn with a 3-D shaded look. */
    isDisplay3DShading: boolean;
    /** The displayed text of the selected item. Not currently supported; always `undefined`. */
    readonly selectedValue: string | undefined;
}

/**
 * Represents a radio button placed on a worksheet, letting you set its
 * label, selection state, and the cell it is linked to.
 */
export interface OptionButton extends FormControlBase, FormControlStyle {
    /** The text shown next to the option button. */
    text: string;
    /**
     * The button's selection state: `'checked'`, `'unchecked'`, or
     * `'mixed'` (a state neither on nor off, as in tri-state checkbox
     * scenarios).
     */
    checkState: CheckState;
    /**
     * The cell the selection is written to. `undefined` when the button is
     * not linked to a cell.
     */
    linkedCell: string | undefined;
    /** Whether the button is drawn with a three-dimensional appearance. */
    isDisplay3DShading: boolean;
    /**
     * Whether this button is the first in its group — the anchor that links
     * the group's buttons together.
     */
    isFirstButton: boolean;
    /** Whether the button's text cannot be edited by the user. */
    isTextLocked: boolean;
}

/**
 * Specifies how many items a list box lets the user select at once.
 * Not part of the shipped package surface (`stripInternal`).
 *
 * @private
 */
export type ListSelectionType = 'single' | 'multi' | 'extended';

/**
 * Restricts what a user can type into a text box, such as only numbers or
 * only references.
 */
export type EditValidation = 'text' | 'integer' | 'number' | 'reference' | 'formula';

/**
 * Represents a push button placed on a worksheet, letting you set its label
 * and the macro or action it runs when clicked.
 */
export interface FormButton extends FormControlBase, FormControlStyle {
    /** The text shown on the button. */
    text: string;
    /** Whether the button's text cannot be edited by the user. */
    isTextLocked: boolean;
}

/**
 * Represents a list box placed on a worksheet, letting you set its source
 * range, selection mode, and the cell it is linked to.
 */
export interface ListBox extends FormControlBase {
    /**
     * The cells the list's entries come from, given as a range address.
     * `undefined` when the list is not filled from the sheet.
     */
    listFillRange: string | undefined;
    /**
     * The cell the selected list entry is written to. `undefined` when the
     * list is not linked to a cell.
     */
    linkedCell: string | undefined;
    /**
     * The position of the selected entry — 1-based; `0` means nothing is
     * selected. Applies when a single entry can be selected.
     */
    selectedIndex: number;
    /**
     * The positions of the selected entries — 1-based — when the list allows
     * selecting several entries at once.
     */
    selectedIndices: ReadonlyArray<number>;
    /**
     * How many entries can be selected at once: one (`'single'`), several by
     * clicking (`'multi'`), or several with Shift/Ctrl (`'extended'`).
     * Not part of the shipped package surface (`stripInternal`).
     *
     * @private
     */
    selectionType: ListSelectionType;
    /** Whether the list is drawn with a three-dimensional appearance. */
    isDisplay3DShading: boolean;
    /**
     * The value stored with the list, used by forms that read the selection
     * as a number.
     */
    value: number;
}

/**
 * Represents a group box placed on a worksheet, used to visually arrange
 * related controls such as option buttons.
 */
export interface GroupBox extends FormControlBase, FormControlStyle {
    /** The caption shown at the top of the group box border. */
    text: string;
    /**
     * The cell the group's option-button selection is written to, taking
     * precedence over each option button's own `linkedCell`. `undefined`
     * when the group is not linked to a cell.
     */
    groupLinkedCell: string | undefined;
}

/**
 * Represents a text label placed on a worksheet, letting you set its caption
 * and the cell it is linked to.
 */
export interface FormLabel extends FormControlBase, FormControlStyle {
    /** The text shown on the label. */
    text: string;
    /**
     * The cell the label's text is linked to, so the label always shows the
     * cell's value. `undefined` when not linked.
     */
    textLink: string | undefined;
    /** Whether the label's text cannot be edited by the user. */
    isTextLocked: boolean;
}

/**
 * Represents a scroll bar placed on a worksheet, letting you set its range,
 * step size, orientation, and the cell it is linked to.
 */
export interface ScrollBar extends FormControlBase {
    /**
     * The cell the scroll bar's current position is written to.
     * `undefined` when the scroll bar is not linked to a cell.
     */
    linkedCell: string | undefined;
    /** The scroll bar's current position. */
    value: number;
    /** The lowest position the scroll bar can be moved to. */
    min: number;
    /** The highest position the scroll bar can be moved to. */
    max: number;
    /**
     * How far the position moves when an arrow at either end is clicked.
     */
    incrementalChange: number;
    /**
     * How far the position moves when the bar's track is clicked, like
     * flipping a page.
     */
    pageChange: number;
    /** Whether the bar is oriented horizontally instead of vertically. */
    isHorizontal: boolean;
}

/**
 * Represents a spin button placed on a worksheet, letting users increase or
 * decrease a linked cell's value one step at a time.
 */
export interface SpinButton extends FormControlBase {
    /**
     * The cell the spin button's current position is written to.
     * `undefined` when the spin button is not linked to a cell.
     */
    linkedCell: string | undefined;
    /** The spin button's current position. */
    value: number;
    /** The lowest position the spin button can be moved to. */
    min: number;
    /** The highest position the spin button can be moved to. */
    max: number;
    /**
     * How far the position moves each time an arrow is clicked.
     */
    incrementalChange: number;
}

/**
 * Represents a text input box placed on a worksheet, letting you set its
 * contents and restrict what users can type into it.
 */
export interface EditBox extends FormControlBase, FormControlStyle {
    /** The text shown in the edit box. */
    text: string;
    /**
     * The cell the edit box's text is linked to, so the cell always shows
     * what the user typed. `undefined` when not linked.
     */
    textLink: string | undefined;
    /**
     * Whether users can type multiple lines of text in the edit box, using
     * line breaks.
     */
    isMultiLine: boolean;
    /**
     * The kind of entry the edit box expects: normal text (`'text'`), whole
     * numbers (`'integer'`), any number (`'number'`), a cell or range
     * reference (`'reference'`), or a formula (`'formula'`).
     */
    validation: EditValidation;
    /**
     * Whether the edit box masks the typed text, like a password field.
     */
    isPassword: boolean;
    /** Whether the edit box's text cannot be edited by the user. */
    isTextLocked: boolean;
}

/** Host callbacks for dirty + package access. */
export interface FormControlsHost {
    markDirty(): void;
    readonly package: OpcPackage;
    readonly sheetPartName: string | undefined;
}

/**
 * FormControlKind.
 */
type FormControlKind = 'checkbox' | 'combo' | 'option' | 'button' | 'list' | 'group' | 'label' | 'scroll' | 'spin' | 'edit';

/** Default scroll/spin max (Excel form-control range ceiling). */
const DEFAULT_SCROLL_MAX: 30000 = 30_000;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_SCROLL_PAGE: 10 = 10;
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_SCROLL_DX: 15 = 15;
/** Default caption font size in points (VML `font@size` 200 half-points). */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_CAPTION_FONT_SIZE_PT: 10 = 10;
/** Default caption font family. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
const DEFAULT_CAPTION_FONT_NAME: 'Calibri' = 'Calibri';

/**
 * Internal entry for one form control.
 *
 * @private
 */
export interface FormControlEntry {
    kind: FormControlKind;
    shapeId: number;
    name: string;
    isVisible: boolean;
    alternativeText?: string | undefined;
    /** 0-based OOXML anchor row. */
    fromRow0: number;
    /** 0-based OOXML anchor col. */
    fromCol0: number;
    widthEmu: number;
    heightEmu: number;
    zIndex: number;
    onAction?: string | undefined;
    /** Wire `x:PrintObject` — default true. */
    printObject: boolean;
    /** Wire `x:Locked` — default true; distinct from isTextLocked. */
    isLocked: boolean;
    /** Wire `x:MoveWithCells` — default true. */
    moveWithCells: boolean;
    /** Wire `x:SizeWithCells` — kind-defaulted. */
    sizeWithCells: boolean;
    /** VML `@fillcolor` RRGGBB when filled. */
    fillColor?: string | undefined;
    fontName: string;
    /** Caption font size in points. */
    fontSize: number;
    fontColor?: string | undefined;
    fontStyle: FormControlFontStyle;
    underline: FormControlUnderline;
    isStrikethrough: boolean;
    isSuperscript: boolean;
    isSubscript: boolean;
    horizontalAlignment: FormControlHorizontalAlignment;
    verticalAlignment: FormControlVerticalAlignment;
    text: string;
    checkState: CheckState;
    linkedCell?: string | undefined;
    isDisplay3DShading: boolean;
    isTextLocked: boolean;
    listFillRange?: string | undefined;
    selectedIndex: number;
    dropDownLines: number;
    dropStyle: ComboDropStyle;
    isFirstButton: boolean;
    /** Group box link. Wire `x:FmlaGroup`. */
    groupLinkedCell?: string | undefined;
    /** Label / edit text link. Wire `x:FmlaTxbx`. */
    textLink?: string | undefined;
    selectionType: ListSelectionType;
    selectedIndices: number[];
    value: number;
    min: number;
    max: number;
    incrementalChange: number;
    pageChange: number;
    isHorizontal: boolean;
    isMultiLine: boolean;
    validation: EditValidation;
    isPassword: boolean;
    /** Opaque full shape XML when loaded from a foreign/unknown control. */
    foreignShapeXml?: string | undefined;
}

/**
 * Result of materializing the VML drawing part + sheet legacyDrawing relationship.
 *
 * @private
 */
export interface FormControlsMaterializeResult {
    /** Relationships to keep (non-VML-drawing). */
    readonly sheetRelsWithoutVmlDrawing: ReadonlyArray<OpcRelationship>;
    /** New or retained VML drawing relationship, if any shapes remain. */
    readonly vmlDrawingRel: OpcRelationship | undefined;
    /** `r:id` for worksheet `<legacyDrawing>` when present. */
    readonly legacyDrawingRelationshipId: string | undefined;
    /** Whether the model owns/emits legacyDrawing (strip bag duplicates). */
    readonly ownsLegacyDrawingElement: boolean;
}

/**
 * Mutable form-control collection for one worksheet (P2 + P3 kinds).
 *
 * @private
 */
export class FormControlsImpl {
    private readonly entries: FormControlEntry[] = [];
    private readonly checkBoxHandles: Map<FormControlEntry, CheckBoxHandle> = new Map<FormControlEntry, CheckBoxHandle>();
    private readonly comboHandles: Map<FormControlEntry, ComboBoxHandle> = new Map<FormControlEntry, ComboBoxHandle>();
    private readonly optionHandles: Map<FormControlEntry, OptionButtonHandle> = new Map<FormControlEntry, OptionButtonHandle>();
    private readonly buttonHandles: Map<FormControlEntry, FormButtonHandle> = new Map<FormControlEntry, FormButtonHandle>();
    private readonly listHandles: Map<FormControlEntry, ListBoxHandle> = new Map<FormControlEntry, ListBoxHandle>();
    private readonly groupHandles: Map<FormControlEntry, GroupBoxHandle> = new Map<FormControlEntry, GroupBoxHandle>();
    private readonly labelHandles: Map<FormControlEntry, FormLabelHandle> = new Map<FormControlEntry, FormLabelHandle>();
    private readonly scrollHandles: Map<FormControlEntry, ScrollBarHandle> = new Map<FormControlEntry, ScrollBarHandle>();
    private readonly spinHandles: Map<FormControlEntry, SpinButtonHandle> = new Map<FormControlEntry, SpinButtonHandle>();
    private readonly editHandles: Map<FormControlEntry, EditBoxHandle> = new Map<FormControlEntry, EditBoxHandle>();
    private host: FormControlsHost | undefined;
    private foreignShapesXml: string[] = [];
    private foreignRootExtra: string = '';
    private vmlPartName: string | undefined;
    private vmlRelId: string | undefined;
    private loaded: boolean = false;
    private dirty: boolean = false;
    private nextShapeId: number = 1025;
    private nextCheckBoxName: number = 1;
    private nextComboName: number = 1;
    private nextOptionName: number = 1;
    private nextButtonName: number = 1;
    private nextListName: number = 1;
    private nextGroupName: number = 1;
    private nextLabelName: number = 1;
    private nextScrollName: number = 1;
    private nextSpinName: number = 1;
    private nextEditName: number = 1;
    private nextZIndex: number = 1;

    /**
     * bindHost method.
     *
     * @param {FormControlsHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: FormControlsHost): void {
        this.host = host;
    }

    /**
     * Load VML drawing part for this sheet (if any). Call after sheet XML parse.
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @param {string} sheetPartName - The sheetPartName parameter.
     * @returns {void} - Returns the result.
     */
    public loadFromPackage(pkg: OpcPackage, sheetPartName: string | undefined): void {
        this.entries.length = 0;
        this.checkBoxHandles.clear();
        this.comboHandles.clear();
        this.optionHandles.clear();
        this.buttonHandles.clear();
        this.listHandles.clear();
        this.groupHandles.clear();
        this.labelHandles.clear();
        this.scrollHandles.clear();
        this.spinHandles.clear();
        this.editHandles.clear();
        this.foreignShapesXml = [];
        this.foreignRootExtra = '';
        this.vmlPartName = undefined;
        this.vmlRelId = undefined;
        this.loaded = true;
        this.dirty = false;
        this.nextShapeId = 1025;
        this.nextCheckBoxName = 1;
        this.nextComboName = 1;
        this.nextOptionName = 1;
        this.nextButtonName = 1;
        this.nextListName = 1;
        this.nextGroupName = 1;
        this.nextLabelName = 1;
        this.nextScrollName = 1;
        this.nextSpinName = 1;
        this.nextEditName = 1;
        this.nextZIndex = 1;

        if (sheetPartName === undefined) {
            return;
        }

        const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(sheetPartName);
        const vmlRel: OpcRelationship = rels.find((r: OpcRelationship): boolean => isVmlDrawingRelationshipType(r.type));
        if (vmlRel === undefined) {
            return;
        }

        this.vmlRelId = vmlRel.id;
        const partName: string = normalizePartName(vmlRel.resolvedTarget);
        this.vmlPartName = partName;
        const part: any = pkg.getPart(partName);
        if (part === undefined) {
            return;
        }

        const parsed: ParsedVml = parseVmlDrawingXml(decodeUtf8(part.data));
        this.foreignRootExtra = parsed.rootExtra;
        for (const e of parsed.controls) {
            this.entries.push(e);
            this.noteLoadedIds(e);
        }
        this.foreignShapesXml = parsed.foreignShapesXml;
    }

    /**
     * noteLoadedIds method.
     *
     * @param {FormControlEntry} e - The e parameter.
     * @returns {void} - Returns the result.
     */
    private noteLoadedIds(e: FormControlEntry): void {
        if (e.shapeId >= this.nextShapeId) {
            this.nextShapeId = e.shapeId + 1;
        }
        if (e.zIndex >= this.nextZIndex) {
            this.nextZIndex = e.zIndex + 1;
        }
        const num: number = extractTrailingNumber(e.name);
        if (num !== undefined) {
            if (e.kind === 'checkbox' && num >= this.nextCheckBoxName) {
                this.nextCheckBoxName = num + 1;
            } else if (e.kind === 'combo' && num >= this.nextComboName) {
                this.nextComboName = num + 1;
            } else if (e.kind === 'option' && num >= this.nextOptionName) {
                this.nextOptionName = num + 1;
            } else if (e.kind === 'button' && num >= this.nextButtonName) {
                this.nextButtonName = num + 1;
            } else if (e.kind === 'list' && num >= this.nextListName) {
                this.nextListName = num + 1;
            } else if (e.kind === 'group' && num >= this.nextGroupName) {
                this.nextGroupName = num + 1;
            } else if (e.kind === 'label' && num >= this.nextLabelName) {
                this.nextLabelName = num + 1;
            } else if (e.kind === 'scroll' && num >= this.nextScrollName) {
                this.nextScrollName = num + 1;
            } else if (e.kind === 'spin' && num >= this.nextSpinName) {
                this.nextSpinName = num + 1;
            } else if (e.kind === 'edit' && num >= this.nextEditName) {
                this.nextEditName = num + 1;
            }
        }
    }

    /**
     * listCheckBoxes method.
     *
     * @returns {Object} - Returns the result.
     */
    public listCheckBoxes(): ReadonlyArray<CheckBox> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'checkbox' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): CheckBox => this.checkBoxHandleFor(e));
    }

    /**
     * listComboBoxes method.
     *
     * @returns {Object} - Returns the result.
     */
    public listComboBoxes(): ReadonlyArray<ComboBox> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'combo' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): ComboBox => this.comboHandleFor(e));
    }

    /**
     * listOptionButtons method.
     *
     * @returns {Object} - Returns the result.
     */
    public listOptionButtons(): ReadonlyArray<OptionButton> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'option' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): OptionButton => this.optionHandleFor(e));
    }

    /**
     * listButtons method.
     *
     * @returns {Object} - Returns the result.
     */
    public listButtons(): ReadonlyArray<FormButton> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'button' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): FormButton => this.buttonHandleFor(e));
    }

    /**
     * listListBoxes method.
     *
     * @returns {Object} - Returns the result.
     */
    public listListBoxes(): ReadonlyArray<ListBox> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'list' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): ListBox => this.listHandleFor(e));
    }

    /**
     * listGroupBoxes method.
     *
     * @returns {Object} - Returns the result.
     */
    public listGroupBoxes(): ReadonlyArray<GroupBox> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'group' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): GroupBox => this.groupHandleFor(e));
    }

    /**
     * listFormLabels method.
     *
     * @returns {Object} - Returns the result.
     */
    public listFormLabels(): ReadonlyArray<FormLabel> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'label' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): FormLabel => this.labelHandleFor(e));
    }

    /**
     * listScrollBars method.
     *
     * @returns {Object} - Returns the result.
     */
    public listScrollBars(): ReadonlyArray<ScrollBar> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'scroll' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): ScrollBar => this.scrollHandleFor(e));
    }

    /**
     * listSpinButtons method.
     *
     * @returns {Object} - Returns the result.
     */
    public listSpinButtons(): ReadonlyArray<SpinButton> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'spin' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): SpinButton => this.spinHandleFor(e));
    }

    /**
     * listEditBoxes method.
     *
     * @returns {Object} - Returns the result.
     */
    public listEditBoxes(): ReadonlyArray<EditBox> {
        return this.entries
            .filter((e: FormControlEntry): boolean => e.kind === 'edit' && e.foreignShapeXml === undefined)
            .map((e: FormControlEntry): EditBox => this.editHandleFor(e));
    }

    /**
     * Add a check box. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, text, checkState, linkedCell, isDisplay3DShading (default true).
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} text - The text parameter.
     * @param {CheckState} checkState - The checkState parameter.
     * @param {string} linkedCell - The linkedCell parameter.
     * @param {boolean} isDisplay3DShading - The isDisplay3DShading parameter.
     * @returns {CheckBox} - Returns the result.
     */
    public addCheckBox(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        text?: string,
        checkState?: CheckState,
        linkedCell?: string,
        isDisplay3DShading?: boolean
    ): CheckBox {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addCheckBox'
        );
        const entry: FormControlEntry = this.createEntry('checkbox', base, name, `Check Box ${this.nextCheckBoxName}`);
        this.nextCheckBoxName += 1;
        entry.text = text === undefined ? '' : String(text);
        entry.checkState = normalizeCheckState(checkState, 'unchecked');
        entry.linkedCell = normalizeOptionalString(linkedCell);
        entry.isDisplay3DShading = isDisplay3DShading !== false;
        entry.isTextLocked = true;
        this.entries.push(entry);
        this.markDirty();
        return this.checkBoxHandleFor(entry);
    }

    /**
     * Add a combo / drop control. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, listFillRange, linkedCell, selectedIndex (default 0), dropDownLines (default 8), dropStyle (default `'combo'`), isDisplay3DShading (default true).
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} listFillRange - The listFillRange parameter.
     * @param {string} linkedCell - The linkedCell parameter.
     * @param {number} selectedIndex - The selectedIndex parameter.
     * @param {number} dropDownLines - The dropDownLines parameter.
     * @param {ComboDropStyle} dropStyle - The dropStyle parameter.
     * @param {boolean} isDisplay3DShading - The isDisplay3DShading parameter.
     * @returns {ComboBox} - Returns the result.
     */
    public addComboBox(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        listFillRange?: string,
        linkedCell?: string,
        selectedIndex?: number,
        dropDownLines?: number,
        dropStyle?: ComboDropStyle,
        isDisplay3DShading?: boolean
    ): ComboBox {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addComboBox'
        );
        const style: ComboDropStyle = dropStyle != null ? dropStyle : 'combo';
        if (style !== 'combo' && style !== 'comboedit' && style !== 'simple') {
            throw new InvalidArgumentError('dropStyle must be "combo", "comboedit", or "simple"');
        }
        const entry: FormControlEntry = this.createEntry('combo', base, name, `Drop Down ${this.nextComboName}`);
        this.nextComboName += 1;
        entry.listFillRange = normalizeOptionalString(listFillRange);
        entry.linkedCell = normalizeOptionalString(linkedCell);
        entry.selectedIndex = normalizeSelectedIndex(selectedIndex);
        entry.dropDownLines = normalizeDropDownLines(dropDownLines);
        entry.dropStyle = style;
        entry.isDisplay3DShading = isDisplay3DShading !== false;
        this.entries.push(entry);
        this.markDirty();
        return this.comboHandleFor(entry);
    }

    /**
     * Add an option button. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, text, checkState, linkedCell, isDisplay3DShading (default true), isFirstButton (default false). Mixed checkState is coerced to unchecked.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} text - The text parameter.
     * @param {CheckState} checkState - The checkState parameter.
     * @param {string} linkedCell - The linkedCell parameter.
     * @param {boolean} isDisplay3DShading - The isDisplay3DShading parameter.
     * @param {boolean} isFirstButton - The isFirstButton parameter.
     * @returns {OptionButton} - Returns the result.
     */
    public addOptionButton(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        text?: string,
        checkState?: CheckState,
        linkedCell?: string,
        isDisplay3DShading?: boolean,
        isFirstButton?: boolean
    ): OptionButton {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addOptionButton'
        );
        const entry: FormControlEntry = this.createEntry('option', base, name, `Option Button ${this.nextOptionName}`);
        this.nextOptionName += 1;
        entry.text = text === undefined ? '' : String(text);
        const state: CheckState = normalizeCheckState(checkState, 'unchecked');
        entry.checkState = state === 'mixed' ? 'unchecked' : state;
        entry.linkedCell = normalizeOptionalString(linkedCell);
        entry.isDisplay3DShading = isDisplay3DShading !== false;
        entry.isFirstButton = isFirstButton === true;
        entry.isTextLocked = true;
        this.entries.push(entry);
        this.markDirty();
        return this.optionHandleFor(entry);
    }

    /**
     * Add a button. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, text, onAction.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} text - The text parameter.
     * @param {string} onAction - The onAction parameter.
     * @returns {FormButton} - Returns the result.
     */
    public addButton(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        text?: string,
        onAction?: string
    ): FormButton {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addButton'
        );
        const entry: FormControlEntry = this.createEntry('button', base, name, `Button ${this.nextButtonName}`);
        this.nextButtonName += 1;
        entry.text = text === undefined ? '' : String(text);
        entry.onAction = normalizeOptionalString(onAction);
        entry.isTextLocked = true;
        this.entries.push(entry);
        this.markDirty();
        return this.buttonHandleFor(entry);
    }

    /**
     * Add a list box. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, listFillRange, linkedCell, selectedIndex (default 0), selectionType (default `'single'`), selectedIndices, isDisplay3DShading (default true), value.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} listFillRange - The listFillRange parameter.
     * @param {string} linkedCell - The linkedCell parameter.
     * @param {number} selectedIndex - The selectedIndex parameter.
     * @param {Object} selectionType - The selectionType parameter.
     * @param {number} selectedIndices - The selectedIndices parameter.
     * @param {boolean} isDisplay3DShading - The isDisplay3DShading parameter.
     * @param {number} value - The value parameter.
     * @returns {ListBox} - Returns the result.
     */
    public addListBox(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        listFillRange?: string,
        linkedCell?: string,
        selectedIndex?: number,
        selectionType?: 'single' | 'multi' | 'extended',
        selectedIndices?: ReadonlyArray<number>,
        isDisplay3DShading?: boolean,
        value?: number
    ): ListBox {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addListBox'
        );
        const entry: FormControlEntry = this.createEntry('list', base, name, `List Box ${this.nextListName}`);
        this.nextListName += 1;
        entry.listFillRange = normalizeOptionalString(listFillRange);
        entry.linkedCell = normalizeOptionalString(linkedCell);
        entry.selectedIndex = normalizeSelectedIndex(selectedIndex);
        entry.selectionType = normalizeSelectionType(selectionType);
        entry.selectedIndices = normalizeSelectedIndices(selectedIndices);
        entry.isDisplay3DShading = isDisplay3DShading !== false;
        entry.value = normalizeScrollInt(value, 0, 'value');
        this.entries.push(entry);
        this.markDirty();
        return this.listHandleFor(entry);
    }

    /**
     * Add a group box. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, text, groupLinkedCell.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} text - The text parameter.
     * @param {string} groupLinkedCell - The groupLinkedCell parameter.
     * @returns {GroupBox} - Returns the result.
     */
    public addGroupBox(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        text?: string,
        groupLinkedCell?: string
    ): GroupBox {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addGroupBox'
        );
        const entry: FormControlEntry = this.createEntry('group', base, name, `Group Box ${this.nextGroupName}`);
        this.nextGroupName += 1;
        entry.text = text === undefined ? '' : String(text);
        entry.groupLinkedCell = normalizeOptionalString(groupLinkedCell);
        this.entries.push(entry);
        this.markDirty();
        return this.groupHandleFor(entry);
    }

    /**
     * Add a form label. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, text, textLink.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} text - The text parameter.
     * @param {string} textLink - The textLink parameter.
     * @returns {FormLabel} - Returns the result.
     */
    public addFormLabel(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        text?: string,
        textLink?: string
    ): FormLabel {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addFormLabel'
        );
        const entry: FormControlEntry = this.createEntry('label', base, name, `Label ${this.nextLabelName}`);
        this.nextLabelName += 1;
        entry.text = text === undefined ? '' : String(text);
        entry.textLink = normalizeOptionalString(textLink);
        entry.isTextLocked = true;
        this.entries.push(entry);
        this.markDirty();
        return this.labelHandleFor(entry);
    }

    /**
     * Add a scroll bar. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, linkedCell, value, min, max, incrementalChange, pageChange, isHorizontal (default false / vertical).
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} linkedCell - The linkedCell parameter.
     * @param {number} value - The value parameter.
     * @param {number} min - The min parameter.
     * @param {number} max - The max parameter.
     * @param {number} incrementalChange - The incrementalChange parameter.
     * @param {number} pageChange - The pageChange parameter.
     * @param {boolean} isHorizontal - The isHorizontal parameter.
     * @returns {ScrollBar} - Returns the result.
     */
    public addScrollBar(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        linkedCell?: string,
        value?: number,
        min?: number,
        max?: number,
        incrementalChange?: number,
        pageChange?: number,
        isHorizontal?: boolean
    ): ScrollBar {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addScrollBar'
        );
        const entry: FormControlEntry = this.createEntry('scroll', base, name, `Scroll Bar ${this.nextScrollName}`);
        this.nextScrollName += 1;
        entry.linkedCell = normalizeOptionalString(linkedCell);
        entry.value = normalizeScrollInt(value, 0, 'value');
        entry.min = normalizeScrollInt(min, 0, 'min');
        entry.max = normalizeScrollInt(max, DEFAULT_SCROLL_MAX, 'max');
        entry.incrementalChange = normalizeScrollInt(incrementalChange, 1, 'incrementalChange');
        entry.pageChange = normalizeScrollInt(pageChange, DEFAULT_SCROLL_PAGE, 'pageChange');
        entry.isHorizontal = isHorizontal === true;
        this.entries.push(entry);
        this.markDirty();
        return this.scrollHandleFor(entry);
    }

    /**
     * Add a spin button. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, linkedCell, value, min, max, incrementalChange.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} linkedCell - The linkedCell parameter.
     * @param {number} value - The value parameter.
     * @param {number} min - The min parameter.
     * @param {number} max - The max parameter.
     * @param {number} incrementalChange - The incrementalChange parameter.
     * @returns {SpinButton} - Returns the result.
     */
    public addSpinButton(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        linkedCell?: string,
        value?: number,
        min?: number,
        max?: number,
        incrementalChange?: number
    ): SpinButton {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addSpinButton'
        );
        const entry: FormControlEntry = this.createEntry('spin', base, name, `Spin Button ${this.nextSpinName}`);
        this.nextSpinName += 1;
        entry.linkedCell = normalizeOptionalString(linkedCell);
        entry.value = normalizeScrollInt(value, 0, 'value');
        entry.min = normalizeScrollInt(min, 0, 'min');
        entry.max = normalizeScrollInt(max, DEFAULT_SCROLL_MAX, 'max');
        entry.incrementalChange = normalizeScrollInt(incrementalChange, 1, 'incrementalChange');
        this.entries.push(entry);
        this.markDirty();
        return this.spinHandleFor(entry);
    }

    /**
     * Add an edit box. Geometry is 1-based row/column + positive size in points. Optional trailing args: name, text, textLink, isMultiLine, validation (default `'text'`), isPassword.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} name - The name parameter.
     * @param {string} text - The text parameter.
     * @param {string} textLink - The textLink parameter.
     * @param {boolean} isMultiLine - The isMultiLine parameter.
     * @param {EditValidation} validation - The validation parameter.
     * @param {boolean} isPassword - The isPassword parameter.
     * @returns {EditBox} - Returns the result.
     */
    public addEditBox(
        row: number,
        column: number,
        width: number,
        height: number,
        name?: string,
        text?: string,
        textLink?: string,
        isMultiLine?: boolean,
        validation?: EditValidation,
        isPassword?: boolean
    ): EditBox {
        const base: { row: number; column: number; widthEmu: number; heightEmu: number } = this.requireAddGeometry(
            row,
            column,
            width,
            height,
            'addEditBox'
        );
        const entry: FormControlEntry = this.createEntry('edit', base, name, `Edit Box ${this.nextEditName}`);
        this.nextEditName += 1;
        entry.text = text === undefined ? '' : String(text);
        entry.textLink = normalizeOptionalString(textLink);
        entry.isMultiLine = isMultiLine === true;
        entry.validation = normalizeEditValidation(validation);
        entry.isPassword = isPassword === true;
        entry.isTextLocked = true;
        this.entries.push(entry);
        this.markDirty();
        return this.editHandleFor(entry);
    }

    /**
     * removeCheckBox method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeCheckBox(target: CheckBox | number): void {
        this.removeByKind('checkbox', target, 'removeCheckBox', this.checkBoxHandles);
    }

    /**
     * removeComboBox method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeComboBox(target: ComboBox | number): void {
        this.removeByKind('combo', target, 'removeComboBox', this.comboHandles);
    }

    /**
     * removeOptionButton method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeOptionButton(target: OptionButton | number): void {
        this.removeByKind('option', target, 'removeOptionButton', this.optionHandles);
    }

    /**
     * removeButton method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeButton(target: FormButton | number): void {
        this.removeByKind('button', target, 'removeButton', this.buttonHandles);
    }

    /**
     * removeListBox method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeListBox(target: ListBox | number): void {
        this.removeByKind('list', target, 'removeListBox', this.listHandles);
    }

    /**
     * removeGroupBox method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeGroupBox(target: GroupBox | number): void {
        this.removeByKind('group', target, 'removeGroupBox', this.groupHandles);
    }

    /**
     * removeFormLabel method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeFormLabel(target: FormLabel | number): void {
        this.removeByKind('label', target, 'removeFormLabel', this.labelHandles);
    }

    /**
     * removeScrollBar method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeScrollBar(target: ScrollBar | number): void {
        this.removeByKind('scroll', target, 'removeScrollBar', this.scrollHandles);
    }

    /**
     * removeSpinButton method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeSpinButton(target: SpinButton | number): void {
        this.removeByKind('spin', target, 'removeSpinButton', this.spinHandles);
    }

    /**
     * removeEditBox method.
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public removeEditBox(target: EditBox | number): void {
        this.removeByKind('edit', target, 'removeEditBox', this.editHandles);
    }

    /**
     * removeByKind method.
     *
     * @param {FormControlKind} kind - The kind parameter.
     * @param {any} target - The target parameter.
     * @param {string} label - The label parameter.
     * @param {Map} handleMap - The handleMap parameter.
     * @returns {void} - Returns the result.
     */
    private removeByKind(
        kind: FormControlKind,
        target:
        CheckBox | ComboBox | OptionButton | FormButton | ListBox | GroupBox | FormLabel | ScrollBar | SpinButton | EditBox | number,
        label: string,
        handleMap: Map<FormControlEntry, unknown>
    ): void {
        const ofKind: FormControlEntry[] = this.entries.filter(
            (e: FormControlEntry): boolean => e.kind === kind && e.foreignShapeXml === undefined
        );
        if (typeof target === 'number') {
            if (!Number.isInteger(target) || target < 0 || target >= ofKind.length) {
                throw new InvalidArgumentError(`${label} index must be in 0..${Math.max(0, ofKind.length - 1)}`);
            }
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const entry: FormControlEntry = ofKind[target];
            if (entry === undefined) {
                return;
            }
            const idx: number = this.entries.indexOf(entry);
            if (idx >= 0) {
                handleMap.delete(entry);
                this.entries.splice(idx, 1);
                this.markDirty();
            }
            return;
        }
        if (target === null || typeof target !== 'object') {
            throw new InvalidArgumentError(`${label} requires a handle or index`);
        }
        // Handles expose `entry` on the impl class; public interfaces omit it.
        const entry: FormControlEntry = (target as unknown as FormControlHandleBase).entry;
        if (entry === undefined || entry.kind !== kind) {
            throw new InvalidArgumentError(`${label} target is not a library handle of this type`);
        }
        const idx: number = this.entries.indexOf(entry);
        if (idx < 0) {
            throw new InvalidArgumentError('Form control is not on this worksheet');
        }
        handleMap.delete(entry);
        this.entries.splice(idx, 1);
        this.markDirty();
    }

    /**
     * True when the model should emit/replace worksheet `<legacyDrawing>`.
     *
     * @returns {boolean} - Returns the result.
     */
    public get ownsLegacyDrawingElement(): boolean {
        return this.dirty || this.vmlPartName !== undefined || this.entries.length > 0 || this.foreignShapesXml.length > 0;
    }

    /**
     * Replace VML `ObjectType="Note"` shapes with one note shape per anchor. Used by threaded-comments flush so Excel shows the comment indicator / threaded-comment chrome. Non-Note foreign shapes are preserved. Call **before** {@link materializeOnFlush} on the same flush pass. Anchors are 0-based row/column (SpreadsheetML `x:Row` / `x:Column`).
     *
     * @param {Object} anchors - The anchors parameter.
     * @returns {void} - Returns the result.
     */
    public syncCommentNoteShapes(anchors: ReadonlyArray<{ readonly row0: number; readonly col0: number }>): void {
        const preserved: string[] = [];
        let removedNote: boolean = false;
        for (const xml of this.foreignShapesXml) {
            if (isCommentNoteShapeXml(xml) || isCommentNoteShapeTypeXml(xml)) {
                removedNote = true;
                continue;
            }
            preserved.push(xml);
        }

        const notes: string[] = [];
        for (let i: number = 0; i < anchors.length; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const a: { readonly row0: number; readonly col0: number } = anchors[i];
            if (a === undefined) {
                continue;
            }
            const row0: number = Number.isFinite(a.row0) && a.row0 >= 0 ? Math.floor(a.row0) : 0;
            const col0: number = Number.isFinite(a.col0) && a.col0 >= 0 ? Math.floor(a.col0) : 0;
            const shapeId: number = this.nextShapeId;
            this.nextShapeId += 1;
            const zIndex: number = this.nextZIndex;
            this.nextZIndex += 1;
            notes.push(serializeCommentNoteShape(shapeId, zIndex, row0, col0));
        }

        const changed: boolean = removedNote || notes.length > 0 || this.foreignShapesXml.length !== preserved.length + notes.length;
        this.foreignShapesXml = [...preserved, ...notes];
        if (changed) {
            this.dirty = true;
            if (this.host != null) {
                this.host.markDirty();
            }
        }
    }

    /**
     * Visibility / size chrome for classic comment notes, keyed `"row0:col0"` (0-based SpreadsheetML `x:Row` / `x:Column`).
     *
     * @returns {string} - Returns the result.
     */
    public noteChromeByKey(): Map<string, NoteShapeInfo> {
        const map: Map<string, NoteShapeInfo> = new Map<string, NoteShapeInfo>();
        for (const xml of this.foreignShapesXml) {
            if (!isCommentNoteShapeXml(xml)) {
                continue;
            }
            const info: { row0: number; col0: number; isVisible: boolean; widthEmu?: number; heightEmu?: number } =
                parseCommentNoteChrome(xml);
            if (info === undefined) {
                continue;
            }
            const chrome: NoteShapeInfo = {
                isVisible: info.isVisible,
                ...(info.widthEmu !== undefined ? { widthEmu: info.widthEmu } : {}),
                ...(info.heightEmu !== undefined ? { heightEmu: info.heightEmu } : {})
            };
            map.set(`${info.row0}:${info.col0}`, chrome);
        }
        return map;
    }

    /**
     * Replace VML Note shapes (and stray t202 shapetype fragments) with the provided overlay XML from classic comments materialize. Non-Note foreign shapes are preserved. Empty overlay clears note chrome only. Call **before** {@link materializeOnFlush} on the same flush pass.
     *
     * @param {string} overlayXml - The overlayXml parameter.
     * @returns {void} - Returns the result.
     */
    public setCommentNoteShapes(overlayXml: ReadonlyArray<string>): void {
        const preserved: string[] = [];
        let removedNote: boolean = false;
        for (const xml of this.foreignShapesXml) {
            if (isCommentNoteShapeXml(xml) || isCommentNoteShapeTypeXml(xml)) {
                removedNote = true;
                continue;
            }
            preserved.push(xml);
        }
        const overlay: string[] = overlayXml.slice();
        const changed: boolean = removedNote || overlay.length > 0 || this.foreignShapesXml.length !== preserved.length + overlay.length;
        this.foreignShapesXml = [...preserved, ...overlay];
        if (changed) {
            this.dirty = true;
            if (this.host != null) {
                this.host.markDirty();
            }
        }
    }

    /**
     * Allocate the next VML shape id for a classic comment note overlay.
     *
     * @returns {number} - Returns the result.
     */
    public allocateNoteShapeId(): number {
        const id: number = this.nextShapeId;
        this.nextShapeId += 1;
        return id;
    }

    /**
     * Write/remove VML drawing part and compute sheet legacyDrawing relationship. Call during worksheet flush after DrawingML materialization. VML drawing types are stripped here and re-added when needed.
     *
     * @param {Object} sheetRelsCurrent - The sheetRelsCurrent parameter.
     * @returns {FormControlsMaterializeResult} - Returns the result.
     */
    public materializeOnFlush(sheetRelsCurrent: ReadonlyArray<OpcRelationship>): FormControlsMaterializeResult {
        const host: FormControlsHost = this.host;
        const sheetPartName: string = host == null ? undefined : host.sheetPartName;

        const withoutVml: OpcRelationship[] = sheetRelsCurrent.filter(
            (r: OpcRelationship): boolean => !isVmlDrawingRelationshipType(r.type)
        );

        const hasShapes: boolean = this.entries.length > 0 || this.foreignShapesXml.length > 0;

        if (!this.ownsLegacyDrawingElement && !this.dirty) {
            return {
                sheetRelsWithoutVmlDrawing: withoutVml,
                vmlDrawingRel: undefined,
                legacyDrawingRelationshipId: undefined,
                ownsLegacyDrawingElement: false
            };
        }

        if (!hasShapes) {
            if (host !== undefined && this.vmlPartName !== undefined) {
                host.package.removePart(this.vmlPartName);
            }
            this.vmlPartName = undefined;
            this.vmlRelId = undefined;
            this.dirty = false;
            return {
                sheetRelsWithoutVmlDrawing: withoutVml,
                vmlDrawingRel: undefined,
                legacyDrawingRelationshipId: undefined,
                ownsLegacyDrawingElement: true
            };
        }

        if (host === undefined || sheetPartName === undefined) {
            return {
                sheetRelsWithoutVmlDrawing: withoutVml,
                vmlDrawingRel: undefined,
                legacyDrawingRelationshipId: this.vmlRelId,
                ownsLegacyDrawingElement: true
            };
        }

        const partName: string = this.vmlPartName != null ? this.vmlPartName : allocateVmlDrawingPartName(host.package);
        this.vmlPartName = partName;

        const xml: string = serializeVmlDrawingXml(this.entries, this.foreignShapesXml);
        host.package.setPart(partName, encodeUtf8(xml), VML_DRAWING_CONTENT_TYPE);

        let maxNum: number = 0;
        for (const r of withoutVml) {
            const m: RegExpExecArray = /^rId(\d+)$/i.exec(r.id);
            if (m !== null && m[1] !== undefined) {
                const n: number = Number.parseInt(m[1], 10);
                if (Number.isFinite(n) && n > maxNum) {
                    maxNum = n;
                }
            }
        }

        let relId: string = this.vmlRelId;
        const idTaken: boolean = relId !== undefined && withoutVml.some((r: OpcRelationship): boolean => r.id === relId);
        if (relId === undefined || idTaken) {
            maxNum += 1;
            relId = `rId${maxNum}`;
        }
        this.vmlRelId = relId;

        const target: string = relativeTargetFromSheetToDrawing(sheetPartName, partName);
        const vmlDrawingRel: OpcRelationship = {
            id: relId,
            type: VML_DRAWING_REL_TYPE_TRANSITIONAL,
            target,
            resolvedTarget: resolveRelationshipTarget(sheetPartName, target, undefined)
        };

        this.dirty = false;
        return {
            sheetRelsWithoutVmlDrawing: withoutVml,
            vmlDrawingRel,
            legacyDrawingRelationshipId: relId,
            ownsLegacyDrawingElement: true
        };
    }

    /**
     * requireAddGeometry method.
     *
     * @param {number} row - The row parameter.
     * @param {number} column - The column parameter.
     * @param {number} width - The width parameter.
     * @param {number} height - The height parameter.
     * @param {string} _label - The _label parameter.
     * @returns {Object} - Returns the result.
     */
    private requireAddGeometry(
        row: number,
        column: number,
        width: number,
        height: number,
        _label: string
    ): {
            row: number;
            column: number;
            widthEmu: number;
            heightEmu: number;
        } {
        const rowN: number = requirePositiveInt(row, 'row');
        const columnN: number = requirePositiveInt(column, 'column');
        requirePositivePoints(width, 'width');
        requirePositivePoints(height, 'height');
        return {
            row: rowN,
            column: columnN,
            widthEmu: pointsToEmu(width),
            heightEmu: pointsToEmu(height)
        };
    }

    /**
     * createEntry method.
     *
     * @param {FormControlKind} kind - kind value.
     * @param {*} base - base value.
     * @param {string | undefined} nameOpt - nameOpt value.
     * @param {string} defaultName - defaultName value.
     * @returns {FormControlEntry} Function result.
     */
    private createEntry(
        kind: FormControlKind,
        base: { row: number; column: number; widthEmu: number; heightEmu: number },
        nameOpt: string | undefined,
        defaultName: string
    ): FormControlEntry {
        const shapeId: number = this.nextShapeId;
        this.nextShapeId += 1;
        const zIndex: number = this.nextZIndex;
        this.nextZIndex += 1;
        return {
            kind,
            shapeId,
            name: nameOpt !== undefined && String(nameOpt).trim() !== '' ? String(nameOpt) : defaultName,
            isVisible: true,
            fromRow0: base.row - 1,
            fromCol0: base.column - 1,
            widthEmu: base.widthEmu,
            heightEmu: base.heightEmu,
            zIndex,
            printObject: true,
            isLocked: true,
            moveWithCells: true,
            sizeWithCells: defaultSizeWithCells(kind),
            fontName: DEFAULT_CAPTION_FONT_NAME,
            fontSize: DEFAULT_CAPTION_FONT_SIZE_PT,
            fontStyle: 'regular',
            underline: 'none',
            isStrikethrough: false,
            isSuperscript: false,
            isSubscript: false,
            horizontalAlignment: 'left',
            verticalAlignment: defaultVerticalAlignment(kind),
            text: '',
            checkState: 'unchecked',
            isDisplay3DShading: true,
            isTextLocked: true,
            selectedIndex: 0,
            dropDownLines: 8,
            dropStyle: 'combo',
            isFirstButton: false,
            selectionType: 'single',
            selectedIndices: [],
            value: 0,
            min: 0,
            max: DEFAULT_SCROLL_MAX,
            incrementalChange: 1,
            pageChange: DEFAULT_SCROLL_PAGE,
            isHorizontal: false,
            isMultiLine: false,
            validation: 'text',
            isPassword: false
        };
    }

    /**
     * markDirty method.
     *
     * @returns {void} - Returns the result.
     */
    private markDirty(): void {
        this.dirty = true;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * checkBoxHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {CheckBox} - Returns the result.
     */
    private checkBoxHandleFor(entry: FormControlEntry): CheckBox {
        let h: CheckBoxHandle = this.checkBoxHandles.get(entry);
        if (h === undefined) {
            h = new CheckBoxHandle(entry, (): void => this.markDirty());
            this.checkBoxHandles.set(entry, h);
        }
        return h;
    }

    /**
     * comboHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {ComboBox} - Returns the result.
     */
    private comboHandleFor(entry: FormControlEntry): ComboBox {
        let h: ComboBoxHandle = this.comboHandles.get(entry);
        if (h === undefined) {
            h = new ComboBoxHandle(entry, (): void => this.markDirty());
            this.comboHandles.set(entry, h);
        }
        return h;
    }

    /**
     * optionHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {OptionButton} - Returns the result.
     */
    private optionHandleFor(entry: FormControlEntry): OptionButton {
        let h: OptionButtonHandle = this.optionHandles.get(entry);
        if (h === undefined) {
            h = new OptionButtonHandle(entry, (): void => this.markDirty());
            this.optionHandles.set(entry, h);
        }
        return h;
    }

    /**
     * buttonHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {FormButton} - Returns the result.
     */
    private buttonHandleFor(entry: FormControlEntry): FormButton {
        let h: FormButtonHandle = this.buttonHandles.get(entry);
        if (h === undefined) {
            h = new FormButtonHandle(entry, (): void => this.markDirty());
            this.buttonHandles.set(entry, h);
        }
        return h;
    }

    /**
     * listHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {ListBox} - Returns the result.
     */
    private listHandleFor(entry: FormControlEntry): ListBox {
        let h: ListBoxHandle = this.listHandles.get(entry);
        if (h === undefined) {
            h = new ListBoxHandle(entry, (): void => this.markDirty());
            this.listHandles.set(entry, h);
        }
        return h;
    }

    /**
     * groupHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {GroupBox} - Returns the result.
     */
    private groupHandleFor(entry: FormControlEntry): GroupBox {
        let h: GroupBoxHandle = this.groupHandles.get(entry);
        if (h === undefined) {
            h = new GroupBoxHandle(entry, (): void => this.markDirty());
            this.groupHandles.set(entry, h);
        }
        return h;
    }

    /**
     * labelHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {FormLabel} - Returns the result.
     */
    private labelHandleFor(entry: FormControlEntry): FormLabel {
        let h: FormLabelHandle = this.labelHandles.get(entry);
        if (h === undefined) {
            h = new FormLabelHandle(entry, (): void => this.markDirty());
            this.labelHandles.set(entry, h);
        }
        return h;
    }

    /**
     * scrollHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {ScrollBar} - Returns the result.
     */
    private scrollHandleFor(entry: FormControlEntry): ScrollBar {
        let h: ScrollBarHandle = this.scrollHandles.get(entry);
        if (h === undefined) {
            h = new ScrollBarHandle(entry, (): void => this.markDirty());
            this.scrollHandles.set(entry, h);
        }
        return h;
    }

    /**
     * spinHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {SpinButton} - Returns the result.
     */
    private spinHandleFor(entry: FormControlEntry): SpinButton {
        let h: SpinButtonHandle = this.spinHandles.get(entry);
        if (h === undefined) {
            h = new SpinButtonHandle(entry, (): void => this.markDirty());
            this.spinHandles.set(entry, h);
        }
        return h;
    }

    /**
     * editHandleFor method.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @returns {EditBox} - Returns the result.
     */
    private editHandleFor(entry: FormControlEntry): EditBox {
        let h: EditBoxHandle = this.editHandles.get(entry);
        if (h === undefined) {
            h = new EditBoxHandle(entry, (): void => this.markDirty());
            this.editHandles.set(entry, h);
        }
        return h;
    }
}

// ── Handles ──────────────────────────────────────────────────────────────────

/**
 * FormControlHandleBase class.
 */
abstract class FormControlHandleBase implements FormControlBase {
    /** @private */
    public readonly entry: FormControlEntry;
    protected readonly markDirty: () => void;

    /**
     * Creates an instance.
     *
     * @param {FormControlEntry} entry - The entry parameter.
     * @param {any} markDirty - The markDirty parameter.
     */
    public constructor(entry: FormControlEntry, markDirty: () => void) {
        this.entry = entry;
        this.markDirty = markDirty;
    }

    /**
     * Gets name.
     *
     * @returns {string} - Returns the result.
     */
    public get name(): string {
        return this.entry.name;
    }

    /**
     * Sets name.
     *
     * @param {string} value - The value parameter.
     */
    public set name(value: string) {
        this.entry.name = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets isVisible.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isVisible(): boolean {
        return this.entry.isVisible;
    }

    /**
     * Sets isVisible.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isVisible(value: boolean) {
        this.entry.isVisible = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets alternativeText.
     *
     * @returns {string} - Returns the result.
     */
    public get alternativeText(): string | undefined {
        return this.entry.alternativeText;
    }

    /**
     * Sets alternativeText.
     *
     * @param {string} value - The value parameter.
     */
    public set alternativeText(value: string | undefined) {
        this.entry.alternativeText = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets row.
     *
     * @returns {number} - Returns the result.
     */
    public get row(): number {
        return this.entry.fromRow0 + 1;
    }

    /**
     * Gets column.
     *
     * @returns {number} - Returns the result.
     */
    public get column(): number {
        return this.entry.fromCol0 + 1;
    }

    /**
     * Gets width.
     *
     * @returns {number} - Returns the result.
     */
    public get width(): number {
        return this.entry.widthEmu / EMU_PER_PT;
    }

    /**
     * Gets height.
     *
     * @returns {number} - Returns the result.
     */
    public get height(): number {
        return this.entry.heightEmu / EMU_PER_PT;
    }

    /**
     * Gets onAction.
     *
     * @returns {string} - Returns the result.
     */
    public get onAction(): string | undefined {
        return this.entry.onAction;
    }

    /**
     * Sets onAction.
     *
     * @param {string} value - The value parameter.
     */
    public set onAction(value: string | undefined) {
        this.entry.onAction = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets printObject.
     *
     * @returns {boolean} - Returns the result.
     */
    public get printObject(): boolean {
        return this.entry.printObject;
    }

    /**
     * Sets printObject.
     *
     * @param {boolean} value - The value parameter.
     */
    public set printObject(value: boolean) {
        this.entry.printObject = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isLocked.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isLocked(): boolean {
        return this.entry.isLocked;
    }

    /**
     * Sets isLocked.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isLocked(value: boolean) {
        this.entry.isLocked = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets moveWithCells.
     *
     * @returns {boolean} - Returns the result.
     */
    public get moveWithCells(): boolean {
        return this.entry.moveWithCells;
    }

    /**
     * Sets moveWithCells.
     *
     * @param {boolean} value - The value parameter.
     */
    public set moveWithCells(value: boolean) {
        this.entry.moveWithCells = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets sizeWithCells.
     *
     * @returns {boolean} - Returns the result.
     */
    public get sizeWithCells(): boolean {
        return this.entry.sizeWithCells;
    }

    /**
     * Sets sizeWithCells.
     *
     * @param {boolean} value - The value parameter.
     */
    public set sizeWithCells(value: boolean) {
        this.entry.sizeWithCells = Boolean(value);
        this.markDirty();
    }
}

/**
 * Base handle for caption-bearing form controls (checkbox, option, button,
 * group, label, edit).
 */
abstract class FormControlStyleHandleBase extends FormControlHandleBase implements FormControlStyle {
    /**
     * Gets fillColor.
     *
     * @returns {string} - Returns the result.
     */
    public get fillColor(): string | undefined {
        return this.entry.fillColor;
    }

    /**
     * Sets fillColor.
     *
     * @param {string} value - The value parameter.
     */
    public set fillColor(value: string | undefined) {
        this.entry.fillColor = normalizeFormControlColor(value);
        this.markDirty();
    }

    /**
     * Gets fontName.
     *
     * @returns {string} - Returns the result.
     */
    public get fontName(): string {
        return this.entry.fontName;
    }

    /**
     * Sets fontName.
     *
     * @param {string} value - The value parameter.
     */
    public set fontName(value: string) {
        const name: string = value === undefined || value === null ? DEFAULT_CAPTION_FONT_NAME : String(value).trim();
        this.entry.fontName = name.length > 0 ? name : DEFAULT_CAPTION_FONT_NAME;
        this.markDirty();
    }

    /**
     * Gets fontSize.
     *
     * @returns {number} - Returns the result.
     */
    public get fontSize(): number {
        return this.entry.fontSize;
    }

    /**
     * Sets fontSize.
     *
     * @param {number} value - The value parameter.
     */
    public set fontSize(value: number) {
        this.entry.fontSize = normalizeFontSizePt(value);
        this.markDirty();
    }

    /**
     * Gets fontColor.
     *
     * @returns {string} - Returns the result.
     */
    public get fontColor(): string | undefined {
        return this.entry.fontColor;
    }

    /**
     * Sets fontColor.
     *
     * @param {string} value - The value parameter.
     */
    public set fontColor(value: string | undefined) {
        this.entry.fontColor = normalizeFormControlColor(value);
        this.markDirty();
    }

    /**
     * Gets fontStyle.
     *
     * @returns {FormControlFontStyle} - Returns the result.
     */
    public get fontStyle(): FormControlFontStyle {
        return this.entry.fontStyle;
    }

    /**
     * Sets fontStyle.
     *
     * @param {FormControlFontStyle} value - The value parameter.
     */
    public set fontStyle(value: FormControlFontStyle) {
        this.entry.fontStyle = normalizeFormControlFontStyle(value);
        this.markDirty();
    }

    /**
     * Gets underline.
     *
     * @returns {FormControlUnderline} - Returns the result.
     */
    public get underline(): FormControlUnderline {
        return this.entry.underline;
    }

    /**
     * Sets underline.
     *
     * @param {FormControlUnderline} value - The value parameter.
     */
    public set underline(value: FormControlUnderline) {
        this.entry.underline = normalizeFormControlUnderline(value);
        this.markDirty();
    }

    /**
     * Gets isStrikethrough.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isStrikethrough(): boolean {
        return this.entry.isStrikethrough;
    }

    /**
     * Sets isStrikethrough.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isStrikethrough(value: boolean) {
        this.entry.isStrikethrough = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isSuperscript.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isSuperscript(): boolean {
        return this.entry.isSuperscript;
    }

    /**
     * Sets isSuperscript.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isSuperscript(value: boolean) {
        const on: boolean = Boolean(value);
        this.entry.isSuperscript = on;
        if (on) {
            this.entry.isSubscript = false;
        }
        this.markDirty();
    }

    /**
     * Gets isSubscript.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isSubscript(): boolean {
        return this.entry.isSubscript;
    }

    /**
     * Sets isSubscript.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isSubscript(value: boolean) {
        const on: boolean = Boolean(value);
        this.entry.isSubscript = on;
        if (on) {
            this.entry.isSuperscript = false;
        }
        this.markDirty();
    }

    /**
     * Gets isNormalFont.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isNormalFont(): boolean {
        return isCaptionNormalFont(this.entry);
    }

    /**
     * Sets isNormalFont.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isNormalFont(value: boolean) {
        if (value) {
            applyNormalCaptionFont(this.entry);
            this.markDirty();
        }
        // false is a no-op: Excel has no discrete "not normal" flag beyond
        // whatever face/size/effects are already set.
    }

    /**
     * Gets horizontalAlignment.
     *
     * @returns {FormControlHorizontalAlignment} - Returns the result.
     */
    public get horizontalAlignment(): FormControlHorizontalAlignment {
        return this.entry.horizontalAlignment;
    }

    /**
     * Sets horizontalAlignment.
     *
     * @param {FormControlHorizontalAlignment} value - The value parameter.
     */
    public set horizontalAlignment(value: FormControlHorizontalAlignment) {
        this.entry.horizontalAlignment = normalizeHorizontalAlignment(value);
        this.markDirty();
    }

    /**
     * Gets verticalAlignment.
     *
     * @returns {FormControlVerticalAlignment} - Returns the result.
     */
    public get verticalAlignment(): FormControlVerticalAlignment {
        return this.entry.verticalAlignment;
    }

    /**
     * Sets verticalAlignment.
     *
     * @param {FormControlVerticalAlignment} value - The value parameter.
     */
    public set verticalAlignment(value: FormControlVerticalAlignment) {
        this.entry.verticalAlignment = normalizeVerticalAlignment(value);
        this.markDirty();
    }
}

/**
 * CheckBoxHandle class.
 */
class CheckBoxHandle extends FormControlStyleHandleBase implements CheckBox {
    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        this.entry.text = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets checkState.
     *
     * @returns {CheckState} - Returns the result.
     */
    public get checkState(): CheckState {
        return this.entry.checkState;
    }

    /**
     * Sets checkState.
     *
     * @param {CheckState} value - The value parameter.
     */
    public set checkState(value: CheckState) {
        this.entry.checkState = normalizeCheckState(value, 'unchecked');
        this.markDirty();
    }

    /**
     * Gets linkedCell.
     *
     * @returns {string} - Returns the result.
     */
    public get linkedCell(): string | undefined {
        return this.entry.linkedCell;
    }

    /**
     * Sets linkedCell.
     *
     * @param {string} value - The value parameter.
     */
    public set linkedCell(value: string | undefined) {
        this.entry.linkedCell = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets isDisplay3DShading.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDisplay3DShading(): boolean {
        return this.entry.isDisplay3DShading;
    }

    /**
     * Sets isDisplay3DShading.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isDisplay3DShading(value: boolean) {
        this.entry.isDisplay3DShading = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isTextLocked.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isTextLocked(): boolean {
        return this.entry.isTextLocked;
    }

    /**
     * Sets isTextLocked.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isTextLocked(value: boolean) {
        this.entry.isTextLocked = Boolean(value);
        this.markDirty();
    }
}

/**
 * ComboBoxHandle class.
 */
class ComboBoxHandle extends FormControlHandleBase implements ComboBox {
    /**
     * Gets listFillRange.
     *
     * @returns {string} - Returns the result.
     */
    public get listFillRange(): string | undefined {
        return this.entry.listFillRange;
    }

    /**
     * Sets listFillRange.
     *
     * @param {string} value - The value parameter.
     */
    public set listFillRange(value: string | undefined) {
        this.entry.listFillRange = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets linkedCell.
     *
     * @returns {string} - Returns the result.
     */
    public get linkedCell(): string | undefined {
        return this.entry.linkedCell;
    }

    /**
     * Sets linkedCell.
     *
     * @param {string} value - The value parameter.
     */
    public set linkedCell(value: string | undefined) {
        this.entry.linkedCell = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets selectedIndex.
     *
     * @returns {number} - Returns the result.
     */
    public get selectedIndex(): number {
        return this.entry.selectedIndex;
    }

    /**
     * Sets selectedIndex.
     *
     * @param {number} value - The value parameter.
     */
    public set selectedIndex(value: number) {
        this.entry.selectedIndex = normalizeSelectedIndex(value);
        this.markDirty();
    }

    /**
     * Gets dropDownLines.
     *
     * @returns {number} - Returns the result.
     */
    public get dropDownLines(): number {
        return this.entry.dropDownLines;
    }

    /**
     * Sets dropDownLines.
     *
     * @param {number} value - The value parameter.
     */
    public set dropDownLines(value: number) {
        this.entry.dropDownLines = normalizeDropDownLines(value);
        this.markDirty();
    }

    /**
     * Gets dropStyle.
     *
     * @returns {ComboDropStyle} - Returns the result.
     */
    public get dropStyle(): ComboDropStyle {
        return this.entry.dropStyle;
    }

    /**
     * Sets dropStyle.
     *
     * @param {ComboDropStyle} value - The value parameter.
     */
    public set dropStyle(value: ComboDropStyle) {
        if (value !== 'combo' && value !== 'comboedit' && value !== 'simple') {
            throw new InvalidArgumentError('dropStyle must be "combo", "comboedit", or "simple"');
        }
        this.entry.dropStyle = value;
        this.markDirty();
    }

    /**
     * Gets isDisplay3DShading.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDisplay3DShading(): boolean {
        return this.entry.isDisplay3DShading;
    }

    /**
     * Sets isDisplay3DShading.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isDisplay3DShading(value: boolean) {
        this.entry.isDisplay3DShading = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets selectedValue.
     *
     * @returns {string} - Returns the result.
     */
    public get selectedValue(): string | undefined {
        return undefined;
    }
}

/**
 * OptionButtonHandle class.
 */
class OptionButtonHandle extends FormControlStyleHandleBase implements OptionButton {
    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        this.entry.text = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets checkState.
     *
     * @returns {CheckState} - Returns the result.
     */
    public get checkState(): CheckState {
        return this.entry.checkState;
    }

    /**
     * Sets checkState.
     *
     * @param {CheckState} value - The value parameter.
     */
    public set checkState(value: CheckState) {
        const state: CheckState = normalizeCheckState(value, 'unchecked');
        this.entry.checkState = state === 'mixed' ? 'unchecked' : state;
        this.markDirty();
    }

    /**
     * Gets linkedCell.
     *
     * @returns {string} - Returns the result.
     */
    public get linkedCell(): string | undefined {
        return this.entry.linkedCell;
    }

    /**
     * Sets linkedCell.
     *
     * @param {string} value - The value parameter.
     */
    public set linkedCell(value: string | undefined) {
        this.entry.linkedCell = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets isDisplay3DShading.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDisplay3DShading(): boolean {
        return this.entry.isDisplay3DShading;
    }

    /**
     * Sets isDisplay3DShading.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isDisplay3DShading(value: boolean) {
        this.entry.isDisplay3DShading = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isFirstButton.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isFirstButton(): boolean {
        return this.entry.isFirstButton;
    }

    /**
     * Sets isFirstButton.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isFirstButton(value: boolean) {
        this.entry.isFirstButton = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isTextLocked.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isTextLocked(): boolean {
        return this.entry.isTextLocked;
    }

    /**
     * Sets isTextLocked.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isTextLocked(value: boolean) {
        this.entry.isTextLocked = Boolean(value);
        this.markDirty();
    }
}

/**
 * FormButtonHandle class.
 */
class FormButtonHandle extends FormControlStyleHandleBase implements FormButton {
    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        this.entry.text = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets isTextLocked.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isTextLocked(): boolean {
        return this.entry.isTextLocked;
    }

    /**
     * Sets isTextLocked.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isTextLocked(value: boolean) {
        this.entry.isTextLocked = Boolean(value);
        this.markDirty();
    }
}

/**
 * ListBoxHandle class.
 */
class ListBoxHandle extends FormControlHandleBase implements ListBox {
    /**
     * Gets listFillRange.
     *
     * @returns {string} - Returns the result.
     */
    public get listFillRange(): string | undefined {
        return this.entry.listFillRange;
    }

    /**
     * Sets listFillRange.
     *
     * @param {string} value - The value parameter.
     */
    public set listFillRange(value: string | undefined) {
        this.entry.listFillRange = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets linkedCell.
     *
     * @returns {string} - Returns the result.
     */
    public get linkedCell(): string | undefined {
        return this.entry.linkedCell;
    }

    /**
     * Sets linkedCell.
     *
     * @param {string} value - The value parameter.
     */
    public set linkedCell(value: string | undefined) {
        this.entry.linkedCell = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets selectedIndex.
     *
     * @returns {number} - Returns the result.
     */
    public get selectedIndex(): number {
        return this.entry.selectedIndex;
    }

    /**
     * Sets selectedIndex.
     *
     * @param {number} value - The value parameter.
     */
    public set selectedIndex(value: number) {
        this.entry.selectedIndex = normalizeSelectedIndex(value);
        this.markDirty();
    }

    /**
     * Gets selectedIndices.
     *
     * @returns {number} - Returns the result.
     */
    public get selectedIndices(): ReadonlyArray<number> {
        return this.entry.selectedIndices.slice();
    }

    /**
     * Sets selectedIndices.
     *
     * @param {number} value - The value parameter.
     */
    public set selectedIndices(value: ReadonlyArray<number>) {
        this.entry.selectedIndices = normalizeSelectedIndices(value);
        this.markDirty();
    }

    /**
     * Gets selectionType.
     *
     * @returns {ListSelectionType} - Returns the result.
     */
    public get selectionType(): ListSelectionType {
        return this.entry.selectionType;
    }

    /**
     * Sets selectionType.
     *
     * @param {ListSelectionType} value - The value parameter.
     */
    public set selectionType(value: ListSelectionType) {
        this.entry.selectionType = normalizeSelectionType(value);
        this.markDirty();
    }

    /**
     * Gets isDisplay3DShading.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDisplay3DShading(): boolean {
        return this.entry.isDisplay3DShading;
    }

    /**
     * Sets isDisplay3DShading.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isDisplay3DShading(value: boolean) {
        this.entry.isDisplay3DShading = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets value.
     *
     * @returns {number} - Returns the result.
     */
    public get value(): number {
        return this.entry.value;
    }

    /**
     * Sets value.
     *
     * @param {number} value - The value parameter.
     */
    public set value(value: number) {
        this.entry.value = normalizeScrollInt(value, 0, 'value');
        this.markDirty();
    }
}

/**
 * GroupBoxHandle class.
 */
class GroupBoxHandle extends FormControlStyleHandleBase implements GroupBox {
    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        this.entry.text = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets groupLinkedCell.
     *
     * @returns {string} - Returns the result.
     */
    public get groupLinkedCell(): string | undefined {
        return this.entry.groupLinkedCell;
    }

    /**
     * Sets groupLinkedCell.
     *
     * @param {string} value - The value parameter.
     */
    public set groupLinkedCell(value: string | undefined) {
        this.entry.groupLinkedCell = normalizeOptionalString(value);
        this.markDirty();
    }
}

/**
 * FormLabelHandle class.
 */
class FormLabelHandle extends FormControlStyleHandleBase implements FormLabel {
    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        this.entry.text = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets textLink.
     *
     * @returns {string} - Returns the result.
     */
    public get textLink(): string | undefined {
        return this.entry.textLink;
    }

    /**
     * Sets textLink.
     *
     * @param {string} value - The value parameter.
     */
    public set textLink(value: string | undefined) {
        this.entry.textLink = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets isTextLocked.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isTextLocked(): boolean {
        return this.entry.isTextLocked;
    }

    /**
     * Sets isTextLocked.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isTextLocked(value: boolean) {
        this.entry.isTextLocked = Boolean(value);
        this.markDirty();
    }
}

/**
 * ScrollBarHandle class.
 */
class ScrollBarHandle extends FormControlHandleBase implements ScrollBar {
    /**
     * Gets linkedCell.
     *
     * @returns {string} - Returns the result.
     */
    public get linkedCell(): string | undefined {
        return this.entry.linkedCell;
    }

    /**
     * Sets linkedCell.
     *
     * @param {string} value - The value parameter.
     */
    public set linkedCell(value: string | undefined) {
        this.entry.linkedCell = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets value.
     *
     * @returns {number} - Returns the result.
     */
    public get value(): number {
        return this.entry.value;
    }

    /**
     * Sets value.
     *
     * @param {number} value - The value parameter.
     */
    public set value(value: number) {
        this.entry.value = normalizeScrollInt(value, 0, 'value');
        this.markDirty();
    }

    /**
     * Gets min.
     *
     * @returns {number} - Returns the result.
     */
    public get min(): number {
        return this.entry.min;
    }

    /**
     * Sets min.
     *
     * @param {number} value - The value parameter.
     */
    public set min(value: number) {
        this.entry.min = normalizeScrollInt(value, 0, 'min');
        this.markDirty();
    }

    /**
     * Gets max.
     *
     * @returns {number} - Returns the result.
     */
    public get max(): number {
        return this.entry.max;
    }

    /**
     * Sets max.
     *
     * @param {number} value - The value parameter.
     */
    public set max(value: number) {
        this.entry.max = normalizeScrollInt(value, DEFAULT_SCROLL_MAX, 'max');
        this.markDirty();
    }

    /**
     * Gets incrementalChange.
     *
     * @returns {number} - Returns the result.
     */
    public get incrementalChange(): number {
        return this.entry.incrementalChange;
    }

    /**
     * Sets incrementalChange.
     *
     * @param {number} value - The value parameter.
     */
    public set incrementalChange(value: number) {
        this.entry.incrementalChange = normalizeScrollInt(value, 1, 'incrementalChange');
        this.markDirty();
    }

    /**
     * Gets pageChange.
     *
     * @returns {number} - Returns the result.
     */
    public get pageChange(): number {
        return this.entry.pageChange;
    }

    /**
     * Sets pageChange.
     *
     * @param {number} value - The value parameter.
     */
    public set pageChange(value: number) {
        this.entry.pageChange = normalizeScrollInt(value, DEFAULT_SCROLL_PAGE, 'pageChange');
        this.markDirty();
    }

    /**
     * Gets isHorizontal.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isHorizontal(): boolean {
        return this.entry.isHorizontal;
    }

    /**
     * Sets isHorizontal.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isHorizontal(value: boolean) {
        this.entry.isHorizontal = Boolean(value);
        this.markDirty();
    }
}

/**
 * SpinButtonHandle class.
 */
class SpinButtonHandle extends FormControlHandleBase implements SpinButton {
    /**
     * Gets linkedCell.
     *
     * @returns {string} - Returns the result.
     */
    public get linkedCell(): string | undefined {
        return this.entry.linkedCell;
    }

    /**
     * Sets linkedCell.
     *
     * @param {string} value - The value parameter.
     */
    public set linkedCell(value: string | undefined) {
        this.entry.linkedCell = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets value.
     *
     * @returns {number} - Returns the result.
     */
    public get value(): number {
        return this.entry.value;
    }

    /**
     * Sets value.
     *
     * @param {number} value - The value parameter.
     */
    public set value(value: number) {
        this.entry.value = normalizeScrollInt(value, 0, 'value');
        this.markDirty();
    }

    /**
     * Gets min.
     *
     * @returns {number} - Returns the result.
     */
    public get min(): number {
        return this.entry.min;
    }

    /**
     * Sets min.
     *
     * @param {number} value - The value parameter.
     */
    public set min(value: number) {
        this.entry.min = normalizeScrollInt(value, 0, 'min');
        this.markDirty();
    }

    /**
     * Gets max.
     *
     * @returns {number} - Returns the result.
     */
    public get max(): number {
        return this.entry.max;
    }

    /**
     * Sets max.
     *
     * @param {number} value - The value parameter.
     */
    public set max(value: number) {
        this.entry.max = normalizeScrollInt(value, DEFAULT_SCROLL_MAX, 'max');
        this.markDirty();
    }

    /**
     * Gets incrementalChange.
     *
     * @returns {number} - Returns the result.
     */
    public get incrementalChange(): number {
        return this.entry.incrementalChange;
    }

    /**
     * Sets incrementalChange.
     *
     * @param {number} value - The value parameter.
     */
    public set incrementalChange(value: number) {
        this.entry.incrementalChange = normalizeScrollInt(value, 1, 'incrementalChange');
        this.markDirty();
    }
}

/**
 * EditBoxHandle class.
 */
class EditBoxHandle extends FormControlStyleHandleBase implements EditBox {
    /**
     * Gets text.
     *
     * @returns {string} - Returns the result.
     */
    public get text(): string {
        return this.entry.text;
    }

    /**
     * Sets text.
     *
     * @param {string} value - The value parameter.
     */
    public set text(value: string) {
        this.entry.text = value === undefined || value === null ? '' : String(value);
        this.markDirty();
    }

    /**
     * Gets textLink.
     *
     * @returns {string} - Returns the result.
     */
    public get textLink(): string | undefined {
        return this.entry.textLink;
    }

    /**
     * Sets textLink.
     *
     * @param {string} value - The value parameter.
     */
    public set textLink(value: string | undefined) {
        this.entry.textLink = normalizeOptionalString(value);
        this.markDirty();
    }

    /**
     * Gets isMultiLine.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isMultiLine(): boolean {
        return this.entry.isMultiLine;
    }

    /**
     * Sets isMultiLine.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isMultiLine(value: boolean) {
        this.entry.isMultiLine = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets validation.
     *
     * @returns {EditValidation} - Returns the result.
     */
    public get validation(): EditValidation {
        return this.entry.validation;
    }

    /**
     * Sets validation.
     *
     * @param {EditValidation} value - The value parameter.
     */
    public set validation(value: EditValidation) {
        this.entry.validation = normalizeEditValidation(value);
        this.markDirty();
    }

    /**
     * Gets isPassword.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isPassword(): boolean {
        return this.entry.isPassword;
    }

    /**
     * Sets isPassword.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isPassword(value: boolean) {
        this.entry.isPassword = Boolean(value);
        this.markDirty();
    }

    /**
     * Gets isTextLocked.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isTextLocked(): boolean {
        return this.entry.isTextLocked;
    }

    /**
     * Sets isTextLocked.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isTextLocked(value: boolean) {
        this.entry.isTextLocked = Boolean(value);
        this.markDirty();
    }
}

// ── legacyDrawing worksheet element ──────────────────────────────────────────

/**
 * Successors after `legacyDrawing` in CT_Worksheet (drawing successors minus self).
 * Citation: sml CT_Worksheet sequence.
 */
export const LEGACY_DRAWING_SUCCESSORS: ReadonlyArray<string> = DRAWING_SUCCESSORS.filter((n: string): boolean => n !== 'legacyDrawing');

const LEGACY_DRAWING_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
    'sheetData',
    'sheetCalcPr',
    'sheetProtection',
    'protectedRanges',
    'scenarios',
    'autoFilter',
    'sortState',
    'dataConsolidate',
    'customSheetViews',
    'mergeCells',
    'phoneticPr',
    'conditionalFormatting',
    'dataValidations',
    'hyperlinks',
    'printOptions',
    'pageMargins',
    'pageSetup',
    'headerFooter',
    'rowBreaks',
    'colBreaks',
    'customProperties',
    'cellWatches',
    'ignoredErrors',
    'smartTags',
    'drawing'
];

/**
 * Index to insert modeled `<legacyDrawing r:id="…"/>` among after-sheetData siblings.
 *
 * @param {string} afterSheetDataLocals - The afterSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findLegacyDrawingInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
    const pred: Set<string> = new Set(LEGACY_DRAWING_PREDECESSORS_AFTER_SHEET_DATA);
    const succ: Set<string> = new Set(LEGACY_DRAWING_SUCCESSORS);
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && pred.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && succ.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Serialize worksheet legacyDrawing element.
 *
 * @param {string} relationshipId - The relationshipId parameter.
 * @returns {string} - Returns the result.
 */
export function serializeLegacyDrawingElementXml(relationshipId: string): string {
    return `<legacyDrawing r:id="${escapeXml(relationshipId)}"/>`;
}

// ── VML parse / serialize ────────────────────────────────────────────────────

/**
 * ParsedVml.
 */
interface ParsedVml {
    readonly controls: FormControlEntry[];
    readonly foreignShapesXml: string[];
    readonly rootExtra: string;
}

/**
 * parseVmlDrawingXml function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {ParsedVml} - Returns the result.
 */
function parseVmlDrawingXml(xml: string): ParsedVml {
    const trimmed: string = stripProlog(xml);
    // Root is typically bare `<xml …>`; also accept any root wrapping shapes.
    const rootMatch: { openAttrs: string; inner: string } =
        matchRootLocal(trimmed, 'xml') != null ? matchRootLocal(trimmed, 'xml') : matchAnyRoot(trimmed);
    if (rootMatch === undefined) {
        return { controls: [], foreignShapesXml: [], rootExtra: '' };
    }
    const children: string[] = splitTopLevelElements(rootMatch.inner);
    const controls: FormControlEntry[] = [];
    const foreignShapesXml: string[] = [];

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local === 'shapetype') {
            // Shared type definitions — re-emitted on write; not preserved as foreign.
            continue;
        }
        if (local !== 'shape') {
            foreignShapesXml.push(child);
            continue;
        }
        const entry: FormControlEntry = parseFormControlShape(child);
        if (entry === undefined) {
            foreignShapesXml.push(child);
            continue;
        }
        controls.push(entry);
    }

    return { controls, foreignShapesXml, rootExtra: rootMatch.openAttrs };
}

/**
 * parseFormControlShape function.
 *
 * @param {string} shapeXml - The shapeXml parameter.
 * @returns {*} - Returns the result.
 */
function parseFormControlShape(shapeXml: string): FormControlEntry | undefined {
    const client: string = findChildByLocal(shapeXml, 'ClientData');
    if (client === undefined) {
        return undefined;
    }
    const clientAttrs: Map<string, string> = parseAttrMap(elementOpenAttrs(client));
    const objectTypeRaw: string = clientAttrs.get('ObjectType');
    const objectType: string = (objectTypeRaw !== undefined && objectTypeRaw !== null ? objectTypeRaw : '').trim();
    let kind: FormControlKind | undefined;
    if (objectType === 'Checkbox') {
        kind = 'checkbox';
    } else if (objectType === 'Drop') {
        kind = 'combo';
    } else if (objectType === 'Radio') {
        kind = 'option';
    } else if (objectType === 'Button') {
        kind = 'button';
    } else if (objectType === 'List') {
        kind = 'list';
    } else if (objectType === 'GBox') {
        kind = 'group';
    } else if (objectType === 'Label') {
        kind = 'label';
    } else if (objectType === 'Scroll') {
        kind = 'scroll';
    } else if (objectType === 'Spin') {
        kind = 'spin';
    } else if (objectType === 'Edit') {
        kind = 'edit';
    } else {
        return undefined;
    }

    const shapeAttrs: Map<string, string> = parseAttrMap(elementOpenAttrs(shapeXml));
    const idAttr: string = ((__t: string): string => (__t != null ? __t : ''))(
        shapeAttrs.get('id') != null ? shapeAttrs.get('id') : shapeAttrs.get('spid')
    );
    const shapeIdParsed: number = parseShapeId(idAttr);
    const shapeId: number = shapeIdParsed != null ? shapeIdParsed : 1025;
    const styleAttr: string = shapeAttrs.get('style');
    const style: string = styleAttr !== undefined && styleAttr !== null ? styleAttr : '';
    const styleMap: Map<string, string> = parseCssStyle(style);
    const widthCss: string = styleMap.get('width');
    const heightCss: string = styleMap.get('height');
    const widthEmuParsed: number = widthCss !== undefined ? cssLengthToEmu(widthCss) : undefined;
    const heightEmuParsed: number = heightCss !== undefined ? cssLengthToEmu(heightCss) : undefined;
    const widthEmu: number = widthEmuParsed != null ? widthEmuParsed : 100 * EMU_PER_PX_96DPI;
    const heightEmu: number = heightEmuParsed != null ? heightEmuParsed : 20 * EMU_PER_PX_96DPI;
    const zIndex: number = parseIntOr(styleMap.get('z-index'), 1);
    const visibilityCss: string = styleMap.get('visibility');
    const isVisible: boolean = (visibilityCss !== undefined ? visibilityCss : '').toLowerCase() !== 'hidden';
    const nameAttr: string = shapeAttrs.get('id');
    const name: string = nameAttr !== undefined && nameAttr !== null ? nameAttr : defaultNameForKind(kind, shapeId);
    const alt: string = shapeAttrs.get('alt');

    const clientInner: string = elementInner(client);
    const clientKids: string[] = splitTopLevelElements(clientInner);
    const clientMap: Map<string, string> = new Map<string, string>();
    const emptyTags: Set<string> = new Set<string>();
    for (const k of clientKids) {
        const ln: string = elementLocalName(k);
        const inner: string = elementInner(k).trim();
        if (inner.length === 0 && !k.includes('><') && /\/\s*>$/.test(k.trim()) === false) {
            // empty element content
            emptyTags.add(ln);
            clientMap.set(ln, '');
        } else if (inner.length === 0) {
            emptyTags.add(ln);
            clientMap.set(ln, '');
        } else {
            clientMap.set(ln, unescapeXml(inner));
        }
    }

    const anchor: { col1: number; row1: number } = parseAnchor(clientMap.get('Anchor'));
    const fromCol0: number = anchor != null && anchor.col1 != null ? anchor.col1 : 0;
    const fromRow0: number = anchor != null && anchor.row1 != null ? anchor.row1 : 0;

    const onAction: string = emptyToUndef(clientMap.get('FmlaMacro'));
    const linkedCell: string = emptyToUndef(clientMap.get('FmlaLink'));
    const checkedRaw: string = clientMap.get('Checked');
    const checkState: CheckState = parseCheckState(checkedRaw);

    const printObject: boolean = parseTrueFalseBlank(clientMap, emptyTags, 'PrintObject', true);
    const isLocked: boolean = parseTrueFalseBlank(clientMap, emptyTags, 'Locked', true);
    const moveWithCells: boolean = parseTrueFalseBlank(clientMap, emptyTags, 'MoveWithCells', true);
    const sizeWithCells: boolean = parseTrueFalseBlank(clientMap, emptyTags, 'SizeWithCells', defaultSizeWithCells(kind));

    const filledRaw: string = shapeAttrs.get('filled');
    const filledAttr: string = (filledRaw !== undefined && filledRaw !== null ? filledRaw : '').trim().toLowerCase();
    const fillcolorRaw: string = shapeAttrs.get('fillcolor');
    let fillColor: string | undefined;
    if (filledAttr === 't' || filledAttr === 'true' || filledAttr === '1') {
        fillColor = parseVmlColor(fillcolorRaw);
    } else if (
        filledAttr !== 'f' &&
        filledAttr !== 'false' &&
        filledAttr !== '0' &&
        fillcolorRaw !== undefined &&
        fillcolorRaw.trim() !== ''
    ) {
        // filled omitted: treat fillcolor presence as filled.
        fillColor = parseVmlColor(fillcolorRaw);
    }

    const entry: FormControlEntry = {
        kind,
        shapeId,
        name: name.length > 0 ? name : defaultNameForKind(kind, shapeId),
        isVisible,
        alternativeText: alt !== undefined && alt.length > 0 ? alt : undefined,
        fromRow0,
        fromCol0,
        widthEmu,
        heightEmu,
        zIndex,
        onAction,
        printObject,
        isLocked,
        moveWithCells,
        sizeWithCells,
        fillColor,
        fontName: DEFAULT_CAPTION_FONT_NAME,
        fontSize: DEFAULT_CAPTION_FONT_SIZE_PT,
        fontStyle: 'regular',
        underline: 'none',
        isStrikethrough: false,
        isSuperscript: false,
        isSubscript: false,
        horizontalAlignment: 'left',
        verticalAlignment: defaultVerticalAlignment(kind),
        text: '',
        checkState,
        linkedCell,
        isDisplay3DShading: true,
        isTextLocked: true,
        selectedIndex: 0,
        dropDownLines: 8,
        dropStyle: 'combo',
        isFirstButton: false,
        selectionType: 'single',
        selectedIndices: [],
        value: 0,
        min: 0,
        max: DEFAULT_SCROLL_MAX,
        incrementalChange: 1,
        pageChange: DEFAULT_SCROLL_PAGE,
        isHorizontal: false,
        isMultiLine: false,
        validation: 'text',
        isPassword: false
    };

    if (kind === 'checkbox') {
        applyCaptionFromShape(entry, shapeXml, clientMap);
        entry.isDisplay3DShading = !clientMap.has('NoThreeD');
        if (clientMap.has('LockText') && isFalseToken(clientMap.get('LockText'))) {
            entry.isTextLocked = false;
        }
    } else if (kind === 'option') {
        applyCaptionFromShape(entry, shapeXml, clientMap);
        entry.isDisplay3DShading = !clientMap.has('NoThreeD');
        entry.isFirstButton = clientMap.has('FirstButton');
        if (clientMap.has('LockText') && isFalseToken(clientMap.get('LockText'))) {
            entry.isTextLocked = false;
        }
        if (entry.checkState === 'mixed') {
            entry.checkState = 'unchecked';
        }
    } else if (kind === 'combo') {
        entry.listFillRange = emptyToUndef(clientMap.get('FmlaRange'));
        entry.selectedIndex = parseIntOr(clientMap.get('Sel'), 0);
        if (entry.selectedIndex < 0) {
            entry.selectedIndex = 0;
        }
        entry.dropDownLines = clampInt(parseIntOr(clientMap.get('DropLines'), 8), 0, 30_000);
        entry.dropStyle = parseDropStyle(clientMap.get('DropStyle'));
        entry.isDisplay3DShading = !clientMap.has('NoThreeD2');
    } else if (kind === 'button') {
        applyCaptionFromShape(entry, shapeXml, clientMap);
        if (clientMap.has('LockText') && isFalseToken(clientMap.get('LockText'))) {
            entry.isTextLocked = false;
        }
    } else if (kind === 'list') {
        entry.listFillRange = emptyToUndef(clientMap.get('FmlaRange'));
        entry.selectedIndex = parseIntOr(clientMap.get('Sel'), 0);
        if (entry.selectedIndex < 0) {
            entry.selectedIndex = 0;
        }
        entry.selectedIndices = parseMultiSel(clientMap.get('MultiSel'));
        entry.selectionType = parseSelectionType(clientMap.get('SelType'));
        entry.value = parseIntOr(clientMap.get('Val'), 0);
        entry.isDisplay3DShading = !clientMap.has('NoThreeD2');
    } else if (kind === 'group') {
        applyCaptionFromShape(entry, shapeXml, clientMap);
        entry.groupLinkedCell = emptyToUndef(clientMap.get('FmlaGroup'));
    } else if (kind === 'label') {
        applyCaptionFromShape(entry, shapeXml, clientMap);
        entry.textLink = emptyToUndef(clientMap.get('FmlaTxbx'));
        if (clientMap.has('LockText') && isFalseToken(clientMap.get('LockText'))) {
            entry.isTextLocked = false;
        }
    } else if (kind === 'scroll') {
        entry.value = parseIntOr(clientMap.get('Val'), 0);
        entry.min = parseIntOr(clientMap.get('Min'), 0);
        entry.max = parseIntOr(clientMap.get('Max'), DEFAULT_SCROLL_MAX);
        entry.incrementalChange = parseIntOr(clientMap.get('Inc'), 1);
        entry.pageChange = parseIntOr(clientMap.get('Page'), DEFAULT_SCROLL_PAGE);
        entry.isHorizontal = parseHoriz(clientMap, emptyTags);
    } else if (kind === 'spin') {
        entry.value = parseIntOr(clientMap.get('Val'), 0);
        entry.min = parseIntOr(clientMap.get('Min'), 0);
        entry.max = parseIntOr(clientMap.get('Max'), DEFAULT_SCROLL_MAX);
        entry.incrementalChange = parseIntOr(clientMap.get('Inc'), 1);
    } else if (kind === 'edit') {
        applyCaptionFromShape(entry, shapeXml, clientMap);
        entry.textLink = emptyToUndef(clientMap.get('FmlaTxbx'));
        entry.isMultiLine = clientMap.has('MultiLine');
        entry.isPassword = clientMap.has('SecretEdit');
        if (clientMap.has('LockText') && isFalseToken(clientMap.get('LockText'))) {
            entry.isTextLocked = false;
        }
        // validation stays model default 'text' — no invented VTEdit mapping
    }

    return entry;
}

/**
 * Visibility and size chrome extracted from a VML note shape.
 *
 * @private
 */
export interface NoteShapeInfo {
    /** Whether the note balloon is visible (not `visibility:hidden`). */
    readonly isVisible: boolean;
    /** Optional width in EMUs when recoverable from style or Anchor. */
    readonly widthEmu?: number;
    /** Optional height in EMUs when recoverable from style or Anchor. */
    readonly heightEmu?: number;
}

/**
 * True when a VML shape fragment is a spreadsheet comment note (`x:ClientData ObjectType="Note"`).
 *
 * @param {string} xml - The xml parameter.
 * @returns {boolean} - Returns the result.
 */
function isCommentNoteShapeXml(xml: string): boolean {
    return /ObjectType\s*=\s*["']Note["']/i.test(xml);
}

/**
 * True when a VML fragment is the comment-note shapetype (`o:spt="202"` / `#_x0000_t202`) rather than a shape instance. Classic comments may inject this in the overlay; strip it so serializeVmlDrawingXml owns emission.
 *
 * @param {string} xml - The xml parameter.
 * @returns {boolean} - Returns the result.
 */
function isCommentNoteShapeTypeXml(xml: string): boolean {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    if (!/<\s*(?:[A-Za-z_][\w.-]*:)?shapetype\b/i.test(xml)) {
        return false;
    }
    if (new RegExp(`\\bid\\s*=\\s*["']${COMMENT_NOTE_SHAPE_TYPE_ID}["']`, 'i').test(xml)) {
        return true;
    }
    return /o:spt\s*=\s*["']202["']/i.test(xml);
}

/**
 * Note VML chrome parsed from ClientData / size attrs.
 */
interface CommentNoteChrome {
    row0: number;
    col0: number;
    isVisible: boolean;
    widthEmu?: number;
    heightEmu?: number;
}

/**
 * Parse note chrome (row/col, visibility, size) from a Note VML shape.
 *
 * @param {string} xml - The xml parameter.
 * @returns {CommentNoteChrome|undefined} - Parsed chrome, or undefined when incomplete.
 */
function parseCommentNoteChrome(xml: string): CommentNoteChrome | undefined {
    const client: string = findChildByLocal(xml, 'ClientData');
    if (client === undefined) {
        return undefined;
    }
    const rowEl: string = findChildByLocal(client, 'Row');
    const colEl: string = findChildByLocal(client, 'Column');
    if (rowEl === undefined || colEl === undefined) {
        return undefined;
    }
    const rowText: string = unescapeXml(elementInnerText(rowEl));
    const colText: string = unescapeXml(elementInnerText(colEl));
    const row0: number = Number.parseInt(rowText !== undefined ? rowText : '', 10);
    const col0: number = Number.parseInt(colText !== undefined ? colText : '', 10);
    if (!Number.isFinite(row0) || row0 < 0 || !Number.isFinite(col0) || col0 < 0) {
        return undefined;
    }

    const openAttrs: string = matchOpenAttrs(xml);
    const attrs: Map<string, string> = parseAttrMap(openAttrs !== undefined ? openAttrs : '');
    const styleAttr: string = attrs.get('style');
    const style: string = styleAttr !== undefined ? styleAttr : '';
    const styleMap: Map<string, string> = parseCssStyle(style);
    const visibilityAttr: string = styleMap.get('visibility');
    const visibility: string = (visibilityAttr !== undefined ? visibilityAttr : '').toLowerCase();
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const hasVisibleTag: boolean = /<\s*(?:[A-Za-z_][\w.-]*:)?Visible\b/i.test(client);
    const isVisible: boolean = hasVisibleTag || (visibility !== 'hidden' && visibility !== 'collapse');

    let widthEmu: number | undefined = cssLengthToEmu(styleMap.get('width'));
    let heightEmu: number | undefined = cssLengthToEmu(styleMap.get('height'));

    if (widthEmu === undefined || heightEmu === undefined) {
        const anchorEl: string = findChildByLocal(client, 'Anchor');
        if (anchorEl !== undefined) {
            const parts: string[] = unescapeXml(elementInnerText(anchorEl))
                .split(',')
                .map((p: string): string => p.trim());
            // leftCol, leftOff, topRow, topOff, rightCol, rightOff, bottomRow, bottomOff
            if (parts.length >= 8) {
                const leftOff: number = Number.parseInt(parts[1] != null ? parts[1] : '', 10);
                const rightOff: number = Number.parseInt(parts[5] != null ? parts[5] : '', 10);
                const topOff: number = Number.parseInt(parts[3] != null ? parts[3] : '', 10);
                const bottomOff: number = Number.parseInt(parts[7] != null ? parts[7] : '', 10);
                // Offsets are in pixels at 96dpi when classic comments serialize.
                if (widthEmu === undefined && Number.isFinite(leftOff) && Number.isFinite(rightOff)) {
                    const px: number = Math.max(0, rightOff - leftOff);
                    if (px > 0) {
                        widthEmu = Math.round(px * EMU_PER_PX_96DPI);
                    }
                }
                if (heightEmu === undefined && Number.isFinite(topOff) && Number.isFinite(bottomOff)) {
                    const px: number = Math.max(0, bottomOff - topOff);
                    if (px > 0) {
                        heightEmu = Math.round(px * EMU_PER_PX_96DPI);
                    }
                }
            }
        }
    }

    const out: {
        row0: number;
        col0: number;
        isVisible: boolean;
        widthEmu?: number;
        heightEmu?: number;
    } = { row0, col0, isVisible };
    if (widthEmu !== undefined) {
        out.widthEmu = widthEmu;
    }
    if (heightEmu !== undefined) {
        out.heightEmu = heightEmu;
    }
    return out;
}

/**
 * matchOpenAttrs function.
 *
 * @param {string} elementXml - The elementXml parameter.
 * @returns {string} - Returns the result.
 */
function matchOpenAttrs(elementXml: string): string | undefined {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<\s*(?:[A-Za-z_][\w.-]*:)?[A-Za-z_][\w.-]*\b([^>]*)/.exec(elementXml.trim());
    return m === null ? undefined : m[1];
}

/**
 * elementInnerText function.
 *
 * @param {string} elementXml - The elementXml parameter.
 * @returns {string} - Returns the result.
 */
function elementInnerText(elementXml: string): string {
    const m: RegExpExecArray =
        /^<[^>]+>([\s\S]*)<\/[^>]+>\s*$/.exec(elementXml.trim()) != null
            ? /^<[^>]+>([\s\S]*)<\/[^>]+>\s*$/.exec(elementXml.trim())
            : /^<[^>]+\/>\s*$/.exec(elementXml.trim());
    if (m === null) {
        return '';
    }
    return m[1] != null ? m[1] : '';
}

/**
 * Minimal Excel-openable VML note shape for a comments / threaded-comment placeholder. Citation: ECMA-376-1 Annex L; ECMA-376-4 §19.4.2 ClientData ObjectType Note; Row/Column are 0-based cell coordinates matching comments part `ref`.
 *
 * @param {number} shapeId - The shapeId parameter.
 * @param {number} zIndex - The zIndex parameter.
 * @param {number} row0 - The row0 parameter.
 * @param {number} col0 - The col0 parameter.
 * @returns {string} - Returns the result.
 */
function serializeCommentNoteShape(shapeId: number, zIndex: number, row0: number, col0: number): string {
    const id: string = `_x0000_s${shapeId}`;
    // Balloon sits near the cell; offsets mirror common Excel comment chrome.
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const marginLeftPt: 59.25 = 59.25;
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const marginTopPt: 1.5 = 1.5;
    const style: string = [
        'position:absolute',
        `margin-left:${marginLeftPt}pt`,
        `margin-top:${marginTopPt}pt`,
        `width:${COMMENT_NOTE_WIDTH_PT}pt`,
        `height:${COMMENT_NOTE_HEIGHT_PT}pt`,
        `z-index:${zIndex}`,
        // Hidden until the indicator is activated — matches typical Excel notes.
        'visibility:hidden'
    ].join(';');

    // Anchor: leftCol, leftOff, topRow, topOff, rightCol, rightOff, bottomRow, bottomOff.
    // Span a couple of cells so the balloon has a stable layout box.
    const anchor: string = `${col0}, 15, ${row0}, 10, ${col0 + 2}, 15, ${row0 + 4}, 4`;

    return (
        `<v:shape id="${escapeXml(id)}" type="#${COMMENT_NOTE_SHAPE_TYPE_ID}"` +
        ` style="${escapeXml(style)}"` +
        ' fillcolor="#ffffe1"' +
        ' o:insetmode="auto">' +
        '<v:fill color2="#ffffe1"/>' +
        '<v:shadow on="t" color="black" obscured="t"/>' +
        '<v:path o:connecttype="none"/>' +
        '<v:textbox style="mso-direction-alt:auto"><div style="text-align:left"></div></v:textbox>' +
        '<x:ClientData ObjectType="Note">' +
        '<x:MoveWithCells/>' +
        '<x:SizeWithCells/>' +
        `<x:Anchor>${escapeXmlText(anchor)}</x:Anchor>` +
        '<x:AutoFill>False</x:AutoFill>' +
        `<x:Row>${String(row0)}</x:Row>` +
        `<x:Column>${String(col0)}</x:Column>` +
        '</x:ClientData>' +
        '</v:shape>'
    );
}

/**
 * serializeVmlDrawingXml function.
 *
 * @param {Object} entries - The entries parameter.
 * @param {string} foreignShapesXml - The foreignShapesXml parameter.
 * @returns {string} - Returns the result.
 */
function serializeVmlDrawingXml(entries: ReadonlyArray<FormControlEntry>, foreignShapesXml: ReadonlyArray<string>): string {
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    lines.push(`<xml xmlns:v="${VML_NS}" xmlns:o="${OFFICE_NS}" xmlns:x="${EXCEL_NS}">`);
    // Shared shapetype for form controls (ShapeInstance 201).
    // Citation: XlsIO CheckBox/OptionButton SerializeShapeTypeSubNodes + Combo empty type.
    const hasFormControls: boolean = entries.some((e: FormControlEntry): boolean => e.foreignShapeXml === undefined);
    if (hasFormControls) {
        lines.push(
            `<v:shapetype id="${FORM_CONTROL_SHAPE_TYPE_ID}" coordsize="21600,21600" o:spt="${FORM_CONTROL_SHAPE_INSTANCE}" path="m,l,21600r21600,l21600,xe">` +
                '<v:stroke joinstyle="miter"/>' +
                '<v:path shadowok="f" o:extrusionok="f" strokeok="f" fillok="f" o:connecttype="rect"/>' +
                '<o:lock v:ext="edit" shapetype="t"/>' +
                '</v:shapetype>'
        );
    }
    // Comment note shapetype (spt 202). Citation: ECMA-376-1 Annex L comment VML.
    const hasCommentNotes: boolean =
        foreignShapesXml.some((s: string): boolean => isCommentNoteShapeXml(s)) ||
        entries.some((e: FormControlEntry): boolean => e.foreignShapeXml !== undefined && isCommentNoteShapeXml(e.foreignShapeXml));
    if (hasCommentNotes) {
        lines.push(
            `<v:shapetype id="${COMMENT_NOTE_SHAPE_TYPE_ID}" coordsize="21600,21600" o:spt="${COMMENT_NOTE_SHAPE_INSTANCE}" path="m,l,21600r21600,l21600,xe">` +
                '<v:stroke joinstyle="miter"/>' +
                '<v:path gradientshapeok="t" o:connecttype="rect"/>' +
                '</v:shapetype>'
        );
    }
    for (const e of entries) {
        if (e.foreignShapeXml !== undefined) {
            lines.push(e.foreignShapeXml);
            continue;
        }
        lines.push(serializeFormControlShape(e));
    }
    for (const f of foreignShapesXml) {
        lines.push(f);
    }
    lines.push('</xml>');
    return lines.join('');
}

/**
 * serializeFormControlShape function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeFormControlShape(e: FormControlEntry): string {
    const shapeId: string = `_x0000_s${e.shapeId}`;
    const style: string = buildShapeStyle(e);
    const hasFill: boolean = e.fillColor !== undefined && e.fillColor.length > 0;
    const attrs: string[] = [
        `id="${escapeXml(shapeId)}"`,
        `type="#${FORM_CONTROL_SHAPE_TYPE_ID}"`,
        `style="${escapeXml(style)}"`,
        hasFill ? 'filled="t"' : 'filled="f"',
        'stroked="f"',
        'o:insetmode="auto"'
    ];
    if (hasFill && e.fillColor !== undefined) {
        attrs.splice(3, 0, `fillcolor="#${escapeXml(e.fillColor)}"`);
    }
    if (e.alternativeText !== undefined && e.alternativeText.length > 0) {
        attrs.push(`alt="${escapeXml(e.alternativeText)}"`);
    }
    // Prefer author name via spid secondary only when name differs from id format.
    if (e.name.length > 0 && e.name !== shapeId) {
        // XlsIO may put name in id; keep wire id stable and store name in o:spid-less alt path.
        // Excel often uses id as shape id; author name is separate in some paths.
        // We keep `_x0000_sN` as id (required for type wiring) and put display name in
        // a data attribute is not standard — name is recovered from load id when matching.
        // For round-trip of custom names, write id as the name when it is not empty and
        // looks like an author name (not starting with _x0000_s).
        if (!e.name.startsWith('_x0000_s')) {
            attrs[0] = `id="${escapeXml(e.name)}"`;
            attrs.splice(1, 0, `o:spid="${escapeXml(shapeId)}"`);
        }
    }

    const body: string[] = [];
    if (
        e.kind === 'checkbox' ||
        e.kind === 'option' ||
        e.kind === 'button' ||
        e.kind === 'group' ||
        e.kind === 'label' ||
        e.kind === 'edit'
    ) {
        body.push(serializeCaptionTextBox(e));
    }
    body.push(serializeClientData(e));

    return `<v:shape ${attrs.join(' ')}>${body.join('')}</v:shape>`;
}

/**
 * serializeCaptionTextBox function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeCaptionTextBox(e: FormControlEntry): string {
    const face: string = e.fontName.length > 0 ? e.fontName : DEFAULT_CAPTION_FONT_NAME;
    const sizeHalfPt: number = Math.max(1, Math.round(e.fontSize * 20));
    const color: string = e.fontColor !== undefined && e.fontColor.length > 0 ? `#${e.fontColor}` : 'auto';
    const align: FormControlHorizontalAlignment = e.horizontalAlignment;
    const fontInner: string =
        e.text.length > 0
            ? `<font face="${escapeXml(face)}" size="${String(sizeHalfPt)}" color="${escapeXml(color)}">${serializeCaptionFontEffects(e)}</font>`
            : '';
    return '<v:textbox>' + `<div style="text-align:${escapeXml(align)}">${fontInner}</div>` + '</v:textbox>';
}

/**
 * Nest caption effect tags around escaped plain text. Excel order (outer → inner): b → i → u → s → text (sup/sub wrap text when set). Citation: `output/_excel-form-font-effects.xlsx` / probe BoldBtn nesting.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeCaptionFontEffects(e: FormControlEntry): string {
    let inner: string = escapeXmlText(e.text);
    if (e.isSuperscript) {
        inner = `<sup>${inner}</sup>`;
    } else if (e.isSubscript) {
        inner = `<sub>${inner}</sub>`;
    }
    if (e.isStrikethrough) {
        inner = `<s>${inner}</s>`;
    }
    if (e.underline === 'single') {
        inner = `<u>${inner}</u>`;
    } else if (e.underline === 'double') {
        inner = `<u class="${FORM_CONTROL_DOUBLE_UNDERLINE_CLASS}">${inner}</u>`;
    }
    const bold: boolean = e.fontStyle === 'bold' || e.fontStyle === 'boldItalic';
    const italic: boolean = e.fontStyle === 'italic' || e.fontStyle === 'boldItalic';
    if (italic) {
        inner = `<i>${inner}</i>`;
    }
    if (bold) {
        inner = `<b>${inner}</b>`;
    }
    return inner;
}

/**
 * serializeClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeClientData(e: FormControlEntry): string {
    if (e.kind === 'combo') {
        return serializeComboClientData(e);
    }
    if (e.kind === 'list') {
        return serializeListClientData(e);
    }
    if (e.kind === 'scroll') {
        return serializeScrollClientData(e);
    }
    if (e.kind === 'spin') {
        return serializeSpinClientData(e);
    }
    if (e.kind === 'button') {
        return serializeButtonClientData(e);
    }
    if (e.kind === 'group') {
        return serializeGroupClientData(e);
    }
    if (e.kind === 'label') {
        return serializeLabelClientData(e);
    }
    if (e.kind === 'edit') {
        return serializeEditClientData(e);
    }
    // checkbox / option
    const objectType: 'Checkbox' | 'Radio' = e.kind === 'checkbox' ? 'Checkbox' : 'Radio';
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoFill>False</x:AutoFill>');
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    pushCaptionAlignment(kids, e);
    if (!e.isTextLocked) {
        kids.push('<x:LockText>False</x:LockText>');
    }
    const checked: number = checkStateToWire(e.checkState);
    if (checked !== 0) {
        kids.push(`<x:Checked>${checked}</x:Checked>`);
    }
    if (e.kind === 'option') {
        if (e.linkedCell !== undefined && e.linkedCell.length > 0 && e.isFirstButton) {
            kids.push(`<x:FmlaLink>${escapeXmlText(e.linkedCell)}</x:FmlaLink>`);
        }
    } else if (e.linkedCell !== undefined && e.linkedCell.length > 0) {
        kids.push(`<x:FmlaLink>${escapeXmlText(e.linkedCell)}</x:FmlaLink>`);
    }
    if (!e.isDisplay3DShading) {
        kids.push('<x:NoThreeD/>');
    }
    if (e.kind === 'option' && e.isFirstButton) {
        kids.push('<x:FirstButton/>');
    }
    return `<x:ClientData ObjectType="${objectType}">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeComboClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeComboClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    if (e.linkedCell !== undefined && e.linkedCell.length > 0) {
        kids.push(`<x:FmlaLink>${escapeXmlText(e.linkedCell)}</x:FmlaLink>`);
    }
    kids.push('<x:Val>2</x:Val>');
    kids.push('<x:Min>0</x:Min>');
    kids.push('<x:Max>2</x:Max>');
    kids.push('<x:Inc>1</x:Inc>');
    kids.push('<x:Page>8</x:Page>');
    kids.push('<x:Dx>15</x:Dx>');
    if (e.listFillRange !== undefined && e.listFillRange.length > 0) {
        kids.push(`<x:FmlaRange>${escapeXmlText(e.listFillRange)}</x:FmlaRange>`);
    }
    kids.push(`<x:Sel>${e.selectedIndex}</x:Sel>`);
    if (!e.isDisplay3DShading) {
        kids.push('<x:NoThreeD2/>');
    }
    kids.push('<x:SelType>Single</x:SelType>');
    kids.push('<x:LCT>Normal</x:LCT>');
    kids.push(`<x:DropStyle>${dropStyleToWire(e.dropStyle)}</x:DropStyle>`);
    kids.push(`<x:DropLines>${e.dropDownLines}</x:DropLines>`);
    return `<x:ClientData ObjectType="Drop">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeListClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeListClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    if (e.linkedCell !== undefined && e.linkedCell.length > 0) {
        kids.push(`<x:FmlaLink>${escapeXmlText(e.linkedCell)}</x:FmlaLink>`);
    }
    kids.push(`<x:Val>${e.value}</x:Val>`);
    if (e.listFillRange !== undefined && e.listFillRange.length > 0) {
        kids.push(`<x:FmlaRange>${escapeXmlText(e.listFillRange)}</x:FmlaRange>`);
    }
    kids.push(`<x:Sel>${e.selectedIndex}</x:Sel>`);
    if (e.selectedIndices.length > 0) {
        kids.push(`<x:MultiSel>${escapeXmlText(formatMultiSel(e.selectedIndices))}</x:MultiSel>`);
    }
    if (!e.isDisplay3DShading) {
        kids.push('<x:NoThreeD2/>');
    }
    kids.push(`<x:SelType>${selectionTypeToWire(e.selectionType)}</x:SelType>`);
    return `<x:ClientData ObjectType="List">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeScrollClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeScrollClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    if (e.linkedCell !== undefined && e.linkedCell.length > 0) {
        kids.push(`<x:FmlaLink>${escapeXmlText(e.linkedCell)}</x:FmlaLink>`);
    }
    kids.push(`<x:Val>${e.value}</x:Val>`);
    kids.push(`<x:Min>${e.min}</x:Min>`);
    kids.push(`<x:Max>${e.max}</x:Max>`);
    kids.push(`<x:Inc>${e.incrementalChange}</x:Inc>`);
    kids.push(`<x:Page>${e.pageChange}</x:Page>`);
    kids.push(`<x:Dx>${DEFAULT_SCROLL_DX}</x:Dx>`);
    if (e.isHorizontal) {
        kids.push('<x:Horiz/>');
    }
    return `<x:ClientData ObjectType="Scroll">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeSpinClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeSpinClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    if (e.linkedCell !== undefined && e.linkedCell.length > 0) {
        kids.push(`<x:FmlaLink>${escapeXmlText(e.linkedCell)}</x:FmlaLink>`);
    }
    kids.push(`<x:Val>${e.value}</x:Val>`);
    kids.push(`<x:Min>${e.min}</x:Min>`);
    kids.push(`<x:Max>${e.max}</x:Max>`);
    kids.push(`<x:Inc>${e.incrementalChange}</x:Inc>`);
    return `<x:ClientData ObjectType="Spin">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeButtonClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeButtonClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoFill>False</x:AutoFill>');
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    pushCaptionAlignment(kids, e);
    if (!e.isTextLocked) {
        kids.push('<x:LockText>False</x:LockText>');
    }
    return `<x:ClientData ObjectType="Button">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeGroupClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeGroupClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoFill>False</x:AutoFill>');
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    pushCaptionAlignment(kids, e);
    if (e.groupLinkedCell !== undefined && e.groupLinkedCell.length > 0) {
        kids.push(`<x:FmlaGroup>${escapeXmlText(e.groupLinkedCell)}</x:FmlaGroup>`);
    }
    return `<x:ClientData ObjectType="GBox">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeLabelClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeLabelClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoFill>False</x:AutoFill>');
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    pushCaptionAlignment(kids, e);
    if (e.textLink !== undefined && e.textLink.length > 0) {
        kids.push(`<x:FmlaTxbx>${escapeXmlText(e.textLink)}</x:FmlaTxbx>`);
    }
    if (!e.isTextLocked) {
        kids.push('<x:LockText>False</x:LockText>');
    }
    return `<x:ClientData ObjectType="Label">${kids.join('')}</x:ClientData>`;
}

/**
 * serializeEditClientData function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function serializeEditClientData(e: FormControlEntry): string {
    const kids: string[] = [];
    pushPlacementPrintLocked(kids, e);
    kids.push(`<x:Anchor>${escapeXmlText(buildAnchorCsv(e))}</x:Anchor>`);
    kids.push('<x:AutoFill>False</x:AutoFill>');
    kids.push('<x:AutoLine>False</x:AutoLine>');
    if (e.onAction !== undefined && e.onAction.length > 0) {
        kids.push(`<x:FmlaMacro>${escapeXmlText(e.onAction)}</x:FmlaMacro>`);
    }
    pushCaptionAlignment(kids, e);
    if (e.textLink !== undefined && e.textLink.length > 0) {
        kids.push(`<x:FmlaTxbx>${escapeXmlText(e.textLink)}</x:FmlaTxbx>`);
    }
    if (e.isMultiLine) {
        kids.push('<x:MultiLine/>');
        kids.push('<x:VScroll/>');
    }
    if (e.isPassword) {
        kids.push('<x:SecretEdit/>');
    }
    if (!e.isTextLocked) {
        kids.push('<x:LockText>False</x:LockText>');
    }
    // validation is model-side only — do not invent VTEdit wire without corpus
    return `<x:ClientData ObjectType="Edit">${kids.join('')}</x:ClientData>`;
}

/**
 * buildShapeStyle function.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function buildShapeStyle(e: FormControlEntry): string {
    const leftPt: string = formatPt(0);
    const topPt: string = formatPt(0);
    const widthPt: string = formatPt(e.widthEmu / EMU_PER_PT);
    const heightPt: string = formatPt(e.heightEmu / EMU_PER_PT);
    const parts: string[] = [
        'position:absolute',
        `margin-left:${leftPt}pt`,
        `margin-top:${topPt}pt`,
        `width:${widthPt}pt`,
        `height:${heightPt}pt`,
        `z-index:${e.zIndex}`
    ];
    if (!e.isVisible) {
        parts.push('visibility:hidden');
    }
    return parts.join(';');
}

/**
 * VML ClientData Anchor: eight 0-based CSV integers — leftCol, leftOffPx, topRow, topOffPx, rightCol, rightOffPx, bottomRow, bottomOffPx. One-cell authoring: left/top offsets 0; right/bottom from width/height in CSS px @96dpi. Citation: XlsIO `ShapeSerializator.GetAnchorValue`.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function buildAnchorCsv(e: FormControlEntry): string {
    const widthPx: number = Math.max(1, Math.round(e.widthEmu / EMU_PER_PX_96DPI));
    const heightPx: number = Math.max(1, Math.round(e.heightEmu / EMU_PER_PX_96DPI));
    const leftCol: number = e.fromCol0;
    const topRow: number = e.fromRow0;
    // End markers use same cell with pixel offsets (one-cell style).
    const rightCol: number = leftCol;
    const bottomRow: number = topRow;
    return `${leftCol}, 0, ${topRow}, 0, ${rightCol}, ${widthPx}, ${bottomRow}, ${heightPx}`;
}

/**
 * parseAnchor function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {Object} - Returns the result.
 */
function parseAnchor(raw: string | undefined): { col1: number; row1: number } | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const parts: string[] = raw.split(',').map((p: string): string => p.trim());
    if (parts.length < 8) {
        return undefined;
    }
    const col1: number = Number.parseInt(parts[0] != null ? parts[0] : '', 10);
    const row1: number = Number.parseInt(parts[2] != null ? parts[2] : '', 10);
    if (!Number.isFinite(col1) || !Number.isFinite(row1) || col1 < 0 || row1 < 0) {
        return undefined;
    }
    return { col1, row1 };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * allocateVmlDrawingPartName function.
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @returns {string} - Returns the result.
 */
function allocateVmlDrawingPartName(pkg: OpcPackage): string {
    const existing: Set<string> = new Set(pkg.partNames().map((n: string): string => n.toLowerCase()));
    for (let i: number = 1; i < 10_000; i += 1) {
        const name: string = `/xl/drawings/vmlDrawing${i}.vml`;
        if (!existing.has(name.toLowerCase())) {
            return name;
        }
    }
    throw new InvalidArgumentError('Could not allocate a VML drawing part name');
}

/**
 * pointsToEmu function.
 *
 * @param {number} points - The points parameter.
 * @returns {number} - Returns the result.
 */
function pointsToEmu(points: number): number {
    return Math.round(points * EMU_PER_PT);
}

/**
 * requirePositivePoints function.
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {void} - Returns the result.
 */
function requirePositivePoints(value: number, label: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        throw new InvalidArgumentError(`${label} must be a positive number of points`);
    }
}

/**
 * requirePositiveInt function.
 *
 * @param {number} value - The value parameter.
 * @param {string} label - The label parameter.
 * @returns {number} - Returns the result.
 */
function requirePositiveInt(value: number, label: string): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
        throw new InvalidArgumentError(`${label} must be a 1-based integer`);
    }
    return value;
}

/**
 * normalizeOptionalString function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function normalizeOptionalString(value: string | undefined | null): string | undefined {
    if (value === undefined || value === null) {
        return undefined;
    }
    const s: string = String(value);
    return s.length === 0 ? undefined : s;
}

/**
 * normalizeCheckState function.
 *
 * @param {*} value - The value parameter.
 * @param {CheckState} fallback - The fallback parameter.
 * @returns {CheckState} - Returns the result.
 */
function normalizeCheckState(value: CheckState | undefined, fallback: CheckState): CheckState {
    if (value === undefined) {
        return fallback;
    }
    if (value !== 'unchecked' && value !== 'checked' && value !== 'mixed') {
        throw new InvalidArgumentError('checkState must be "unchecked", "checked", or "mixed"');
    }
    return value;
}

/**
 * normalizeSelectedIndex function.
 *
 * @param {number} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function normalizeSelectedIndex(value: number | undefined): number {
    if (value === undefined) {
        return 0;
    }
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
        throw new InvalidArgumentError('selectedIndex must be a non-negative integer (1-based; 0 = none)');
    }
    return value;
}

/**
 * normalizeDropDownLines function.
 *
 * @param {number} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function normalizeDropDownLines(value: number | undefined): number {
    if (value === undefined) {
        return 8;
    }
    if (typeof value !== 'number' || !Number.isInteger(value)) {
        throw new InvalidArgumentError('dropDownLines must be an integer');
    }
    return clampInt(value, 0, 30_000);
}

/**
 * normalizeSelectionType function.
 *
 * @param {*} value - The value parameter.
 * @returns {ListSelectionType} - Returns the result.
 */
function normalizeSelectionType(value: ListSelectionType | undefined): ListSelectionType {
    if (value === undefined) {
        return 'single';
    }
    if (value !== 'single' && value !== 'multi' && value !== 'extended') {
        throw new InvalidArgumentError('selectionType must be "single", "multi", or "extended"');
    }
    return value;
}

/**
 * normalizeSelectedIndices function.
 *
 * @param {number} value - The value parameter.
 * @returns {number[]} - Returns the result.
 */
function normalizeSelectedIndices(value: ReadonlyArray<number> | undefined): number[] {
    if (value === undefined) {
        return [];
    }
    if (!Array.isArray(value)) {
        throw new InvalidArgumentError('selectedIndices must be an array of non-negative integers');
    }
    const out: number[] = [];
    for (const item of value) {
        if (typeof item !== 'number' || !Number.isInteger(item) || item < 0) {
            throw new InvalidArgumentError('selectedIndices must be an array of non-negative integers (1-based; 0 = none)');
        }
        out.push(item);
    }
    return out;
}

/**
 * normalizeScrollInt function.
 *
 * @param {number} value - The value parameter.
 * @param {number} fallback - The fallback parameter.
 * @param {string} label - The label parameter.
 * @returns {number} - Returns the result.
 */
function normalizeScrollInt(value: number | undefined, fallback: number, label: string): number {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value !== 'number' || !Number.isInteger(value)) {
        throw new InvalidArgumentError(`${label} must be an integer`);
    }
    return value;
}

/**
 * normalizeEditValidation function.
 *
 * @param {*} value - The value parameter.
 * @returns {EditValidation} - Returns the result.
 */
function normalizeEditValidation(value: EditValidation | undefined): EditValidation {
    if (value === undefined) {
        return 'text';
    }
    if (value !== 'text' && value !== 'integer' && value !== 'number' && value !== 'reference' && value !== 'formula') {
        throw new InvalidArgumentError('validation must be "text", "integer", "number", "reference", or "formula"');
    }
    return value;
}

/**
 * clampInt function.
 *
 * @param {number} n - The n parameter.
 * @param {number} min - The min parameter.
 * @param {number} max - The max parameter.
 * @returns {number} - Returns the result.
 */
function clampInt(n: number, min: number, max: number): number {
    if (n < min) {
        return min;
    }
    if (n > max) {
        return max;
    }
    return n;
}

/**
 * checkStateToWire function.
 *
 * @param {CheckState} state - The state parameter.
 * @returns {number} - Returns the result.
 */
function checkStateToWire(state: CheckState): number {
    if (state === 'checked') {
        return 1;
    }
    if (state === 'mixed') {
        return 2;
    }
    return 0;
}

/**
 * parseCheckState function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {CheckState} - Returns the result.
 */
function parseCheckState(raw: string | undefined): CheckState {
    if (raw === undefined || raw === '' || raw === '0') {
        return 'unchecked';
    }
    if (raw === '1') {
        return 'checked';
    }
    if (raw === '2') {
        return 'mixed';
    }
    const n: number = Number.parseInt(raw, 10);
    if (n === 1) {
        return 'checked';
    }
    if (n === 2) {
        return 'mixed';
    }
    return 'unchecked';
}

/**
 * dropStyleToWire function.
 *
 * @param {ComboDropStyle} style - The style parameter.
 * @returns {string} - Returns the result.
 */
function dropStyleToWire(style: ComboDropStyle): string {
    if (style === 'comboedit') {
        return 'ComboEdit';
    }
    if (style === 'simple') {
        return 'Simple';
    }
    return 'Combo';
}

/**
 * parseDropStyle function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {ComboDropStyle} - Returns the result.
 */
function parseDropStyle(raw: string | undefined): ComboDropStyle {
    if (raw === undefined) {
        return 'combo';
    }
    const s: string = raw.trim().toLowerCase();
    if (s === 'comboedit') {
        return 'comboedit';
    }
    if (s === 'simple') {
        return 'simple';
    }
    return 'combo';
}

/**
 * parseSelectionType function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {ListSelectionType} - Returns the result.
 */
function parseSelectionType(raw: string | undefined): ListSelectionType {
    if (raw === undefined) {
        return 'single';
    }
    const s: string = raw.trim().toLowerCase();
    if (s === 'multi') {
        return 'multi';
    }
    if (s === 'extended') {
        return 'extended';
    }
    return 'single';
}

/**
 * selectionTypeToWire function.
 *
 * @param {ListSelectionType} type - The type parameter.
 * @returns {string} - Returns the result.
 */
function selectionTypeToWire(type: ListSelectionType): string {
    if (type === 'multi') {
        return 'Multi';
    }
    if (type === 'extended') {
        return 'Extended';
    }
    return 'Single';
}

/**
 * parseMultiSel function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number[]} - Returns the result.
 */
function parseMultiSel(raw: string | undefined): number[] {
    if (raw === undefined || raw.trim() === '') {
        return [];
    }
    const out: number[] = [];
    for (const part of raw.split(',')) {
        const n: number = Number.parseInt(part.trim(), 10);
        if (Number.isFinite(n) && n >= 0) {
            out.push(n);
        }
    }
    return out;
}

/**
 * formatMultiSel function.
 *
 * @param {number} indices - The indices parameter.
 * @returns {string} - Returns the result.
 */
function formatMultiSel(indices: ReadonlyArray<number>): string {
    return indices.join(',');
}

/**
 * parseHoriz function.
 *
 * @param {string} clientMap - The clientMap parameter.
 * @param {string} emptyTags - The emptyTags parameter.
 * @returns {boolean} - Returns the result.
 */
function parseHoriz(clientMap: Map<string, string>, emptyTags: Set<string>): boolean {
    if (!clientMap.has('Horiz') && !emptyTags.has('Horiz')) {
        return false;
    }
    const horizRaw: string = clientMap.get('Horiz');
    const raw: string = (horizRaw !== undefined ? horizRaw : '').trim().toLowerCase();
    if (raw === '' || raw === 'true' || raw === 't' || raw === '1') {
        return true;
    }
    if (raw === 'false' || raw === 'f' || raw === '0') {
        return false;
    }
    return true;
}

/**
 * defaultNameForKind function.
 *
 * @param {FormControlKind} kind - The kind parameter.
 * @param {number} shapeId - The shapeId parameter.
 * @returns {string} - Returns the result.
 */
function defaultNameForKind(kind: FormControlKind, shapeId: number): string {
    if (kind === 'checkbox') {
        return `Check Box ${shapeId}`;
    }
    if (kind === 'combo') {
        return `Drop Down ${shapeId}`;
    }
    if (kind === 'option') {
        return `Option Button ${shapeId}`;
    }
    if (kind === 'button') {
        return `Button ${shapeId}`;
    }
    if (kind === 'list') {
        return `List Box ${shapeId}`;
    }
    if (kind === 'group') {
        return `Group Box ${shapeId}`;
    }
    if (kind === 'label') {
        return `Label ${shapeId}`;
    }
    if (kind === 'scroll') {
        return `Scroll Bar ${shapeId}`;
    }
    if (kind === 'spin') {
        return `Spin Button ${shapeId}`;
    }
    return `Edit Box ${shapeId}`;
}

/**
 * parseShapeId function.
 *
 * @param {string} idAttr - The idAttr parameter.
 * @returns {number} - Returns the result.
 */
function parseShapeId(idAttr: string): number | undefined {
    const m: RegExpExecArray = /_x0000_s(\d+)/i.exec(idAttr);
    if (m !== null && m[1] !== undefined) {
        const n: number = Number.parseInt(m[1], 10);
        return Number.isFinite(n) ? n : undefined;
    }
    const trail: number = extractTrailingNumber(idAttr);
    return trail;
}

/**
 * Locate the caption `<font>` element. Excel/XlsIO nest it under `v:textbox` → `div` → `font`; some files put `font` directly under textbox.
 *
 * @param {string} textboxXml - The textboxXml parameter.
 * @returns {string} - Returns the result.
 */
function findCaptionFontElement(textboxXml: string): string | undefined {
    const direct: string = findChildByLocal(textboxXml, 'font');
    if (direct !== undefined) {
        return direct;
    }
    const div: string = findChildByLocal(textboxXml, 'div');
    if (div !== undefined) {
        const nested: string = findChildByLocal(div, 'font');
        if (nested !== undefined) {
            return nested;
        }
    }
    return undefined;
}

/**
 * Apply caption text + font chrome + TextHAlign/TextVAlign onto an entry.
 *
 * @param {FormControlEntry} entry - The entry parameter.
 * @param {string} shapeXml - The shapeXml parameter.
 * @param {string} clientMap - The clientMap parameter.
 * @returns {void} - Returns the result.
 */
function applyCaptionFromShape(entry: FormControlEntry, shapeXml: string, clientMap: Map<string, string>): void {
    const textboxFound: string = findChildByLocal(shapeXml, 'textbox');
    const textbox: string = textboxFound != null ? textboxFound : findChildByLocal(shapeXml, 'textpath');
    if (textbox === undefined) {
        entry.text = '';
    } else {
        const div: string = findChildByLocal(textbox, 'div');
        const font: string = findCaptionFontElement(textbox);
        if (font !== undefined) {
            applyCaptionFontEffectsFromInner(entry, elementInner(font));
            const fontAttrs: Map<string, string> = parseAttrMap(elementOpenAttrs(font));
            const face: string = fontAttrs.get('face');
            if (face !== undefined && face.trim().length > 0) {
                entry.fontName = face.trim();
            }
            const sizeRaw: string = fontAttrs.get('size');
            if (sizeRaw !== undefined && sizeRaw.trim() !== '') {
                const half: number = Number.parseInt(sizeRaw, 10);
                if (Number.isFinite(half) && half > 0) {
                    entry.fontSize = half / 20;
                }
            }
            const colorRaw: string = fontAttrs.get('color');
            if (colorRaw !== undefined && colorRaw.trim() !== '' && colorRaw.trim().toLowerCase() !== 'auto') {
                entry.fontColor = parseVmlColor(colorRaw);
            }
        } else {
            const inner: string = elementInner(textbox);
            applyCaptionFontEffectsFromInner(entry, inner);
        }
        // div text-align as fallback for horizontal alignment (ClientData TextHAlign wins).
        if (div !== undefined) {
            const divAttrs: Map<string, string> = parseAttrMap(elementOpenAttrs(div));
            const styleAttrDiv: string = divAttrs.get('style');
            const style: string = styleAttrDiv !== undefined ? styleAttrDiv : '';
            const styleMap: Map<string, string> = parseCssStyle(style);
            const taAttr: string = styleMap.get('text-align');
            const ta: string = (taAttr !== undefined ? taAttr : '').toLowerCase();
            if (ta === 'left' || ta === 'center' || ta === 'right' || ta === 'justify') {
                entry.horizontalAlignment = ta;
            }
        }
    }

    const hAlign: FormControlHorizontalAlignment = parseTextHAlign(clientMap.get('TextHAlign'));
    if (hAlign !== undefined) {
        entry.horizontalAlignment = hAlign;
    }
    const vAlign: FormControlVerticalAlignment = parseTextVAlign(clientMap.get('TextVAlign'));
    if (vAlign !== undefined) {
        entry.verticalAlignment = vAlign;
    }
}

/**
 * Parse nested caption effect tags from `font` inner markup. Sets whole-caption boolean/style flags and plain `text` (tags stripped). Citation: Excel VML nested `<b><i><u class="font5"?><s>|<sup>|<sub>`.
 *
 * @param {FormControlEntry} entry - The entry parameter.
 * @param {string} innerXml - The innerXml parameter.
 * @returns {void} - Returns the result.
 */
function applyCaptionFontEffectsFromInner(entry: FormControlEntry, innerXml: string): void {
    // Match standalone `<b>` / `<strong>` (not part of another tag name).
    const hasB: boolean = /<\s*b(?:\s|>|\/)/i.test(innerXml) || /<\s*strong(?:\s|>|\/)/i.test(innerXml);
    const hasI: boolean = /<\s*i(?:\s|>|\/)/i.test(innerXml) || /<\s*em(?:\s|>|\/)/i.test(innerXml);
    // Match standalone `<s>` / strike / del — not `<sup>` / `<sub>` / `<span>`.
    const hasS: boolean =
        /<\s*s(?:\s|>|\/)/i.test(innerXml) || /<\s*strike(?:\s|>|\/)/i.test(innerXml) || /<\s*del(?:\s|>|\/)/i.test(innerXml);
    const hasSup: boolean = /<\s*sup(?:\s|>|\/)/i.test(innerXml);
    const hasSub: boolean = /<\s*sub(?:\s|>|\/)/i.test(innerXml);

    let underline: FormControlUnderline = 'none';
    const uOpen: RegExp = /<\s*u\b([^>]*)>/gi;
    let uMatch: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign -- intentional assign-in-condition while parsing
    while ((uMatch = uOpen.exec(innerXml)) !== null) {
        const attrs: string = uMatch[1] != null ? uMatch[1] : '';
        const classMatch: RegExpExecArray = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
        const cls: string = ((__t: string): string => (__t != null ? __t : ''))(
            ((classMatch == null ? undefined : classMatch[1]) != null
                ? classMatch == null
                    ? undefined
                    : classMatch[1]
                : classMatch == null
                    ? undefined
                    : classMatch[2]) != null
                ? (classMatch == null ? undefined : classMatch[1]) != null
                    ? classMatch == null
                        ? undefined
                        : classMatch[1]
                    : classMatch == null
                        ? undefined
                        : classMatch[2]
                : classMatch == null
                    ? undefined
                    : classMatch[3]
        ).toLowerCase();
        if (cls.split(/\s+/).indexOf(FORM_CONTROL_DOUBLE_UNDERLINE_CLASS) >= 0) {
            underline = 'double';
            break;
        }
        underline = 'single';
    }
    // Also accept CSS text-decoration: underline double on a span/u style attr.
    if (underline === 'none' && /text-decoration\s*:\s*[^;]*underline/i.test(innerXml)) {
        underline = /double/i.test(innerXml) ? 'double' : 'single';
    }

    if (hasB && hasI) {
        entry.fontStyle = 'boldItalic';
    } else if (hasB) {
        entry.fontStyle = 'bold';
    } else if (hasI) {
        entry.fontStyle = 'italic';
    } else {
        entry.fontStyle = 'regular';
    }
    entry.underline = underline;
    entry.isStrikethrough = hasS;
    // Super/sub mutually exclusive; superscript wins if both present.
    if (hasSup) {
        entry.isSuperscript = true;
        entry.isSubscript = false;
    } else if (hasSub) {
        entry.isSuperscript = false;
        entry.isSubscript = true;
    } else {
        entry.isSuperscript = false;
        entry.isSubscript = false;
    }

    // Strip tags for plain caption text (preserve XML entities then unescape).
    entry.text = unescapeXml(innerXml.replace(/<[^>]+>/g, '')).trim();
}

/**
 * Emit MoveWithCells / SizeWithCells / PrintObject / Locked for ClientData. True defaults: empty self-closing tags for Move/Size when true and that is the kind default path for caption kinds; False when false. PrintObject and Locked omitted when true (Excel default). Citation: `vml-spreadsheetDrawing.xsd` ST_TrueFalseBlank.
 *
 * @param {string[]} kids - The kids parameter.
 * @param {FormControlEntry} e - The e parameter.
 * @returns {void} - Returns the result.
 */
function pushPlacementPrintLocked(kids: string[], e: FormControlEntry): void {
    pushTrueFalseBlank(kids, 'MoveWithCells', e.moveWithCells, true);
    pushTrueFalseBlank(kids, 'SizeWithCells', e.sizeWithCells, true);
    // PrintObject / Locked: omit when true (default); emit False when false.
    if (!e.printObject) {
        kids.push('<x:PrintObject>False</x:PrintObject>');
    }
    if (!e.isLocked) {
        kids.push('<x:Locked>False</x:Locked>');
    }
}

/**
 * ST_TrueFalseBlank emit helper. When value === defaultTrueBehavior and default is true: empty tag `<x:Name/>`. When value is false: `<x:Name>False</x:Name>`. When default is false and value is false: emit False (combo/list default size). When default is false and value is true: empty tag (user enabled size-with-cells).
 *
 * @param {string[]} kids - The kids parameter.
 * @param {string} localName - The localName parameter.
 * @param {boolean} value - The value parameter.
 * @param {boolean} _defaultTrue - The _defaultTrue parameter.
 * @returns {void} - Returns the result.
 */
function pushTrueFalseBlank(kids: string[], localName: string, value: boolean, _defaultTrue: boolean): void {
    if (value) {
        kids.push(`<x:${localName}/>`);
    } else {
        kids.push(`<x:${localName}>False</x:${localName}>`);
    }
}

/**
 * Emit TextHAlign / TextVAlign for caption kinds. Always emit TextVAlign (matches prior Center default path for checkbox/option/button). Emit TextHAlign when not left (default).
 *
 * @param {string[]} kids - The kids parameter.
 * @param {FormControlEntry} e - The e parameter.
 * @returns {void} - Returns the result.
 */
function pushCaptionAlignment(kids: string[], e: FormControlEntry): void {
    if (e.horizontalAlignment !== 'left') {
        kids.push(`<x:TextHAlign>${horizontalAlignmentToWire(e.horizontalAlignment)}</x:TextHAlign>`);
    }
    kids.push(`<x:TextVAlign>${verticalAlignmentToWire(e.verticalAlignment)}</x:TextVAlign>`);
}

/**
 * defaultSizeWithCells function.
 *
 * @param {FormControlKind} kind - The kind parameter.
 * @returns {boolean} - Returns the result.
 */
function defaultSizeWithCells(kind: FormControlKind): boolean {
    return kind !== 'combo' && kind !== 'list' && kind !== 'scroll' && kind !== 'spin';
}

/**
 * defaultVerticalAlignment function.
 *
 * @param {FormControlKind} kind - The kind parameter.
 * @returns {FormControlVerticalAlignment} - Returns the result.
 */
function defaultVerticalAlignment(kind: FormControlKind): FormControlVerticalAlignment {
    if (kind === 'checkbox' || kind === 'option' || kind === 'button') {
        return 'center';
    }
    return 'top';
}

/**
 * normalizeFormControlColor function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function normalizeFormControlColor(value: string | undefined | null): string | undefined {
    if (value === undefined || value === null || String(value).trim() === '') {
        return undefined;
    }
    let s: string = String(value).trim();
    if (s.startsWith('#')) {
        s = s.slice(1);
    }
    if (s.length === 8 && /^[0-9a-fA-F]{8}$/.test(s)) {
        s = s.slice(2);
    }
    if (!/^[0-9a-fA-F]{6}$/.test(s)) {
        throw new InvalidArgumentError('Color must be RRGGBB or #RRGGBB (optional AARRGGBB)');
    }
    return s.toUpperCase();
}

/**
 * parseVmlColor function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {string} - Returns the result.
 */
function parseVmlColor(raw: string | undefined): string | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const t: string = raw.trim();
    if (t.length === 0 || t.toLowerCase() === 'auto') {
        return undefined;
    }
    try {
        return normalizeFormControlColor(t);
    } catch {
        return undefined;
    }
}

/**
 * normalizeFontSizePt function.
 *
 * @param {number} value - The value parameter.
 * @returns {number} - Returns the result.
 */
function normalizeFontSizePt(value: number): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        throw new InvalidArgumentError('fontSize must be a positive number of points');
    }
    // Clamp to a practical Excel-like range (half-points 1..8000 → 0.05..400 pt).
    const clamped: number = Math.min(400, Math.max(0.05, value));
    return clamped;
}

/**
 * normalizeHorizontalAlignment function.
 *
 * @param {FormControlHorizontalAlignment} value - The value parameter.
 * @returns {FormControlHorizontalAlignment} - Returns the result.
 */
function normalizeHorizontalAlignment(value: FormControlHorizontalAlignment): FormControlHorizontalAlignment {
    if (value === 'left' || value === 'center' || value === 'right' || value === 'justify') {
        return value;
    }
    throw new InvalidArgumentError('horizontalAlignment must be "left", "center", "right", or "justify"');
}

/**
 * normalizeVerticalAlignment function.
 *
 * @param {FormControlVerticalAlignment} value - The value parameter.
 * @returns {FormControlVerticalAlignment} - Returns the result.
 */
function normalizeVerticalAlignment(value: FormControlVerticalAlignment): FormControlVerticalAlignment {
    if (value === 'top' || value === 'center' || value === 'bottom' || value === 'justify') {
        return value;
    }
    throw new InvalidArgumentError('verticalAlignment must be "top", "center", "bottom", or "justify"');
}

/**
 * normalizeFormControlFontStyle function.
 *
 * @param {FormControlFontStyle} value - The value parameter.
 * @returns {FormControlFontStyle} - Returns the result.
 */
function normalizeFormControlFontStyle(value: FormControlFontStyle): FormControlFontStyle {
    if (value === 'regular' || value === 'italic' || value === 'bold' || value === 'boldItalic') {
        return value;
    }
    throw new InvalidArgumentError('fontStyle must be "regular", "italic", "bold", or "boldItalic"');
}

/**
 * normalizeFormControlUnderline function.
 *
 * @param {FormControlUnderline} value - The value parameter.
 * @returns {FormControlUnderline} - Returns the result.
 */
function normalizeFormControlUnderline(value: FormControlUnderline): FormControlUnderline {
    if (value === 'none' || value === 'single' || value === 'double') {
        return value;
    }
    throw new InvalidArgumentError('underline must be "none", "single", or "double"');
}

/**
 * True when face/size/color and font effects match Excel "Normal font" defaults for form-control captions (Calibri 10 pt, auto color, regular, no effects).
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {boolean} - Returns the result.
 */
function isCaptionNormalFont(e: FormControlEntry): boolean {
    const face: string = e.fontName.length > 0 ? e.fontName : DEFAULT_CAPTION_FONT_NAME;
    return (
        face === DEFAULT_CAPTION_FONT_NAME &&
        e.fontSize === DEFAULT_CAPTION_FONT_SIZE_PT &&
        e.fontColor === undefined &&
        e.fontStyle === 'regular' &&
        e.underline === 'none' &&
        !e.isStrikethrough &&
        !e.isSuperscript &&
        !e.isSubscript
    );
}

/**
 * Reset caption face/size/color and effects to Normal font defaults.
 *
 * @param {FormControlEntry} e - The e parameter.
 * @returns {void} - Returns the result.
 */
function applyNormalCaptionFont(e: FormControlEntry): void {
    e.fontName = DEFAULT_CAPTION_FONT_NAME;
    e.fontSize = DEFAULT_CAPTION_FONT_SIZE_PT;
    e.fontColor = undefined;
    e.fontStyle = 'regular';
    e.underline = 'none';
    e.isStrikethrough = false;
    e.isSuperscript = false;
    e.isSubscript = false;
}

/**
 * horizontalAlignmentToWire function.
 *
 * @param {FormControlHorizontalAlignment} v - The v parameter.
 * @returns {string} - Returns the result.
 */
function horizontalAlignmentToWire(v: FormControlHorizontalAlignment): string {
    if (v === 'center') {
        return 'Center';
    }
    if (v === 'right') {
        return 'Right';
    }
    if (v === 'justify') {
        return 'Justify';
    }
    return 'Left';
}

/**
 * verticalAlignmentToWire function.
 *
 * @param {FormControlVerticalAlignment} v - The v parameter.
 * @returns {string} - Returns the result.
 */
function verticalAlignmentToWire(v: FormControlVerticalAlignment): string {
    if (v === 'center') {
        return 'Center';
    }
    if (v === 'bottom') {
        return 'Bottom';
    }
    if (v === 'justify') {
        return 'Justify';
    }
    return 'Top';
}

/**
 * parseTextHAlign function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {*} - Returns the result.
 */
function parseTextHAlign(raw: string | undefined): FormControlHorizontalAlignment | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const s: string = raw.trim().toLowerCase();
    if (s === 'left') {
        return 'left';
    }
    if (s === 'center') {
        return 'center';
    }
    if (s === 'right') {
        return 'right';
    }
    if (s === 'justify') {
        return 'justify';
    }
    return undefined;
}

/**
 * parseTextVAlign function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {*} - Returns the result.
 */
function parseTextVAlign(raw: string | undefined): FormControlVerticalAlignment | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const s: string = raw.trim().toLowerCase();
    if (s === 'top') {
        return 'top';
    }
    if (s === 'center') {
        return 'center';
    }
    if (s === 'bottom') {
        return 'bottom';
    }
    if (s === 'justify') {
        return 'justify';
    }
    return undefined;
}

/**
 * Parse ST_TrueFalseBlank from ClientData map. Empty / true / t / 1 → true; false / f / 0 → false; missing → defaultValue.
 *
 * @param {string} clientMap - The clientMap parameter.
 * @param {string} emptyTags - The emptyTags parameter.
 * @param {string} localName - The localName parameter.
 * @param {boolean} defaultValue - The defaultValue parameter.
 * @returns {boolean} - Returns the result.
 */
function parseTrueFalseBlank(clientMap: Map<string, string>, emptyTags: Set<string>, localName: string, defaultValue: boolean): boolean {
    if (!clientMap.has(localName) && !emptyTags.has(localName)) {
        return defaultValue;
    }
    const tfbRaw: string = clientMap.get(localName);
    const raw: string = (tfbRaw !== undefined ? tfbRaw : '').trim().toLowerCase();
    if (raw === '' || raw === 'true' || raw === 't' || raw === '1') {
        return true;
    }
    if (raw === 'false' || raw === 'f' || raw === '0') {
        return false;
    }
    return defaultValue;
}

/**
 * isFalseToken function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {boolean} - Returns the result.
 */
function isFalseToken(raw: string | undefined): boolean {
    if (raw === undefined) {
        return false;
    }
    const s: string = raw.trim().toLowerCase();
    return s === 'false' || s === 'f' || s === '0';
}

/**
 * emptyToUndef function.
 *
 * @param {string} v - The v parameter.
 * @returns {string} - Returns the result.
 */
function emptyToUndef(v: string | undefined): string | undefined {
    if (v === undefined || v.length === 0) {
        return undefined;
    }
    return v;
}

/**
 * parseIntOr function.
 *
 * @param {string} raw - The raw parameter.
 * @param {number} fallback - The fallback parameter.
 * @returns {number} - Returns the result.
 */
function parseIntOr(raw: string | undefined, fallback: number): number {
    if (raw === undefined || raw === '') {
        return fallback;
    }
    const n: number = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : fallback;
}

/**
 * formatPt function.
 *
 * @param {number} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function formatPt(value: number): string {
    const r: number = Math.round(value * 100) / 100;
    if (Number.isInteger(r)) {
        return String(r);
    }
    return String(r);
}

/**
 * parseCssStyle function.
 *
 * @param {string} style - The style parameter.
 * @returns {string} - Returns the result.
 */
function parseCssStyle(style: string): Map<string, string> {
    const map: Map<string, string> = new Map<string, string>();
    for (const part of style.split(';')) {
        const idx: number = part.indexOf(':');
        if (idx <= 0) {
            continue;
        }
        const key: string = part.slice(0, idx).trim().toLowerCase();
        const val: string = part.slice(idx + 1).trim();
        if (key.length > 0) {
            map.set(key, val);
        }
    }
    return map;
}

/**
 * cssLengthToEmu function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function cssLengthToEmu(raw: string | undefined): number | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const m: RegExpExecArray = /^([0-9.]+)\s*(pt|px|in|mm|cm)?$/i.exec(raw.trim());
    if (m === null || m[1] === undefined) {
        return undefined;
    }
    const n: number = Number.parseFloat(m[1]);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    const unit: string = (m[2] != null ? m[2] : 'pt').toLowerCase();
    if (unit === 'pt') {
        return Math.round(n * EMU_PER_PT);
    }
    if (unit === 'px') {
        return Math.round(n * EMU_PER_PX_96DPI);
    }
    if (unit === 'in') {
        return Math.round(n * 914_400);
    }
    if (unit === 'cm') {
        return Math.round(n * 360_000);
    }
    if (unit === 'mm') {
        return Math.round(n * 36_000);
    }
    return Math.round(n * EMU_PER_PT);
}

/**
 * extractTrailingNumber function.
 *
 * @param {string} name - The name parameter.
 * @returns {number} - Returns the result.
 */
function extractTrailingNumber(name: string): number | undefined {
    const m: RegExpExecArray = /(\d+)\s*$/.exec(name);
    if (m === null || m[1] === undefined) {
        return undefined;
    }
    const n: number = Number.parseInt(m[1], 10);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * stripProlog function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string} - Returns the result.
 */
function stripProlog(xml: string): string {
    return xml.replace(/^\uFEFF/, '').replace(/<\?xml[^?]*\?>\s*/i, '');
}

/**
 * matchRootLocal function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} localName - The localName parameter.
 * @returns {Object} - Returns the result.
 */
function matchRootLocal(xml: string, localName: string): { openAttrs: string; inner: string } | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const re: RegExp = new RegExp(`<((?:[A-Za-z_][\\w.-]*:)?)(${localName})(\\s[^>]*)?>([\\s\\S]*)</\\1?\\2\\s*>`, 'i');
    const m: RegExpExecArray = re.exec(xml);
    if (m === null) {
        // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
        const sc: RegExpExecArray = new RegExp(`<((?:[A-Za-z_][\\w.-]*:)?)(${localName})(\\s[^>]*)?/>`, 'i').exec(xml);
        if (sc === null) {
            return undefined;
        }
        return { openAttrs: sc[3] != null ? sc[3] : '', inner: '' };
    }
    return { openAttrs: m[3] != null ? m[3] : '', inner: m[4] != null ? m[4] : '' };
}

/**
 * matchAnyRoot function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {Object} - Returns the result.
 */
function matchAnyRoot(xml: string): { openAttrs: string; inner: string } | undefined {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /<([A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?)(\s[^>]*)?>([\s\S]*)<\/\1\s*>/i.exec(xml.trim());
    if (m === null) {
        return undefined;
    }
    return { openAttrs: m[2] != null ? m[2] : '', inner: m[3] != null ? m[3] : '' };
}

/**
 * splitTopLevelElements function.
 *
 * @param {string} inner - The inner parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelElements(inner: string): string[] {
    const out: string[] = [];
    let i: number = 0;
    const s: string = inner;
    while (i < s.length) {
        while (i < s.length && /\s/.test(s.charAt(i))) {
            i += 1;
        }
        if (i >= s.length) {
            break;
        }
        if (s.charAt(i) !== '<') {
            i += 1;
            continue;
        }
        if (s.startsWith('<!--', i)) {
            const end: number = s.indexOf('-->', i + 4);
            i = end < 0 ? s.length : end + 3;
            continue;
        }
        if (s.startsWith('<?', i)) {
            const end: number = s.indexOf('?>', i + 2);
            i = end < 0 ? s.length : end + 2;
            continue;
        }
        const start: number = i;
        const openEnd: number = s.indexOf('>', i);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(i, openEnd + 1);
        if (openTag.endsWith('/>')) {
            out.push(s.slice(start, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
        const nameMatch: RegExpExecArray = /^<\/?([A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?)/.exec(openTag);
        if (nameMatch === null) {
            i = openEnd + 1;
            continue;
        }
        const fullName: string = nameMatch[1] != null ? nameMatch[1] : '';
        const local: string = fullName.includes(':') ? fullName.slice(fullName.indexOf(':') + 1) : fullName;
        let depth: number = 1;
        let pos: number = openEnd + 1;
        while (pos < s.length && depth > 0) {
            const nextLt: number = s.indexOf('<', pos);
            if (nextLt < 0) {
                pos = s.length;
                break;
            }
            if (s.startsWith('<!--', nextLt)) {
                const end: number = s.indexOf('-->', nextLt + 4);
                pos = end < 0 ? s.length : end + 3;
                continue;
            }
            const nextEnd: number = s.indexOf('>', nextLt);
            if (nextEnd < 0) {
                pos = s.length;
                break;
            }
            const tag: string = s.slice(nextLt, nextEnd + 1);
            // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
            const close: RegExpExecArray = new RegExp(`^</(?:[A-Za-z_][\\w.-]*:)?${local}\\s*>`, 'i').exec(tag);
            // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
            const open: RegExpExecArray = new RegExp(`^<(?:[A-Za-z_][\\w.-]*:)?${local}(?:\\s|>|/>)`, 'i').exec(tag);
            if (close !== null) {
                depth -= 1;
                pos = nextEnd + 1;
                if (depth === 0) {
                    out.push(s.slice(start, pos));
                    break;
                }
                continue;
            }
            if (open !== null && !tag.endsWith('/>')) {
                depth += 1;
            }
            pos = nextEnd + 1;
        }
        if (depth !== 0) {
            i = openEnd + 1;
        } else {
            i = pos;
        }
    }
    return out;
}

/**
 * elementLocalName function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalName(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<\/?([A-Za-z_][\w.-]*)(?::([A-Za-z_][\w.-]*))?/.exec(el.trim());
    if (m === null) {
        return '';
    }
    return ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[1]).toLowerCase() ===
        ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[1])
        ? ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[1])
        : ((__t: string): string => (__t != null ? __t : ''))(m[2] != null ? m[2] : m[1]);
}

/**
 * elementOpenAttrs function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrs(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<[^>\s]+(\s[^>]*)?>/.exec(el.trim());
    if (m === null) {
        return '';
    }
    const attrs: string = m[1] != null ? m[1] : '';
    return attrs.endsWith('/') ? attrs.slice(0, -1) : attrs;
}

/**
 * elementInner function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInner(el: string): string {
    const trimmed: string = el.trim();
    if (trimmed.endsWith('/>')) {
        return '';
    }
    const openEnd: number = trimmed.indexOf('>');
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart < openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
}

/**
 * findChildByLocal function.
 *
 * @param {string} parentXml - The parentXml parameter.
 * @param {string} localName - The localName parameter.
 * @returns {string} - Returns the result.
 */
function findChildByLocal(parentXml: string, localName: string): string | undefined {
    const inner: string = elementInner(parentXml);
    for (const child of splitTopLevelElements(inner)) {
        if (elementLocalName(child).toLowerCase() === localName.toLowerCase()) {
            return child;
        }
    }
    return undefined;
}
