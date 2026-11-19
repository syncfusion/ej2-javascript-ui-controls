import * as Y from '../yjs-types';
import { insertTextAtOffset, deleteTextAtOffset, findTextNodeAtOffset, walkTextNodes } from './dom-offset';
import { DeltaOp, InternalYRuntime, TextNodePosition } from '../base/interface';
import { ContentType } from '../../../models/enums';
import { StyleModel, Styles } from '../../../models/content/content-props';
import { Collaboration } from '../base/collaboration';
import { findClosestParent } from '../../../common/utils/dom';
import { YTextAttributes } from '../base/interface';
import { ExecCommandOptions } from '../../../common/interface';
import { detectFormatsForTextNode } from '../../../common/utils/html-parser';
import { BlockEditorBinding } from '../plugins/sync-plugin';

/**
 * Applies incremental text changes from Yjs deltas to DOM
 *
 * @hidden
 */
export class IncrementalSync {
    private parent: BlockEditorBinding
    private collabManager: Collaboration;
    private YRuntime: InternalYRuntime;

    constructor(parent: BlockEditorBinding, manager: Collaboration) {
        this.parent = parent;
        this.collabManager = manager;
        this.YRuntime = this.collabManager.getYRuntime();
    }

    /**
     * Applies delta operations to update DOM content
     *
     * @param {HTMLElement} container - Container element to update
     * @param {DeltaOp[]} delta - Array of delta operations
     * @param {Y.TextEvent} event - Y.Text event that triggered change
     * @returns {void}
     * @hidden
     */
    public applyDelta(
        container: HTMLElement,
        delta: DeltaOp[],
        event: Y.TextEvent
    ): void {
        let currentOffset: number = 0;
        const { isPropChange } = this.parent.segmentSync.parseYTextEvent(event);

        for (const op of delta) {
            if (op.retain !== undefined) {
                const retainLength: number = op.retain;

                if (isPropChange && op.attributes) {
                    const startOffset: number = currentOffset;
                    const endOffset: number = startOffset + op.retain;
                    let absolutePos: number = 0;
                    for (const [node] of walkTextNodes(container)) {
                        const nodeLength: number = node.textContent.length;
                        const nodeStart: number = absolutePos;
                        const nodeEnd: number = absolutePos + nodeLength;
                        // Skip nodes before range
                        if (nodeEnd <= startOffset) {
                            absolutePos += nodeLength;
                            continue;
                        }
                        // Stop after range
                        if (nodeStart >= endOffset) {
                            break;
                        }
                        const overlapStart: number = Math.max(nodeStart, startOffset);
                        const overlapEnd: number = Math.min(nodeEnd, endOffset);
                        const applyLen: number = overlapEnd - overlapStart;
                        if (applyLen <= 0) {
                            absolutePos += nodeLength;
                            continue;
                        }
                        const formats: Styles = detectFormatsForTextNode(node);
                        if (!this.shouldApplyFormatChange(formats, op.attributes)) {
                            absolutePos += nodeLength;
                            continue;
                        }
                        this.applyPropertyChanges(
                            container,
                            overlapStart,
                            applyLen,
                            op.attributes
                        );
                        absolutePos += nodeLength;
                    }
                }

                currentOffset += retainLength;
            } else if (op.insert !== undefined) {
                const text: string = op.insert;
                const incomingAttrs: YTextAttributes = op.attributes;
                /* Process Inline content insertions */
                const inlineItemId: string = incomingAttrs ? (incomingAttrs.labelId || incomingAttrs.userId) : null;
                if (inlineItemId) {
                    this.processInlineInsertion(container, currentOffset, incomingAttrs);
                }
                else {
                    insertTextAtOffset(container, currentOffset, text);
                }

                currentOffset += text.length;
            } else {
                // op.delete case
                const deleteLength: number = op.delete;
                deleteTextAtOffset(container, currentOffset, deleteLength);
            }
        }
    }

    /**
     * Checks if format change should be applied
     *
     * @param {Object} existing - Existing format properties
     * @param {Object} incoming - Incoming format properties
     * @returns {boolean} True if change should be applied
     * @hidden
     */
    public shouldApplyFormatChange(
        existing: any,
        incoming: any
    ): boolean {
        for (const key of Object.keys(incoming)) {
            const value: any = incoming[`${key}`];
            // REMOVE format (bold:null)
            if (value === null) {
                if (existing[`${key}`]) {
                    return true; // only remove if it exists
                }
            }
            // APPLY format (bold:true / color etc.)
            else {
                // Even if existing has same key, if it is valueBasedFormat then format should be applied
                const valueBasedFormats: string[] = ['color', 'backgroundColor', 'url'];
                const isValueBasedFormat: boolean = valueBasedFormats.indexOf(key) !== -1;
                if (!existing[`${key}`] || isValueBasedFormat) {
                    return true; // only apply if not already present
                }
            }
        }
        return false;
    }

    /**
     * Applies property changes to specified range
     *
     * @param {HTMLElement} container - Container element
     * @param {number} absoluteOffset - Start offset of range
     * @param {number} length - Length of range
     * @param {YTextAttributes} incomingAttrs - Attributes to apply
     * @returns {void}
     * @hidden
     */
    public applyPropertyChanges(
        container: HTMLElement,
        absoluteOffset: number,
        length: number,
        incomingAttrs: YTextAttributes
    ): void {
        const range: Range = document.createRange();
        const selection: Selection = window.getSelection();
        this.collabManager.blockManager.formattingAction.nodeSelection.saveSelection();

        const startPos: TextNodePosition = findTextNodeAtOffset(container, absoluteOffset);
        if (!startPos) { return; }

        const endPos: TextNodePosition = findTextNodeAtOffset(container, absoluteOffset + length);
        if (!endPos) { return; }

        range.setStart(startPos.node, startPos.offsetInNode);
        range.setEnd(endPos.node, endPos.offsetInNode);

        selection.removeAllRanges();
        selection.addRange(range);

        /* Process formatting actions */
        this.applyFormattingsToEditor(incomingAttrs, range);

        this.collabManager.blockManager.formattingAction.nodeSelection.restoreSelection();
    }

    /**
     * Applies formatting actions based on attributes
     *
     * @param {YTextAttributes} properties - Text attributes to apply
     * @param {Range} range - DOM range to apply to
     * @returns {void}
     * @hidden
     */
    public applyFormattingsToEditor(
        properties: YTextAttributes,
        range: Range
    ): void {
        // Compare old with new
        const currentAttrs: any = this.collabManager.blockManager.inlineToolbarModule.detectFormatsFromSelection(range);

        for (const key of Object.keys(properties)) {
            const val: any = (properties as any)[`${key}`];
            if (key in currentAttrs && val !== null && (currentAttrs[`${key}`] === val)) {
                continue; //skip
            }
            const state: ExecCommandOptions = {
                isRemoteChanges: true,
                ...(key === 'url'
                    ? { subCommand: 'link', value: { url: val } }
                    : { command: key as keyof StyleModel, value: val })
            };

            this.collabManager.blockManager.execCommand({
                command: 'FormattingAction',
                state
            });
        }
    }

    /**
     * Processes inline content insertion (labels, mentions)
     *
     * @param {HTMLElement} container - Container element
     * @param {number} absoluteOffset - Offset to insert at
     * @param {YTextAttributes} properties - Inline content attributes
     * @returns {void}
     * @hidden
     */
    public processInlineInsertion(
        container: HTMLElement,
        absoluteOffset: number,
        properties: YTextAttributes
    ): void {
        const blockEle: HTMLElement = findClosestParent(container, '.e-block');
        const contentType: ContentType = properties.labelId ? ContentType.Label : ContentType.Mention;
        const inlineItemId: string = properties.labelId || properties.userId;
        this.collabManager.blockManager.inlineContentInsertionModule.insertInlineContentAtOffset(
            blockEle.id,
            absoluteOffset,
            contentType,
            inlineItemId
        );
    }

    /**
     * Extracts delta operations from Y.TextEvent
     *
     * @param {Y.TextEvent} event - Y.Text event
     * @returns {DeltaOp[]} Array of delta operations
     * @hidden
     */
    public extractDeltaFromEvent(event: Y.TextEvent): DeltaOp[] {
        return (event.delta) as DeltaOp[];
    }

}
