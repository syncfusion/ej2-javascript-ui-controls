import * as Y from '../yjs-types';
import { simpleDiff } from './diff';
import { ContentModel } from '../../../models/content/content-model';
import { flattenObj } from './dom-offset';
import { InternalYRuntime, OffsetMap, SimpleDiffResult, YjsDelta } from '../base/interface';
import { Collaboration } from '../base/collaboration';
import { BlockEditorBinding } from '../plugins/sync-plugin';
import { ILabelContentSettings, IMentionContentSettings } from '../../../models';


/**
 * Synchronizes block editor segments with Yjs text and attributes.
 *
 * @hidden
 */
export class SegmentSync {
    private parent: BlockEditorBinding
    private collabManager: Collaboration;
    private YRuntime: InternalYRuntime;

    constructor(parent: BlockEditorBinding, manager: Collaboration) {
        this.parent = parent;
        this.collabManager = manager;
        this.YRuntime = this.collabManager.getYRuntime();
    }

    /**
     * Incrementally updates a Y.XmlText from BlockEditor segments.
     *
     * @param {Y.XmlText} yText - The Y.XmlText to update
     * @param {ContentModel[]} newSegments - The new contents from BlockEditor
     * @returns {void} - No return value
     * @hidden
     */
    public syncSegmentsToYText(
        yText: Y.XmlText,
        newSegments: ContentModel[]
    ): void {
        // Capture the pre-edit state for plain-text diffing and atomic classification.
        const preEditSegments: ContentModel[] = this.parent.conversion.yTextToContentModel(yText);

        // Build the set of atomic identities currently in YText.
        const existingAtomicSet: Set<string> = this.buildAtomicSet(preEditSegments);

        /* Build diff texts:
          currentText — full plain text of the current YText state.
          newDiffText — full plain text of newSegments, but with content of NEW atomics replaced by ''
          so simpleDiff never inserts atomic content as plain text. */
        const currentText: string = this.buildFullText(preEditSegments);
        const newDiffText: string = this.buildDiffText(newSegments, existingAtomicSet);

        if (currentText !== newDiffText) {
            const diff: SimpleDiffResult = simpleDiff(currentText, newDiffText);

            if (diff.remove > 0) {
                yText.delete(diff.index, diff.remove);
            }

            if (diff.insert.length > 0) {
                const safeAttrs: Record<string, null> = this.buildInsertSafeAttrs(yText, diff.index);
                yText.insert(
                    diff.index,
                    diff.insert,
                    safeAttrs
                );
            }
        }

        // Re-read yText after the plain-text diff so that postEditSegments
        // shares the same coordinate space as newSegments.
        const postEditSegments: ContentModel[] = this.parent.conversion.yTextToContentModel(yText);

        this.broadcastPropertiesChanges(yText, postEditSegments, newSegments);
    }

    private broadcastPropertiesChanges(
        yText: Y.XmlText,
        oldSegments: ContentModel[],
        newSegments: ContentModel[]
    ): void {
        const oldOffsetMap: OffsetMap[] = this.buildSegmentOffsetMap(oldSegments);
        const newOffsetMap: OffsetMap[] = this.buildSegmentOffsetMap(newSegments);
        const totalLength: number = newOffsetMap.reduce((sum: number, info: OffsetMap) => sum + info.length, 0);

        let currentOffset: number = 0;
        let oldSegmentIndex: number = 0;
        let newSegmentIndex: number = 0;

        while (currentOffset < totalLength) {
            let oldSegment: ContentModel | null = null;
            let oldAttrs: Record<string, any> = {};

            if (oldSegmentIndex < oldSegments.length) {
                const oldInfo: OffsetMap = oldOffsetMap[oldSegmentIndex as number];
                if (currentOffset >= oldInfo.startOffset && currentOffset < oldInfo.endOffset) {
                    oldSegment = oldSegments[oldSegmentIndex as number];
                    oldAttrs = this.parent.conversion.segmentPropertiesToAttributes(oldSegment.properties);
                } else {
                    // Move to next old segment
                    oldSegmentIndex++;
                    if (oldSegmentIndex < oldSegments.length) {
                        oldSegment = oldSegments[oldSegmentIndex as number];
                        oldAttrs = this.parent.conversion.segmentPropertiesToAttributes(oldSegment.properties);
                    }
                }
            }

            // Find which segment this offset belongs to in NEW segments
            let newSegment: ContentModel | null = null;
            let newAttrs: Record<string, any> = {};

            if (newSegmentIndex < newSegments.length) {
                const newInfo: OffsetMap = newOffsetMap[newSegmentIndex as number];
                if (currentOffset >= newInfo.startOffset && currentOffset < newInfo.endOffset) {
                    newSegment = newSegments[newSegmentIndex as number];
                    newAttrs = this.parent.conversion.segmentPropertiesToAttributes(newSegment.properties);
                } else {
                    // Move to next new segment
                    newSegmentIndex++;
                    if (newSegmentIndex < newSegments.length) {
                        newSegment = newSegments[newSegmentIndex as number];
                        newAttrs = this.parent.conversion.segmentPropertiesToAttributes(newSegment.properties);
                    }
                }
            }

            const oldAttrsStr: string = JSON.stringify(oldAttrs);
            const newAttrsStr: string = JSON.stringify(newAttrs);

            if (oldAttrsStr !== newAttrsStr) {
                // props changed! Find the range where this props applies
                let rangeEndOffset: number = currentOffset + 1;

                // Extend range until props changes again
                while (rangeEndOffset < totalLength) {
                    // Get props at rangeEndOffset
                    let checkNewAttrs: Record<string, any> = {};
                    for (let i: number = 0; i < newSegments.length; i++) {
                        const info: OffsetMap = newOffsetMap[i as number];
                        if (rangeEndOffset >= info.startOffset && rangeEndOffset < info.endOffset) {
                            checkNewAttrs = this.parent.conversion.segmentPropertiesToAttributes(newSegments[i as number].properties);
                            break;
                        }
                    }

                    if (JSON.stringify(checkNewAttrs) !== newAttrsStr) {
                        break;
                    }
                    rangeEndOffset++;
                }

                const rangeLength: number = rangeEndOffset - currentOffset;
                const yTextAttrs: Record<string, any> = this.buildAttributesWithNulls(oldAttrs, newAttrs);

                const isAtomicInsert: boolean = !!newAttrs['userId'] || !!newAttrs['labelId'];
                if (isAtomicInsert) {
                    yText.insert(currentOffset, newSegment.content, yTextAttrs);
                }
                else {
                    yText.format(currentOffset, rangeLength, yTextAttrs);
                }

                currentOffset = rangeEndOffset;
            } else {
                currentOffset++;
            }
        }
    }

    private buildSegmentOffsetMap(segments: ContentModel[]): Array<OffsetMap> {
        const map: Array<OffsetMap> = [];
        let offset: number = 0;

        for (const seg of segments) {
            const length: number = (seg.content).length;
            map.push({
                startOffset: offset,
                endOffset: offset + length,
                length
            });
            offset += length;
        }

        return map;
    }

    private buildAttributesWithNulls(
        oldAttrs: Record<string, any>,
        newAttrs: Record<string, any>
    ): Record<string, any> {
        const attrs: Record<string, any> = {};
        const oldFlattened: any = flattenObj(oldAttrs);
        const newFlattened: any = flattenObj(newAttrs);

        for (const key of Object.keys(newFlattened)) {
            const value: any = newFlattened[`${key}`];
            if (value !== undefined && value !== null) {
                attrs[`${key}`] = value;
            }
        }

        for (const key of Object.keys(oldFlattened)) {
            const oldValue: any = oldFlattened[`${key}`];
            if (!(key in newFlattened) && oldValue !== undefined && oldValue !== null) {
                attrs[`${key}`] = null;
            }
        }

        return attrs;
    }

    /**
     * Parses a Y.TextEvent into structured change descriptors.
     *
     * @param {Y.TextEvent} event - The Yjs text event to parse
     * @returns {object} - Parsed change summary
     * @hidden
     */
    public parseYTextEvent(event: Y.TextEvent): {
        isTextChange: boolean;
        isPropChange: boolean;
        changes: Array<{
            type: 'insert' | 'delete' | 'retain';
            index: number;
            length: number;
            text?: string;
            attributes?: Record<string, any>;
        }>;
    } {
        const delta: any = event.delta;
        const changes: Array<{
            type: 'insert' | 'delete' | 'retain';
            index: number;
            length: number;
            text?: string;
            attributes?: Record<string, any>;
        }> = [];

        let isTextChange: boolean = false;
        let isPropChange: boolean = false;
        let index: number = 0;

        for (const op of delta) {
            if (op.insert !== undefined) {
                isTextChange = true;
                const text: string = op.insert;
                changes.push({
                    type: 'insert',
                    index,
                    length: text.length,
                    text,
                    attributes: op.attributes
                });
                index += text.length;
            } else if (op.delete !== undefined) {
                isTextChange = true;
                changes.push({
                    type: 'delete',
                    index,
                    length: op.delete
                });
            } else {
                // op.retain case
                if (op.attributes) {
                    isPropChange = true;
                }
                changes.push({
                    type: 'retain',
                    index,
                    length: op.retain,
                    attributes: op.attributes
                });
                index += op.retain;
            }
        }

        return { isTextChange, isPropChange, changes };
    }

    /**
     * Returns the Yjs attributes of the character immediately to the left
     * of `insertOffset` by walking the current YText delta.
     * Returns `{}` when inserting at position 0 or the delta is empty.
     *
     * @param {Y.XmlText | Y.Text} yText - The ytext
     * @param {number} insertOffset - Offset to insert
     * @returns {Record<string, null>} - Left neighbouring attrs
     */
    private getLeftNeighborAttrs(
        yText: Y.XmlText | Y.Text,
        insertOffset: number
    ): Record<string, any> {
        if (insertOffset <= 0) {
            return {};
        }

        const delta: YjsDelta[] = yText.toDelta();
        const targetIndex: number = insertOffset - 1;
        let pos: number = 0;

        for (const op of delta) {
            const len: number = (op.insert as string).length;
            if (targetIndex >= pos && targetIndex < pos + len) {
                return op.attributes;
            }
            pos += len;
        }

        return {};
    }

    /**
     * Returns a Yjs attribute map that neutralizes any atomic identity
     * attributes (`userId`, `labelId`) inherited from the left neighbor,
     * preventing plain-text insertions from being absorbed into a Mention
     * or Label run.
     *
     * Returns `undefined` when no neutralization is needed so that
     * `yText.insert()` is called without a third argument in the normal case.
     *
     * @param {Y.XmlText | Y.Text} yText - The ytext
     * @param {number} insertOffset - Offset to insert
     * @returns {Record<string, null>} - Safe attrs to insert
     */
    private buildInsertSafeAttrs(
        yText: Y.XmlText | Y.Text,
        insertOffset: number
    ): Record<string, null> {
        const ATOMIC_KEYS: string[] = ['userId', 'labelId'];
        const leftAttrs: Record<string, any> = this.getLeftNeighborAttrs(yText, insertOffset);
        const neutralize: Record<string, null> = {};

        for (const key of ATOMIC_KEYS) {
            if (leftAttrs && leftAttrs[`${key}`] != null) {
                neutralize[`${key}`] = null;
            }
        }

        return Object.keys(neutralize).length > 0 ? neutralize : undefined;
    }

    private isAtomicSegment(segment: ContentModel): boolean {
        return segment.contentType === 'Mention' || segment.contentType === 'Label';
    }

    private getAtomicIdentity(segment: ContentModel): string {
        switch (segment.contentType) {
        case 'Mention':
            return `mention:${(segment.properties as IMentionContentSettings).userId}`;
        case 'Label':
            return `label:${(segment.properties as ILabelContentSettings).labelId}`;
        default:
            return '';
        }
    }

    private buildAtomicSet(segments: ContentModel[]): Set<string> {
        const set: Set<string> = new Set<string>();
        for (const segment of segments) {
            if (this.isAtomicSegment(segment)) {
                set.add(this.getAtomicIdentity(segment));
            }
        }
        return set;
    }

    private buildFullText(segments: ContentModel[]): string {
        return segments
            .map((segment: ContentModel) => segment.content)
            .join('');
    }

    /**
     * Builds the plain-text string used as the "new" side of simpleDiff.
     *
     * @param {ContentModel[]} segments - The new segment array
     * @param {Set<string>} existingAtomicSet - Identity set built from preEditSegments
     * @returns {string} - The diff text
     */
    private buildDiffText(
        segments: ContentModel[],
        existingAtomicSet: Set<string>
    ): string {
        return segments
            .map((segment: ContentModel): string => {
                // New atomic: exclude its content from the diff so that
                // broadcastPropertiesChanges remains the sole owner of insertion.
                if (
                    this.isAtomicSegment(segment) &&
                    !existingAtomicSet.has(this.getAtomicIdentity(segment))
                ) {
                    return '';
                }
                return segment.content;
            })
            .join('');
    }

}
