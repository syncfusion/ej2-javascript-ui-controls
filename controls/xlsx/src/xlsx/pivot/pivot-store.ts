/**
 * Workbook-level pivot store: owns the authored caches and, at `save()`,
 * materializes the pivot package parts:
 *
 * | Part | Content type | Relationship |
 * | --- | --- | --- |
 * | `/xl/pivotCache/pivotCacheDefinitionN.xml` | `…pivotCacheDefinition+xml` | workbook → definition |
 * | `/xl/pivotCache/pivotCacheRecordsN.xml` | `…pivotCacheRecords+xml` | definition → records |
 * | `/xl/pivotTables/pivotTableN.xml` | `…pivotTable+xml` | worksheet → table; table → definition |
 *
 * and returns the `workbook.xml` `pivotCaches` entries (`cacheId` + `r:id`).
 *
 * Only caches used by at least one live pivot table are written. Caches and
 * tables read from a file are adopted by `load` and rewritten only when they
 * were edited; anything the model cannot describe stays an untouched opaque
 * package part. New part names and `cacheId`s are allocated above whatever
 * the file already uses.
 *
 * Citations: ECMA-376-1 §18.10; ECMA-376-1 Part 1 content-type listing and
 * relationship-type table (corpus-verified); `docs/specs/pivot-tables.md`.
 *
 * @private
 */

import { InvalidPivotTableError } from '../core/errors';
import {
    PIVOT_CACHE_DEFINITION_CONTENT_TYPE,
    PIVOT_CACHE_DEFINITION_REL_TYPE,
    PIVOT_CACHE_RECORDS_CONTENT_TYPE,
    PIVOT_CACHE_RECORDS_REL_TYPE,
    PIVOT_TABLE_CONTENT_TYPE,
    PIVOT_TABLE_REL_TYPE,
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { encodeUtf8 } from '../core/xml/minimal-xml';
import { WorkbookStyles } from '../styles/workbook-styles';
import { WorksheetImpl } from '../workbook/worksheet';
import { decodeUtf8 } from '../core/xml/minimal-xml';
import { PivotCachesImpl } from './pivot-cache';
import { PivotCacheImpl } from './pivot-cache';
import { patchLoadedCacheDefinition, rewriteLoadedPivotTable, setCacheRefreshOnLoad } from './pivot-edit';
import { loadPivots } from './pivot-loader';
import { decodeXstring } from './pivot-xml-tree';
import { PivotCacheSnapshot } from './pivot-snapshot';
import { PivotTableImpl, PivotTablesImpl } from './pivot-table';
import {
    PivotGeometry,
    computeGeometry,
    enumeratedColumns,
    pageFieldRoomProblem,
    serializePivotCacheDefinition,
    serializePivotCacheRecords,
    serializePivotTable,
} from './pivot-xml';

/**
 * Host surface the workbook provides to the store.
 *
 * @private
 */
export interface PivotStoreHost {
    readonly package: OpcPackage;
    readonly workbookPartName: string;
    markDirty(): void;
    allocateWorkbookRelationshipId(): string;
    styles(): WorkbookStyles;
    /** Current worksheets (in workbook order) with their pivot collection, if any. */
    worksheets(): ReadonlyArray<WorksheetImpl>;
    /** Highest `cacheId` already used by preserved `pivotCaches`. */
    preservedMaxCacheId(): number;
    /** Remove a `pivotCache` entry from the preserved `workbook.xml` children. */
    dropPreservedCache(cacheId: number): void;
}

/**
 * One `pivotCaches/pivotCache` entry for `workbook.xml`.
 *
 * @private
 */
export interface PivotCacheEntry {
    readonly cacheId: number;
    readonly relId: string;
}

/** What a table needs to know about its written cache. */
interface WrittenCache {
    readonly cacheId: number;
    readonly definitionPartName: string;
    readonly snapshot: PivotCacheSnapshot;
}

/**
 * Relative target from one part to another (both absolute part names).
 *
 * @param {string} fromPart - Source part name.
 * @param {string} toPart - Target part name.
 * @returns {string} Relative URI as stored in `Target`.
 * @private
 */
export function relativePartTarget(fromPart: string, toPart: string): string {
    const from: string[] = fromPart.split('/').filter((s: string): boolean => s.length > 0);
    const to: string[] = toPart.split('/').filter((s: string): boolean => s.length > 0);
    from.pop();
    let shared: number = 0;
    while (shared < from.length && shared < to.length - 1 && from[shared] === to[shared]) {
        shared += 1;
    }
    const up: string[] = from.slice(shared).map((): string => '..');
    return up.concat(to.slice(shared)).join('/');
}

function nextFreeRelId(rels: ReadonlyArray<OpcRelationship>): string {
    const used: Set<number> = new Set<number>();
    for (const r of rels) {
        const m: RegExpExecArray | null = /^rId(\d+)$/i.exec(r.id);
        if (m !== null && m[1] !== undefined) {
            used.add(Number.parseInt(m[1], 10));
        }
    }
    let n: number = 1;
    while (used.has(n)) {
        n += 1;
    }
    return `rId${n}`;
}

function highestIndex(pkg: OpcPackage, pattern: RegExp): number {
    let max: number = 0;
    for (const name of pkg.partNames()) {
        const m: RegExpExecArray | null = pattern.exec(name);
        if (m !== null && m[1] !== undefined) {
            const n: number = Number.parseInt(m[1], 10);
            if (n > max) {
                max = n;
            }
        }
    }
    return max;
}

/**
 * Pivot store for one workbook.
 *
 * @private
 */
export class PivotStore {
    public readonly caches: PivotCachesImpl;
    private readonly host: PivotStoreHost;
    private nextCacheIndex: number;
    private nextTableIndex: number;
    private nextCacheId: number;
    /** Tables written by an earlier flush (to drop parts of removed ones). */
    private writtenTables: Map<PivotTableImpl, string> = new Map<PivotTableImpl, string>();
    /** Caches written by an earlier flush. */
    private writtenCaches: Set<PivotCacheImpl> = new Set<PivotCacheImpl>();

    /**
     * Creates the store.
     *
     * @param {PivotStoreHost} host - Workbook host.
     * @param {PivotCachesHost} cachesHost - Cache collection host.
     */
    public constructor(host: PivotStoreHost, cachesHost: { markDirty(): void; containsSheet(sheet: WorksheetImpl): boolean }) {
        this.host = host;
        this.caches = new PivotCachesImpl(cachesHost);
        this.nextCacheIndex = highestIndex(host.package, /^\/xl\/pivotCache\/pivotCacheDefinition(\d+)\.xml$/i) + 1;
        const recordsMax: number = highestIndex(host.package, /^\/xl\/pivotCache\/pivotCacheRecords(\d+)\.xml$/i) + 1;
        if (recordsMax > this.nextCacheIndex) {
            this.nextCacheIndex = recordsMax;
        }
        this.nextTableIndex = highestIndex(host.package, /^\/xl\/pivotTables\/pivotTable(\d+)\.xml$/i) + 1;
        this.nextCacheId = host.preservedMaxCacheId() + 1;
    }

    /**
     * Adopt the caches and tables of an opened workbook so they can be read
     * and edited. Tables the model cannot describe stay opaque.
     *
     * @param {ReadonlyArray<string>} preserved - Preserved top-level `workbook.xml` children.
     */
    public load(preserved: ReadonlyArray<string>): void {
        loadPivots({
            package: this.host.package,
            workbookPartName: this.host.workbookPartName,
            caches: this.caches,
            styles: this.host.styles(),
            worksheets: this.host.worksheets(),
            preserved,
            registerTable: (table: PivotTableImpl, sheetPart: string): void => {
                this.writtenTables.set(table, sheetPart);
            },
        });
    }

    /**
     * True when the store holds nothing that needs to be written or dropped.
     *
     * @returns {boolean} Whether a flush would be a no-op.
     */
    public get isIdle(): boolean {
        return this.caches.count === 0 && this.writtenTables.size === 0 && this.writtenCaches.size === 0;
    }

    /**
     * Write all pivot parts and return the `workbook.xml` cache entries.
     *
     * @returns {PivotCacheEntry[]} Entries for caches in use.
     * @throws InvalidPivotTableError when a table or cache cannot be written
     */
    public flush(): PivotCacheEntry[] {
        const pkg: OpcPackage = this.host.package;
        const live: PivotTableImpl[] = [];
        const collections: PivotTablesImpl[] = [];
        for (const sheet of this.host.worksheets()) {
            const collection: PivotTablesImpl | undefined = sheet.pivotTablesIfCreated();
            if (collection === undefined) {
                continue;
            }
            collections.push(collection);
            for (const table of collection.internalEntries()) {
                live.push(table);
            }
            collection.takeRemoved();
        }

        // Drop parts of tables removed (or whose sheet was removed) since the last flush.
        for (const [table, sheetPart] of Array.from(this.writtenTables.entries())) {
            if (live.indexOf(table) >= 0) {
                continue;
            }
            if (table.partName !== undefined) {
                pkg.removePart(table.partName);
                const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(sheetPart);
                const kept: OpcRelationship[] = rels.filter((r: OpcRelationship): boolean => r.id !== table.sheetRelId || r.resolvedTarget !== table.partName);
                if (kept.length !== rels.length) {
                    pkg.setRelationships(sheetPart, kept);
                }
            }
            table.partName = undefined;
            table.sheetRelId = undefined;
            this.writtenTables.delete(table);
        }

        // Validate before writing anything.
        for (const table of live) {
            if (!this.caches.owns(table.cache)) {
                throw new InvalidPivotTableError(`Pivot table "${table.name}" uses a cache that does not belong to this workbook`);
            }
            if (!this.caches.sourceIsLive(table.cache)) {
                throw new InvalidPivotTableError(`Pivot table "${table.name}" reads from a worksheet that was removed from the workbook`);
            }
            const problem: string | undefined = table.adopted && !table.isModified() ? undefined : pageFieldRoomProblem(table);
            if (problem !== undefined) {
                throw new InvalidPivotTableError(problem);
            }
        }

        const used: PivotCacheImpl[] = this.caches.internalEntries().filter(
            (cache: PivotCacheImpl): boolean => live.some((t: PivotTableImpl): boolean => t.cache === cache),
        );

        const entries: PivotCacheEntry[] = [];
        const written: Map<PivotCacheImpl, WrittenCache> = new Map<PivotCacheImpl, WrittenCache>();
        for (const cache of used) {
            const tables: PivotTableImpl[] = live.filter((t: PivotTableImpl): boolean => t.cache === cache);
            const snapshot: PivotCacheSnapshot = cache.snapshot();
            if (cache.adopted) {
                const info: WrittenCache = this.updateLoadedCache(cache, snapshot, tables);
                written.set(cache, info);
                continue;
            }
            const result: { readonly entry: PivotCacheEntry; readonly definitionPartName: string } = this.writeCache(cache, snapshot, tables);
            written.set(cache, { cacheId: result.entry.cacheId, definitionPartName: result.definitionPartName, snapshot });
            entries.push(result.entry);
        }

        // Caches read from a file whose tables were all removed.
        for (const cache of this.caches.internalEntries().slice()) {
            if (!cache.adopted || cache.pinned || cache.adoptedTables === 0 || used.indexOf(cache) >= 0) {
                continue;
            }
            if (cache.definitionPartName !== undefined) {
                pkg.removePart(cache.definitionPartName);
            }
            if (cache.recordsPartName !== undefined) {
                pkg.removePart(cache.recordsPartName);
            }
            const wbRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(this.host.workbookPartName);
            pkg.setRelationships(
                this.host.workbookPartName,
                wbRels.filter((r: OpcRelationship): boolean => r.id !== cache.workbookRelId),
            );
            if (cache.cacheId !== undefined) {
                this.host.dropPreservedCache(cache.cacheId);
            }
            this.caches.discard(cache);
        }

        // Caches written earlier but no longer used.
        for (const cache of Array.from(this.writtenCaches)) {
            if (used.indexOf(cache) >= 0) {
                continue;
            }
            if (cache.definitionPartName !== undefined) {
                pkg.removePart(cache.definitionPartName);
            }
            if (cache.recordsPartName !== undefined) {
                pkg.removePart(cache.recordsPartName);
            }
            const wbRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(this.host.workbookPartName);
            pkg.setRelationships(
                this.host.workbookPartName,
                wbRels.filter((r: OpcRelationship): boolean => r.id !== cache.workbookRelId),
            );
            cache.definitionPartName = undefined;
            cache.recordsPartName = undefined;
            cache.workbookRelId = undefined;
            this.writtenCaches.delete(cache);
        }

        const styles: WorkbookStyles = this.host.styles();
        for (const collection of collections) {
            for (const table of collection.internalEntries()) {
                const cacheInfo: WrittenCache | undefined = written.get(table.cache);
                if (cacheInfo === undefined) {
                    throw new InvalidPivotTableError(`Pivot table "${table.name}" has no cache to read from`);
                }
                this.writeTable(table, cacheInfo, collection, (code: string): number => styles.ensureCustomNumberFormat(code));
            }
        }
        return entries;
    }

    /**
     * Bring a cache read from a file up to date. Its parts are regenerated
     * only when an edit needs them (a table over it changed or is new, or the
     * source sheet was renamed); otherwise only `refreshOnOpen` is patched.
     * Its `workbook.xml` entry already exists in the preserved children.
     */
    private updateLoadedCache(
        cache: PivotCacheImpl,
        snapshot: PivotCacheSnapshot,
        tables: ReadonlyArray<PivotTableImpl>,
    ): WrittenCache {
        const pkg: OpcPackage = this.host.package;
        const loaded = cache.loaded;
        const definitionPart: string | undefined = cache.definitionPartName;
        const recordsPart: string | undefined = cache.recordsPartName;
        if (loaded === undefined || definitionPart === undefined || recordsPart === undefined || cache.cacheId === undefined) {
            throw new InvalidPivotTableError('A pivot cache read from a file lost its package parts');
        }
        const renamed: boolean = cache.sheet.name !== decodeXstring(loaded.sheetName);
        const regenerate: boolean = renamed || tables.some((t: PivotTableImpl): boolean => !t.adopted || t.isModified());
        const staleBody: boolean = tables.some((t: PivotTableImpl): boolean => t.adopted && t.geometrySignature() !== t.baselineGeometry);
        if (staleBody) {
            cache.assignRefreshOnLoad(true);
        }
        if (regenerate) {
            // Records are regenerated; the definition is patched so Excel's
            // extLst, revision uid and default field attributes survive.
            const forced: boolean[] = loaded.sharedItems.map((items): boolean => items !== undefined);
            const enumerated: boolean[] = enumeratedColumns(snapshot, tables, forced);
            const part = pkg.getPart(definitionPart);
            const patched: string | undefined = part === undefined ? undefined : patchLoadedCacheDefinition(decodeUtf8(part.data), cache);
            if (patched === undefined) {
                throw new InvalidPivotTableError(`Pivot cache "${cache.source}" cannot be updated`);
            }
            pkg.setPart(definitionPart, encodeUtf8(patched), PIVOT_CACHE_DEFINITION_CONTENT_TYPE);
            pkg.setPart(recordsPart, encodeUtf8(serializePivotCacheRecords(snapshot, enumerated)), PIVOT_CACHE_RECORDS_CONTENT_TYPE);
        } else if (cache.modified || staleBody) {
            const part = pkg.getPart(definitionPart);
            const patched: string | undefined = part === undefined ? undefined : setCacheRefreshOnLoad(decodeUtf8(part.data), cache.refreshOnOpen);
            if (patched !== undefined) {
                pkg.setPart(definitionPart, encodeUtf8(patched), PIVOT_CACHE_DEFINITION_CONTENT_TYPE);
            }
        }
        return { cacheId: cache.cacheId, definitionPartName: definitionPart, snapshot };
    }

    private recordsRelationshipId(definitionPart: string): string {
        const rel: OpcRelationship | undefined = this.host.package.getRelationships(definitionPart).find(
            (r: OpcRelationship): boolean => r.type === PIVOT_CACHE_RECORDS_REL_TYPE,
        );
        if (rel === undefined) {
            throw new InvalidPivotTableError('A pivot cache read from a file lost its records relationship');
        }
        return rel.id;
    }

    private writeCache(
        cache: PivotCacheImpl,
        snapshot: PivotCacheSnapshot,
        tables: ReadonlyArray<PivotTableImpl>,
    ): { readonly entry: PivotCacheEntry; readonly definitionPartName: string } {
        const pkg: OpcPackage = this.host.package;
        let cacheId: number | undefined = cache.cacheId;
        if (cacheId === undefined) {
            cacheId = this.nextCacheId;
            this.nextCacheId += 1;
            cache.cacheId = cacheId;
        }
        let definitionPart: string | undefined = cache.definitionPartName;
        let recordsPart: string | undefined = cache.recordsPartName;
        if (definitionPart === undefined || recordsPart === undefined) {
            const index: number = this.nextCacheIndex;
            this.nextCacheIndex += 1;
            definitionPart = `/xl/pivotCache/pivotCacheDefinition${index}.xml`;
            recordsPart = `/xl/pivotCache/pivotCacheRecords${index}.xml`;
            cache.definitionPartName = definitionPart;
            cache.recordsPartName = recordsPart;
        }
        const enumerated: boolean[] = enumeratedColumns(snapshot, tables);
        const recordsRel: OpcRelationship = {
            id: 'rId1',
            type: PIVOT_CACHE_RECORDS_REL_TYPE,
            target: relativePartTarget(definitionPart, recordsPart),
            resolvedTarget: recordsPart,
        };
        pkg.setPart(
            definitionPart,
            encodeUtf8(serializePivotCacheDefinition(cache, snapshot, enumerated, recordsRel.id)),
            PIVOT_CACHE_DEFINITION_CONTENT_TYPE,
        );
        pkg.setPart(recordsPart, encodeUtf8(serializePivotCacheRecords(snapshot, enumerated)), PIVOT_CACHE_RECORDS_CONTENT_TYPE);
        pkg.setRelationships(definitionPart, [recordsRel]);

        const wbRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(this.host.workbookPartName);
        let relId: string | undefined = cache.workbookRelId;
        const existing: OpcRelationship | undefined = wbRels.find(
            (r: OpcRelationship): boolean => r.id === relId && r.resolvedTarget === definitionPart,
        );
        if (existing === undefined || relId === undefined) {
            relId = this.host.allocateWorkbookRelationshipId();
            cache.workbookRelId = relId;
            pkg.setRelationships(this.host.workbookPartName, [
                ...wbRels,
                {
                    id: relId,
                    type: PIVOT_CACHE_DEFINITION_REL_TYPE,
                    target: relativePartTarget(this.host.workbookPartName, definitionPart),
                    resolvedTarget: definitionPart,
                },
            ]);
        }
        this.writtenCaches.add(cache);
        return { entry: { cacheId, relId }, definitionPartName: definitionPart };
    }

    private rewriteLoadedTable(table: PivotTableImpl, cacheInfo: WrittenCache, resolveNumFmt: (code: string) => number): void {
        const loaded = table.loaded;
        if (loaded === undefined || table.partName === undefined || !table.isModified()) {
            return;
        }
        const geometry: PivotGeometry = computeGeometry(table, cacheInfo.snapshot);
        const text: string | undefined = rewriteLoadedPivotTable(table, loaded.originalXml, cacheInfo.snapshot, geometry, resolveNumFmt);
        if (text === undefined) {
            throw new InvalidPivotTableError(`Pivot table "${table.name}" could not be rewritten`, { partName: table.partName });
        }
        this.host.package.setPart(table.partName, encodeUtf8(text), PIVOT_TABLE_CONTENT_TYPE);
    }

    private writeTable(
        table: PivotTableImpl,
        cacheInfo: WrittenCache,
        collection: PivotTablesImpl,
        resolveNumFmt: (code: string) => number,
    ): void {
        const pkg: OpcPackage = this.host.package;
        const sheetPart: string | undefined = collection.sheetPartName();
        if (sheetPart === undefined) {
            throw new InvalidPivotTableError(`Pivot table "${table.name}" is on a worksheet without a package part`);
        }
        if (table.adopted && table.loaded !== undefined) {
            this.rewriteLoadedTable(table, cacheInfo, resolveNumFmt);
            this.writtenTables.set(table, sheetPart);
            return;
        }
        let partName: string | undefined = table.partName;
        if (partName === undefined) {
            partName = `/xl/pivotTables/pivotTable${this.nextTableIndex}.xml`;
            this.nextTableIndex += 1;
            table.partName = partName;
        }
        const geometry: PivotGeometry = computeGeometry(table, cacheInfo.snapshot);
        pkg.setPart(
            partName,
            encodeUtf8(serializePivotTable(table, cacheInfo.snapshot, cacheInfo.cacheId, geometry, resolveNumFmt)),
            PIVOT_TABLE_CONTENT_TYPE,
        );
        pkg.setRelationships(partName, [
            {
                id: 'rId1',
                type: PIVOT_CACHE_DEFINITION_REL_TYPE,
                target: relativePartTarget(partName, cacheInfo.definitionPartName),
                resolvedTarget: cacheInfo.definitionPartName,
            },
        ]);
        const sheetRels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(sheetPart);
        const existing: OpcRelationship | undefined = sheetRels.find(
            (r: OpcRelationship): boolean => r.id === table.sheetRelId && r.resolvedTarget === partName,
        );
        if (existing === undefined) {
            const id: string = nextFreeRelId(sheetRels);
            table.sheetRelId = id;
            pkg.setRelationships(sheetPart, [
                ...sheetRels,
                {
                    id,
                    type: PIVOT_TABLE_REL_TYPE,
                    target: relativePartTarget(sheetPart, partName),
                    resolvedTarget: partName,
                },
            ]);
        }
        this.writtenTables.set(table, sheetPart);
    }
}
