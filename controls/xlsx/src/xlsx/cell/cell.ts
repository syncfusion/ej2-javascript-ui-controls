/**
 * Public Cell handle bound to a worksheet address.
 *
 * Citations: docs/specs/worksheet-cells.md; docs/requirements/worksheet-cells.md;
 * docs/specs/styles-table.md (style / numberFormat);
 * docs/specs/cell-formulas.md (formula);
 * docs/specs/hyperlinks.md (hyperlink);
 * docs/api/API-RULES.md R1.1 / R1.4 / R1.5 (one public name per process).
 *
 * Formula APIs are text-only: the library never evaluates formulas and never
 * resolves external workbook links. Value setters never promote strings
 * beginning with `=`, `+`, `-`, or `@` into formulas.
 */

import {
  InvalidCellValueError,
  InvalidErrorCodeError,
  InvalidFormulaError,
  InvalidStyleIndexError,
} from '../core/errors';
import { formatA1, parseA1Range } from '../address/cell-address';
import {
  joinRunText,
  parseRichRunsFromSiXml, RichTextRun,
} from '../shared-strings/rich-text-xml';
import {
  CellBorder,
  Border,
  CellStyle,
  CellFormat,
  FillEntry,
  Fill,
  FontEntry,
  Font,
} from '../styles/styles-xml';
import { WorkbookStyles } from '../styles/workbook-styles';
import { WorksheetImpl } from '../workbook/worksheet';
import {
  AddCommentOptions,
  Comment,
} from '../worksheet/comments';
import { CellHyperlink } from '../worksheet/hyperlinks';
import { ThreadedComment } from '../worksheet/threaded-comments';
import { MergeRange } from '../worksheet/merged-cells';
import {
  cellModelHasResidue,
  createEmptyCellModel,
  modelToCellValue, CellModel,
} from './cell-model';
import {
  DEFAULT_DATE_TIME_FORMAT,
  dateToExcelSerial,
  excelSerialToDate,
} from './excel-date';
import {
  createFormulaState,
  formulaStateToPublic,
  isCellFormulaType,
  normalizeFormulaExpression, CellFormula, ClearFormulaOptions, SetFormulaOptions,
} from './formula';
import {
  normalizeRichRuns,
  richRunsIndicateRichText,
  RichTextString, RichTextCellHost,
} from './rich-text';
import { isCellError, KNOWN_CELL_ERROR_CODES, CellValue } from './types';

/**
 * Convert a stored font row to {@link Font} (strips xmlPreserve).
 * Conditional spreads satisfy `exactOptionalPropertyTypes`.
 */
function fontEntryToFont(styles: WorkbookStyles, entry: FontEntry): Font {
  return {
    ...(entry.name !== undefined ? { name: entry.name } : {}),
    ...(entry.size !== undefined ? { size: entry.size } : {}),
    ...(entry.bold !== undefined ? { bold: entry.bold } : {}),
    ...(entry.italic !== undefined ? { italic: entry.italic } : {}),
    ...(entry.underline !== undefined ? { underline: entry.underline } : {}),
    ...(entry.strike !== undefined ? { strike: entry.strike } : {}),
    ...(entry.color !== undefined ? { color: styles.colorWithRgb(entry.color) } : {}),
    ...(entry.family !== undefined ? { family: entry.family } : {}),
    ...(entry.charset !== undefined ? { charset: entry.charset } : {}),
    ...(entry.scheme !== undefined ? { scheme: entry.scheme } : {}),
    ...(entry.vertAlign !== undefined ? { vertAlign: entry.vertAlign } : {}),
    ...(entry.outline !== undefined ? { outline: entry.outline } : {}),
    ...(entry.shadow !== undefined ? { shadow: entry.shadow } : {}),
    ...(entry.condense !== undefined ? { condense: entry.condense } : {}),
    ...(entry.extend !== undefined ? { extend: entry.extend } : {}),
  };
}

/**
 * Convert a stored fill row to {@link Fill}, or `undefined` when unknown.
 */
function fillEntryToFill(styles: WorkbookStyles, entry: FillEntry): Fill | undefined {
  if (entry.type === 'pattern') {
    if (entry.patternType === undefined) {
      return undefined;
    }
    return {
      type: 'pattern',
      patternType: entry.patternType,
      ...(entry.fgColor !== undefined ? { fgColor: styles.colorWithRgb(entry.fgColor) } : {}),
      ...(entry.bgColor !== undefined ? { bgColor: styles.colorWithRgb(entry.bgColor) } : {}),
    };
  }
  if (entry.type === 'gradient') {
    const gradientXml = (entry.gradientXml != null ? entry.gradientXml : entry.xmlPreserve);
    if (gradientXml.length === 0) {
      return undefined;
    }
    return { type: 'gradient', gradientXml };
  }
  return undefined;
}

/**
 * Convert a stored border row to {@link Border} (strips preserve bags).
 */
function cellBorderToBorder(entry: CellBorder): Border {
  return {
    ...(entry.left !== undefined ? { left: entry.left } : {}),
    ...(entry.right !== undefined ? { right: entry.right } : {}),
    ...(entry.top !== undefined ? { top: entry.top } : {}),
    ...(entry.bottom !== undefined ? { bottom: entry.bottom } : {}),
    ...(entry.diagonal !== undefined ? { diagonal: entry.diagonal } : {}),
    ...(entry.diagonalUp !== undefined ? { diagonalUp: entry.diagonalUp } : {}),
    ...(entry.diagonalDown !== undefined ? { diagonalDown: entry.diagonalDown } : {}),
    ...(entry.outline !== undefined ? { outline: entry.outline } : {}),
  };
}

/**
 * Rebuild a {@link CellStyle} from a cell xf snapshot so L1 setters can
 * merge (e.g. numberFormat) without dropping font/fill/border/alignment.
 *
 * Citations: docs/specs/styles-table.md; TASK-1209 journal (exactOptionalPropertyTypes).
 */
function cellFormatToStyleInput(styles: WorkbookStyles, view: CellFormat): CellStyle {
  const fontEntry = view.fontId !== undefined ? styles.getFontAt(view.fontId) : undefined;
  const fillEntry = view.fillId !== undefined ? styles.getFillAt(view.fillId) : undefined;
  const borderEntry = view.borderId !== undefined ? styles.getBorderAt(view.borderId) : undefined;

  const font = fontEntry !== undefined ? fontEntryToFont(styles, fontEntry) : undefined;
  const fill = fillEntry !== undefined ? fillEntryToFill(styles, fillEntry) : undefined;
  const border = borderEntry !== undefined ? cellBorderToBorder(borderEntry) : undefined;

  return {
    ...(view.numFmtId !== undefined ? { numFmtId: view.numFmtId } : {}),
    ...(font !== undefined ? { font } : {}),
    ...(fill !== undefined ? { fill } : {}),
    ...(border !== undefined ? { border } : {}),
    ...(view.alignment !== undefined ? { alignment: view.alignment } : {}),
    ...(view.protection !== undefined ? { protection: view.protection } : {}),
    ...(view.xfId !== undefined ? { xfId: view.xfId } : {}),
    ...(view.quotePrefix !== undefined ? { quotePrefix: view.quotePrefix } : {}),
    ...(view.pivotButton !== undefined ? { pivotButton: view.pivotButton } : {}),
  };
}

/**
 * Represents a single cell in a worksheet, allowing you to read, write, and
 * format its contents. Obtain it via {@link Worksheet.getCell}.
 */
export class Cell {
  private readonly sheet: WorksheetImpl;
  private readonly row: number;
  private readonly col: number;

  /** @private */
  public constructor(sheet: WorksheetImpl, row: number, col: number) {
    this.sheet = sheet;
    this.row = row;
    this.col = col;
  }

  /**
   * Returns the cell's reference, such as `B2`.
   */
  public get address(): string {
    return formatA1(this.row, this.col);
  }

  /**
   * Gets or sets the cell's contents — a number, text, boolean, or error
   * value — or `null` when the cell is empty. Setting a value replaces any
   * formula. For formula cells, reading returns the saved result; the
   * formula is never recalculated.
   */
  public get value(): CellValue {
    const model = this.sheet.getCellModel(this.row, this.col);
    return modelToCellValue(model, (index) => this.sheet.resolveSharedString(index));
  }

  /**
   * Set a plain value. Clears any formula on this cell. Text is stored
   * as-is; even text that looks like a formula is never turned into one.
   * @throws InvalidCellValueError | InvalidErrorCodeError
   */
  public set value(v: CellValue) {
    this.sheet.ensureSheetDataLoaded();
    if (v === null) {
      this.clear();
      return;
    }

    let model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      model = createEmptyCellModel(this.row, this.col);
    }

    // Setting a plain value clears formula (spec / AGENTS.md).
    model.formula = undefined;
    model.inlineIsXml = undefined;
    model.inlinePlain = undefined;
    model.preserveChildrenXml = [];

    if (typeof v === 'number') {
      if (!Number.isFinite(v)) {
        throw new InvalidCellValueError('Cell number value must be a finite IEEE-754 number');
      }
      this.adjustSstRefIfNeeded(model, undefined);
      model.kind = 'number';
      model.raw = v;
    } else if (typeof v === 'boolean') {
      this.adjustSstRefIfNeeded(model, undefined);
      model.kind = 'boolean';
      model.raw = v;
    } else if (typeof v === 'string') {
      // Never implicit formula — always shared string.
      const prevIndex =
        model.kind === 'sharedString' && typeof model.raw === 'number' ? model.raw : undefined;
      const index = this.sheet.appendSharedString(v);
      if (prevIndex !== index) {
        if (prevIndex !== undefined) {
          this.sheet.addSharedStringReferences(-1);
        }
        this.sheet.addSharedStringReferences(1);
      }
      model.kind = 'sharedString';
      model.raw = index;
    } else if (isCellError(v)) {
      if (!KNOWN_CELL_ERROR_CODES.has(v.code)) {
        throw new InvalidErrorCodeError(`Unrecognized cell error code "${v.code}"`);
      }
      this.adjustSstRefIfNeeded(model, undefined);
      model.kind = 'error';
      model.raw = v.code;
    } else {
      throw new InvalidCellValueError('Unsupported cell value type');
    }

    model.dirty = true;
    this.sheet.putCellModel(model);
    this.sheet.markCellsDirty();
  }

  /**
   * Gets or sets the cell's text. Returns `null` when the cell is empty or
   * holds a different type. Text is stored as-is, even when it looks like a
   * formula.
   */
  public get text(): string | null {
    const v = this.value;
    return typeof v === 'string' ? v : null;
  }

  /**
   * Assign plain text, or `null` to clear.
   * @throws InvalidCellValueError when value is not a string or null
   */
  public set text(v: string | null) {
    if (v === null) {
      this.value = null;
      return;
    }
    if (typeof v !== 'string') {
      throw new InvalidCellValueError('Cell text must be a string or null');
    }
    this.value = v;
  }

  /**
   * Gets or sets the cell's numeric value, including dates stored as
   * numbers. Returns `null` when the cell is empty or holds a different
   * type.
   */
  public get number(): number | null {
    const v = this.value;
    return typeof v === 'number' ? v : null;
  }

  /**
   * Assign a finite number, or `null` to clear.
   * @throws InvalidCellValueError when value is not a finite number or null
   */
  public set number(v: number | null) {
    if (v === null) {
      this.value = null;
      return;
    }
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      throw new InvalidCellValueError('Cell number must be a finite IEEE-754 number or null');
    }
    this.value = v;
  }

  /**
   * Gets or sets the cell's date and time as a `Date` object. Returns
   * `null` when the cell is empty or holds a non-date. Setting a date also
   * applies a default date number format so Excel displays it correctly.
   */
  public get dateTime(): Date | null {
    const v = this.value;
    if (typeof v !== 'number') {
      return null;
    }
    return excelSerialToDate(v, this.sheet.date1904());
  }

  /**
   * Assign a valid `Date` (stores serial + datetime number format), or `null` to clear.
   * @throws InvalidCellValueError when value is not a valid Date or null
   */
  public set dateTime(v: Date | null) {
    if (v === null) {
      this.value = null;
      return;
    }
    if (!(v instanceof Date) || Number.isNaN(v.getTime())) {
      throw new InvalidCellValueError('Cell dateTime must be a valid Date or null');
    }
    const serial = dateToExcelSerial(v, this.sheet.date1904());
    this.value = serial;
    this.numberFormat = DEFAULT_DATE_TIME_FORMAT;
  }

  /**
   * Formula text and attributes when `f` is present; `undefined` otherwise.
   *
   * Text-only: never evaluates. Shared/array metadata (`t`/`ref`/`si` and
   * other attributes) are exposed as stored.
   *
   * Citations: ECMA-376-1 §18.3.1.40; docs/specs/cell-formulas.md.
   * Prefer public {@link formula} for normal expressions; use this for shared/array metadata.
   *
   * 
   *
   * @private
   */
  public getFormula(): CellFormula | undefined {
    const model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined || model.formula === undefined) {
      return undefined;
    }
    return formulaStateToPublic(model.formula);
  }

  /**
   * Set formula **text** on this cell. Does not evaluate. Does not resolve
   * external links. Does not write the expression through the shared string
   * table as the formula source.
   *
   * A single leading `=` is stripped as a convenience (Excel stores the bare
   * expression in `f`). Strings set via {@link value} are never promoted.
   *
   * By default clears the cached calculated value so Excel recalculates on open.
   * Prior shared/array `si`/`ref` are replaced unless supplied in `options`.
   *
   * @throws InvalidFormulaError when expression is empty (for normal type) or type is invalid
   *
   * Citations: ECMA-376-1 §18.3.1.40; docs/specs/cell-formulas.md.
   * Prefer public {@link formula} for normal expression set/clear.
   *
   * 
   *
   * @private
   */
  public setFormula(expression: string, options?: SetFormulaOptions): void {
    this.sheet.ensureSheetDataLoaded();

    if (typeof expression !== 'string') {
      throw new InvalidFormulaError('Formula expression must be a string');
    }

    const type = ((__t) => __t != null ? __t : 'normal')(options == null ? undefined : options.type);
    if (!isCellFormulaType(type)) {
      throw new InvalidFormulaError(`Invalid formula type "${String(type)}"`);
    }

    const normalized = normalizeFormulaExpression(expression);
    // Shared/array slaves may legally have empty body when si/ref are set via options.
    const allowEmpty =
      type === 'shared' ||
      type === 'array' ||
      type === 'dataTable' ||
      (options == null ? undefined : options.si) !== undefined ||
      (options == null ? undefined : options.ref) !== undefined;

    if (normalized.length === 0 && !allowEmpty) {
      throw new InvalidFormulaError('Formula expression must not be empty');
    }

    let model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      model = createEmptyCellModel(this.row, this.col);
    }

    model.formula = createFormulaState(normalized, { ...options, type });

    const clearCached = (options == null ? undefined : options.clearCachedValue) !== false;
    if (clearCached) {
      this.adjustSstRefIfNeeded(model, undefined);
      model.kind = 'empty';
      model.raw = undefined;
      model.inlineIsXml = undefined;
      model.inlinePlain = undefined;
    }

    model.dirty = true;
    this.sheet.putCellModel(model);
    this.sheet.markCellsDirty();
  }

  /**
   * Remove `f` from this cell. By default leaves any cached `v` intact.
   *
   * Citations: docs/specs/cell-formulas.md.
   * Prefer `formula = undefined` for the public clear path.
   *
   * 
   *
   * @private
   */
  public clearFormula(options?: ClearFormulaOptions): void {
    this.sheet.ensureSheetDataLoaded();
    const model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      return;
    }
    if (model.formula === undefined && (options == null ? undefined : options.clearCachedValue) !== true) {
      return;
    }

    model.formula = undefined;
    if ((options == null ? undefined : options.clearCachedValue) === true) {
      this.adjustSstRefIfNeeded(model, undefined);
      model.kind = 'empty';
      model.raw = undefined;
      model.inlineIsXml = undefined;
      model.inlinePlain = undefined;
    }
    model.dirty = true;
    if (cellModelHasResidue(model)) {
      this.sheet.putCellModel(model);
    } else {
      this.sheet.deleteCellModel(this.row, this.col);
    }
    this.sheet.markCellsDirty();
  }

  /**
   * Zero-based `cellXfs` index (`c@s`), or `undefined` when absent.
   *
   * Citations: ECMA-376-1 §18.3.1.4; docs/specs/styles-table.md.
   * Prefer public {@link style} / {@link numberFormat}.
   *
   * @private
   */
  public get styleIndex(): number | undefined {
    const model = this.sheet.getCellModel(this.row, this.col);
    return (model == null ? undefined : model.styleIndex);
  }

  /**
   * Assign or clear the cell style index. Does not clear value or formula.
   * Out-of-range indexes throw {@link InvalidStyleIndexError}.
   *
   * @throws InvalidStyleIndexError when index is outside `cellXfs`
   * Prefer public {@link style}.
   *
   * @private
   */
  public set styleIndex(index: number | undefined) {
    this.sheet.ensureSheetDataLoaded();
    if (index !== undefined) {
      // Validate against live cellXfs (throws InvalidStyleIndexError).
      this.sheet.styles().getCellXf(index);
    }

    let model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      if (index === undefined) {
        return;
      }
      model = createEmptyCellModel(this.row, this.col);
    }

    model.styleIndex = index;
    model.dirty = true;
    if (index === undefined && !cellModelHasResidue(model)) {
      this.sheet.deleteCellModel(this.row, this.col);
    } else {
      this.sheet.putCellModel(model);
    }
    this.sheet.markCellsDirty();
  }

  /**
   * Ensure a `cellXfs` row for `style` and assign {@link styleIndex}.
   * Preserves the current value.
   *
   * Citations: docs/specs/styles-table.md; ECMA-376-1 §18.8.10.
   * Prefer public {@link style}.
   *
   * @private
   */
  public applyStyle(style: CellStyle): void {
    const index = this.sheet.styles().ensureCellXf(style);
    this.styleIndex = index;
  }

  /**
   * xf Excel paints for this address without creating a cell record.
   *
   * Precedence: cell `c@s`, then row `s` when `customFormat` is true, then
   * column `style`. An index outside `cellXfs` is treated as absent so a
   * corrupt column style cannot throw on an empty-cell read.
   */
  private resolvedStyleIndex(): number | undefined {
    const own = this.styleIndex;
    if (own !== undefined) {
      return this.xfIndexOrUndefined(own);
    }
    const rowStyle = this.sheet.getRowStyleIndex(this.row);
    if (rowStyle !== undefined) {
      return this.xfIndexOrUndefined(rowStyle);
    }
    const columnStyle = this.sheet.getColumnStyleIndex(this.col);
    if (columnStyle !== undefined) {
      return this.xfIndexOrUndefined(columnStyle);
    }
    return undefined;
  }

  private xfIndexOrUndefined(index: number): number | undefined {
    const styles = this.sheet.styles();
    if (!Number.isInteger(index) || index < 0) {
      return undefined;
    }
    try {
      styles.getCellXf(index);
    } catch (caught) {
      if (caught instanceof InvalidStyleIndexError) {
        return undefined;
      }
      throw caught;
    }
    return index;
  }

  /**
   * Gets or sets the cell's formula, such as `SUM(A1:A10)`. Set to
   * `undefined` to remove the formula while keeping its last calculated
   * result. Formulas are stored as written and are never evaluated.
   */
  public get formula(): string | undefined {
    return ((__t) => __t == null ? undefined : __t.expression)(this.getFormula());
  }

  /**
   * Set or clear formula text. `undefined` clears `f` (leaves cached `v`).
   * @throws InvalidFormulaError when expression is empty after normalize
   */
  public set formula(expression: string | undefined) {
    if (expression === undefined) {
      this.clearFormula();
      return;
    }
    this.setFormula(expression);
  }

  /**
   * Hyperlink for this cell address, or `undefined` when none.
   *
   * Sole public cell hyperlink surface (API-RULES R1.5). `displayText` maps to
   * `display` (XlsIO TextToDisplay) and also sets this cell's value so the
   * text is visible in Excel. Optional `type` / `subAddress` match XlsIO
   * Type / SubAddress. `clear()` does not remove the hyperlink. Distinct
   * from the `HYPERLINK()` formula text on {@link formula}.
   *
   * Citations: ECMA-376-1 §18.3.1.47; docs/specs/hyperlinks.md; API-RULES R1.5 / R5.1.
   */
  public get hyperlink(): CellHyperlink | undefined {
    return this.sheet.hyperlinksImpl.getForCell(this.address);
  }

  /**
   * Gets or sets the clickable link attached to this cell. Set to
   * `undefined` to remove the link. Removing the link does not clear the
   * cell's value.
   *
   * @throws InvalidHyperlinkError when target/ref is invalid
   * @throws InvalidArgumentError when value shape is wrong
   */
  public set hyperlink(value: CellHyperlink | undefined) {
    this.sheet.hyperlinksImpl.setForCell(this.address, value);
  }

  /**
   * Discussion thread on this cell, or `undefined` if none.
   * Create one with {@link addThreadedComment}.
   */
  public get threadedComment(): ThreadedComment | undefined {
    return this.sheet.threadedCommentsImpl.getForCell(this.row, this.col);
  }

  /**
   * Start a discussion thread on this cell and return it so you can add replies.
   * A cell can have only one thread.
   *
   * @param text - Opening message text.
   * @param author - Author display name. Default `""`.
   * @param createdAt - When the thread started. Default: now.
   *
   * @throws InvalidThreadedCommentError when the cell already has a thread
   * @throws InvalidArgumentError when text is invalid
   */
  public addThreadedComment(
    text: string,
    author?: string,
    createdAt?: Date,
  ): ThreadedComment {
    return this.sheet.threadedCommentsImpl.addAtCell(
      this.row,
      this.col,
      text,
      author,
      createdAt,
    );
  }

  /**
   * Classic sticky note on this cell, or `undefined` if none.
   */
  public get comment(): Comment | AddCommentOptions | undefined {
    return this.sheet.commentsImpl.getForCell(this.row, this.col);
  }

  /**
   * Replace or clear the classic note on this cell.
   * Assign note options to create or replace it; assign `undefined` to remove it.
   * Cell path ignores {@link AddCommentOptions.ref} / row / column; the cell is the target.
   */
  public set comment(
    value: Comment | AddCommentOptions | undefined,
  ) {
    if (value === undefined) {
      this.removeComment();
      return;
    }
    this.sheet.commentsImpl.removeForCell(this.row, this.col);
    this.sheet.commentsImpl.addForCell(this.row, this.col, value);
  }

  /**
   * Add a classic sticky note on this cell.
   *
   * Cell path ignores {@link AddCommentOptions.ref} / row / column; the cell is the target.
   *
   * @throws InvalidCommentError when options are invalid or the cell already has a note
   */
  public addComment(
    options: AddCommentOptions = {},
  ): Comment {
    return this.sheet.commentsImpl.addForCell(this.row, this.col, options);
  }

  /**
   * Remove the classic sticky note from this cell (does nothing if there is none).
   */
  public removeComment(): void {
    this.sheet.commentsImpl.removeForCell(this.row, this.col);
  }

  /**
   * `true` when this cell uses rich text (different formatting on parts of the value).
   */
  public get hasRichText(): boolean {
    return this.createRichTextHost().hasRichFormatting();
  }

  /**
   * Rich text for this cell — full text and character ranges you can format.
   *
   * Example: `cell.richText.characters(0, 4).font = workbook.createFont()`.
   */
  public get richText(): RichTextString {
    return new RichTextString(this.createRichTextHost());
  }

  /**
   * Gets or sets the cell's formatting — number format, font, fill, border,
   * alignment, and protection — in one operation. Set to `undefined` to
   * clear the cell's formatting without affecting its value.
   *
   * When this cell has no own style index, the getter returns the row style
   * (`row/@s` with `customFormat="1"`), then the column style. Reading an
   * inherited style does not write `c/@s`.
   */
  public get style(): CellFormat | undefined | CellStyle {
    const index = this.resolvedStyleIndex();
    if (index === undefined) {
      return undefined;
    }
    return cellFormatToStyleInput(this.sheet.styles(), this.sheet.styles().getCellXf(index));
  }

  /**
   * Apply a style input or clear the cell style index.
   */
  public set style(style: CellFormat | undefined | CellStyle) {
    if (style === undefined) {
      this.styleIndex = undefined;
      return;
    }
    this.applyStyle(style);
  }

  /**
   * Host callbacks for {@link RichTextString} / {@link RichTextCharacters}.
   */
  private createRichTextHost(): RichTextCellHost {
    return {
      getPlainText: (): string => this.getRichPlainText(),
      getRuns: (): RichTextRun[] => this.getRichRunsFromModel(),
      commitRuns: (runs: ReadonlyArray<RichTextRun>): void => {
        this.commitRichRuns(runs);
      },
      hasRichFormatting: (): boolean => this.computeHasRichFormatting(),
    };
  }

  private getRichPlainText(): string {
    const model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      return '';
    }
    if (model.kind === 'inlineString') {
      if (model.inlineIsXml !== undefined && model.inlineIsXml.length > 0) {
        return joinRunText(parseRichRunsFromSiXml(model.inlineIsXml));
      }
      return (model.inlinePlain != null ? model.inlinePlain : '');
    }
    if (model.kind === 'sharedString' && typeof model.raw === 'number') {
      return this.sheet.resolveSharedString(model.raw);
    }
    const v = modelToCellValue(model, (index) => this.sheet.resolveSharedString(index));
    return typeof v === 'string' ? v : '';
  }

  private getRichRunsFromModel(): RichTextRun[] {
    const model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      return [{ text: '' }];
    }
    if (model.kind === 'inlineString') {
      if (model.inlineIsXml !== undefined && model.inlineIsXml.length > 0) {
        return parseRichRunsFromSiXml(model.inlineIsXml);
      }
      return [{ text: (model.inlinePlain != null ? model.inlinePlain : '') }];
    }
    if (model.kind === 'sharedString' && typeof model.raw === 'number') {
      return this.sheet.getRichSharedStringRuns(model.raw);
    }
    const plain = this.getRichPlainText();
    return [{ text: plain }];
  }

  private computeHasRichFormatting(): boolean {
    const model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      return false;
    }
    if (model.kind === 'sharedString' && typeof model.raw === 'number') {
      if (this.sheet.sharedStringEntryKind(model.raw) === 'rich') {
        return true;
      }
      return richRunsIndicateRichText(this.sheet.getRichSharedStringRuns(model.raw));
    }
    if (model.kind === 'inlineString') {
      if (model.inlineIsXml !== undefined && model.inlineIsXml.length > 0) {
        return richRunsIndicateRichText(parseRichRunsFromSiXml(model.inlineIsXml));
      }
      return false;
    }
    return false;
  }

  /**
   * Commit structured runs: plain single-run → plain SST; formatted/multi → rich SST.
   * Always clears inline bags and promotes authored content to shared strings.
   */
  private commitRichRuns(runs: ReadonlyArray<RichTextRun>): void {
    this.sheet.ensureSheetDataLoaded();
    const normalized = normalizeRichRuns(runs);
    const isRich = richRunsIndicateRichText(normalized);

    let model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      model = createEmptyCellModel(this.row, this.col);
    }

    // Rich edit replaces formula and inline payload (library owns t="s").
    model.formula = undefined;
    model.inlineIsXml = undefined;
    model.inlinePlain = undefined;
    model.preserveChildrenXml = [];

    const prevIndex =
      model.kind === 'sharedString' && typeof model.raw === 'number' ? model.raw : undefined;

    const nextIndex = isRich
      ? this.sheet.appendRichSharedString(normalized)
      : this.sheet.appendSharedString(joinRunText(normalized));

    if (prevIndex !== nextIndex) {
      if (prevIndex !== undefined) {
        this.sheet.addSharedStringReferences(-1);
      }
      this.sheet.addSharedStringReferences(1);
    }

    model.kind = 'sharedString';
    model.raw = nextIndex;
    model.dirty = true;
    this.sheet.putCellModel(model);
    this.sheet.markCellsDirty();
  }

  /**
   * Gets or sets the number format code that controls how the cell's value
   * is displayed, such as `#,##0.00` or `yyyy-mm-dd`.
   *
   * On read: uses the resolved style (cell `c@s`, else row xf when
   * `customFormat` is set, else column `col@style`) and resolves via styles
   * `numFmts` rows first, then the ECMA-376-1 §18.8.30 implied built-in table
   * when that xf's `numFmtId` is a known language-neutral built-in (for
   * example id 14 → `m/d/yyyy`). Returns `undefined` when no xf applies, or
   * the id has no package row and no built-in mapping. Setting always
   * allocates a custom format (≥164) on this cell and does not rewrite
   * built-in ids or the column/row record.
   */
  public get numberFormat(): string | undefined {
    const view = this.style;
    if (view === undefined || view.numFmtId === undefined) {
      return undefined;
    }
    return this.sheet.styles().getFormatCode(view.numFmtId);
  }

  /**
   * Assign a custom number format code on this cell.
   * @throws InvalidNumberFormatError when code is empty / whitespace-only
   */
  public set numberFormat(formatCode: string | undefined) {
    if (formatCode === undefined) {
      return;
    }
    const styles = this.sheet.styles();
    const numFmtId = styles.ensureCustomNumberFormat(formatCode);

    // The `style` getter already returns a CellStyle (font/fill/border objects).
    const current = this.style;
    const base: CellStyle = current !== undefined ? current : {};

    this.applyStyle({
      ...base,
      numFmtId,
    });
  }

  /**
   * Gets whether this cell is locked for protection.
   *
   * When the worksheet is protected, locked cells cannot be edited.
   * Unlocked cells remain editable.
   *
   * @returns `true` if cell protection is locked; `false` otherwise.
   *
   * @remarks
   *
   * This is a read-only convenience accessor. To change cell locking, use the
   * {@link style} property:
   *
   * ```typescript
   * cell.style = { protection: { locked: true } };
   * ```
   *
   * Citations: ECMA-376-1 §18.8.46 (protection element); docs/ooxml-mapping/styles-table.md.
   */
  public get isLocked(): boolean {
    const protection = this.style && this.style.protection ? this.style.protection : null;
    return protection == null ? false : (protection.locked != null ? protection.locked : false);
  }

  /**
   * Gets the number of rows spanned by this cell in a merged region.
   *
   * For unmerged cells, always returns 1.
   *
   * @returns Row span (≥ 1). Returns 1 for unmerged cells.
   *
   * @remarks
   *
   * The span is computed by finding any merge that contains this cell.
   * The property works for any cell within the merged range, not just the top-left.
   *
   * Performance: O(n) where n = number of merged regions on the sheet.
   *
   * ```typescript
   * // For merged cell A1:C3
   * const cell = sheet.getCell(2, 1);  // Cell B1
   * cell.rowSpan;  // Returns 3
   * ```
   *
   * Citations: ECMA-376-1 §18.3.1.55 (mergeCells); docs/ooxml-mapping/merged-cells.md.
   */
  public get rowSpan(): number {
    const merge = this.findMergeContainingCell();
    return merge === undefined ? 1 : (merge.endRow - merge.startRow + 1);
  }

  /**
   * Gets the number of columns spanned by this cell in a merged region.
   *
   * For unmerged cells, always returns 1.
   *
   * @returns Column span (≥ 1). Returns 1 for unmerged cells.
   *
   * @remarks
   *
   * The span is computed by finding any merge that contains this cell.
   * The property works for any cell within the merged range, not just the top-left.
   *
   * Performance: O(n) where n = number of merged regions on the sheet.
   *
   * ```typescript
   * // For merged cell A1:C3
   * const cell = sheet.getCell(2, 2);  // Cell B2
   * cell.colSpan;  // Returns 3
   * ```
   *
   * Citations: ECMA-376-1 §18.3.1.55 (mergeCells); docs/ooxml-mapping/merged-cells.md.
   */
  public get colSpan(): number {
    const merge = this.findMergeContainingCell();
    return merge === undefined ? 1 : (merge.endCol - merge.startCol + 1);
  }

  /**
   * Find the merged region that contains this cell, if any.
   *
   * @private
   */
  private findMergeContainingCell(): MergeRange | undefined {
    const merges = this.sheet.merges.list();
    for (const ref of merges) {
      const range = parseA1Range(ref);
      if (
        this.row >= range.startRow && this.row <= range.endRow &&
        this.col >= range.startCol && this.col <= range.endCol
      ) {
        return range;
      }
    }
    return undefined;
  }

  /**
   * Removes the cell's value and formula, leaving its formatting in place.
   * Does nothing when the cell is already empty of both.
   */
  public clear(): void {
    this.sheet.ensureSheetDataLoaded();
    const model = this.sheet.getCellModel(this.row, this.col);
    if (model === undefined) {
      return;
    }
    this.adjustSstRefIfNeeded(model, undefined);
    model.kind = 'empty';
    model.raw = undefined;
    model.formula = undefined;
    model.inlineIsXml = undefined;
    model.inlinePlain = undefined;
    model.dirty = true;
    if (cellModelHasResidue(model)) {
      this.sheet.putCellModel(model);
    } else {
      this.sheet.deleteCellModel(this.row, this.col);
    }
    this.sheet.markCellsDirty();
  }

  private adjustSstRefIfNeeded(model: CellModel, _next: number | undefined): void {
    if (model.kind === 'sharedString') {
      this.sheet.addSharedStringReferences(-1);
    }
  }
}
