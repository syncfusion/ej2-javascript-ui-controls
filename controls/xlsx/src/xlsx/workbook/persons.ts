/**
 * Workbook-level persons store for threaded comments ([MS-XLSX] §2.1.18 / §2.3.7.1).
 *
 * Part: `application/vnd.ms-excel.person+xml`
 * Rel: `http://schemas.microsoft.com/office/2017/10/relationships/person`
 * Root: `personList` in NS `…/2018/threadedcomments`
 *
 * Authoring default (No Provider): `providerId="None"`, `userId="Name"`.
 * Ensure-by-displayName reuses an existing person with the same display name.
 *
 * @private
 */

import { isPersonRelationshipType, PERSON_CONTENT_TYPE, PERSON_REL_TYPE, THREADED_COMMENTS_NS } from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8, escapeXml, findElementsWithAttrs, unescapeXml } from '../core/xml/minimal-xml';
import { relativeTargetFromWorkbook } from './sheet-collection';

/** Conventional persons part name when allocating. */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const DEFAULT_PERSONS_PART_NAME: '/xl/persons/person.xml' = '/xl/persons/person.xml';

/**
 * One `CT_Person` row ([MS-XLSX] §2.6.203).
 *
 * @private
 */
export interface PersonEntry {
    /** ST_Guid — required `id`. */
    id: string;
    /** Required `displayName`. */
    displayName: string;
    /** Optional `userId` (authoring default `"Name"`). */
    userId: string | undefined;
    /** Optional `providerId` (authoring default `"None"`). */
    providerId: string | undefined;
    /** Opaque residual attribute XML (preserve). */
    extraAttrsXml: string;
}

/**
 * Workbook persons store. Materializes on save after worksheet flush (R5.1).
 *
 * @private
 */
export class PersonsStore {
    private readonly entries: PersonEntry[] = [];
    private partName: string | undefined;
    private dirty: boolean = false;
    /** True once loaded or intentionally empty for create path. */
    private loaded: boolean = false;

    /**
     * Empty store for `Workbook.create()`.
     *
     * @returns {PersonsStore} - Returns the result.
     */
    public static empty(): PersonsStore {
        const store: PersonsStore = new PersonsStore();
        store.loaded = true;
        return store;
    }

    /**
     * Load persons from workbook relationships (or conventional part name).
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @param {string} workbookPartName - The workbookPartName parameter.
     * @param {Object} rels - The rels parameter.
     * @returns {PersonsStore} - Returns the result.
     */
    public static loadFromPackage(pkg: OpcPackage, workbookPartName: string, rels: ReadonlyArray<OpcRelationship>): PersonsStore {
        const store: PersonsStore = new PersonsStore();
        const personRel: OpcRelationship = rels.find((r: OpcRelationship): boolean => isPersonRelationshipType(r.type));
        let partName: string = personRel == null ? undefined : personRel.resolvedTarget;
        if (partName === undefined) {
            const conventional: any = pkg.getPart(DEFAULT_PERSONS_PART_NAME);
            if (conventional !== undefined) {
                partName = conventional.name;
            }
        }
        if (partName === undefined) {
            store.loaded = true;
            return store;
        }
        store.partName = partName;
        const part: any = pkg.getPart(partName);
        if (part === undefined) {
            store.loaded = true;
            return store;
        }
        store.parsePersonList(decodeUtf8(part.data));
        store.loaded = true;
        store.dirty = false;
        return store;
    }

    /**
     * Gets isDirty.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isDirty(): boolean {
        return this.dirty;
    }

    /**
     * Gets personsPartName.
     *
     * @returns {string} - Returns the result.
     */
    public get personsPartName(): string | undefined {
        return this.partName;
    }

    /**
     * Resolve display name for a person id. Missing → empty string.
     *
     * @param {string} personId - The personId parameter.
     * @returns {string} - Returns the result.
     */
    public displayNameFor(personId: string): string {
        const id: string = normalizeGuid(personId);
        if (id === undefined) {
            return '';
        }
        const found: PersonEntry = this.entries.find((e: PersonEntry): boolean => e.id === id);
        return ((__t: string): string => (__t != null ? __t : ''))(found == null ? undefined : found.displayName);
    }

    /**
     * Ensure a person row for `displayName`. Reuses first match; else appends. Returns the person `id` (braced uppercase ST_Guid).
     *
     * @param {string} displayName - The displayName parameter.
     * @returns {string} - Returns the result.
     */
    public ensureByDisplayName(displayName: string): string {
        const name: string = displayName;
        for (const e of this.entries) {
            if (e.displayName === name) {
                return e.id;
            }
        }
        const id: string = generateGuid();
        this.entries.push({
            id,
            displayName: name,
            userId: 'Name',
            providerId: 'None',
            extraAttrsXml: ''
        });
        this.dirty = true;
        return id;
    }

    /**
     * True when any person rows exist (need part on save).
     *
     * @returns {boolean} - Returns the result.
     */
    public shouldWritePart(): boolean {
        return this.entries.length > 0 || this.dirty;
    }

    /**
     * Write persons part + workbook relationship when needed.
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @param {string} workbookPartName - The workbookPartName parameter.
     * @param {any} allocateRelationshipId - The allocateRelationshipId parameter.
     * @returns {void} - Returns the result.
     */
    public flush(pkg: OpcPackage, workbookPartName: string, allocateRelationshipId: () => string): void {
        if (!this.shouldWritePart() && this.partName === undefined) {
            return;
        }
        if (this.entries.length === 0) {
            // Drop empty owned part if we previously wrote one this session.
            if (this.dirty && this.partName !== undefined) {
                pkg.removePart(this.partName);
                const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(workbookPartName);
                const next: OpcRelationship[] = rels.filter((r: OpcRelationship): boolean => !isPersonRelationshipType(r.type));
                if (next.length !== rels.length) {
                    pkg.setRelationships(workbookPartName, next);
                }
                this.partName = undefined;
                this.dirty = false;
            }
            return;
        }

        const partName: string = this.partName != null ? this.partName : DEFAULT_PERSONS_PART_NAME;
        this.partName = partName;
        const xml: string = serializePersonList(this.entries);
        pkg.setPart(partName, encodeUtf8(xml), PERSON_CONTENT_TYPE);

        const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(workbookPartName);
        const existing: OpcRelationship = rels.find((r: OpcRelationship): boolean => isPersonRelationshipType(r.type));
        if (existing === undefined) {
            const id: string = allocateRelationshipId();
            const target: string = relativeTargetFromWorkbook(workbookPartName, partName);
            const next: OpcRelationship[] = [
                ...rels,
                {
                    id,
                    type: PERSON_REL_TYPE,
                    target,
                    resolvedTarget: partName
                }
            ];
            pkg.setRelationships(workbookPartName, next);
        } else if (existing.resolvedTarget !== partName) {
            const next: OpcRelationship[] = rels.map((r: OpcRelationship): OpcRelationship =>
                isPersonRelationshipType(r.type)
                    ? {
                        ...r,
                        target: relativeTargetFromWorkbook(workbookPartName, partName),
                        resolvedTarget: partName
                    }
                    : r
            );
            pkg.setRelationships(workbookPartName, next);
        }
        this.dirty = false;
    }

    /**
     * parsePersonList method.
     *
     * @param {string} xml - The xml parameter.
     * @returns {void} - Returns the result.
     */
    private parsePersonList(xml: string): void {
        this.entries.length = 0;
        for (const el of findElementsWithAttrs(xml, 'person')) {
            const idRaw: string = el.attrs.get('id');
            const id: string = normalizeGuid(idRaw);
            if (id === undefined) {
                continue;
            }
            const displayNameRaw: string = el.attrs.get('displayName');
            const displayName: string = displayNameRaw !== undefined ? displayNameRaw : '';
            const userId: string = el.attrs.get('userId');
            const providerId: string = el.attrs.get('providerId');
            this.entries.push({
                id,
                displayName,
                userId: userId !== undefined && userId.length > 0 ? userId : undefined,
                providerId: providerId !== undefined && providerId.length > 0 ? providerId : undefined,
                extraAttrsXml: ''
            });
        }
    }
}

/**
 * serializePersonList function.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {string} - Returns the result.
 */
function serializePersonList(entries: ReadonlyArray<PersonEntry>): string {
    const parts: string[] = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        `<personList xmlns="${THREADED_COMMENTS_NS}" xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
    ];
    for (const e of entries) {
        const attrs: string[] = [`displayName="${escapeXml(e.displayName)}"`, `id="${escapeXml(e.id)}"`];
        if (e.userId !== undefined) {
            attrs.push(`userId="${escapeXml(e.userId)}"`);
        }
        if (e.providerId !== undefined) {
            attrs.push(`providerId="${escapeXml(e.providerId)}"`);
        }
        parts.push(`<person ${attrs.join(' ')}/>`);
    }
    parts.push('</personList>');
    return parts.join('');
}

/**
 * Generate a braced uppercase GUID for ST_Guid pairing.
 *
 * @returns {string} - Returns the result.
 */
function generateGuid(): string {
    const bytes: Uint8Array = new Uint8Array(16);
    let cryptoObj: any;
    try {
        // @ts-expect-error global undefined in TS 3.3
        cryptoObj = (function (): { getRandomValues?: (a: Uint8Array) => Uint8Array } | undefined {
            try {
                if (typeof window !== 'undefined' && window.crypto) {
                    return window.crypto;
                }
            } catch {
                // ignore
            }
            try {
                // eslint-disable-next-line no-new-func
                const g: { crypto?: Crypto } = new Function('return this')() as { crypto?: Crypto };
                if (g != null && g.crypto) {
                    return g.crypto;
                }
            } catch {
                // ignore
            }
            return undefined;
        })();
    } catch {
        cryptoObj = undefined;
    }
    if (cryptoObj !== undefined && typeof cryptoObj.getRandomValues === 'function') {
        cryptoObj.getRandomValues(bytes);
    } else {
        for (let i: number = 0; i < 16; i += 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }
    // RFC 4122 version 4
    bytes[6] = ((bytes[6] != null ? bytes[6] : 0) & 0x0f) | 0x40;
    bytes[8] = ((bytes[8] != null ? bytes[8] : 0) & 0x3f) | 0x80;
    const hex: string = Array.from(bytes, (b: number): string => {
        const s: string = b.toString(16);
        return s.length < 2 ? '0' + s : s;
    })
        .join('')
        .toUpperCase();
    return `{${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}}`;
}

/**
 * normalizeGuid function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {string} - Returns the result.
 */
function normalizeGuid(raw: string | undefined): string | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const t: string = raw.trim();
    if (t.length === 0) {
        return undefined;
    }
    const bare: string = t.startsWith('{') && t.endsWith('}') ? t.slice(1, -1) : t;
    if (!/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(bare)) {
        return undefined;
    }
    return `{${bare.toUpperCase()}}`;
}

// Keep unescapeXml referenced for future residual body parse (lint parity).
void unescapeXml;
