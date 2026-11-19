/**
 * Public Workbook façade over internal {@link OpcPackage}.
 *
 * Async `load` / `save` align with package I/O. Sync `create()` seeds
 * an in-memory package via {@link OpcPackage.createFromParts} (Transitional
 * SpreadsheetML only).
 *
 * Public sheet surface (API-RULES R1.5 — one name per concept):
 * `load`, `worksheets`, `sheet` / `firstSheet` / `lastSheet` / `activeSheet` /
 * `activeSheetIndex`,
 * `addSheet` / `removeSheet` / `moveSheet`, `names`.
 *
 * Citations: `docs/specs/workbook-model.md`, transitional `sml.xsd` CT_Workbook.
 */

import { validateLicense } from '@syncfusion/ej2-base';
import { Font } from '../cell/rich-text';
import { decryptPackage, encryptPackage, isEncryptedContainer, MAX_PASSWORD_LENGTH } from '../core/encryption/office-crypto';
import { InvalidArgumentError, InvalidPasswordError, InvalidWorkbookError, IoError } from '../core/errors';
import {
  DEFAULT_SHARED_STRINGS_PART_NAME,
  DEFAULT_STYLES_PART_NAME,
  isSharedStringsRelationshipType,
  isStylesRelationshipType,
  isTableRelationshipType,
  isThemeRelationshipType,
  isCustomPropertiesRelationshipType,
  OFFICE_DOCUMENT_REL_TYPE_TRANSITIONAL,
  SHARED_STRINGS_CONTENT_TYPE,
  SHARED_STRINGS_REL_TYPE_TRANSITIONAL,
  STYLES_CONTENT_TYPE,
  STYLES_REL_TYPE_TRANSITIONAL,
  WORKBOOK_CONTENT_TYPE_TRANSITIONAL,
  WORKSHEET_CONTENT_TYPE_TRANSITIONAL,
  WORKSHEET_REL_TYPE_TRANSITIONAL,
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8 } from '../core/xml/minimal-xml';
import { SharedStringTable } from '../shared-strings/shared-string-table';
import { WorkbookStyles } from '../styles/workbook-styles';
import {
  DefinedNamesImpl, DefinedNames,
} from './defined-names';
import {
  DocumentPropertiesImpl,
  maxPackageRelationshipNumber, BuiltInDocumentProperties,
} from './document-properties';
import {
  CustomDocumentPropertiesImpl, CustomDocumentProperties,
} from './custom-document-properties';
import {
  createSheetCollection,
  relativeTargetFromWorkbook, SheetCollection, SheetCollectionHost,
} from './sheet-collection';
import { PersonsStore } from './persons';
import { RichDataStore } from './rich-data-store';
import {
  WorkbookProtectionImpl, WorkbookProtectionInfo, WorkbookProtectionOptions,
} from './workbook-protection';
import {
  emptyWorksheetXml,
  parseWorkbookXml,
  serializeWorkbookXml, WorkbookXmlModel,
} from './workbook-xml';
import { Worksheet, WorksheetCellHost, WorksheetImpl } from './worksheet';
import { PivotStore } from '../pivot/pivot-store';
import { PivotCacheEntry } from '../pivot/pivot-store';
import { PivotCaches } from '../pivot/pivot-types';

const DEFAULT_WORKBOOK_PART = '/xl/workbook.xml';
const DEFAULT_SHEET_PART = '/xl/worksheets/sheet1.xml';

/**
 * Trial-license watermark callback, registered by `license/license-register`.
 *
 * @private
 */
export type LicenseWatermarkApplicator = (workbook: Workbook) => void;

let licenseWatermarkApplicator: LicenseWatermarkApplicator | undefined;

/**
 * Registers the trial-license watermark callback used on save.
 *
 * @param applicator - The applicator.
 * @private
 */
export function setLicenseWatermarkApplicator(applicator: LicenseWatermarkApplicator): void {
  licenseWatermarkApplicator = applicator;
}

/**
 * Represents an Excel workbook containing worksheets, document settings, and
 * workbook-level data, letting you open, edit, and save spreadsheet files
 * programmatically.
 */
export class Workbook {
  private readonly pkg: OpcPackage;
  private readonly workbookPartName: string;
  private readonly sheetsCollection: SheetCollection;
  private readonly definedNamesCollection: DefinedNamesImpl;
  private readonly sst: SharedStringTable;
  private readonly stylesTable: WorkbookStyles;
  private readonly personsStore: PersonsStore;
  private readonly richDataStore: RichDataStore;
  private readonly documentPropertiesImpl: DocumentPropertiesImpl;
  private readonly customDocumentPropertiesImpl: CustomDocumentPropertiesImpl;
  private readonly _protection = new WorkbookProtectionImpl();
  private _date1904: boolean;
  /** Open password applied on save (file-level encryption); `undefined` = not encrypted. */
  private _passwordToOpen: string | undefined;
  /**
   * Culture list separator for localized formulas and in-cell dropdown
   * lists. Session setting only — not written to the package. Default `,`.
   */
  private _listSeparator: ',' | ';' = ',';
  /** True when original workbook.xml had a workbookPr element (even empty). */
  private hasWorkbookPr: boolean;
  private workbookPrExtraAttrsXml: string | undefined;
  private preserveChildrenXml: string[];
  private rootExtraxmlnsXml: string;
  private dirty: boolean;
  private maxSheetId: number;
  private maxRelNum: number;
  /** Highest rIdN among package-level relationships (`/_rels/.rels`). */
  private maxPackageRelNum: number;
  private nextSheetPartIndex: number;
  private nextTablePartIndex: number;
  private maxTableId: number;
  private readonly pivotStore: PivotStore;
  /** `pivotCaches` entries produced by the last pivot flush. */
  private pivotCacheEntries: PivotCacheEntry[] = [];
  /**
  * Zero-based active sheet index for this session and the saved workbook view.
   */
  private _activeSheetIndex = 0;

  private constructor(
    pkg: OpcPackage,
    workbookPartName: string,
    model: WorkbookXmlModel,
    sheets: SheetCollection,
    definedNames: DefinedNamesImpl,
    sst: SharedStringTable,
    stylesTable: WorkbookStyles,
    personsStore: PersonsStore,
    documentProperties: DocumentPropertiesImpl,
    maxSheetId: number,
    maxRelNum: number,
    maxPackageRelNum: number,
    nextSheetPartIndex: number,
    nextTablePartIndex: number,
    maxTableId: number,
  ) {
    this.pkg = pkg;
    this.workbookPartName = workbookPartName;
    this.sheetsCollection = sheets;
    this.definedNamesCollection = definedNames;
    this.sst = sst;
    this.stylesTable = stylesTable;
    this.personsStore = personsStore;
    this.richDataStore = new RichDataStore(pkg);
    this.documentPropertiesImpl = documentProperties;
    
    // Phase 2: Load custom properties from package
    let customPropsRelId: string | undefined;
    for (const rel of pkg.getRelationships(null)) {
      if (isCustomPropertiesRelationshipType(rel.type)) {
        customPropsRelId = rel.id;
        break;
      }
    }
    this.customDocumentPropertiesImpl = CustomDocumentPropertiesImpl.fromPackage(
      pkg,
      customPropsRelId
    );
    
    // Bind dirty tracking for custom properties
    this.customDocumentPropertiesImpl.setDirtyCallback(() => {
      this.markDirty();
    });
    
    this._date1904 = model.date1904;
    this.hasWorkbookPr = model.hasWorkbookPr;
    this.workbookPrExtraAttrsXml = model.workbookPrExtraAttrsXml;
    this.preserveChildrenXml = [...model.preserveChildrenXml];
    this.rootExtraxmlnsXml = model.rootExtraxmlnsXml;
    this.dirty = false;
    this.maxSheetId = maxSheetId;
    this.maxRelNum = maxRelNum;
    this.maxPackageRelNum = maxPackageRelNum;
    this.nextSheetPartIndex = nextSheetPartIndex;
    this.nextTablePartIndex = nextTablePartIndex;
    this.maxTableId = maxTableId;
    this._activeSheetIndex = clampSheetIndex(model.activeTab, sheets.length);
    this._protection.bindHost({
      markDirty: () => {
        this.markDirty();
      },
    });
    if (model.workbookProtection !== undefined) {
      this._protection.replaceFromParse(model.workbookProtection);
    }
    this.definedNamesCollection.bindHost({
      markDirty: () => {
        this.markDirty();
      },
      sheetCount: () => this.sheetsCollection.length,
    });
    this.pivotStore = new PivotStore(
      {
        package: pkg,
        workbookPartName,
        markDirty: () => {
          this.markDirty();
        },
        allocateWorkbookRelationshipId: () => this.allocateRelationshipId(),
        styles: () => this.stylesTable,
        worksheets: () => this.worksheetImpls(),
        preservedMaxCacheId: () => maxPreservedCacheId(this.preserveChildrenXml),
        dropPreservedCache: (cacheId: number) => {
          this.preserveChildrenXml = dropPivotCacheEntry(this.preserveChildrenXml, cacheId);
          this.markDirty();
        },
      },
      {
        markDirty: () => {
          this.markDirty();
        },
        containsSheet: (sheet: WorksheetImpl) => this.worksheetImpls().indexOf(sheet) >= 0,
      },
    );
    this.documentPropertiesImpl.bindHost({
      markDirty: () => {
        this.markDirty();
      },
    });
  }

  /**
   * Open an existing workbook from the bytes of an `.xlsx` file.
   *
   * Formulas are stored as written and never evaluated; external links are
   * not resolved.
   *
   * Password-protected (encrypted) files are decrypted when `password` is
   * given. A decrypted workbook keeps its open password, so saving it again
   * re-encrypts it; clear {@link Workbook.passwordToOpen} to save it
   * unencrypted. `password` is ignored for files that are not encrypted.
   *
   * @param data - The bytes of the workbook file to open.
   * @param password - Open password for an encrypted workbook.
   * @returns the opened workbook, ready to read or edit.
   * @throws InvalidPasswordError when the file is encrypted and the password is missing or wrong
   * @throws UnsupportedEncryptionError when the file uses an encryption scheme this library cannot read
   */
  public static async open(data: Uint8Array | ArrayBuffer, password?: string): Promise<Workbook>;
  /**
   * Open an existing workbook from a filesystem path (Node.js).
   *
   * Formulas are stored as written and never evaluated; external links are
   * not resolved. Path open requires the Node.js `fs` module and is not
   * available in browsers — read the file yourself and pass
   * `Uint8Array` / `ArrayBuffer` there.
   *
   * Password-protected (encrypted) files are decrypted when `password` is
   * given; see {@link Workbook.open} for the byte-array overload.
   *
   * @param filePath - Absolute or relative path to an `.xlsx` file (for
   * example `D:\\Input.xlsx` or `./data/report.xlsx`).
   * @param password - Open password for an encrypted workbook.
   * @returns the opened workbook, ready to read or edit.
   * @throws InvalidArgumentError when `filePath` is missing or empty
   * @throws IoError when the file cannot be read
   * @throws InvalidPasswordError when the file is encrypted and the password is missing or wrong
   */
  public static async open(filePath: string, password?: string): Promise<Workbook>;
  public static async open(dataOrPath: Uint8Array | ArrayBuffer | string, password?: string): Promise<Workbook> {
    if (password !== undefined && password !== null && typeof password !== 'string') {
      throw new InvalidArgumentError('password must be a string');
    }
    let data: Uint8Array | ArrayBuffer =
      typeof dataOrPath === 'string' ? await readWorkbookFromPath(dataOrPath) : dataOrPath;
    let appliedPassword: string | undefined;
    const view: Uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data);
    if (isEncryptedContainer(view)) {
      data = decryptPackage(view, password === null ? undefined : password);
      appliedPassword = password === null || password === '' ? undefined : password;
    }
    const pkg = await OpcPackage.open(data);
    const workbook = Workbook.fromPackage(pkg);
    workbook._passwordToOpen = appliedPassword;
    return workbook;
  }

  /**
   * Create a new, empty workbook with one visible sheet named `Sheet1`.
   *
   * @returns the new workbook.
   */
  public static create(): Workbook {
    const workbookXml = serializeWorkbookXml({
      date1904: false,
      hasWorkbookPr: false,
      workbookProtection: undefined,
      sheets: [
        {
          name: 'Sheet1',
          sheetId: 1,
          relId: 'rId1',
          state: 'visible',
          extraAttrsXml: '',
        },
      ],
      definedNames: [],
      preserveChildrenXml: [],
      rootExtraxmlnsXml: '',
      workbookPrExtraAttrsXml: undefined,
      activeTab: 0,
    });
    const sheetXml = encodeUtf8(emptyWorksheetXml());

    const pkg = OpcPackage.createFromParts({
      parts: [
        {
          name: DEFAULT_WORKBOOK_PART,
          data: workbookXml,
          contentType: WORKBOOK_CONTENT_TYPE_TRANSITIONAL,
        },
        {
          name: DEFAULT_SHEET_PART,
          data: sheetXml,
          contentType: WORKSHEET_CONTENT_TYPE_TRANSITIONAL,
        },
      ],
      relationshipSets: [
        {
          source: null,
          relationships: [
            {
              id: 'rId1',
              type: OFFICE_DOCUMENT_REL_TYPE_TRANSITIONAL,
              target: 'xl/workbook.xml',
              resolvedTarget: DEFAULT_WORKBOOK_PART,
            },
          ],
        },
        {
          source: DEFAULT_WORKBOOK_PART,
          relationships: [
            {
              id: 'rId1',
              type: WORKSHEET_REL_TYPE_TRANSITIONAL,
              target: 'worksheets/sheet1.xml',
              resolvedTarget: DEFAULT_SHEET_PART,
            },
          ],
        },
      ],
    });

    const wb = Workbook.fromPackage(pkg);
    wb.dirty = true;
    return wb;
  }

  /**
   * The worksheets in the workbook, in tab order. Each read returns a fresh
   * snapshot; add sheets with {@link addSheet} and remove them with
   * {@link removeSheet}.
   */
  public get worksheets(): ReadonlyArray<Worksheet> {
    return [...this.sheetsCollection];
  }

  /**
   * The workbook's defined names (named ranges).
   *
   * Add a name with {@link DefinedNames.add}, look one up with
   * {@link DefinedNames.get}.
   */
  public get names(): DefinedNames {
    return this.definedNamesCollection;
  }

  /**
   * Get a sheet by its zero-based position or its name (not case
   * sensitive).
   *
   * @param nameOrIndex - The sheet's name, like `'Sales'`, or its
   *   zero-based position.
   * @returns the matching sheet.
   * @throws RangeError when a numeric index is out of bounds
   * @throws InvalidArgumentError when name is not found
   */
  public sheet(nameOrIndex: string | number): Worksheet {
    if (typeof nameOrIndex === 'number') {
      return this.sheetsCollection.get(nameOrIndex);
    }
    const found = this.sheetsCollection.getByName(nameOrIndex);
    if (found === undefined) {
      throw new InvalidArgumentError(`Sheet "${nameOrIndex}" was not found`);
    }
    return found;
  }

  /** @private
   * First sheet in workbook order.
   * @throws RangeError when the workbook has no sheets
   */
  public get firstSheet(): Worksheet {
    return this.sheetsCollection.get(0);
  }

  /** @private
   * Last sheet in workbook order.
   * @throws RangeError when the workbook has no sheets
   */
  public get lastSheet(): Worksheet {
    const last = this.sheetsCollection.length - 1;
    return this.sheetsCollection.get(last);
  }

  /**
   * The sheet that is currently active — the one Excel shows when the
   * workbook opens. Assign a sheet to make it active.
   *
   * @throws RangeError when setting a sheet that is not part of this
   *   workbook
   */
  public get activeSheet(): Worksheet {
    const index = this.clampActiveSheetIndex(this._activeSheetIndex);
    return this.sheetsCollection.get(index);
  }

  /**
   * Set the sheet shown as active when the workbook opens.
   * @throws RangeError when the sheet is not part of this workbook
   */
  public set activeSheet(sheet: Worksheet) {
    const length = this.sheetsCollection.length;
    for (let i = 0; i < length; i += 1) {
      if (this.sheetsCollection.get(i) === sheet) {
        this._activeSheetIndex = i;
        return;
      }
    }
    throw new RangeError('Sheet is not part of this workbook');
  }

  /**
   * Zero-based index of {@link activeSheet} (`workbookView@activeTab`).
   * Assign an index in `0 .. sheetCount - 1` to change the sheet Excel shows
   * on open. Same field as {@link activeSheet}.
   *
   * @throws RangeError when the index is not an integer in range
   */
  public get activeSheetIndex(): number {
    return this.clampActiveSheetIndex(this._activeSheetIndex);
  }

  public set activeSheetIndex(index: number) {
    const length = this.sheetsCollection.length;
    if (!Number.isInteger(index) || index < 0 || index >= length) {
      throw new RangeError('Active sheet index is out of range');
    }
    this._activeSheetIndex = index;
  }

  /**
   * Add a new, visible worksheet at the end of the workbook.
   *
   * @param name - The new sheet's name. Omit it to use the next available
   *   `Sheet2`, `Sheet3`, … name.
   * @returns the newly created sheet.
   */
  public addSheet(name?: string): Worksheet {
    return this.sheetsCollection.add(name);
  }

  /**
   * Remove a sheet from the workbook. The last remaining sheet cannot be
   * removed — a workbook must always have at least one.
   *
   * @param sheet - The sheet to remove.
   * @throws LastSheetError when this is the only sheet
   * @throws RangeError when the sheet is not part of this workbook
   */
  public removeSheet(sheet: Worksheet): void {
    const length = this.sheetsCollection.length;
    let deletedIndex = -1;
    for (let i = 0; i < length; i += 1) {
      if (this.sheetsCollection.get(i) === sheet) {
        deletedIndex = i;
        break;
      }
    }
    this.sheetsCollection.remove(sheet);
    if (deletedIndex < 0) {
      return;
    }
    // Shift session active index when a sheet before/at active is removed.
    if (this._activeSheetIndex > deletedIndex) {
      this._activeSheetIndex -= 1;
    } else if (this._activeSheetIndex === deletedIndex) {
      // Prefer the sheet that slid into this slot; clamp if we removed the last.
      this._activeSheetIndex = this.clampActiveSheetIndex(deletedIndex);
    } else {
      this._activeSheetIndex = this.clampActiveSheetIndex(this._activeSheetIndex);
    }
  }

  /**
   * Move a sheet to a different position, changing its place in the tab
   * order.
   *
   * @param fromIndex - The sheet's current zero-based position.
   * @param toIndex - The zero-based position to move it to.
   * @throws RangeError when either index is out of range
   */
  public moveSheet(fromIndex: number, toIndex: number): void {
    this.sheetsCollection.move(fromIndex, toIndex);
    // Keep session active sheet identity stable across reorder.
    const active = this._activeSheetIndex;
    if (fromIndex === active) {
      this._activeSheetIndex = toIndex;
    } else if (fromIndex < active && toIndex >= active) {
      this._activeSheetIndex = active - 1;
    } else if (fromIndex > active && toIndex <= active) {
      this._activeSheetIndex = active + 1;
    }
  }

  /**
   * Whether the workbook uses the 1904 date system (as Excel on Mac
   * historically did) instead of the usual 1900 system. Affects how dates
   * are stored as serial numbers. Default `false`.
   */
  public get date1904(): boolean {
    return this._date1904;
  }

  public set date1904(value: boolean) {
    if (this._date1904 !== value) {
      this._date1904 = value;
      this.dirty = true;
    }
  }

  /**
   * Culture list separator for localized formulas and in-cell dropdown lists.
   * A session setting only — it is not written to the package. Default `,`.
   * Only `,` and `;` are accepted.
   */
  public get listSeparator(): ',' | ';' {
    return this._listSeparator;
  }

  public set listSeparator(value: ',' | ';') {
    if (value !== ',' && value !== ';') {
      throw new InvalidArgumentError('listSeparator must be "," or ";"');
    }
    this._listSeparator = value;
  }

  /**
   * The workbook's built-in document properties — title, subject, author,
   * and other file details shown in Excel's file info.
   */
  public get builtInDocumentProperties(): BuiltInDocumentProperties {
    return this.documentPropertiesImpl;
  }

  /**
   * The workbook's custom document properties — arbitrary named metadata
   * such as project codes, client IDs, and other application-specific
   * information.
   *
   * @example
   * ```typescript
   * workbook.customDocumentProperties.add('ClientID', 'ACME-001');
   * workbook.customDocumentProperties.add('ProjectCode', 'P-2025-001');
   * const clientId = workbook.customDocumentProperties.get('ClientID')?.value;
   * ```
   */
  public get customDocumentProperties(): CustomDocumentProperties {
    return this.customDocumentPropertiesImpl;
  }

  /**
   * The workbook's author.
   *
   * A shortcut for `{@link builtInDocumentProperties}.author`. Assign
   * `undefined` to clear it.
   */
  public get author(): string | undefined | null {
    return this.documentPropertiesImpl.author;
  }

  public set author(value: string | undefined | null) {
    this.documentPropertiesImpl.author = value;
  }

  /**
   * The workbook's styles table — its fonts, fills, borders, and number
   * formats. Style authoring is normally done per cell via
   * `cell.style` / `cell.numberFormat`; this handle is for advanced work.
   *
   * @private Entire `WorkbookStyles` surface is internal (stripped from the
   * shipped package `.d.ts`). Prefer `cell.style` / `cell.numberFormat`.
   */
  public get styles(): WorkbookStyles {
    return this.stylesTable;
  }

  /**
   * Create a font you can apply to part of a cell’s rich text.
   *
   * Set properties on the returned font, then assign it with
   * `cell.richText.characters(start, end).font = font`.
   * This does not create a shared style-table font.
   */
  public createFont(): Font {
    return new Font();
  }

  /**
   * `true` when workbook structure and/or windows are protected.
   */
  public get isProtected(): boolean {
    return this._protection.isProtected;
  }

  /**
   * Current workbook protection settings, or `undefined` when not protected.
   */
  public get workbookProtection(): WorkbookProtectionInfo | undefined {
    return this._protection.workbookProtection;
  }

  /**
   * Protect the workbook structure and/or windows (not file encryption).
   *
   * @param password - Optional password required to unprotect later.
   * @param options - What to lock; defaults lock structure only.
   */
  public protect(password?: string, options?: WorkbookProtectionOptions): void {
    this._protection.protect(password, options);
  }

  /**
   * Turn off workbook structure/windows protection.
   *
   * @param password - Required when the workbook was protected with a password.
   */
  public unprotect(password?: string): void {
    this._protection.unprotect(password);
  }

  /**
   * Password required to open the saved file, or `undefined` when the file is
   * not encrypted. Mirrors the XlsIO `PasswordToOpen` property.
   *
   * Setting a password encrypts the whole file on {@link Workbook.save} (ECMA-376
   * Agile encryption: AES-256, SHA-512). Setting `undefined`, `null`, or an empty
   * string removes file encryption. A workbook opened with a password keeps it,
   * so saving re-encrypts; this is separate from {@link Workbook.protect}, which
   * only locks structure.
   *
   * @throws InvalidPasswordError when set to a password longer than 255 characters
   */
  public get passwordToOpen(): string | undefined {
    return this._passwordToOpen;
  }

  public set passwordToOpen(value: string | undefined) {
    if (value === undefined || value === null || value === '') {
      this._passwordToOpen = undefined;
      return;
    }
    if (typeof value !== 'string' || value.length > MAX_PASSWORD_LENGTH) {
      throw new InvalidPasswordError(`The open password must be 1 to ${MAX_PASSWORD_LENGTH} characters long`);
    }
    this._passwordToOpen = value;
  }

  /**
   * Internal shared string table (cells wire in TASK-1105).
   * @private
   */
  public get sharedStrings(): SharedStringTable {
    return this.sst;
  }

  /**
   * Write the workbook back into `.xlsx` file bytes, applying every change
   * made to its sheets, tables, styles, names, and properties. When
   * {@link Workbook.passwordToOpen} is set the bytes are an encrypted file.
   *
   * @returns the bytes of the saved workbook file.
   */
  public async save(): Promise<Uint8Array>;
  /**
   * Save the workbook to a filesystem path (Node.js), applying every change
   * made to its sheets, tables, styles, names, and properties.
   *
   * The parent directory must already exist. Path save requires the Node.js
   * `fs` module and is not available in browsers — use parameterless
   * {@link Workbook.save} and write the returned bytes yourself there.
   *
   * @param filePath - Absolute or relative destination path (for example
   * `D:\\Output.xlsx` or `./out/report.xlsx`).
   * @throws InvalidArgumentError when `filePath` is missing or empty
   * @throws IoError when the file cannot be written
   */
  public async save(filePath: string): Promise<void>;
  public async save(filePath?: string): Promise<Uint8Array | void> {
    // Same gate as ej2-docx document.save. The applicator is registered by
    // license/license-register (side-effect import) to avoid a value cycle.
    if (!validateLicense('xlsx') && licenseWatermarkApplicator !== undefined) {
      licenseWatermarkApplicator(this);
    }
    this.richDataStore.prepare(this.worksheetImpls());
    this.flushWorksheets({ withTables: true });
    this.flushPivots();
    this.flushPersons();
    this.flushRichData();
    this.flushSharedStrings();
    this.flushStyles();
    this.flushWorkbookXml();
    this.flushDocumentProperties();
    this.flushCustomDocumentProperties(); // Phase 2: Flush custom properties
    const packageBytes = await this.pkg.save();
    const bytes =
      this._passwordToOpen === undefined ? packageBytes : encryptPackage(packageBytes, this._passwordToOpen);
    if (filePath === undefined) {
      return bytes;
    }
    await writeWorkbookToPath(filePath, bytes);
  }

  /**
   * Sheet removed at zero-based index — drop local names and reindex higher ids.
   * @private
   */
  public onSheetRemoved(deletedIndex: number): void {
    this.definedNamesCollection.onSheetRemoved(deletedIndex);
    if (this.richDataStore.hasData()) {
      this.richDataStore.markDirty();
    }
  }

  /**
   * Sheet reordered — remap defined-name sheetIndex values.
   * @private
   */
  public onSheetMoved(fromIndex: number, toIndex: number): void {
    this.definedNamesCollection.onSheetMoved(fromIndex, toIndex);
  }

  /** @private */
  public markDirty(): void {
    this.dirty = true;
  }

  /**
   * Allocate the next package-level relationship id (`/_rels/.rels`).
   * @private
   */
  public allocatePackageRelationshipId(): string {
    this.maxPackageRelNum += 1;
    return `rId${this.maxPackageRelNum}`;
  }

  /** @private */
  public allocateSheetId(): number {
    this.maxSheetId += 1;
    return this.maxSheetId;
  }

  /** @private */
  public allocateRelationshipId(): string {
    this.maxRelNum += 1;
    return `rId${this.maxRelNum}`;
  }

  /** @private */
  public nextWorksheetPartName(): string {
    const name = `/xl/worksheets/sheet${this.nextSheetPartIndex}.xml`;
    this.nextSheetPartIndex += 1;
    return name;
  }

  /** @private */
  public get package(): OpcPackage {
    return this.pkg;
  }

  /**
   * Cell host shared by worksheets (SST + package access).
   * @private
   */
  public createWorksheetCellHost(): WorksheetCellHost {
    return {
      package: this.pkg,
      sharedStrings: () => this.sst,
      persons: () => this.personsStore,
      richData: () => this.richDataStore,
      styles: () => this.stylesTable,
      date1904: () => this._date1904,
      markDirty: () => {
        this.dirty = true;
      },
      nextTablePartName: () => this.nextTablePartNameInternal(),
      pivotCaches: () => this.pivotStore.caches,
      noteTableId: (id: number) => {
        if (id > this.maxTableId) {
          this.maxTableId = id;
        }
      },
      noteTablePartCount: (count: number) => {
        // Dense flush wrote table1..table{count}; next free index is count+1.
        if (count + 1 > this.nextTablePartIndex) {
          this.nextTablePartIndex = count + 1;
        } else if (count >= 0) {
          // Shrink after middle-remove densify (e.g. was 4, now 2 parts).
          this.nextTablePartIndex = count + 1;
        }
      },
      allocateTableId: () => {
        this.maxTableId += 1;
        return this.maxTableId;
      },
    };
  }

  /** @private */
  private nextTablePartNameInternal(): string {
    const name = `/xl/tables/table${this.nextTablePartIndex}.xml`;
    this.nextTablePartIndex += 1;
    return name;
  }

  private static fromPackage(pkg: OpcPackage): Workbook {
    const workbookPartName = pkg.officeDocumentPartName();
    if (workbookPartName === undefined) {
      throw new InvalidWorkbookError('Package has no officeDocument workbook part');
    }
    const part = pkg.getPart(workbookPartName);
    if (part === undefined) {
      throw new InvalidWorkbookError(`Workbook part "${workbookPartName}" is missing`, {
        partName: workbookPartName,
      });
    }
    const model = parseWorkbookXml(part.data, workbookPartName);
    const rels = pkg.getRelationships(workbookPartName);
    const packageRels = pkg.getRelationships(null);
    const host = createHostState(pkg, workbookPartName);
    const sheets = createSheetCollection(host, model.sheets, rels);
    const definedNames = new DefinedNamesImpl(model.definedNames);
    const sst = loadSharedStringTable(pkg, workbookPartName, rels);
    const personsStore = PersonsStore.loadFromPackage(pkg, workbookPartName, rels);
    const stylesTable = loadStyles(pkg, workbookPartName, rels);
    const documentProperties = DocumentPropertiesImpl.loadFromPackage(pkg);

    let maxSheetId = 0;
    for (const s of model.sheets) {
      if (s.sheetId > maxSheetId) {
        maxSheetId = s.sheetId;
      }
    }
    let maxRelNum = 0;
    for (const r of rels) {
      const m = /^rId(\d+)$/i.exec(r.id);
      if (m !== null && m[1] !== undefined) {
        const n = Number.parseInt(m[1], 10);
        if (n > maxRelNum) {
          maxRelNum = n;
        }
      }
    }
    const maxPackageRelNum = maxPackageRelationshipNumber(packageRels);
    let nextSheetPartIndex = 1;
    for (const r of rels) {
      const m = /sheet(\d+)\.xml$/i.exec(r.resolvedTarget);
      if (m !== null && m[1] !== undefined) {
        const n = Number.parseInt(m[1], 10);
        if (n >= nextSheetPartIndex) {
          nextSheetPartIndex = n + 1;
        }
      }
    }
    // Table part index: scan every worksheet relationship target for
    // `/xl/tables/tableN.xml` and allocate above the max in use.
    let nextTablePartIndex = 1;
    for (const sheetRel of rels) {
      const sheetPart = pkg.getPart(sheetRel.resolvedTarget);
      if (sheetPart === undefined) {
        continue;
      }
      for (const r of pkg.getRelationships(sheetPart.name)) {
        if (!isTableRelationshipType(r.type)) {
          continue;
        }
        const m = /table(\d+)\.xml$/i.exec(r.resolvedTarget);
        if (m !== null && m[1] !== undefined) {
          const n = Number.parseInt(m[1], 10);
          if (n >= nextTablePartIndex) {
            nextTablePartIndex = n + 1;
          }
        }
      }
    }

    const wb = new Workbook(
      pkg,
      workbookPartName,
      model,
      sheets,
      definedNames,
      sst,
      stylesTable,
      personsStore,
      documentProperties,
      maxSheetId,
      maxRelNum,
      maxPackageRelNum,
      nextSheetPartIndex,
      nextTablePartIndex,
      0,
    );
    bindHost(host, wb);
    wb.richDataStore.load(rels);
    bindWorksheetCellHosts(wb, sheets);
    wb.pivotStore.load(wb.preserveChildrenXml);
    return wb;
  }

  /**
   * The pivot caches of this workbook: those read from a file (in file
   * order) followed by those added with `workbook.pivotCaches.add(...)`.
   * A cache the library cannot describe completely (for example one over
   * an external or database source) is kept in the file unchanged and is not
   * listed. The library writes new cache definitions and records and sets the
   * cache to refresh when the file is opened.
   *
   * @example
   * ```ts
   * const cache = workbook.pivotCaches.add(workbook.sheet('Data').range('A1:D100'));
   * ```
   */
  public get pivotCaches(): PivotCaches {
    return this.pivotStore.caches;
  }

  /** Worksheets that are real worksheet implementations, in workbook order. */
  private worksheetImpls(): WorksheetImpl[] {
    const list: WorksheetImpl[] = [];
    for (const sheet of this.sheetsCollection) {
      if (sheet instanceof WorksheetImpl) {
        list.push(sheet);
      }
    }
    return list;
  }

  private flushPivots(): void {
    if (this.pivotStore.isIdle) {
      this.pivotCacheEntries = [];
      return;
    }
    this.pivotCacheEntries = this.pivotStore.flush();
  }

  private flushWorksheets(options?: { readonly withTables?: boolean }): void {
    for (const sheet of this.sheetsCollection) {
      const impl = sheet as WorksheetImpl;
      if ((options == null ? undefined : options.withTables) === true) {
        impl.flushTablesIfDirty();
      }
      impl.flushIfDirty();
    }
  }

  /**
   * Keep session active index inside `[0, length)`.
   * Empty workbooks are not expected after open/create; clamp still avoids OOB.
   */
  private clampActiveSheetIndex(index: number): number {
    const length = this.sheetsCollection.length;
    if (length <= 0) {
      return 0;
    }
    if (index < 0) {
      return 0;
    }
    if (index >= length) {
      return length - 1;
    }
    return index;
  }

  private flushWorkbookXml(): void {
    // Sheet collection marks workbook dirty on structural edits; always rewrite model.
    const protectionModel = this._protection.toModel();
    const model: WorkbookXmlModel = {
      date1904: this._date1904,
      hasWorkbookPr:
        this.hasWorkbookPr ||
        this._date1904 ||
        (this.workbookPrExtraAttrsXml !== undefined && this.workbookPrExtraAttrsXml.length > 0),
      workbookProtection: protectionModel.present ? protectionModel : undefined,
      sheets: this.sheetsCollection.toXmlEntries(),
      definedNames: this.definedNamesCollection.toEntries(),
      preserveChildrenXml: this.preserveChildrenXml,
      rootExtraxmlnsXml: this.rootExtraxmlnsXml,
      workbookPrExtraAttrsXml: this.workbookPrExtraAttrsXml,
      activeTab: this.clampActiveSheetIndex(this._activeSheetIndex),
      pivotCaches: this.pivotCacheEntries,
    };
    const bytes = serializeWorkbookXml(model);
    this.pkg.setPart(this.workbookPartName, bytes, WORKBOOK_CONTENT_TYPE_TRANSITIONAL);
    this.dirty = false;
  }
/**
   * Write the metadata and rich-value parts behind pictures placed in cells,
   * after the worksheets (which carry the cells' `vm`) were written.
   */
  private flushRichData(): void {
    this.richDataStore.write(this.workbookPartName, this.worksheetImpls(), () => this.allocateRelationshipId());
  }

  /**
   * Write workbook persons part used by threaded-comment authors.
   * Materializes after worksheet flush so person rows allocated during sheet
   * mutations are included (API-RULES R5.1).
   */
  private flushPersons(): void {
    this.personsStore.flush(this.pkg, this.workbookPartName, () =>
      this.allocateRelationshipId(),
    );
  }

  
  private flushSharedStrings(): void {
    if (!this.sst.shouldWritePart()) {
      return;
    }

    const partName = (this.sst.sharedStringsPartName != null ? this.sst.sharedStringsPartName : DEFAULT_SHARED_STRINGS_PART_NAME);
    const bytes = this.sst.toPartBytes();
    this.pkg.setPart(partName, bytes, SHARED_STRINGS_CONTENT_TYPE);

    const rels = this.pkg.getRelationships(this.workbookPartName);
    const existing = rels.find((r) => isSharedStringsRelationshipType(r.type));
    if (existing === undefined) {
      const id = this.allocateRelationshipId();
      const target = relativeTargetFromWorkbook(this.workbookPartName, partName);
      const next: OpcRelationship[] = [
        ...rels,
        {
          id,
          type: SHARED_STRINGS_REL_TYPE_TRANSITIONAL,
          target,
          resolvedTarget: partName,
        },
      ];
      this.pkg.setRelationships(this.workbookPartName, next);
    }
  }

  private flushStyles(): void {
    if (!this.stylesTable.shouldWritePart()) {
      return;
    }

    const partName = (this.stylesTable.stylesPartName != null ? this.stylesTable.stylesPartName : DEFAULT_STYLES_PART_NAME);
    this.stylesTable.assignPartName(partName);
    const bytes = this.stylesTable.toPartBytes();
    this.pkg.setPart(partName, bytes, STYLES_CONTENT_TYPE);

    const rels = this.pkg.getRelationships(this.workbookPartName);
    const existing = rels.find((r) => isStylesRelationshipType(r.type));
    if (existing === undefined) {
      const id = this.allocateRelationshipId();
      const target = relativeTargetFromWorkbook(this.workbookPartName, partName);
      const next: OpcRelationship[] = [
        ...rels,
        {
          id,
          type: STYLES_REL_TYPE_TRANSITIONAL,
          target,
          resolvedTarget: partName,
        },
      ];
      this.pkg.setRelationships(this.workbookPartName, next);
    }
  }

  /**
   * Write dirty core/app property parts and ensure package-level relationships.
   * Untouched parts keep original bytes (open → save lossless).
   * Passes current worksheet names so dirty app.xml can emit Excel inventory.
   */
  private flushDocumentProperties(): void {
    const sheetNames: string[] = [];
    for (const sheet of this.sheetsCollection) {
      sheetNames.push(sheet.name);
    }
    this.documentPropertiesImpl.flush(
      this.pkg,
      () => this.allocatePackageRelationshipId(),
      { sheetNames },
    );
  }

  /**
   * Flush custom document properties to OPC package if dirty.
   * @internal
   */
  private flushCustomDocumentProperties(): void {
    // Phase 2: Flush custom properties only if modified
    if (this.customDocumentPropertiesImpl.isDirty()) {
      this.customDocumentPropertiesImpl.flush(this.pkg);
    }
  }
}

function loadSharedStringTable(
  pkg: OpcPackage,
  workbookPartName: string,
  rels: ReadonlyArray<OpcRelationship>,
): SharedStringTable {
  void workbookPartName;
  const sstRel = rels.find((r) => isSharedStringsRelationshipType(r.type));
  let partName: string | undefined = (sstRel == null ? undefined : sstRel.resolvedTarget);
  if (partName === undefined) {
    const conventional = pkg.getPart(DEFAULT_SHARED_STRINGS_PART_NAME);
    if (conventional !== undefined) {
      partName = conventional.name;
    }
  }
  if (partName === undefined) {
    return SharedStringTable.empty();
  }
  const part = pkg.getPart(partName);
  if (part === undefined) {
    // Relationship present but part missing — treat as empty table bound to that name.
    return SharedStringTable.empty({ partName });
  }
  return SharedStringTable.fromPartBytes(part.data, part.name);
}

/**
 * Highest `cacheId` among preserved `pivotCaches` children (0 when none).
 */
function maxPreservedCacheId(preserved: ReadonlyArray<string>): number {
  let max = 0;
  for (const snippet of preserved) {
    if (!/^<(?:[A-Za-z_][\w.-]*:)?pivotCaches[\s>]/.test(snippet.trim())) {
      continue;
    }
    const re = /cacheId\s*=\s*"(\d+)"/g;
    let m: RegExpExecArray | null = re.exec(snippet);
    while (m !== null) {
      const n = Number.parseInt(m[1] === undefined ? '0' : m[1], 10);
      if (n > max) {
        max = n;
      }
      m = re.exec(snippet);
    }
  }
  return max;
}

/**
 * Remove one `pivotCache` entry from the preserved `pivotCaches` element
 * (and the element itself when it becomes empty).
 */
function dropPivotCacheEntry(preserved: ReadonlyArray<string>, cacheId: number): string[] {
  const out: string[] = [];
  for (const snippet of preserved) {
    if (!/^<(?:[A-Za-z_][\w.-]*:)?pivotCaches[\s>/]/.test(snippet.trim())) {
      out.push(snippet);
      continue;
    }
    const entry = new RegExp(`<(?:[A-Za-z_][\\w.-]*:)?pivotCache\\s[^>]*?cacheId\\s*=\\s*"${cacheId}"[^>]*?/>`, 'g');
    const next = snippet.replace(entry, '');
    if (!/<(?:[A-Za-z_][\w.-]*:)?pivotCache[\s/>]/.test(next.replace(/^<[^>]*>/, ''))) {
      continue;
    }
    out.push(next);
  }
  return out;
}

function clampSheetIndex(index: number, length: number): number {
  if (length <= 0 || !Number.isInteger(index) || index < 0) {
    return 0;
  }
  return Math.min(index, length - 1);
}

function loadStyles(
  pkg: OpcPackage,
  workbookPartName: string,
  rels: ReadonlyArray<OpcRelationship>,
): WorkbookStyles {
  void workbookPartName;
  const stylesRel = rels.find((r) => isStylesRelationshipType(r.type));
  let partName: string | undefined = (stylesRel == null ? undefined : stylesRel.resolvedTarget);
  if (partName === undefined) {
    const conventional = pkg.getPart(DEFAULT_STYLES_PART_NAME);
    if (conventional !== undefined) {
      partName = conventional.name;
    }
  }
  let styles: WorkbookStyles;
  if (partName === undefined) {
    styles = WorkbookStyles.empty();
  } else {
    const part = pkg.getPart(partName);
    if (part === undefined) {
      styles = WorkbookStyles.empty({ partName });
    } else {
      styles = WorkbookStyles.fromPartBytes(part.data, part.name);
    }
  }
  // Theme bytes are read only to resolve Color.rgbColor. The theme part is
  // not rewritten, and its absence leaves the Office default scheme inside
  // the resolver (never written into styles.xml).
  const themeRel = rels.find((r) => isThemeRelationshipType(r.type));
  if (themeRel !== undefined) {
    const themePart = pkg.getPart(themeRel.resolvedTarget);
    if (themePart !== undefined) {
      styles.bindThemeXml(decodeUtf8(themePart.data));
    }
  }
  return styles;
}

interface HostState extends SheetCollectionHost {
  workbook: Workbook | undefined;
}

/**
 * Quote a sheet name for a defined-name formula (`Sheet1!$A$1:$F$12`).
 * ECMA-376-1 §18.2.5: definedName content is ST_Formula, not a bare ref.
 */
function quoteSheetForFormula(name: string): string {
  return /^[A-Za-z_][A-Za-z0-9_.]*$/.test(name) ? name : `'${name.replace(/'/g, "''")}'`;
}

function qualifyRef(sheet: string, ref: string): string {
  const trimmed = ref.trim();
  if (trimmed.length === 0 || trimmed.indexOf('!') >= 0) {
    return trimmed;
  }
  const abs = trimmed.replace(/\$?([A-Za-z]+)\$?(\d+)/g, (_m: string, col: string, row: string): string => {
    return `$${col}$${row}`;
  });
  return `${sheet}!${abs}`;
}

/**
 * Built-in `_xlnm.Print_Area` must be a sheet-qualified formula. A bare
 * `A1:F12` is rejected by Excel ("Removed Records: Named range").
 */
function qualifyPrintArea(content: string, sheetName: string | undefined): string {
  if (sheetName === undefined || sheetName.length === 0) {
    return content;
  }
  const sheet = quoteSheetForFormula(sheetName);
  return content.split(',').map((part: string): string => qualifyRef(sheet, part)).join(',');
}

function stripPrintAreaSheetQualifier(content: string, sheetName: string | undefined): string {
  if (sheetName === undefined) {
    return content;
  }
  const quoted = `'${sheetName.replace(/'/g, "''")}'`;
  const prefixes = [`${quoteSheetForFormula(sheetName)}!`, `${quoted}!`];
  return content.split(',').map((part: string): string => {
    const trimmed = part.trim();
    for (const prefix of prefixes) {
      if (trimmed.indexOf(prefix) === 0) {
        return trimmed.slice(prefix.length).replace(/\$/g, '');
      }
    }
    return trimmed;
  }).join(',');
}

function createHostState(pkg: OpcPackage, workbookPartName: string): HostState {
  const state: HostState = {
    package: pkg,
    workbookPartName,
    workbook: undefined,
    markDirty(): void {
      (state.workbook == null ? undefined : state.workbook.markDirty());
    },
    onSheetRemoved(deletedIndex: number): void {
      (state.workbook == null ? undefined : state.workbook.onSheetRemoved(deletedIndex));
    },
    onSheetMoved(fromIndex: number, toIndex: number): void {
      (state.workbook == null ? undefined : state.workbook.onSheetMoved(fromIndex, toIndex));
    },
    allocateSheetId(): number {
      const wb = state.workbook;
      if (wb === undefined) {
        throw new InvalidWorkbookError('Workbook host not bound');
      }
      return wb.allocateSheetId();
    },
    allocateRelationshipId(): string {
      const wb = state.workbook;
      if (wb === undefined) {
        throw new InvalidWorkbookError('Workbook host not bound');
      }
      return wb.allocateRelationshipId();
    },
    nextWorksheetPartName(): string {
      const wb = state.workbook;
      if (wb === undefined) {
        throw new InvalidWorkbookError('Workbook host not bound');
      }
      return wb.nextWorksheetPartName();
    },
    createWorksheetCellHost(): WorksheetCellHost {
      const wb = state.workbook;
      if (wb === undefined) {
        throw new InvalidWorkbookError('Workbook host not bound');
      }
      return wb.createWorksheetCellHost();
    },
    getPrintName(name: 'Print_Area' | 'Print_Titles', sheetIndex: number): string | undefined {
      const wb = state.workbook;
      if (wb === undefined) throw new InvalidWorkbookError('Workbook host not bound');
      const content = ((__t) => __t == null ? undefined : __t.content)(wb.names.get(`_xlnm.${name}`, sheetIndex));
      if (content === undefined || name !== 'Print_Area') {
        return content;
      }
      return stripPrintAreaSheetQualifier(content, wb.worksheets[sheetIndex] == null ? undefined : wb.worksheets[sheetIndex].name);
    },
    setPrintName(name: 'Print_Area' | 'Print_Titles', sheetIndex: number, content: string | undefined): void {
      const wb = state.workbook;
      if (wb === undefined) throw new InvalidWorkbookError('Workbook host not bound');
      const key = `_xlnm.${name}`;
      if (content === undefined || content.length === 0) {
        wb.names.remove(key, sheetIndex);
        return;
      }
      const sheetName = wb.worksheets[sheetIndex] == null ? undefined : wb.worksheets[sheetIndex].name;
      const wire = name === 'Print_Area' ? qualifyPrintArea(content, sheetName) : content;
      wb.names.add(key, wire, sheetIndex, true);
    },
  };
  return state;
}

/**
 * Minimal Node `fs` surface used by path open/save.
 * Intentionally structural so we never take a bundler-visible `fs` import.
 */
interface NodeFsBufferLike {
  buffer: ArrayBufferLike;
  byteOffset: number;
  byteLength: number;
}

interface NodeFsErrno {
  message?: string;
}

interface NodeFsModule {
  promises?: {
    readFile?: (path: string) => Promise<NodeFsBufferLike | Uint8Array>;
    writeFile?: (path: string, data: Uint8Array) => Promise<void>;
  };
  readFile?: (
    path: string,
    callback: (err: NodeFsErrno | null, data?: NodeFsBufferLike | Uint8Array) => void,
  ) => void;
  writeFile?: (
    path: string,
    data: Uint8Array,
    callback: (err: NodeFsErrno | null) => void,
  ) => void;
}

interface ProcessWithBuiltinModule {
  getBuiltinModule?: (id: string) => unknown;
}

function isNodeFsModule(value: unknown): value is NodeFsModule {
  return value != null && typeof value === 'object';
}

function toUint8ArrayFromFsRead(buffer: NodeFsBufferLike | Uint8Array): Uint8Array {
  if (buffer instanceof Uint8Array) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}

/**
 * Load Node `fs` without a bundler-visible module specifier.
 *
 * Static or dynamic `import('fs/promises')` is rewritten by Rollup into an
 * external during `global-scripts` UMD packaging and crashes without browser
 * globals (`TypeError` reading `.length` / `.name` on missing `output.globals`).
 * Prefer `process.getBuiltinModule` (no import graph edge). Fall back to direct
 * `eval('require')` so the binding resolves in CJS/AMD module scope
 * (a bare `Function` body cannot see module-local `require`).
 */
function loadNodeFs(): NodeFsModule | undefined {
  try {
    // Resolve `process` without a compile-time Node ambient (`@types/node` is
    // intentionally absent from this package's `tsconfig` types list).
    let proc: ProcessWithBuiltinModule | undefined;
    try {
      // @ts-ignore process is Node-only; not present in browser lib types
      if (typeof process !== 'undefined') {
        // @ts-ignore
        proc = process as ProcessWithBuiltinModule;
      }
    } catch {
      proc = undefined;
    }
    if (proc != null && typeof proc.getBuiltinModule === 'function') {
      const builtin = proc.getBuiltinModule('fs');
      if (isNodeFsModule(builtin)) {
        return builtin;
      }
    }
  } catch {
    // continue to require fallback
  }
  try {
    // Direct eval: module-scoped require (CJS / AMD factory). Not a static import.
    // eslint-disable-next-line no-eval
    const req = eval('require') as unknown;
    if (typeof req === 'function') {
      const loaded = (req as (id: string) => unknown)('fs');
      if (isNodeFsModule(loaded)) {
        return loaded;
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function nodeFsReadFile(
  fs: NodeFsModule | undefined,
): (path: string) => Promise<NodeFsBufferLike | Uint8Array> {
  if (fs != null && fs.promises != null && typeof fs.promises.readFile === 'function') {
    const readFile = fs.promises.readFile;
    return (path: string) => readFile(path);
  }
  if (fs != null && typeof fs.readFile === 'function') {
    const readFile = fs.readFile;
    return (path: string) =>
      new Promise((resolve, reject) => {
        readFile(path, (err: NodeFsErrno | null, data?: NodeFsBufferLike | Uint8Array) => {
          if (err) {
            reject(err);
          } else if (data == null) {
            reject(new Error('fs.readFile returned no data'));
          } else {
            resolve(data);
          }
        });
      });
  }
  throw new IoError(
    'open(filePath) requires the Node.js filesystem and is not available in this environment',
  );
}

function nodeFsWriteFile(
  fs: NodeFsModule | undefined,
): (path: string, data: Uint8Array) => Promise<void> {
  if (fs != null && fs.promises != null && typeof fs.promises.writeFile === 'function') {
    const writeFile = fs.promises.writeFile;
    return (path: string, data: Uint8Array) => writeFile(path, data);
  }
  if (fs != null && typeof fs.writeFile === 'function') {
    const writeFile = fs.writeFile;
    return (path: string, data: Uint8Array) =>
      new Promise((resolve, reject) => {
        writeFile(path, data, (err: NodeFsErrno | null) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
  }
  throw new IoError(
    'save(filePath) requires the Node.js filesystem and is not available in this environment',
  );
}

/**
 * Read package bytes from a local path via Node `fs`.
 * Node `fs` is resolved only at call time and is not a static bundle dependency.
 */
async function readWorkbookFromPath(filePath: string): Promise<Uint8Array> {
  if (typeof filePath !== 'string' || filePath.trim().length === 0) {
    throw new InvalidArgumentError('open(filePath) requires a non-empty file path string');
  }
  let readFile: (path: string) => Promise<NodeFsBufferLike | Uint8Array>;
  try {
    readFile = nodeFsReadFile(loadNodeFs());
  } catch (err) {
    if (err instanceof IoError) {
      throw err;
    }
    throw new IoError(
      'open(filePath) requires the Node.js filesystem and is not available in this environment',
      { cause: err },
    );
  }
  try {
    const buffer = await readFile(filePath);
    return toUint8ArrayFromFsRead(buffer);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new IoError(`Failed to read workbook from "${filePath}": ${detail}`, { cause: err });
  }
}

/**
 * Write package bytes to a local path via Node `fs`.
 * Node `fs` is resolved only at call time and is not a static bundle dependency.
 */
async function writeWorkbookToPath(filePath: string, bytes: Uint8Array): Promise<void> {
  if (typeof filePath !== 'string' || filePath.trim().length === 0) {
    throw new InvalidArgumentError('save(filePath) requires a non-empty file path string');
  }
  let writeFile: (path: string, data: Uint8Array) => Promise<void>;
  try {
    writeFile = nodeFsWriteFile(loadNodeFs());
  } catch (err) {
    if (err instanceof IoError) {
      throw err;
    }
    throw new IoError(
      'save(filePath) requires the Node.js filesystem and is not available in this environment',
      { cause: err },
    );
  }
  try {
    await writeFile(filePath, bytes);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new IoError(`Failed to write workbook to "${filePath}": ${detail}`, { cause: err });
  }
}

function bindHost(host: HostState, wb: Workbook): void {
  host.workbook = wb;
}

function bindWorksheetCellHosts(wb: Workbook, sheets: SheetCollection): void {
  const cellHost = wb.createWorksheetCellHost();
  for (const sheet of sheets) {
    (sheet as WorksheetImpl).bindCellHost(cellHost);
  }
}
