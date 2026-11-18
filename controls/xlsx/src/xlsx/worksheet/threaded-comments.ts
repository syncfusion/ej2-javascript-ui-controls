/**
 * Threaded comments — modern Excel cell discussions with an opening note and replies.
 *
 * Prefer the cell API: {@link Cell.addThreadedComment}, {@link Cell.threadedComment},
 * and sheet helpers to list or remove threads. Author and creation time on a thread
 * or reply are set when created and cannot be reassigned afterward.
 *
 * Citations:
 * - [MS-XLSX] CT_ThreadedComment §2.6.205; ThreadedComments root §2.4.86
 * - Persons store (workbook) via host.persons()
 * - docs/specs/threaded-comments.md; docs/api/THREADED-COMMENTS-PROPOSAL.md
 * - API-RULES R1.1 / R2.1 / R2.4 / R2.5 / R5.1 / R7.1
 *
 * Part CT: application/vnd.ms-excel.threadedcomments+xml
 * Rel: …/2017/10/relationships/threadedComment
 * Placeholder author: tc={uid} per top-level thread id.
 */

import { formatA1, parseA1 } from '../address/cell-address';
import { InvalidArgumentError, InvalidThreadedCommentError } from '../core/errors';
import {
    COMMENTS_CONTENT_TYPE,
    COMMENTS_REL_TYPE_TRANSITIONAL,
    isCommentsRelationshipType,
    isThreadedCommentsRelationshipType,
    THREADED_COMMENTS_CONTENT_TYPE,
    THREADED_COMMENTS_NS,
    THREADED_COMMENTS_REL_TYPE
} from '../core/package/constants';
import { OpcPackage } from '../core/package/opc-package';
import { resolveRelationshipTarget } from '../core/package/part-names';
import { OpcRelationship } from '../core/package/relationships';
import { decodeUtf8, encodeUtf8, escapeXml, escapeXmlText, findElementsWithAttrs, unescapeXml } from '../core/xml/minimal-xml';
import { PersonsStore } from '../workbook/persons';
import { relativeTargetFromSheetToDrawing } from './text-boxes';
import { claimUnreferencedCommentsPart } from './comments';

/**
 * Represents a single reply within a cell's discussion thread.
 */
export interface ThreadedCommentReply {
    /** The reply's message text. */
    text: string;
    /** The name of the person who wrote the reply. */
    readonly author: string;
    /** When the reply was written. */
    readonly createdAt: Date;
}

/**
 * Represents a discussion thread attached to a worksheet cell, letting you
 * post the original note, mark it resolved, and add replies.
 */
export interface ThreadedComment {
    /** The comment's message text. */
    text: string;
    /** The name of the person who started the thread. */
    readonly author: string;
    /** When the thread was started. */
    readonly createdAt: Date;
    /**
     * Whether the discussion is marked as resolved. Default `false`.
     */
    isResolved: boolean;
    /** The replies to this thread, in the order they were written. */
    readonly replies: ReadonlyArray<ThreadedCommentReply>;
    /** The row the comment is attached to — 1-based, like Excel rows. */
    readonly row: number;
    /** The column the comment is attached to — 1-based, like Excel columns. */
    readonly column: number;

    /**
     * Add a reply to this discussion.
     *
     * @param text - The reply's message text.
     * @param author - The name of the person replying. Default `""`.
     * @param createdAt - When the reply was written. Default: the time of
     *   the call.
     * @returns {Object} the newly created reply.
     */
    addReply(text: string, author?: string, createdAt?: Date): ThreadedCommentReply;
}

/**
 * One wire entry (top-level or reply).
 *
 * @private
 */
export interface ThreadedCommentEntry {
    /** ST_Guid — required `id`. */
    id: string;
    /** ST_Guid — required `personId`. */
    personId: string;
    /** ST_Guid of parent when this is a reply. */
    parentId: string | undefined;
    /** Cell A1 for top-level; optional on replies. */
    ref: string | undefined;
    text: string;
    /** UTC ISO-ish string or undefined. */
    dT: string | undefined;
    /** Top-level resolved flag (`done`). */
    done: boolean;
    /** Opaque residual child XML (mentions/extLst). */
    residualChildrenXml: string;
}

/**
 * Host surface for mutations and package I/O.
 *
 * @private
 */
export interface ThreadedCommentsHost {
    readonly package: OpcPackage;
    readonly sheetPartName: string | undefined;
    markDirty(): void;
    persons(): PersonsStore;
}

/**
 * Result of materializing TC + comments parts on flush.
 *
 * @private
 */
export interface ThreadedCommentsMaterializeResult {
    readonly sheetRelsWithoutTcAndComments: ReadonlyArray<OpcRelationship>;
    readonly tcRel: OpcRelationship | undefined;
    readonly commentsRel: OpcRelationship | undefined;
}

/**
 * Mutable threaded-comments store for one worksheet.
 *
 * @private
 */
export class ThreadedCommentsImpl {
    private readonly entries: ThreadedCommentEntry[] = [];
    private readonly topLevelHandles: Map<ThreadedCommentEntry, ThreadHandle> = new Map<ThreadedCommentEntry, ThreadHandle>();
    private readonly replyHandles: Map<ThreadedCommentEntry, ReplyHandle> = new Map<ThreadedCommentEntry, ReplyHandle>();
    private host: ThreadedCommentsHost | undefined;
    private tcPartName: string | undefined;
    private commentsPartName: string | undefined;
    private dirty: boolean = false;
    private loaded: boolean = false;

    /**
     * bindHost method.
     *
     * @param {ThreadedCommentsHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: ThreadedCommentsHost): void {
        this.host = host;
    }

    /**
     * Load threaded comments from the worksheet package relationships.
     *
     * @param {OpcPackage} pkg - The pkg parameter.
     * @param {string} sheetPartName - The sheetPartName parameter.
     * @returns {void} - Returns the result.
     */
    public loadFromPackage(pkg: OpcPackage, sheetPartName: string | undefined): void {
        this.entries.length = 0;
        this.topLevelHandles.clear();
        this.replyHandles.clear();
        this.tcPartName = undefined;
        this.commentsPartName = undefined;
        this.dirty = false;
        this.loaded = true;

        if (sheetPartName === undefined) {
            return;
        }

        const rels: ReadonlyArray<OpcRelationship> = pkg.getRelationships(sheetPartName);
        const tcRel: OpcRelationship = rels.find((r: OpcRelationship): boolean => isThreadedCommentsRelationshipType(r.type));
        const commentsRel: OpcRelationship = rels.find((r: OpcRelationship): boolean => isCommentsRelationshipType(r.type));

        if (commentsRel !== undefined && commentsRel.resolvedTarget !== undefined) {
            this.commentsPartName = commentsRel.resolvedTarget;
        }

        if (tcRel === undefined || tcRel.resolvedTarget === undefined) {
            return;
        }

        this.tcPartName = tcRel.resolvedTarget;
        const part: any = pkg.getPart(this.tcPartName);
        if (part === undefined) {
            return;
        }

        this.parseThreadedCommentsXml(decodeUtf8(part.data));
    }

    /**
     * Snapshot of top-level handles in document order.
     *
     * @returns {Object} - Returns the result.
     */
    public list(): ReadonlyArray<ThreadedComment> {
        return this.topLevelEntries().map((e: ThreadedCommentEntry): ThreadedComment => this.handleForTop(e));
    }

    /**
     * Top-level thread for a 1-based cell, or undefined.
     *
     * @param {number} row - The row parameter.
     * @param {number} col - The col parameter.
     * @returns {*} - Returns the result.
     */
    public getForCell(row: number, col: number): ThreadedComment | undefined {
        const ref: string = formatA1(row, col);
        const entry: ThreadedCommentEntry = this.topLevelEntries().find((e: ThreadedCommentEntry): boolean => e.ref === ref);
        return entry === undefined ? undefined : this.handleForTop(entry);
    }

    /**
     * Add a top-level thread at the given 1-based cell.
     *
     * @param {number} row - The row parameter.
     * @param {number} col - The col parameter.
     * @param {string} text - The text parameter.
     * @param {string} author - The author parameter.
     * @param {Date} createdAt - The createdAt parameter.
     * @returns {ThreadedComment} - Returns the result.
     */
    public addAtCell(row: number, col: number, text: string, author?: string, createdAt?: Date): ThreadedComment {
        if (typeof text !== 'string') {
            throw new InvalidArgumentError('Threaded comment text must be a string');
        }
        const ref: string = formatA1(row, col);
        if (this.topLevelEntries().some((e: ThreadedCommentEntry): boolean => e.ref === ref)) {
            throw new InvalidThreadedCommentError(`Cell ${ref} already has a threaded comment`);
        }

        const host: ThreadedCommentsHost = this.requireHost();
        const authorName: string = typeof author === 'string' ? author : '';
        const personId: string = host.persons().ensureByDisplayName(authorName);
        const when: Date = createdAt instanceof Date && !Number.isNaN(createdAt.getTime()) ? createdAt : new Date();

        const entry: ThreadedCommentEntry = {
            id: generateGuid(),
            personId,
            parentId: undefined,
            ref,
            text,
            dT: toXsDateTime(when),
            done: false,
            residualChildrenXml: ''
        };
        this.entries.push(entry);
        this.markDirty();
        return this.handleForTop(entry);
    }

    /**
     * Append a reply under a top-level entry.
     *
     * @param {ThreadedCommentEntry} parent - The parent parameter.
     * @param {string} text - The text parameter.
     * @param {string} author - The author parameter.
     * @param {Date} createdAt - The createdAt parameter.
     * @returns {ThreadedCommentReply} - Returns the result.
     */
    public addReplyTo(parent: ThreadedCommentEntry, text: string, author?: string, createdAt?: Date): ThreadedCommentReply {
        if (parent.parentId !== undefined) {
            throw new InvalidThreadedCommentError('Cannot add a reply to a reply in v1');
        }
        if (typeof text !== 'string') {
            throw new InvalidArgumentError('Threaded comment reply text must be a string');
        }
        const host: ThreadedCommentsHost = this.requireHost();
        const authorName: string = typeof author === 'string' ? author : '';
        const personId: string = host.persons().ensureByDisplayName(authorName);
        const when: Date = createdAt instanceof Date && !Number.isNaN(createdAt.getTime()) ? createdAt : new Date();

        const entry: ThreadedCommentEntry = {
            id: generateGuid(),
            personId,
            parentId: parent.id,
            ref: parent.ref,
            text,
            dT: toXsDateTime(when),
            done: false,
            residualChildrenXml: ''
        };
        this.entries.push(entry);
        this.markDirty();
        return this.handleForReply(entry);
    }

    /**
     * Remove a top-level thread by handle or 0-based index (and its replies).
     *
     * @param {number} target - The target parameter.
     * @returns {void} - Returns the result.
     */
    public remove(target: ThreadedComment | number): void {
        let top: ThreadedCommentEntry | undefined;
        if (typeof target === 'number') {
            if (!Number.isInteger(target) || target < 0) {
                throw new InvalidArgumentError(`Threaded comment index ${String(target)} is out of range`);
            }
            const tops: ThreadedCommentEntry[] = this.topLevelEntries();
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            top = tops[target];
            if (top === undefined) {
                throw new InvalidArgumentError(`Threaded comment index ${String(target)} is out of range`);
            }
        } else if (target !== null && typeof target === 'object') {
            top = this.findTopEntryForHandle(target);
            if (top === undefined) {
                throw new InvalidThreadedCommentError('Threaded comment handle is not from this worksheet');
            }
        } else {
            throw new InvalidArgumentError('removeThreadedComment requires a handle or 0-based index');
        }

        const parentId: string = top.id;
        for (let i: number = this.entries.length - 1; i >= 0; i -= 1) {
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            const e: ThreadedCommentEntry = this.entries[i];
            if (e === undefined) {
                continue;
            }
            if (e === top || e.parentId === parentId) {
                this.topLevelHandles.delete(e);
                this.replyHandles.delete(e);
                this.entries.splice(i, 1);
            }
        }
        this.markDirty();
    }

    /**
     * Remove every threaded comment on this sheet.
     *
     * @returns {void} - Returns the result.
     */
    public clear(): void {
        if (this.entries.length === 0) {
            return;
        }
        this.entries.length = 0;
        this.topLevelHandles.clear();
        this.replyHandles.clear();
        this.markDirty();
    }

    /**
     * Legacy comments-part rows for top-level threads ([MS-XLSX] §2.3.7.3).
     * Published into the sheet's single comments part on flush so classic notes
     * and `tc={uid}` placeholders share one part and one relationship.
     *
     * @returns {Object} - Returns the result.
     */
    public listLegacyPlaceholders(): ReadonlyArray<{ readonly ref: string; readonly threadId: string; readonly text: string }> {
        const out: { ref: string; threadId: string; text: string }[] = [];
        for (const t of this.topLevelEntries()) {
            out.push({
                ref: t.ref != null && t.ref.length > 0 ? t.ref : 'A1',
                threadId: t.id,
                text: t.text
            });
        }
        return out;
    }

    /**
     * 0-based cell anchors for VML `ObjectType="Note"` shapes matching top-level threads. Used by worksheet flush **before** form-controls VML materialize so Excel shows the comment indicator for threaded comments. - Returns anchors when top-level threads exist (owned rewrite). - Returns `[]` when dirty and empty (clear owned notes). - Returns `undefined` when clean and empty (leave foreign notes alone).
     *
     * @returns {Object} - Returns the result.
     */
    public listCommentNoteAnchorsForFlush(): ReadonlyArray<{ readonly row0: number; readonly col0: number }> | undefined {
        const tops: ThreadedCommentEntry[] = this.topLevelEntries();
        if (tops.length === 0) {
            return this.dirty ? [] : undefined;
        }
        const anchors: { row0: number; col0: number }[] = [];
        for (const t of tops) {
            if (t.ref === undefined || t.ref.length === 0) {
                continue;
            }
            try {
                const addr: any = parseA1(t.ref);
                anchors.push({ row0: addr.row - 1, col0: addr.col - 1 });
            } catch {
                // Skip malformed refs; comments placeholders also skip bad refs.
            }
        }
        return anchors;
    }

    /**
     * Write/remove TC + comments parts and compute sheet relationships. Call during worksheet flush after form-controls materialization. TC and comments types are stripped here and re-added when needed.
     *
     * @param {Object} sheetRelsCurrent - The sheetRelsCurrent parameter.
     * @returns {ThreadedCommentsMaterializeResult} - Returns the result.
     */
    public materializeOnFlush(
        sheetRelsCurrent: ReadonlyArray<OpcRelationship>,
        ownedCommentsRel?: OpcRelationship
    ): ThreadedCommentsMaterializeResult {
        const withoutTcComments: OpcRelationship[] = sheetRelsCurrent.filter(
            (r: OpcRelationship): boolean => !isThreadedCommentsRelationshipType(r.type) && !isCommentsRelationshipType(r.type)
        );

        const host: ThreadedCommentsHost = this.host;
        const sheetPartName: string = host == null ? undefined : host.sheetPartName;
        const hasThreads: boolean = this.topLevelEntries().length > 0;

        if (!hasThreads) {
            if (host !== undefined) {
                if (this.tcPartName !== undefined) {
                    host.package.removePart(this.tcPartName);
                }
                if (this.commentsPartName !== undefined && this.dirty) {
                    // Drop owned placeholder comments part only when we dirtied TC layer.
                    host.package.removePart(this.commentsPartName);
                    this.commentsPartName = undefined;
                }
            }
            this.tcPartName = undefined;
            this.dirty = false;
            return {
                sheetRelsWithoutTcAndComments: withoutTcComments,
                tcRel: undefined,
                commentsRel: undefined
            };
        }

        if (host === undefined || sheetPartName === undefined) {
            return {
                sheetRelsWithoutTcAndComments: withoutTcComments,
                tcRel: undefined,
                commentsRel: undefined
            };
        }

        const tcPart: string = this.tcPartName != null ? this.tcPartName : allocateThreadedCommentsPartName(host.package);
        this.tcPartName = tcPart;

        const tcXml: string = serializeThreadedCommentsXml(this.entries);
        host.package.setPart(tcPart, encodeUtf8(tcXml), THREADED_COMMENTS_CONTENT_TYPE);

        // Legacy `tc={uid}` rows share the sheet's single comments part.
        // When classic notes (or a prior comments materialize) already published
        // that relationship, reuse it. Otherwise write placeholders here.
        let commentsRel: OpcRelationship | undefined = ownedCommentsRel;
        if (commentsRel !== undefined && commentsRel.resolvedTarget !== undefined) {
            this.commentsPartName = commentsRel.resolvedTarget;
        } else {
            const claimed: string | undefined =
                this.commentsPartName != null
                    ? this.commentsPartName
                    : claimUnreferencedCommentsPart(host.package, sheetPartName);
            const commentsPart: string = claimed != null ? claimed : allocateCommentsPartName(host.package);
            this.commentsPartName = commentsPart;

            const foreignAuthors: string[] = [];
            const foreignCommentsXml: string[] = [];
            const existingComments: any = host.package.getPart(commentsPart);
            if (existingComments !== undefined) {
                parseForeignComments(decodeUtf8(existingComments.data), foreignAuthors, foreignCommentsXml);
            }

            const tops: ThreadedCommentEntry[] = this.topLevelEntries();
            const commentsXml: string = serializeCommentsPlaceholders(tops, foreignAuthors, foreignCommentsXml);
            host.package.setPart(commentsPart, encodeUtf8(commentsXml), COMMENTS_CONTENT_TYPE);

            let maxNum: number = 0;
            for (const r of withoutTcComments) {
                const m: RegExpExecArray = /^rId(\d+)$/i.exec(r.id);
                if (m !== null && m[1] !== undefined) {
                    const n: number = Number.parseInt(m[1], 10);
                    if (Number.isFinite(n) && n > maxNum) {
                        maxNum = n;
                    }
                }
            }
            const commentsTarget: string = relativeTargetFromSheetToDrawing(sheetPartName, commentsPart);
            commentsRel = {
                id: `rId${maxNum + 2}`,
                type: COMMENTS_REL_TYPE_TRANSITIONAL,
                target: commentsTarget,
                resolvedTarget: resolveRelationshipTarget(sheetPartName, commentsTarget, undefined)
            };
        }

        let tcMax: number = 0;
        for (const r of withoutTcComments) {
            const m: RegExpExecArray = /^rId(\d+)$/i.exec(r.id);
            if (m !== null && m[1] !== undefined) {
                const n: number = Number.parseInt(m[1], 10);
                if (Number.isFinite(n) && n > tcMax) {
                    tcMax = n;
                }
            }
        }
        if (commentsRel !== undefined) {
            const cm: RegExpExecArray = /^rId(\d+)$/i.exec(commentsRel.id);
            if (cm !== null && cm[1] !== undefined) {
                const n: number = Number.parseInt(cm[1], 10);
                if (Number.isFinite(n) && n > tcMax) {
                    tcMax = n;
                }
            }
        }
        const tcRelId: string = `rId${tcMax + 1}`;
        const tcTarget: string = relativeTargetFromSheetToDrawing(sheetPartName, tcPart);
        const tcRel: OpcRelationship = {
            id: tcRelId,
            type: THREADED_COMMENTS_REL_TYPE,
            target: tcTarget,
            resolvedTarget: resolveRelationshipTarget(sheetPartName, tcTarget, undefined)
        };

        this.dirty = false;
        return {
            sheetRelsWithoutTcAndComments: withoutTcComments,
            tcRel,
            commentsRel
        };
    }

    /**
     * topLevelEntries method.
     *
     * @returns {ThreadedCommentEntry[]} - Returns the result.
     */
    private topLevelEntries(): ThreadedCommentEntry[] {
        return this.entries.filter((e: ThreadedCommentEntry): boolean => e.parentId === undefined);
    }

    /**
     * repliesFor method.
     *
     * @param {string} parentId - The parentId parameter.
     * @returns {ThreadedCommentEntry[]} - Returns the result.
     */
    private repliesFor(parentId: string): ThreadedCommentEntry[] {
        return this.entries.filter((e: ThreadedCommentEntry): boolean => e.parentId === parentId);
    }

    /**
     * handleForTop method.
     *
     * @param {ThreadedCommentEntry} entry - The entry parameter.
     * @returns {ThreadedComment} - Returns the result.
     */
    private handleForTop(entry: ThreadedCommentEntry): ThreadedComment {
        let h: ThreadHandle = this.topLevelHandles.get(entry);
        if (h === undefined) {
            h = new ThreadHandle(this, entry);
            this.topLevelHandles.set(entry, h);
        }
        return h;
    }

    /**
     * handleForReply method.
     *
     * @param {ThreadedCommentEntry} entry - The entry parameter.
     * @returns {ThreadedCommentReply} - Returns the result.
     */
    private handleForReply(entry: ThreadedCommentEntry): ThreadedCommentReply {
        let h: ReplyHandle = this.replyHandles.get(entry);
        if (h === undefined) {
            h = new ReplyHandle(this, entry);
            this.replyHandles.set(entry, h);
        }
        return h;
    }

    /**
     * findTopEntryForHandle method.
     *
     * @param {ThreadedComment} handle - The handle parameter.
     * @returns {*} - Returns the result.
     */
    private findTopEntryForHandle(handle: ThreadedComment): ThreadedCommentEntry | undefined {
        for (const [entry, h] of this.topLevelHandles) {
            if (h === handle) {
                return entry;
            }
        }
        return undefined;
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
     * requireHost method.
     *
     * @returns {ThreadedCommentsHost} - Returns the result.
     */
    private requireHost(): ThreadedCommentsHost {
        if (this.host === undefined) {
            throw new InvalidThreadedCommentError('Threaded comments host is not bound');
        }
        return this.host;
    }

    /**
     * displayNameFor method.
     *
     * @param {string} personId - The personId parameter.
     * @returns {string} - Returns the result.
     */
    public displayNameFor(personId: string): string {
        const host: ThreadedCommentsHost = this.host;
        if (host === undefined) {
            return '';
        }
        const name: string = host.persons().displayNameFor(personId);
        return name !== undefined ? name : '';
    }

    /**
     * notifyMutation method.
     *
     * @returns {void} - Returns the result.
     */
    public notifyMutation(): void {
        this.markDirty();
    }

    /**
     * listReplyHandles method.
     *
     * @param {string} parentId - The parentId parameter.
     * @returns {Object} - Returns the result.
     */
    public listReplyHandles(parentId: string): ReadonlyArray<ThreadedCommentReply> {
        return this.repliesFor(parentId).map((e: ThreadedCommentEntry): ThreadedCommentReply => this.handleForReply(e));
    }

    /**
     * parseThreadedCommentsXml method.
     *
     * @param {string} xml - The xml parameter.
     * @returns {void} - Returns the result.
     */
    private parseThreadedCommentsXml(xml: string): void {
        // Match each threadedComment element with attrs + optional body.
        // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
        const pattern: RegExp = /<([A-Za-z_][\w.-]*:)?threadedComment(?=[\s/>])([^>]*)(?:\/>|>([\s\S]*?)<\/\1?threadedComment\s*>)/gi;
        for (;;) {
            const match: RegExpExecArray = pattern.exec(xml);
            if (match === null) {
                break;
            }
            const attrText: string = match[2] != null ? match[2] : '';
            const body: string = match[3] != null ? match[3] : '';
            const attrs: ReadonlyMap<string, string> = ((__t: any): ReadonlyMap<string, string> =>
                __t == null ? undefined : __t.attrs)(findElementsWithAttrs(`<threadedComment ${attrText}/>`, 'threadedComment')[0]);
            if (attrs === undefined) {
                continue;
            }
            const id: string = normalizeGuid(attrs.get('id'));
            const personId: string = normalizeGuid(attrs.get('personId'));
            if (id === undefined || personId === undefined) {
                continue;
            }
            const parentId: string = normalizeGuid(attrs.get('parentId'));
            const refRaw: string = attrs.get('ref');
            const dT: string = attrs.get('dT');
            const doneRaw: string = attrs.get('done');
            const done: boolean = doneRaw === '1' || doneRaw === 'true' || doneRaw === 'TRUE' || doneRaw === 'True';

            let text: string = '';
            const residual: string[] = [];
            // Extract text child and residual (mentions, extLst, unknown).
            // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
            const childPattern: RegExp = /<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)(?=[\s/>])([^>]*)(?:\/>|>([\s\S]*?)<\/\1?\2\s*>)/g;
            for (;;) {
                const cm: RegExpExecArray = childPattern.exec(body);
                if (cm === null) {
                    break;
                }
                const local: string = cm[2] != null ? cm[2] : '';
                const childBody: string = cm[4] != null ? cm[4] : '';
                if (local === 'text') {
                    text = unescapeXml(stripTags(childBody));
                } else if (local === 'mentions' || local === 'extLst') {
                    residual.push(cm[0] != null ? cm[0] : '');
                } else {
                    residual.push(cm[0] != null ? cm[0] : '');
                }
            }

            this.entries.push({
                id,
                personId,
                parentId,
                ref: refRaw !== undefined && refRaw.trim().length > 0 ? normalizeRef(refRaw) : undefined,
                text,
                dT: dT !== undefined && dT.length > 0 ? dT : undefined,
                done,
                residualChildrenXml: residual.join('')
            });
        }
    }
}

/**
 * ThreadHandle class.
 */
class ThreadHandle implements ThreadedComment {
    /**
     * Creates an instance.
     *
     * @param {ThreadedCommentsImpl} store - The store parameter.
     * @param {ThreadedCommentEntry} entry - The entry parameter.
     */
    private readonly store: ThreadedCommentsImpl;
    private readonly entry: ThreadedCommentEntry;

    /**
     * Creates a new instance.
     *
     * @param {ThreadedCommentsImpl} store - store value.
     * @param {ThreadedCommentEntry} entry - entry value.
     */
    public constructor(
        store: ThreadedCommentsImpl,
        entry: ThreadedCommentEntry
    ) {
        this.store = store;
        this.entry = entry;
    }

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
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('Threaded comment text must be a string');
        }
        this.entry.text = value;
        this.store.notifyMutation();
    }

    /**
     * Gets author.
     *
     * @returns {string} - Returns the result.
     */
    public get author(): string {
        return this.store.displayNameFor(this.entry.personId);
    }

    /**
     * Gets createdAt.
     *
     * @returns {Date} - Returns the result.
     */
    public get createdAt(): Date {
        return parseXsDateTime(this.entry.dT);
    }

    /**
     * Gets isResolved.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isResolved(): boolean {
        return this.entry.done;
    }

    /**
     * Sets isResolved.
     *
     * @param {boolean} value - The value parameter.
     */
    public set isResolved(value: boolean) {
        this.entry.done = value === true;
        this.store.notifyMutation();
    }

    /**
     * Gets replies.
     *
     * @returns {Object} - Returns the result.
     */
    public get replies(): ReadonlyArray<ThreadedCommentReply> {
        return this.store.listReplyHandles(this.entry.id);
    }

    /**
     * Gets row.
     *
     * @returns {number} - Returns the result.
     */
    public get row(): number {
        const ref: string = this.entry.ref;
        if (ref === undefined) {
            return 1;
        }
        try {
            return parseA1(ref).row;
        } catch {
            return 1;
        }
    }

    /**
     * Gets column.
     *
     * @returns {number} - Returns the result.
     */
    public get column(): number {
        const ref: string = this.entry.ref;
        if (ref === undefined) {
            return 1;
        }
        try {
            return parseA1(ref).col;
        } catch {
            return 1;
        }
    }

    /**
     * addReply method.
     *
     * @param {string} text - The text parameter.
     * @param {string} author - The author parameter.
     * @param {Date} createdAt - The createdAt parameter.
     * @returns {ThreadedCommentReply} - Returns the result.
     */
    public addReply(text: string, author?: string, createdAt?: Date): ThreadedCommentReply {
        return this.store.addReplyTo(this.entry, text, author, createdAt);
    }
}

/**
 * ReplyHandle class.
 */
class ReplyHandle implements ThreadedCommentReply {
    /**
     * Creates an instance.
     *
     * @param {ThreadedCommentsImpl} store - The store parameter.
     * @param {ThreadedCommentEntry} entry - The entry parameter.
     */
    private readonly store: ThreadedCommentsImpl;
    private readonly entry: ThreadedCommentEntry;

    /**
     * Creates a new instance.
     *
     * @param {ThreadedCommentsImpl} store - store value.
     * @param {ThreadedCommentEntry} entry - entry value.
     */
    public constructor(
        store: ThreadedCommentsImpl,
        entry: ThreadedCommentEntry
    ) {
        this.store = store;
        this.entry = entry;
    }

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
        if (typeof value !== 'string') {
            throw new InvalidArgumentError('Threaded comment reply text must be a string');
        }
        this.entry.text = value;
        this.store.notifyMutation();
    }

    /**
     * Gets author.
     *
     * @returns {string} - Returns the result.
     */
    public get author(): string {
        return this.store.displayNameFor(this.entry.personId);
    }

    /**
     * Gets createdAt.
     *
     * @returns {Date} - Returns the result.
     */
    public get createdAt(): Date {
        return parseXsDateTime(this.entry.dT);
    }
}

/**
 * serializeThreadedCommentsXml function.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {string} - Returns the result.
 */
function serializeThreadedCommentsXml(entries: ReadonlyArray<ThreadedCommentEntry>): string {
    const parts: string[] = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        `<ThreadedComments xmlns="${THREADED_COMMENTS_NS}" xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`
    ];
    for (const e of entries) {
        const attrs: string[] = [`id="${escapeXml(e.id)}"`, `personId="${escapeXml(e.personId)}"`];
        if (e.parentId !== undefined) {
            attrs.push(`parentId="${escapeXml(e.parentId)}"`);
        }
        if (e.ref !== undefined && e.ref.length > 0) {
            attrs.push(`ref="${escapeXml(e.ref)}"`);
        }
        if (e.dT !== undefined && e.dT.length > 0) {
            attrs.push(`dT="${escapeXml(e.dT)}"`);
        }
        if (e.done && e.parentId === undefined) {
            attrs.push('done="1"');
        }
        const children: string[] = [];
        children.push(`<text>${escapeXmlText(e.text)}</text>`);
        if (e.residualChildrenXml.length > 0) {
            children.push(e.residualChildrenXml);
        }
        parts.push(`<threadedComment ${attrs.join(' ')}>${children.join('')}</threadedComment>`);
    }
    parts.push('</ThreadedComments>');
    return parts.join('');
}

/**
 * Minimal comments part with tc={uid} placeholders + preserved foreign comments. ECMA-376-1 §18.7; [MS-XLSX] §2.3.7.3.
 *
 * @param {Object} tops - The tops parameter.
 * @param {string} foreignAuthors - The foreignAuthors parameter.
 * @param {string} foreignCommentsXml - The foreignCommentsXml parameter.
 * @returns {string} - Returns the result.
 */
/** Excel copies the opening thread into the legacy comments part as a Tahoma 9pt run. */
function serializeLegacyThreadText(text: string): string {
    const space: '' | ' xml:space="preserve"' =
        text.length > 0 && (/^\s|\s$/.test(text) || text.includes('\n') || text.includes('\t'))
            ? ' xml:space="preserve"'
            : '';
    return (
        `<r><rPr><sz val="9"/><rFont val="Tahoma"/><charset val="0"/></rPr>` +
        `<t${space}>${escapeXml(text)}</t></r>`
    );
}

function serializeCommentsPlaceholders(
    tops: ReadonlyArray<ThreadedCommentEntry>,
    foreignAuthors: ReadonlyArray<string>,
    foreignCommentsXml: ReadonlyArray<string>
): string {
    const authors: string[] = [...foreignAuthors];
    const authorIndex: Map<string, number> = new Map<string, number>();
    for (let i: number = 0; i < authors.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const a: string = authors[i];
        if (a !== undefined) {
            authorIndex.set(a, i);
        }
    }

    const commentElems: string[] = [...foreignCommentsXml];
    for (const t of tops) {
        const author: string = `tc=${t.id}`;
        let ai: number = authorIndex.get(author);
        if (ai === undefined) {
            ai = authors.length;
            authors.push(author);
            authorIndex.set(author, ai);
        }
        const ref: string = t.ref != null ? t.ref : 'A1';
        const body: string = t.text.length > 0 ? serializeLegacyThreadText(t.text) : '';
        commentElems.push(
            `<comment ref="${escapeXml(ref)}" authorId="${String(ai)}"><text>${body}</text></comment>`
        );
    }

    const authorElems: string = authors.map((a: string): string => `<author>${escapeXmlText(a)}</author>`).join('');
    return [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<comments xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
        `<authors>${authorElems}</authors>`,
        `<commentList>${commentElems.join('')}</commentList>`,
        '</comments>'
    ].join('');
}

/**
 * Collect non-tc= authors and their comment XML for preservation.
 *
 * @param {string} xml - The xml parameter.
 * @param {string[]} foreignAuthors - The foreignAuthors parameter.
 * @param {string[]} foreignCommentsXml - The foreignCommentsXml parameter.
 * @returns {void} - Returns the result.
 */
function parseForeignComments(xml: string, foreignAuthors: string[], foreignCommentsXml: string[]): void {
    const authorEls: any[] = findElementsWithAttrs(
        xml.replace(/<\/?authors[^>]*>/gi, (m: string): string => m), // keep structure for attrs helper
        'author'
    );
    // Prefer body text extraction for authors.
    const authorBodies: string[] = [];
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const authorBodyRe: RegExp = /<([A-Za-z_][\w.-]*:)?author(?=[\s/>])([^>]*)(?:\/>|>([\s\S]*?)<\/\1?author\s*>)/gi;
    for (;;) {
        const m: RegExpExecArray = authorBodyRe.exec(xml);
        if (m === null) {
            break;
        }
        authorBodies.push(unescapeXml(stripTags(m[3] != null ? m[3] : '')));
    }
    if (authorBodies.length === 0) {
        for (const el of authorEls) {
            // self-closing unlikely; skip
            void el;
        }
    }

    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const commentRe: RegExp = /<([A-Za-z_][\w.-]*:)?comment(?=[\s/>])([^>]*)(?:\/>|>([\s\S]*?)<\/\1?comment\s*>)/gi;
    for (;;) {
        const m: RegExpExecArray = commentRe.exec(xml);
        if (m === null) {
            break;
        }
        const attrText: string = m[2] != null ? m[2] : '';
        const body: string = m[3] != null ? m[3] : '';
        const attrs: ReadonlyMap<string, string> = ((__t: any): ReadonlyMap<string, string> =>
            __t == null ? undefined : __t.attrs)(findElementsWithAttrs(`<comment ${attrText}/>`, 'comment')[0]);
        if (attrs === undefined) {
            continue;
        }
        const authorIdRaw: string = attrs.get('authorId');
        const authorId: number = authorIdRaw !== undefined ? Number.parseInt(authorIdRaw, 10) : NaN;
        const authorName: string =
            // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
            Number.isFinite(authorId) && authorId >= 0 ? (authorBodies[authorId] != null ? authorBodies[authorId] : '') : '';
        if (authorName.startsWith('tc=')) {
            // Owned placeholder — drop on rewrite; rebuilt from live threads.
            continue;
        }
        // Preserve foreign author + comment.
        let newAuthorId: number = foreignAuthors.indexOf(authorName);
        if (newAuthorId < 0) {
            newAuthorId = foreignAuthors.length;
            foreignAuthors.push(authorName);
        }
        const refRaw: string = attrs.get('ref');
        const ref: string = refRaw !== undefined ? refRaw : 'A1';
        foreignCommentsXml.push(`<comment ref="${escapeXml(ref)}" authorId="${String(newAuthorId)}">${body}</comment>`);
    }
}

/**
 * allocateThreadedCommentsPartName function.
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @returns {string} - Returns the result.
 */
function allocateThreadedCommentsPartName(pkg: OpcPackage): string {
    for (let n: number = 1; n < 10_000; n += 1) {
        const name: string = `/xl/threadedComments/threadedComment${n}.xml`;
        if (pkg.getPart(name) === undefined) {
            return name;
        }
    }
    throw new InvalidThreadedCommentError('Could not allocate a threaded comments part name');
}

/**
 * allocateCommentsPartName function.
 *
 * @param {OpcPackage} pkg - The pkg parameter.
 * @returns {string} - Returns the result.
 */
function allocateCommentsPartName(pkg: OpcPackage): string {
    for (let n: number = 1; n < 10_000; n += 1) {
        // Excel commonly uses /xl/commentsN.xml at workbook root of xl.
        const candidates: string[] = n === 1 ? ['/xl/comments1.xml', '/xl/worksheets/comments1.xml'] : [`/xl/comments${n}.xml`];
        let free: boolean = true;
        for (const c of candidates) {
            if (pkg.getPart(c) !== undefined) {
                free = false;
                break;
            }
        }
        if (free) {
            return candidates[0] != null ? candidates[0] : `/xl/comments${n}.xml`;
        }
    }
    throw new InvalidThreadedCommentError('Could not allocate a comments part name');
}

/**
 * toXsDateTime function.
 *
 * @param {Date} d - The d parameter.
 * @returns {string} - Returns the result.
 */
function toXsDateTime(d: Date): string {
    // xs:dateTime UTC with milliseconds stripped when zero-ish Excel style.
    return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * parseXsDateTime function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {Date} - Returns the result.
 */
function parseXsDateTime(raw: string | undefined): Date {
    if (raw === undefined || raw.length === 0) {
        return new Date(0);
    }
    const t: number = Date.parse(raw);
    if (Number.isNaN(t)) {
        return new Date(0);
    }
    return new Date(t);
}

/**
 * normalizeRef function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {string} - Returns the result.
 */
function normalizeRef(raw: string): string {
    try {
        const c: any = parseA1(raw.trim());
        return formatA1(c.row, c.col);
    } catch {
        return raw.trim().toUpperCase();
    }
}

/**
 * stripTags function.
 *
 * @param {string} s - The s parameter.
 * @returns {string} - Returns the result.
 */
function stripTags(s: string): string {
    return s.replace(/<[^>]+>/g, '');
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
