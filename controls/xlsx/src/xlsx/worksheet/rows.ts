/** Sparse worksheet row properties (`CT_Row/@ht` and `@customHeight`).
 *
 * Citations: ECMA-376-1 §18.3.1.73 `row`; transitional sml.xsd `CT_Row`.
 * Public authoring uses {@link import('../workbook/worksheet').Worksheet.setRowHeight} /
 * {@link import('../workbook/worksheet').Worksheet.getRowHeight} only.
 * Enumeration of explicit row records is internal.
 *
 * @private
 */

import { InvalidArgumentError } from '../core/errors';
import { attrsToXmlExcluding, parseAttrMap } from '../core/xml/minimal-xml';

/**
 * Snapshot of one explicit row property record.
 * @private
 */
export interface RowProperties {
  /** 1-based worksheet row index. */
  readonly index: number;
  /** Explicit row height in points, when present. */
  readonly height: number | undefined;
  /** Whether `customHeight` was explicitly authored. */
  readonly customHeight: boolean;
}

/**
 * Sparse collection of explicit row property records.
 * @private
 */
export interface Rows {
  /** Number of explicit row records with public height/customHeight. */
  readonly count: number;
  /** Snapshot of explicit row records in author order. */
  list(): ReadonlyArray<RowProperties>;
}

/** @private */
export interface RowEntry {
  readonly index: number;
  readonly height: number | undefined;
  readonly customHeight: boolean | undefined;
  readonly hidden: boolean | undefined;
  readonly hiddenHeight: number | undefined;
  /** `CT_Row/@s`. Applied only when `customFormat` is true. */
  readonly styleIndex: number | undefined;
  /** `CT_Row/@customFormat`. Absent means the schema default (false). */
  readonly customFormat: boolean | undefined;
  readonly extraAttrsXml: string;
}

/** @private */
export interface RowsModel {
  readonly entries: ReadonlyArray<RowEntry>;
}

/** @private */
export interface RowsHost {
  markDirty(): void;
}

/** @private */
export class RowsImpl implements Rows {
  private readonly entries: RowEntry[] = [];
  private host: RowsHost | undefined;

  public constructor(initial?: ReadonlyArray<RowEntry>) {
    if (initial !== undefined) for (const entry of initial) this.entries.push({ ...entry });
  }

  public bindHost(host: RowsHost): void { this.host = host; }
  public get count(): number {
    return this.entries.filter((entry) => hasPublicProperties(entry)).length;
  }
  public list(): ReadonlyArray<RowProperties> {
    return this.entries.filter(hasPublicProperties).map((entry) => ({
      index: entry.index,
      height: entry.height,
      customHeight: entry.customHeight === true,
    }));
  }

  public replaceFromParse(model: RowsModel | undefined): void {
    this.entries.length = 0;
    if (model !== undefined) for (const entry of model.entries) this.entries.push({ ...entry });
  }

  public toModel(): RowsModel { return { entries: this.entries.map((entry) => ({ ...entry })) }; }

  /**
   * Highest 1-based row covered by an authored row record, or `0` when none.
   *
   * Height, `customHeight`, and `hidden` all count. A row that exists only
   * because it holds cells is not in this store. Does not allocate cells.
   *
   * Citation: ECMA-376-1 §18.3.1.73 `row` (`ht`, `customHeight`, `hidden`).
   * @private
   */
  public maxAuthoredIndex(): number {
    let max = 0;
    for (const entry of this.entries) {
      if (!rowEntryExtendsUsedRange(entry)) {
        continue;
      }
      if (entry.index > max) {
        max = entry.index;
      }
    }
    return max;
  }

  /**
   * Row xf when `CT_Row/@customFormat` is true and `@s` is present.
   *
   * ECMA-376-1 §18.3.1.73: `s` is applied only if `customFormat` is `1`.
   * Absent `customFormat` (schema default false) does not apply the row style.
   * Does not allocate cells.
   *
   * @private
   */
  public getRowStyleIndex(index: number): number | undefined {
    assertRowIndex(index);
    const entry = this.entries.find((candidate) => candidate.index === index);
    if (entry === undefined) {
      return undefined;
    }
    if (entry.customFormat !== true || entry.styleIndex === undefined) {
      return undefined;
    }
    return entry.styleIndex;
  }

  public getRowHeight(index: number): number {
    assertRowIndex(index);
    return ((__t) => __t != null ? __t : (0))(((__t) => __t == null ? undefined : __t.height)(this.entries.find((entry) => entry.index === index)));
  }

  public setRowHeight(index: number, height: number): void {
    assertRowIndex(index);
    assertRowHeight(height);
    const existing = this.entries.findIndex((entry) => entry.index === index);
    if (existing >= 0) {
      const prev = this.entries[existing];
      if (prev === undefined) {
        return;
      }
      if (prev.height === height && prev.customHeight === true) {
        return;
      }
      // Update both live height and snapshot when hidden
      const newHiddenHeight = prev.hidden === true ? height : prev.hiddenHeight;
      const next: RowEntry = {
        index,
        height,
        customHeight: true,
        hidden: prev.hidden,
        hiddenHeight: newHiddenHeight,
        styleIndex: prev.styleIndex,
        customFormat: prev.customFormat,
        extraAttrsXml: prev.extraAttrsXml,
      };
      this.entries[existing] = next;
    } else {
      const next: RowEntry = {
        index,
        height,
        customHeight: true,
        hidden: undefined,
        hiddenHeight: undefined,
        styleIndex: undefined,
        customFormat: undefined,
        extraAttrsXml: '',
      };
      this.entries.push(next);
    }
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Whether a 1-based row is hidden (`CT_Row/@hidden="1"`).
   * @private
   */
  public isRowHidden(index: number): boolean {
    assertRowIndex(index);
    const entry = this.entries.find((e) => e.index === index);
    return entry !== undefined && entry.hidden === true;
  }

  /**
   * Set row hidden flag. When hiding, snapshots the current height.
   * When showing, restores the snapshot and sets customHeight.
   * @private
   */
  public setRowHidden(index: number, hidden: boolean): void {
    assertRowIndex(index);
    if (typeof hidden !== 'boolean') {
      throw new InvalidArgumentError('Hidden must be a boolean');
    }

    const existing = this.entries.findIndex((entry) => entry.index === index);

    if (existing >= 0) {
      const entry = this.entries[existing];
      if (entry === undefined) {
        return;
      }

      let newHidden: boolean | undefined;
      let newHiddenHeight: number | undefined;

      if (hidden) {
        // Hide: snapshot height if no snapshot exists
        newHidden = true;
        newHiddenHeight = entry.hiddenHeight === undefined ? entry.height : entry.hiddenHeight;
      } else {
        // Show: restore snapshot
        newHidden = undefined;
        newHiddenHeight = undefined;
        const snapshot = entry.hiddenHeight !== undefined ? entry.hiddenHeight : entry.height;
        if (snapshot !== undefined) {
          this.entries[existing] = {
            ...entry,
            height: snapshot,
            customHeight: true,
            hidden: newHidden,
            hiddenHeight: newHiddenHeight,
          };
          (this.host == null ? undefined : this.host.markDirty());
          return;
        }
      }

      this.entries[existing] = {
        ...entry,
        hidden: newHidden,
        hiddenHeight: newHiddenHeight,
      };
      (this.host == null ? undefined : this.host.markDirty());
      return;
    }

    // Create new entry
    const next: RowEntry = {
      index,
      height: undefined,
      customHeight: undefined,
      hidden: hidden ? true : undefined,
      hiddenHeight: undefined,
      styleIndex: undefined,
      customFormat: undefined,
      extraAttrsXml: '',
    };
    this.entries.push(next);
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Stored unhide height for a 1-based row, or `0` when no snapshot.
   * @private
   */
  public getRowHiddenHeight(index: number): number {
    assertRowIndex(index);
    const entry = this.entries.find((e) => e.index === index);
    return entry !== undefined && entry.hiddenHeight !== undefined ? entry.hiddenHeight : 0;
  }

  /**
   * Set stored unhide height. If row is hidden, updates live height too.
   * @private
   */
  public setRowHiddenHeight(index: number, height: number): void {
    assertRowIndex(index);
    assertRowHeight(height);

    const existing = this.entries.findIndex((entry) => entry.index === index);

    if (existing >= 0) {
      const entry = this.entries[existing];
      if (entry === undefined) {
        return;
      }

      // If hidden, update live height to match the new snapshot
      const newHeight = entry.hidden === true ? height : entry.height;

      this.entries[existing] = {
        ...entry,
        height: newHeight,
        hiddenHeight: height,
      };
      (this.host == null ? undefined : this.host.markDirty());
      return;
    }

    // Create new entry
    const next: RowEntry = {
      index,
      height: undefined,
      customHeight: undefined,
      hidden: undefined,
      hiddenHeight: height,
      styleIndex: undefined,
      customFormat: undefined,
      extraAttrsXml: '',
    };
    this.entries.push(next);
    (this.host == null ? undefined : this.host.markDirty());
  }

  /**
   * Whether a 1-based row has the explicit custom height flag.
   * @private
   */
  public hasCustomRowHeight(index: number): boolean {
    assertRowIndex(index);
    const entry = this.entries.find((e) => e.index === index);
    return entry !== undefined && entry.customHeight === true;
  }

  /**
   * Set the custom height flag on a row without changing the stored height.
   * @private
   */
  public setCustomRowHeight(index: number, custom: boolean): void {
    assertRowIndex(index);
    if (typeof custom !== 'boolean') {
      throw new InvalidArgumentError('Custom height must be a boolean');
    }

    const existing = this.entries.findIndex((entry) => entry.index === index);

    if (existing >= 0) {
      const entry = this.entries[existing];
      if (entry === undefined) {
        return;
      }

      if (entry.customHeight === custom) {
        return;
      }

      this.entries[existing] = {
        ...entry,
        customHeight: custom,
      };
      (this.host == null ? undefined : this.host.markDirty());
      return;
    }

    // Create new entry
    const next: RowEntry = {
      index,
      height: undefined,
      customHeight: custom,
      hidden: undefined,
      hiddenHeight: undefined,
      styleIndex: undefined,
      customFormat: undefined,
      extraAttrsXml: '',
    };
    this.entries.push(next);
    (this.host == null ? undefined : this.host.markDirty());
  }
}

/**
 * Parse `CT_Row` attributes into a sparse row entry.
 *
 * Treats `hidden="1"` independently of height. Stores unhide height in `hiddenHeight`.
 * The `hidden` flag is kept and emitted.
 *
 * @private
 */
export function parseRowEntry(index: number, attrs: Map<string, string>): RowEntry {
  const rawHeight = attrs.get('ht');
  const parsedHeight =
    rawHeight === undefined || rawHeight === '' ? undefined : Number(rawHeight);
  const finiteHeight =
    parsedHeight !== undefined && Number.isFinite(parsedHeight) && parsedHeight >= 0
      ? parsedHeight
      : undefined;
  const customRaw = attrs.get('customHeight');
  const hiddenRaw = attrs.get('hidden');
  const isHidden =
    hiddenRaw === '1' ||
    hiddenRaw === 'true' ||
    hiddenRaw === 'TRUE' ||
    hiddenRaw === 'True';
  // Parse hidden independently of height. Height 0 is a stored size, not hide.
  const height = finiteHeight;
  // Store unhide height: use the height when hidden, or undefined if hidden-only.
  const hiddenHeight = isHidden ? finiteHeight : undefined;
  const formatRaw = attrs.get('customFormat');
  const customFormat =
    formatRaw === undefined
      ? undefined
      : formatRaw === '1' || formatRaw === 'true' || formatRaw === 'TRUE' || formatRaw === 'True';
  const styleRaw = attrs.get('s');
  const styleParsed = styleRaw === undefined ? undefined : Number(styleRaw.trim());
  const styleIndex =
    styleParsed !== undefined && Number.isInteger(styleParsed) && styleParsed >= 0
      ? styleParsed
      : undefined;
  return {
    index,
    height,
    hidden: isHidden ? true : undefined,
    hiddenHeight,
    customHeight:
      customRaw === undefined
        ? undefined
        : customRaw === '1' || customRaw === 'true',
    styleIndex,
    customFormat,
    extraAttrsXml: attrsToXmlExcluding(
      attrs,
      new Set(['r', 'spans', 'ht', 'customHeight', 'hidden', 's', 'customFormat']),
    ),
  };
}

function assertRowIndex(index: number): void {
  if (!Number.isInteger(index) || index < 1) throw new InvalidArgumentError('Row index must be an integer >= 1');
}

function assertRowHeight(height: number): void {
  if (!Number.isFinite(height) || height < 0) throw new InvalidArgumentError('Row height must be a finite number >= 0');
}

function hasPublicProperties(entry: RowEntry): boolean {
  return entry.height !== undefined || entry.customHeight === true || entry.hidden === true
    || entry.customFormat === true;
}

function rowEntryHasResidue(entry: RowEntry): boolean {
  return hasPublicProperties(entry)
    || entry.hiddenHeight !== undefined
    || entry.styleIndex !== undefined
    || entry.customFormat !== undefined
    || entry.extraAttrsXml.trim().length > 0;
}

/**
 * A parsed `row` record extends used range when it carries height, customHeight,
 * hidden, or a custom row style. Empty structural rows do not.
 */
function rowEntryExtendsUsedRange(entry: RowEntry): boolean {
  if (hasPublicProperties(entry)) {
    return true;
  }
  return entry.styleIndex !== undefined;
}

/**
 * Serialize a row entry to `row` element attributes.
 * @private
 */
export function serializeRowAttrs(entry: RowEntry): string {
  const attrs: string[] = [`r="${entry.index}"`];
  if (entry.height !== undefined) {
    attrs.push(`ht="${entry.height}"`);
  }
  if (entry.customHeight === true) {
    attrs.push('customHeight="1"');
  } else if (entry.customHeight === false) {
    attrs.push('customHeight="0"');
  }
  if (entry.hidden === true) {
    attrs.push('hidden="1"');
  }
  return attrs.join(' ');
}

