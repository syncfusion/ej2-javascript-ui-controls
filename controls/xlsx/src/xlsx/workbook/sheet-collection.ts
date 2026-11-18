/**
 * Mutable sheet collection for {@link Workbook}.
 *
 * @private Not part of the public API. Application code uses
 * `Workbook.worksheets`, `Workbook.sheet`, `Workbook.addSheet`,
 * `Workbook.removeSheet`, and `Workbook.moveSheet` (API-RULES R1.5).
 *
 * Citations: CT_Sheets / CT_Sheet in transitional `sml.xsd`; worksheet rel types in
 * `src/xlsx/core/package/constants.ts`.
 */

import { DuplicateSheetNameError, LastSheetError, MissingWorksheetPartError } from '../core/errors';
import {
    isWorksheetRelationshipType,
    WORKSHEET_CONTENT_TYPE_TRANSITIONAL,
    WORKSHEET_REL_TYPE_TRANSITIONAL
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { encodeUtf8 } from '../core/xml/minimal-xml';
import { sheetNameKey, validateSheetName } from './sheet-name';
import { emptyWorksheetXml, SheetKind, SheetVisibility, SheetXmlEntry } from './workbook-xml';
import { Worksheet, WorksheetCellHost } from './worksheet';
import { WorksheetImpl } from './worksheet';

/**
 * Host callbacks supplied by {@link Workbook}.
 *
 * @private
 */
export interface SheetCollectionHost {
    readonly package: OpcPackage;
    readonly workbookPartName: string;
    markDirty(): void;
    /** Notify defined-names of a sheet removed at zero-based index. */
    onSheetRemoved(deletedIndex: number): void;
    /** Notify defined-names of a sheet reorder. */
    onSheetMoved(fromIndex: number, toIndex: number): void;
    allocateSheetId(): number;
    allocateRelationshipId(): string;
    nextWorksheetPartName(): string;
    createWorksheetCellHost(): WorksheetCellHost;
    getPrintName(name: 'Print_Area' | 'Print_Titles', sheetIndex: number): string | undefined;
    setPrintName(name: 'Print_Area' | 'Print_Titles', sheetIndex: number, content: string | undefined): void;
}

/**
 * Ordered collection of worksheets (and preservable non-worksheet sheets).
 *
 * @private
 */
export class SheetCollection {
    private readonly host: SheetCollectionHost;
    private readonly items: WorksheetImpl[];

    /**
     * Creates an instance.
     *
     * @param {SheetCollectionHost} host - The host parameter.
     * @param {Object} sheets - The sheets parameter.
     */
    public constructor(host: SheetCollectionHost, sheets: ReadonlyArray<WorksheetImpl>) {
        this.host = host;
        this.items = [...sheets];
    }

    /**
     * Number of sheets in workbook order.
     *
     * @returns {number} - Returns the result.
     */
    public get length(): number {
        return this.items.length;
    }

    /**
     * Sheet at zero-based index.
     *
     * @param {number} index - The index parameter.
     * @returns {Worksheet} - Returns the result.
     */
    public get(index: number): Worksheet {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const item: WorksheetImpl = this.items[index];
        if (item === undefined) {
            throw new RangeError(`Sheet index ${index} out of range 0..${this.items.length - 1}`);
        }
        return item;
    }

    /**
     * getPrintName method.
     *
     * @param {Object} name - The name parameter.
     * @param {WorksheetImpl} sheet - The sheet parameter.
     * @returns {string} - Returns the result.
     */
    public getPrintName(name: 'Print_Area' | 'Print_Titles', sheet: WorksheetImpl): string | undefined {
        return this.host.getPrintName(name, this.items.indexOf(sheet));
    }

    /**
     * setPrintName method.
     *
     * @param {Object} name - The name parameter.
     * @param {WorksheetImpl} sheet - The sheet parameter.
     * @param {string} content - The content parameter.
     * @returns {void} - Returns the result.
     */
    public setPrintName(name: 'Print_Area' | 'Print_Titles', sheet: WorksheetImpl, content: string | undefined): void {
        this.host.setPrintName(name, this.items.indexOf(sheet), content);
    }

    /**
     * Find sheet by name (case-insensitive).
     *
     * @param {string} name - The name parameter.
     * @returns {*} - Returns the result.
     */
    public getByName(name: string): Worksheet | undefined {
        const key: string = sheetNameKey(name);
        return this.items.find((s: WorksheetImpl): boolean => sheetNameKey(s.name) === key);
    }

    /**
     * Iterate sheets in workbook.xml order.
     *
     * @returns {Object} - Returns the result.
     */
    public [Symbol.iterator](): Iterator<Worksheet> {
        return this.items[Symbol.iterator]();
    }

    /**
     * Add a new visible worksheet. Optional name defaults to `SheetN`.
     *
     * @param {string} name - The name parameter.
     * @returns {Worksheet} - Returns the result.
     */
    public add(name?: string): Worksheet {
        const resolvedName: string = name != null ? name : this.defaultNewName();
        validateSheetName(resolvedName);
        this.assertUniqueName(resolvedName);

        const sheetId: number = this.host.allocateSheetId();
        const relId: string = this.host.allocateRelationshipId();
        const partName: string = this.host.nextWorksheetPartName();
        const target: string = relativeTargetFromWorkbook(this.host.workbookPartName, partName);

        const pkg: OpcPackage = this.host.package;
        pkg.setPart(partName, encodeUtf8(emptyWorksheetXml()), WORKSHEET_CONTENT_TYPE_TRANSITIONAL);

        const existing: OpcRelationship[] = [...pkg.getRelationships(this.host.workbookPartName)];
        const rel: OpcRelationship = {
            id: relId,
            type: WORKSHEET_REL_TYPE_TRANSITIONAL,
            target,
            resolvedTarget: partName
        };
        pkg.setRelationships(this.host.workbookPartName, [...existing, rel]);

        const entry: SheetXmlEntry = {
            name: resolvedName,
            sheetId,
            relId,
            state: 'visible',
            extraAttrsXml: ''
        };
        const ws: WorksheetImpl = new WorksheetImpl(this, entry, partName, 'worksheet');
        ws.bindCellHost(this.host.createWorksheetCellHost());
        // New empty sheet: load empty meta from the part we just wrote.
        ws.ensureSheetDataLoaded();
        this.items.push(ws);
        this.host.markDirty();
        return ws;
    }

    /**
     * Remove a worksheet. Fails if it is the last worksheet-kind sheet.
     *
     * @param {Worksheet} sheet - The sheet parameter.
     * @returns {void} - Returns the result.
     */
    public remove(sheet: Worksheet): void {
        const impl: WorksheetImpl = sheet as WorksheetImpl;
        const idx: number = this.items.indexOf(impl);
        if (idx < 0) {
            throw new RangeError('Sheet is not part of this workbook');
        }

        const worksheetCount: number = this.items.filter((s: WorksheetImpl): boolean => s.kind === 'worksheet').length;
        if (impl.kind === 'worksheet' && worksheetCount <= 1) {
            throw new LastSheetError('Cannot remove the last worksheet');
        }

        this.items.splice(idx, 1);
        this.host.onSheetRemoved(idx);

        const pkg: OpcPackage = this.host.package;
        const rels: OpcRelationship[] = pkg
            .getRelationships(this.host.workbookPartName)
            .filter((r: OpcRelationship): boolean => r.id !== impl.relId);
        pkg.setRelationships(this.host.workbookPartName, rels);
        if (impl.partName !== undefined) {
            pkg.removePart(impl.partName);
        }
        this.host.markDirty();
    }

    /**
     * Move sheet from one index to another (reorder).
     *
     * @param {number} fromIndex - The fromIndex parameter.
     * @param {number} toIndex - The toIndex parameter.
     * @returns {void} - Returns the result.
     */
    public move(fromIndex: number, toIndex: number): void {
        if (fromIndex < 0 || fromIndex >= this.items.length || toIndex < 0 || toIndex >= this.items.length) {
            throw new RangeError('Sheet move index out of range');
        }
        if (fromIndex === toIndex) {
            return;
        }
        const [item] = this.items.splice(fromIndex, 1);
        if (item === undefined) {
            return;
        }
        this.items.splice(toIndex, 0, item);
        this.host.onSheetMoved(fromIndex, toIndex);
        this.host.markDirty();
    }

    /**
     * rename method.
     *
     * @param {WorksheetImpl} sheet - The sheet parameter.
     * @param {string} newName - The newName parameter.
     * @returns {void} - Returns the result.
     */
    public rename(sheet: WorksheetImpl, newName: string): void {
        validateSheetName(newName);
        this.assertUniqueName(newName, sheet);
        sheet.setNameInternal(newName);
        this.host.markDirty();
    }

    /**
     * setVisibility method.
     *
     * @param {WorksheetImpl} sheet - The sheet parameter.
     * @param {SheetVisibility} visibility - The visibility parameter.
     * @returns {void} - Returns the result.
     */
    public setVisibility(sheet: WorksheetImpl, visibility: SheetVisibility): void {
        sheet.setVisibilityInternal(visibility);
        this.host.markDirty();
    }

    /**
     * toXmlEntries method.
     *
     * @returns {SheetXmlEntry[]} - Returns the result.
     */
    public toXmlEntries(): SheetXmlEntry[] {
        return this.items.map((s: WorksheetImpl): SheetXmlEntry => s.toXmlEntry());
    }

    /**
     * assertUniqueName method.
     *
     * @param {string} name - The name parameter.
     * @param {WorksheetImpl} except - The except parameter.
     * @returns {void} - Returns the result.
     */
    public assertUniqueName(name: string, except?: WorksheetImpl): void {
        const key: string = sheetNameKey(name);
        for (const s of this.items) {
            if (except !== undefined && s === except) {
                continue;
            }
            if (sheetNameKey(s.name) === key) {
                throw new DuplicateSheetNameError(`Duplicate sheet name "${name}"`);
            }
        }
    }

    /**
     * defaultNewName method.
     *
     * @returns {string} - Returns the result.
     */
    private defaultNewName(): string {
        let n: number = this.items.length + 1;
        for (;;) {
            const candidate: string = `Sheet${n}`;
            try {
                validateSheetName(candidate);
                this.assertUniqueName(candidate);
                return candidate;
            } catch {
                n += 1;
                if (n > 65534) {
                    throw new DuplicateSheetNameError('Unable to allocate a unique default sheet name');
                }
            }
        }
    }
}

/**
 * Create collection and bound worksheets from parsed entries + package rels.
 *
 * @param {SheetCollectionHost} host - The host parameter.
 * @param {Object} entries - The entries parameter.
 * @param {Object} relationships - The relationships parameter.
 * @returns {SheetCollection} - Returns the result.
 */
export function createSheetCollection(
    host: SheetCollectionHost,
    entries: ReadonlyArray<SheetXmlEntry>,
    relationships: ReadonlyArray<OpcRelationship>
): SheetCollection {
    const byId: Map<string, OpcRelationship> = new Map<string, OpcRelationship>();
    for (const r of relationships) {
        byId.set(r.id, r);
    }
    const skeletons: {
        entry: SheetXmlEntry;
        partName: string | undefined;
        kind: SheetKind;
    }[] = [];

    for (const entry of entries) {
        const rel: OpcRelationship = byId.get(entry.relId);
        if (rel === undefined) {
            throw new MissingWorksheetPartError(`Sheet "${entry.name}" relationship "${entry.relId}" is missing`, {
                partName: host.workbookPartName
            });
        }
        if (rel.targetMode === 'External') {
            throw new MissingWorksheetPartError(`Sheet "${entry.name}" relationship "${entry.relId}" is external`, {
                partName: host.workbookPartName
            });
        }
        const partName: string = rel.resolvedTarget;
        const kind: SheetKind = isWorksheetRelationshipType(rel.type) ? 'worksheet' : 'other';
        if (kind === 'worksheet') {
            const part: any = host.package.getPart(partName);
            if (part === undefined) {
                throw new MissingWorksheetPartError(`Worksheet part "${partName}" for sheet "${entry.name}" is missing`, { partName });
            }
        }
        skeletons.push({ entry, partName, kind });
    }

    const collection: SheetCollection = new SheetCollection(host, []);
    const items: WorksheetImpl[] = (collection as unknown as { items: WorksheetImpl[] }).items;
    for (const sk of skeletons) {
        items.push(new WorksheetImpl(collection, sk.entry, sk.partName, sk.kind));
    }
    return collection;
}

/**
 * Relative Target from workbook part to worksheet part (e.g. `worksheets/sheet1.xml`).
 *
 * @param {string} workbookPartName - The workbookPartName parameter.
 * @param {string} sheetPartName - The sheetPartName parameter.
 * @returns {string} - Returns the result.
 */
export function relativeTargetFromWorkbook(workbookPartName: string, sheetPartName: string): string {
    // Standard layout: /xl/workbook.xml → worksheets/sheetN.xml
    if (workbookPartName === '/xl/workbook.xml' || workbookPartName.toLowerCase() === '/xl/workbook.xml') {
        if (sheetPartName.startsWith('/xl/')) {
            return sheetPartName.slice('/xl/'.length);
        }
    }
    // Fallback: strip shared directory prefix.
    const wbSlash: number = workbookPartName.lastIndexOf('/');
    const wbDir: string = wbSlash <= 0 ? '/' : workbookPartName.slice(0, wbSlash + 1);
    if (sheetPartName.startsWith(wbDir)) {
        return sheetPartName.slice(wbDir.length);
    }
    return sheetPartName.startsWith('/') ? sheetPartName.slice(1) : sheetPartName;
}
