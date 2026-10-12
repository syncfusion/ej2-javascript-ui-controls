import * as Y from '../yjs-types';
import { AbsolutePosition, SelectionRange, XmlElement, YjsDelta, InternalYRuntime } from '../base/interface';
import { Collaboration } from '../base/collaboration';
import { BlockEditorBinding } from '../plugins/sync-plugin';

/**
 * Converts between absolute and relative positions in Yjs structures
 *
 * @hidden
 */
export class YjsPosition {
    private parent: BlockEditorBinding
    private collabManager: Collaboration;
    private YRuntime: InternalYRuntime;

    constructor(parent: BlockEditorBinding, manager: Collaboration) {
        this.parent = parent;
        this.collabManager = manager;
        this.YRuntime = this.collabManager.getYRuntime();
    }

    /**
     * Converts absolute DOM position to relative position in Yjs
     *
     * @param {AbsolutePosition} pos - Absolute position in DOM
     * @param {Y.XmlFragment} yFragment - Yjs fragment for context
     * @returns {Y.RelativePosition|null} Relative position or null
     * @hidden
     */
    public absolutePositionToRelativePosition(
        pos: AbsolutePosition,
        yFragment: Y.XmlFragment
    ): Y.RelativePosition | null {
        const yBlocks: XmlElement[] = yFragment.toArray();
        if (pos.blockIndex < 0 || pos.blockIndex >= yBlocks.length) {
            return this.YRuntime.createRelativePositionFromTypeIndex(yFragment, yFragment.length, -1);
        }

        const { node: yBlock } = this.parent.yBlockHelper.findYBlockById(pos.blockId, yFragment);

        const yText: Y.XmlText = this.parent.yBlockHelper.getYTextByBlock(yBlock);

        if (yText) {
            // Clamp to [0, yText.length] to guard against stale DOM measurements
            const charOffset: number = Math.max(0, Math.min(pos.offset, yText.length));

            // Anchor the relative position to the Y.XmlText, not the fragment
            return this.YRuntime.createRelativePositionFromTypeIndex(yText, charOffset, 0);
        }

        // ── Block has no XmlText (structural block) → block-level anchor ─────
        return this.YRuntime.createRelativePositionFromTypeIndex(yFragment, pos.blockIndex, 0);
    }

    /**
     * Converts relative position from Yjs to absolute DOM position
     *
     * @param {Y.RelativePosition} relPos - Relative position in Yjs
     * @param {Y.Doc} yDoc - Yjs document
     * @param {Y.XmlFragment} yFragment - Yjs fragment
     * @returns {AbsolutePosition|null} Absolute position or null
     * @hidden
     */
    public relativePositionToAbsolutePosition(
        relPos: Y.RelativePosition,
        yDoc: Y.Doc,
        yFragment: Y.XmlFragment
    ): AbsolutePosition | null {
        const absPos: Y.AbsolutePosition = this.YRuntime.createAbsolutePositionFromRelativePosition(relPos, yDoc);
        if (!absPos) { return null; }

        const { type, index } = absPos;

        // ── Anchored in a Y.XmlText ─────────────────────────────────
        if (type instanceof this.YRuntime.XmlText) {
            const yBlockId: string = this.parent.yBlockHelper.findBlockIdForYText(type, yFragment);
            const yBlockIdx: number = this.parent.yBlockHelper.findBlockIndex(yBlockId, yFragment);

            return {
                blockIndex: yBlockIdx,
                blockId: yBlockId,
                offset: index
            };
        }

        return null;
    }

    private compareIDs(a: any, b: any): boolean {
        if (a === b) { return true; }
        if (!a || !b) { return false; }
        return a.client === b.client && a.clock === b.clock;
    }

    public compareRelativePositions(
        a: Y.RelativePosition | null,
        b: Y.RelativePosition | null
    ): boolean {
        if (a === b) { return true; }
        if (!a || !b) { return false; }

        return (
            a.tname === b.tname &&
            this.compareIDs(a.item, b.item) &&
            this.compareIDs(a.type, b.type) &&
            a.assoc === b.assoc
        );
    }
}
