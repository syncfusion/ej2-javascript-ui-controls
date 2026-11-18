/**
 * Worksheet column properties (`CT_Cols` / `CT_Col`).
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.17 `cols` / §18.3.1.12 `col`
 * - transitional sml.xsd `CT_Cols` (~L2233), `CT_Col` (~L2238–2248)
 * - `CT_Worksheet` sequence: sheetFormatPr → **cols** → sheetData (~L2170–2176)
 * - docs/requirements/row-column-properties.md
 * - docs/specs/column-properties.md; docs/ooxml-mapping/column-properties.md
 *
 * Sparse grid law: column records never allocate cells. Empty `cols` is omitted.
 * Unsupported / unmodeled `col` attributes round-trip via `extraAttrsXml`.
 *
 * Public authoring uses {@link import('../workbook/worksheet').Worksheet.setColumnWidth} /
 * {@link import('../workbook/worksheet').Worksheet.getColumnWidth} only.
 * Enumeration of authored `col` records is internal.
 *
 * @private
 */

import { InvalidArgumentError } from '../core/errors';
import { attrsToXmlExcluding, parseAttrMap } from '../core/xml/minimal-xml';

/**
 * Snapshot of one column range record (`CT_Col`).
 *
 * `min` / `max` are 1-based inclusive column indexes. `width` is the OOXML
 * character-width double when present. `customWidth` mirrors
 * `CT_Col/@customWidth` (schema default `false`).
 *
 * @private
 */
export interface ColumnProperties {
  /** Inclusive 1-based start column (`CT_Col/@min`). */
  readonly min: number;
  /** Inclusive 1-based end column (`CT_Col/@max`). */
  readonly max: number;
  /** Column width in OOXML character units when set. */
  readonly width: number | undefined;
  /**
   * Whether the width is custom (`CT_Col/@customWidth`).
   * Schema default is `false` when the attribute is absent.
   */
  readonly customWidth: boolean;
}

/**
 * Collection of worksheet column records for internal parse/mutate/serialize.
 *
 * Prefer {@link import('../workbook/worksheet').Worksheet.setColumnWidth} /
 * {@link import('../workbook/worksheet').Worksheet.getColumnWidth} on the
 * public surface.
 *
 * @private
 */
export interface Columns {
  /** Number of `col` records. */
  readonly count: number;
  /** Snapshot of column records in file / author order. */
  list(): ReadonlyArray<ColumnProperties>;
}

/**
 * Internal column entry with opaque extra attributes for round-trip.
 * @private
 */
export interface ColumnEntry {
  readonly min: number;
  readonly max: number;
  readonly width: number | undefined;
  /**
   * Modeled customWidth:
   * - `undefined` — attribute absent (schema default false)
   * - `true` / `false` — explicit
   */
  readonly customWidth: boolean | undefined;
  /** Column hidden flag (`CT_Col/@hidden`). */
  readonly hidden: boolean | undefined;
  /** Stored unhide width (snapshot when hidden). */
  readonly hiddenWidth: number | undefined;
  /**
   * `CT_Col/@style` when the attribute is present.
   * Absent is not the same as explicit `0`.
   */
  readonly styleIndex: number | undefined;
  /** Extra attributes excluding min/max/width/customWidth/hidden/style. */
  readonly extraAttrsXml: string;
}

/**
 * Wire model for `cols` (ordered entries + presence).
 * @private
 */
export interface ColumnsModel {
  readonly entries: ReadonlyArray<ColumnEntry>;
}

/**
 * Host notifications for column mutations.
 * @private
 */
export interface ColumnsHost {
  markDirty(): void;
}

const EMPTY_MODEL: ColumnsModel = { entries: [] };

/**
 * Mutable columns store backed by an ordered entry list.
 * @private
 */
export class ColumnsImpl implements Columns {
  private readonly entries: ColumnEntry[] = [];
  private host: ColumnsHost | undefined;

  public constructor(initial?: ReadonlyArray<ColumnEntry>) {
    if (initial !== undefined) {
      for (const e of initial) {
        this.entries.push(cloneEntry(e));
      }
    }
  }

  /** @private */
  public bindHost(host: ColumnsHost): void {
    this.host = host;
  }

  public get count(): number {
    return this.entries.length;
  }

  public list(): ReadonlyArray<ColumnProperties> {
    return this.entries.map((e) => toPublic(e));
  }

  /**
   * Highest 1-based column covered by a meaningful `col` record, or `0` when none.
   *
   * Meaningful: custom or explicit width, hidden, or a style attribute.
   * A bare `min`/`max` span (Excel sometimes writes `1:16384`) does not
   * extend the used range. Does not allocate cells.
   *
   * Citation: ECMA-376-1 §18.3.1.13 `col` (`min`, `max`, `width`, `customWidth`,
   * `hidden`, `style`).
   * @private
   */
  public maxAuthoredIndex(): number {
    let max = 0;
    for (const entry of this.entries) {
      if (!columnEntryExtendsUsedRange(entry)) {
        continue;
      }
      if (entry.max > max) {
        max = entry.max;
      }
    }
    return max;
  }

  /**
   * Replace contents from parse (does not mark dirty).
   * @private
   */
  public replaceFromParse(model: ColumnsModel | undefined): void {
    this.entries.length = 0;
    if (model === undefined) {
      return;
    }
    for (const e of model.entries) {
      this.entries.push(cloneEntry(e));
    }
  }

  /**
   * Snapshot for serialize.
   * @private
   */
  public toModel(): ColumnsModel {
    return {
      entries: this.entries.map(cloneEntry),
    };
  }

  /**
   * `CT_Col/@style` for a 1-based column, or `undefined` when no covering
   * record carries the attribute.
   *
   * ECMA-376-1 §18.3.1.13: the style is the default for cells not yet allocated
   * in the column. Schema default is `0` only when the attribute is absent;
   * absence is not the same as an explicit `style="0"`, so missing attributes
   * stay `undefined` and do not paint Normal over a row style.
   *
   * Last covering record in file order wins, matching {@link getColumnWidth}.
   * Does not allocate cells.
   *
   * @private
   */
  public getColumnStyleIndex(index: number): number | undefined {
    assertColumnIndex(index);
    let found: number | undefined;
    for (const e of this.entries) {
      if (index >= e.min && index <= e.max && e.styleIndex !== undefined) {
        found = e.styleIndex;
      }
    }
    return found;
  }

  /**
   * Effective width for a 1-based column index, or `0` when unset.
   * Walks entries in file order; last covering range wins.
   * @private
   */
  public getColumnWidth(index: number): number {
    assertColumnIndex(index);
    let found: number | undefined;
    for (const e of this.entries) {
      if (index >= e.min && index <= e.max && e.width !== undefined) {
        found = e.width;
      }
    }
    return (found != null ? found : 0);
  }

  /**
   * Set custom width for a single 1-based column.
   *
   * Matching policy:
   * 1. Exact `min === index && max === index` → update in place.
   * 2. Otherwise if a multi-column range covers `index`, split that range
   *    so only `index` receives the new width (other columns keep prior
   *    width/extras).
   * 3. Else append `min=max=index`, `customWidth=true`.
   *
   * @private
   */
  public setColumnWidth(index: number, width: number): void {
    assertColumnIndex(index);
    assertColumnWidth(width);

    // Prefer exact single-column record.
    const exactIdx = this.entries.findIndex(
      (e) => e.min === index && e.max === index,
    );
    if (exactIdx >= 0) {
      const prev = this.entries[exactIdx];
      if (prev === undefined) {
        return;
      }
      if (prev.width === width && prev.customWidth === true) {
        return;
      }
      // Update both live width and snapshot when hidden
      const newHiddenWidth = prev.hidden === true ? width : prev.hiddenWidth;
      this.entries[exactIdx] = {
        min: index,
        max: index,
        width,
        customWidth: true,
        hidden: prev.hidden,
        hiddenWidth: newHiddenWidth,
        styleIndex: prev.styleIndex,
        extraAttrsXml: prev.extraAttrsXml,
      };
      (this.host == null ? undefined : this.host.markDirty());
      return;
    }

    // Split the first covering multi-col range (file order).
    const coverIdx = this.entries.findIndex(
      (e) => e.min <= index && index <= e.max && e.min !== e.max,
    );
    if (coverIdx >= 0) {
      const cover = this.entries[coverIdx];
      if (cover === undefined) {
        return;
      }
      const replacements: ColumnEntry[] = [];
      if (cover.min < index) {
        replacements.push({
          min: cover.min,
          max: index - 1,
          width: cover.width,
          customWidth: cover.customWidth,
          hidden: cover.hidden,
          hiddenWidth: cover.hiddenWidth,
          styleIndex: cover.styleIndex,
          extraAttrsXml: cover.extraAttrsXml,
        });
      }
      // Update both live width and snapshot when hidden
      const newHiddenWidth = cover.hidden === true ? width : cover.hiddenWidth;
      replacements.push({
        min: index,
        max: index,
        width,
        customWidth: true,
        hidden: cover.hidden,
        hiddenWidth: newHiddenWidth,
        styleIndex: cover.styleIndex,
        extraAttrsXml: cover.extraAttrsXml,
      });
      if (cover.max > index) {
        replacements.push({
          min: index + 1,
          max: cover.max,
          width: cover.width,
          customWidth: cover.customWidth,
          hidden: cover.hidden,
          hiddenWidth: cover.hiddenWidth,
          styleIndex: cover.styleIndex,
          extraAttrsXml: cover.extraAttrsXml,
        });
      }
      this.entries.splice(coverIdx, 1, ...replacements);
      (this.host == null ? undefined : this.host.markDirty());
      return;
    }

    this.entries.push({
      min: index,
      max: index,
      width,
      customWidth: true,
      hidden: undefined,
      hiddenWidth: undefined,
      styleIndex: undefined,
      extraAttrsXml: '',
    });
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Whether a 1-based column is hidden (`CT_Col/@hidden="1"`).
   * @private
   */
  public isColumnHidden(index: number): boolean {
    assertColumnIndex(index);
    for (const e of this.entries) {
      if (index >= e.min && index <= e.max && e.hidden === true) {
        return true;
      }
    }
    return false;
  }

  /**
   * Set column hidden flag. When hiding, snapshots the current width.
   * When showing, restores the snapshot and sets customWidth.
   * @private
   */
  public setColumnHidden(index: number, hidden: boolean): void {
    assertColumnIndex(index);
    if (typeof hidden !== 'boolean') {
      throw new InvalidArgumentError('Hidden must be a boolean');
    }

    // Find or create exact entry
    const exactIdx = this.entries.findIndex(
      (e) => e.min === index && e.max === index,
    );

    // Split any covering multi-column range first
    if (exactIdx < 0) {
      const coverIdx = this.entries.findIndex(
        (e) => e.min <= index && index <= e.max && e.min !== e.max,
      );
      if (coverIdx >= 0) {
        const cover = this.entries[coverIdx];
        if (cover !== undefined) {
          const replacements: ColumnEntry[] = [];
          if (cover.min < index) {
            replacements.push({
              min: cover.min,
              max: index - 1,
              width: cover.width,
              customWidth: cover.customWidth,
              hidden: cover.hidden,
              hiddenWidth: cover.hiddenWidth,
              styleIndex: cover.styleIndex,
              extraAttrsXml: cover.extraAttrsXml,
            });
          }
          replacements.push({
            min: index,
            max: index,
            width: cover.width,
            customWidth: cover.customWidth,
            hidden: hidden ? true : undefined,
            hiddenWidth: hidden && cover.hiddenWidth === undefined ? cover.width : cover.hiddenWidth,
            styleIndex: cover.styleIndex,
            extraAttrsXml: cover.extraAttrsXml,
          });
          if (cover.max > index) {
            replacements.push({
              min: index + 1,
              max: cover.max,
              width: cover.width,
              customWidth: cover.customWidth,
              hidden: cover.hidden,
              hiddenWidth: cover.hiddenWidth,
              styleIndex: cover.styleIndex,
              extraAttrsXml: cover.extraAttrsXml,
            });
          }
          this.entries.splice(coverIdx, 1, ...replacements);
          (this.host == null ? undefined : this.host.markDirty());
          return;
        }
      }
      // No covering range, append new entry
      this.entries.push({
        min: index,
        max: index,
        width: undefined,
        customWidth: undefined,
        hidden: hidden ? true : undefined,
        hiddenWidth: undefined,
        styleIndex: undefined,
        extraAttrsXml: '',
      });
      (this.host == null ? undefined : this.host.markDirty());
      return;
    }

    // Update exact entry
    const entry = this.entries[exactIdx];
    if (entry === undefined) {
      return;
    }

    let newHidden: boolean | undefined;
    let newHiddenWidth: number | undefined;

    if (hidden) {
      // Hide: snapshot width if no snapshot exists
      newHidden = true;
      newHiddenWidth = entry.hiddenWidth === undefined ? entry.width : entry.hiddenWidth;
    } else {
      // Show: restore snapshot
      newHidden = undefined;
      newHiddenWidth = undefined;
      const snapshot = entry.hiddenWidth !== undefined ? entry.hiddenWidth : entry.width;
      if (snapshot !== undefined) {
        this.entries[exactIdx] = {
          ...entry,
          width: snapshot,
          customWidth: true,
          hidden: newHidden,
          hiddenWidth: newHiddenWidth,
        };
        (this.host == null ? undefined : this.host.markDirty());
        return;
      }
    }

    this.entries[exactIdx] = {
      ...entry,
      hidden: newHidden,
      hiddenWidth: newHiddenWidth,
    };
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Stored unhide width for a 1-based column, or `0` when no snapshot.
   * @private
   */
  public getColumnHiddenWidth(index: number): number {
    assertColumnIndex(index);
    for (const e of this.entries) {
      if (index >= e.min && index <= e.max && e.hiddenWidth !== undefined) {
        return e.hiddenWidth;
      }
    }
    return 0;
  }

  /**
   * Set stored unhide width. If column is hidden, updates live width too.
   * @private
   */
  public setColumnHiddenWidth(index: number, width: number): void {
    assertColumnIndex(index);
    assertColumnWidth(width);

    const exactIdx = this.entries.findIndex(
      (e) => e.min === index && e.max === index,
    );

    // Split any covering multi-column range first
    if (exactIdx < 0) {
      const coverIdx = this.entries.findIndex(
        (e) => e.min <= index && index <= e.max && e.min !== e.max,
      );
      if (coverIdx >= 0) {
        const cover = this.entries[coverIdx];
        if (cover !== undefined) {
          const replacements: ColumnEntry[] = [];
          if (cover.min < index) {
            replacements.push({
              min: cover.min,
              max: index - 1,
              width: cover.width,
              customWidth: cover.customWidth,
              hidden: cover.hidden,
              hiddenWidth: cover.hiddenWidth,
              styleIndex: cover.styleIndex,
              extraAttrsXml: cover.extraAttrsXml,
            });
          }
          replacements.push({
            min: index,
            max: index,
            width: cover.hidden === true ? width : cover.width,
            customWidth: cover.customWidth,
            hidden: cover.hidden,
            hiddenWidth: width,
            styleIndex: cover.styleIndex,
            extraAttrsXml: cover.extraAttrsXml,
          });
          if (cover.max > index) {
            replacements.push({
              min: index + 1,
              max: cover.max,
              width: cover.width,
              customWidth: cover.customWidth,
              hidden: cover.hidden,
              hiddenWidth: cover.hiddenWidth,
              styleIndex: cover.styleIndex,
              extraAttrsXml: cover.extraAttrsXml,
            });
          }
          this.entries.splice(coverIdx, 1, ...replacements);
          (this.host == null ? undefined : this.host.markDirty());
          return;
        }
      }
      // No covering range, append new entry
      this.entries.push({
        min: index,
        max: index,
        width: undefined,
        customWidth: undefined,
        hidden: undefined,
        hiddenWidth: width,
        styleIndex: undefined,
        extraAttrsXml: '',
      });
      (this.host == null ? undefined : this.host.markDirty());
      return;
    }

    const entry = this.entries[exactIdx];
    if (entry === undefined) {
      return;
    }

    // If hidden, update live width to match the new snapshot
    const newWidth = entry.hidden === true ? width : entry.width;

    this.entries[exactIdx] = {
      ...entry,
      width: newWidth,
      hiddenWidth: width,
    };
    (this.host == null ? undefined : this.host.markDirty());
  }
}

/**
 * CT_Worksheet locals that appear **before** `cols`.
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const COLS_PREDECESSORS: ReadonlyArray<string> = [
  'sheetPr',
  'dimension',
  'sheetViews',
  'sheetFormatPr',
];

/**
 * CT_Worksheet locals after `cols` and before `sheetData` — none in the schema.
 * Kept for symmetry / future extensions.
 */
export const COLS_SUCCESSORS_BEFORE_SHEET_DATA: ReadonlyArray<string> = [];

const COLS_PRED = new Set(COLS_PREDECESSORS);
const COLS_SUCC = new Set(COLS_SUCCESSORS_BEFORE_SHEET_DATA);

/**
 * Index at which to insert serialized `cols` among before-sheetData siblings.
 */
export function findColsInsertIndex(
  beforeSheetDataLocals: ReadonlyArray<string>,
): number {
  let lastPred = -1;
  for (let i = 0; i < beforeSheetDataLocals.length; i += 1) {
    const name = beforeSheetDataLocals[i];
    if (name !== undefined && COLS_PRED.has(name)) {
      lastPred = i;
    }
  }
  if (lastPred >= 0) {
    return lastPred + 1;
  }
  for (let i = 0; i < beforeSheetDataLocals.length; i += 1) {
    const name = beforeSheetDataLocals[i];
    if (name !== undefined && COLS_SUCC.has(name)) {
      return i;
    }
  }
  return beforeSheetDataLocals.length;
}

/**
 * Parse a `cols` element into ordered column entries.
 * Soft-skips individual `col` children missing required min/max.
 *
 * Treats `hidden="1"` independently of width. Stores unhide width in `hiddenWidth`.
 * The `hidden` flag is kept and emitted.
 *
 * @private
 */
export function parseColsXml(colsXml: string): ColumnsModel {
  const inner = elementInnerLocal(colsXml);
  const children = splitTopLevelLocal(inner);
  const entries: ColumnEntry[] = [];
  for (const child of children) {
    if (elementLocalNameLocal(child) !== 'col') {
      continue;
    }
    const attrs = parseAttrMap(elementOpenAttrsLocal(child));
    const minRaw = attrs.get('min');
    const maxRaw = attrs.get('max');
    if (minRaw === undefined || maxRaw === undefined) {
      continue;
    }
    const min = parseUnsignedInt(minRaw);
    const max = parseUnsignedInt(maxRaw);
    if (min === undefined || max === undefined || min < 1 || max < min) {
      continue;
    }
    const widthRaw = attrs.get('width');
    let finiteWidth: number | undefined;
    if (widthRaw !== undefined) {
      const w = Number(widthRaw);
      if (Number.isFinite(w) && w >= 0) {
        finiteWidth = w;
      }
    }
    const hiddenRaw = attrs.get('hidden');
    const isHidden =
      hiddenRaw === '1' ||
      hiddenRaw === 'true' ||
      hiddenRaw === 'TRUE' ||
      hiddenRaw === 'True';
    // Parse hidden independently of width. Width 0 is a stored size, not hide.
    const width = finiteWidth;
    // Store unhide width: use the width when hidden, or undefined if hidden-only.
    const hiddenWidth = isHidden ? finiteWidth : undefined;
    const customRaw = attrs.get('customWidth');
    const customWidth =
      customRaw === undefined
        ? undefined
        : parseXsdBooleanOptional(customRaw);
    const styleRaw = attrs.get('style');
    const styleIndex = styleRaw === undefined ? undefined : parseUnsignedInt(styleRaw);
    // `hidden` and `style` are modeled and excluded from opaque extras.
    const extraAttrsXml = attrsToXmlExcluding(
      attrs,
      new Set(['min', 'max', 'width', 'customWidth', 'hidden', 'style']),
    );
    entries.push({
      min,
      max,
      width,
      customWidth,
      hidden: isHidden ? true : undefined,
      hiddenWidth,
      styleIndex,
      extraAttrsXml,
    });
  }
  return { entries };
}

/**
 * Serialize column entries to a `cols` element, or `undefined` when empty.
 * @private
 */
export function serializeColsXml(
  model: ColumnsModel | undefined,
): string | undefined {
  const entries = ((__t) => __t != null ? __t : EMPTY_MODEL.entries)(model == null ? undefined : model.entries);
  if (entries.length === 0) {
    return undefined;
  }
  const parts: string[] = ['<cols>'];
  for (const e of entries) {
    parts.push(serializeCol(e));
  }
  parts.push('</cols>');
  return parts.join('');
}

function serializeCol(e: ColumnEntry): string {
  const attrs: string[] = [
    `min="${e.min}"`,
    `max="${e.max}"`,
  ];
  if (e.width !== undefined) {
    attrs.push(`width="${formatDouble(e.width)}"`);
  }
  if (e.customWidth === true) {
    attrs.push('customWidth="1"');
  } else if (e.customWidth === false) {
    attrs.push('customWidth="0"');
  }
  // Emit hidden flag independently of width
  if (e.hidden === true) {
    attrs.push('hidden="1"');
  }
  if (e.styleIndex !== undefined) {
    attrs.push(`style="${String(e.styleIndex)}"`);
  }
  const extra =
    e.extraAttrsXml.trim().length > 0 ? ` ${e.extraAttrsXml.trim()}` : '';
  return `<col ${attrs.join(' ')}${extra}/>`;
}

function toPublic(e: ColumnEntry): ColumnProperties {
  return {
    min: e.min,
    max: e.max,
    width: e.width,
    customWidth: e.customWidth === true,
  };
}

/**
 * A `col` record extends used range only when it carries width, hidden, or style.
 * Bare spans do not (Excel default `min="1" max="16384"`).
 */
function columnEntryExtendsUsedRange(entry: ColumnEntry): boolean {
  if (entry.width !== undefined || entry.customWidth === true || entry.hidden === true) {
    return true;
  }
  return entry.styleIndex !== undefined;
}

function cloneEntry(e: ColumnEntry): ColumnEntry {
  return {
    min: e.min,
    max: e.max,
    width: e.width,
    customWidth: e.customWidth,
    hidden: e.hidden,
    hiddenWidth: e.hiddenWidth,
    styleIndex: e.styleIndex,
    extraAttrsXml: e.extraAttrsXml,
  };
}

function assertColumnIndex(index: number): void {
  if (!Number.isInteger(index) || index < 1) {
    throw new InvalidArgumentError(
      `Column index must be a finite integer ≥ 1 (received ${String(index)})`,
    );
  }
}

function assertColumnWidth(width: number): void {
  if (!Number.isFinite(width) || width < 0) {
    throw new InvalidArgumentError(
      `Column width must be a finite number ≥ 0 (received ${String(width)})`,
    );
  }
}

function parseUnsignedInt(raw: string): number | undefined {
  const t = raw.trim();
  if (t.length === 0 || !/^\d+$/.test(t)) {
    return undefined;
  }
  const n = Number(t);
  if (!Number.isInteger(n) || n < 0) {
    return undefined;
  }
  return n;
}

/**
 * Parse xsd:boolean lexical forms used by Office (`"1"`/`"0"`/`"true"`/`"false"`).
 * Invalid / unrecognized → `undefined` (attribute treated as absent for the
 * modeled field; extras path does not apply because the attr is excluded).
 */
function parseXsdBooleanOptional(raw: string | undefined): boolean | undefined {
  if (raw === undefined) {
    return undefined;
  }
  const v = raw.trim().toLowerCase();
  if (v === '1' || v === 'true') {
    return true;
  }
  if (v === '0' || v === 'false') {
    return false;
  }
  return undefined;
}

/** Emit a compact double without scientific notation for common widths. */
function formatDouble(n: number): string {
  // Preserve finite doubles as JS default string (matches sample fractional widths).
  return String(n);
}

/* ── minimal local XML helpers (mirror merged-cells / freeze-panes) ── */

function elementLocalNameLocal(el: string): string {
  const m = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
  return ((__t) => __t != null ? __t : '')(m == null ? undefined : m[2]);
}

function elementOpenAttrsLocal(el: string): string {
  const trimmed = el.trim();
  const gt = trimmed.indexOf('>');
  if (gt < 0) {
    return '';
  }
  const open = trimmed.slice(0, gt);
  const m = /^<[A-Za-z_][\w.-]*(?::[A-Za-z_][\w.-]*)?([\s\S]*)$/.exec(open);
  return m !== null && m[1] !== undefined ? m[1].trim() : '';
}

function elementInnerLocal(el: string): string {
  const trimmed = el.trim();
  const firstGt = trimmed.indexOf('>');
  if (firstGt < 0) {
    return '';
  }
  if (trimmed[firstGt - 1] === '/') {
    return '';
  }
  const close = trimmed.lastIndexOf('</');
  if (close < 0 || close <= firstGt) {
    return '';
  }
  return trimmed.slice(firstGt + 1, close);
}

function splitTopLevelLocal(s: string): string[] {
  const out: string[] = [];
  let i = 0;
  const str = s;
  while (i < str.length) {
    while (i < str.length && /\s/.test((str[i] != null ? str[i] : ''))) {
      i += 1;
    }
    if (i >= str.length) {
      break;
    }
    if (str[i] !== '<') {
      break;
    }
    const start = i;
    let depth = 0;
    let j = i;
    while (j < str.length) {
      if (str[j] === '<') {
        if (str.startsWith('<!--', j)) {
          const end = str.indexOf('-->', j + 4);
          j = end < 0 ? str.length : end + 3;
          continue;
        }
        if (str.startsWith('<![CDATA[', j)) {
          const end = str.indexOf(']]>', j + 9);
          j = end < 0 ? str.length : end + 3;
          continue;
        }
        const next = str[j + 1];
        if (next === '/') {
          depth -= 1;
          const gt = str.indexOf('>', j);
          j = gt < 0 ? str.length : gt + 1;
          if (depth === 0) {
            break;
          }
          continue;
        }
        const gt = str.indexOf('>', j);
        if (gt < 0) {
          j = str.length;
          break;
        }
        const openTag = str.slice(j, gt + 1);
        const selfClose = openTag.endsWith('/>');
        if (!selfClose) {
          depth += 1;
        }
        j = gt + 1;
        if (selfClose && depth === 0) {
          break;
        }
        continue;
      }
      j += 1;
    }
    out.push(str.slice(start, j));
    i = j;
  }
  return out;
}

