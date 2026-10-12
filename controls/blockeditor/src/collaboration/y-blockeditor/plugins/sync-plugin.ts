import * as Y from '../yjs-types';
import { BlockFactory } from '../../../block-manager/services/block-factory';
import { getBlockContentElement, getBlockModelById, isChildrenTypeBlock } from '../../../common/utils/block';
import { BlockModel } from '../../../models/block/block-model';
import { ContentModel } from '../../../models/content/content-model';
import { BlockChange } from '../../../models/eventargs';
import { DeltaAnalysis, DeltaOp, InternalYRuntime, ParentBlockContext, SyncPluginOptions, TableSnapshot,
    XmlElement, YBlockLocation, YjsDelta } from '../base/interface';
import { YBlockHelper } from '../utils/yBlock-helper';
import { Conversion } from '../utils/conversion';
import { TableAction } from '../utils/table-sync';
import { YjsPosition } from '../utils/position';
import { IncrementalSync } from '../utils/incremental-text';
import { createMutex } from '../utils/mutex';
import { SegmentSync } from '../utils/segment-sync';
import { ySyncPluginKey, yExcludedOrigin } from './keys';
import { BlockManager } from '../../../block-manager/base/block-manager';
import { Collaboration } from '../base/collaboration';

export class BlockEditorBinding {
    /** @hidden */
    public yBlocks: Y.XmlFragment;
    /** @hidden */
    public doc: Y.Doc;
    /** @hidden */
    public blockManager: BlockManager;
    /** @hidden */
    public isDestroyed: boolean = false;
    /** @hidden */
    public yjsPosition: YjsPosition;
    /** @hidden */
    public conversion: Conversion;
    /** @hidden */
    public incrementalSync: IncrementalSync;
    /** @hidden */
    public segmentSync: SegmentSync;
    /** @hidden */
    public yBlockHelper: YBlockHelper;

    private parent: Collaboration;
    private mux: ReturnType<typeof createMutex>;
    private _observeFunction: (events: Array<Y.YEvent<any>>, tr: Y.Transaction) => void;
    private observedYTexts: WeakSet<Y.XmlText> = new WeakSet();
    /** @hidden */
    public isApplyingRemote: boolean = false;
    private preTransactionBlockSnapshots: Map<string, (string | null)[]> = new Map();
    private preTransactionTableSnapshots: Map<string, TableSnapshot> = new Map();
    private handledYTextInTransaction: Set<Y.XmlText> = new Set();
    private YRuntime: InternalYRuntime;
    private tableAction: TableAction;

    constructor(options: SyncPluginOptions) {
        this.blockManager = options.blockManager;
        this.parent = options.parent;
        this.yBlocks = options.yBlocks;
        this.doc = options.yBlocks.doc!;
        this.mux = createMutex();

        // Runtime
        this.YRuntime = this.parent.getYRuntime();

        // Helpers
        this.tableAction = new TableAction(this, this.parent);
        this.yjsPosition = new YjsPosition(this, this.parent);
        this.conversion = new Conversion(this.parent);
        this.incrementalSync = new IncrementalSync(this, this.parent);
        this.segmentSync = new SegmentSync(this, this.parent);
        this.yBlockHelper = new YBlockHelper(this, this.parent);

        // Bind the observer function
        this._observeFunction = this.onYjsChange.bind(this);

        // Set up Yjs observers
        this.setupYjsObservers();

        this.init();
    }

    private init(): void {
        this.renderFromYjs();
        this.setupEditorObserver();
    }

    private setupYjsObservers(): void {
        this.yBlocks.observeDeep(this._observeFunction);

        this.doc.on('beforeAllTransactions', this.beforeAllTransactions);
        this.doc.on('afterAllTransactions', this.afterAllTransactions);
    }

    private setupEditorObserver(): void {
        this.blockManager.observer.on('triggerBlockChange', this.onEditorChange, this);
    }

    private beforeAllTransactions = (): void => {
        this.preTransactionBlockSnapshots.clear();
        this.preTransactionTableSnapshots.clear();

        this.captureBlockIdsSnapshot(this.yBlocks, '');

        for (const child of this.yBlocks.toArray()) {
            if (child instanceof this.YRuntime.XmlElement && child.nodeName === 'Table') {
                this.captureTableSnapshot(child);
            }
        }
    };

    private captureBlockIdsSnapshot(container: Y.XmlFragment | Y.XmlElement, containerId: string): void {
        const blockIds: (string | null)[] = container.toArray().map((child: Y.XmlElement | Y.XmlText) => {
            return (child instanceof this.YRuntime.XmlElement) ? child.getAttribute('id') : '';
        });

        this.preTransactionBlockSnapshots.set(containerId, blockIds);

        for (const child of container.toArray()) {
            if (!(child instanceof this.YRuntime.XmlElement)) { continue; }

            const nodeName: string = child.nodeName;
            const childId: string | null = child.getAttribute('id');

            // For Callout/Quote/Collapsible: capture their children
            if ((nodeName === 'Callout' || nodeName === 'Quote' || nodeName.startsWith('Collapsible')) && childId) {
                this.captureBlockIdsSnapshot(child, childId);
            }

            // For Table cells: capture blocks inside each cell
            if (nodeName === 'Table' && childId) {
                // Walk through table structure: Table -> tableRow -> tableCell
                for (const row of child.toArray()) {
                    if (!(row instanceof this.YRuntime.XmlElement) || row.nodeName !== 'tableRow') { continue; }

                    for (const cell of row.toArray()) {
                        const cellId: string | null = (cell as Y.XmlElement).getAttribute('id');
                        this.captureBlockIdsSnapshot((cell as Y.XmlElement), cellId);
                    }
                }
            }
        }
    }

    private captureTableSnapshot(yTable: Y.XmlElement): void {
        const tableBlockId: string = yTable.getAttribute('id') as string;
        const columnIds: string[] = [];
        const rowIds: string[] = [];

        for (let child of yTable.toArray()) {
            child = child as Y.XmlElement;
            if (child.nodeName === 'tableColumn') {
                columnIds.push(child.getAttribute('id') as string);
            }
            else {
                // 'tableRow'
                rowIds.push(child.getAttribute('id') as string);
            }
        }

        this.preTransactionTableSnapshots.set(tableBlockId, { columnIds, rowIds });
    }

    private afterAllTransactions = (): void => {
        this.preTransactionBlockSnapshots.clear();
        this.preTransactionTableSnapshots.clear();
        this.handledYTextInTransaction.clear();
    };

    private onYjsChange(events: Y.YEvent<any>[], transaction: Y.Transaction): void {
        const localOrigins: Set<any> = new Set([ySyncPluginKey, yExcludedOrigin]);
        if (this.isDestroyed || localOrigins.has(transaction.origin)) {
            return;
        }

        this.mux(() => {
            this.applyYjsChanges(events, transaction);
        });
    }

    private applyYjsChanges(events: Y.YEvent<any>[], transaction: Y.Transaction): void {
        // Categorize events
        const structuralEvents: Y.XmlEvent[] = [];
        const textEvents: Y.TextEvent[] = [];
        const propertyEvents: Y.XmlEvent[] = [];

        for (const event of events) {
            if (event.target === this.yBlocks) {
                // Root level change (block add/remove/move)
                structuralEvents.push(event as Y.XmlEvent);
            } else if (event.target instanceof this.YRuntime.XmlText) {
                const yText: Y.XmlText = event.target as Y.XmlText;

                // If this yText was already handled by its own observer, skip it
                if (this.handledYTextInTransaction.has(yText)) {
                    continue;
                }
                // Text content change - handle incrementally
                textEvents.push(event as Y.TextEvent);
            } else if (event.target instanceof this.YRuntime.XmlElement) {
                // Check if this is a structural change or property change
                const xmlEvent: Y.XmlEvent = event as Y.XmlEvent;
                if ((xmlEvent as any).childListChanged) {
                    structuralEvents.push(xmlEvent);
                } else {
                    propertyEvents.push(xmlEvent);
                }
            }
        }

        if (structuralEvents.length > 0) {
            this.handleStructuralEvents(structuralEvents, transaction);
        }

        for (const propEvent of propertyEvents) {
            this.handlePropertyEvent(propEvent);
        }

        for (const textEvent of textEvents) {
            this.handleTextEventIncremental(textEvent);
        }
    }

    private onEditorChange = (changes: BlockChange[]): void => {
        this.mux(() => {
            this.doc.transact(() => {
                this.applyEditorChanges(changes);
            }, ySyncPluginKey);
        });
    }

    private applyEditorChanges(changes: BlockChange[]): void {
        // Group changes
        const insertions: BlockChange[] = [];
        const deletions: BlockChange[] = [];
        const updates: BlockChange[] = [];
        const moves: BlockChange[] = [];

        for (const change of changes) {
            const action: string = (change.action).toLowerCase();
            switch (action) {
            case 'insertion':
                insertions.push(change);
                break;
            case 'deletion':
                deletions.push(change);
                break;
            case 'moved':
                moves.push(change);
                break;
            case 'update':
            default:
                updates.push(change);
                break;
            }
        }

        // Process moves first (to avoid order issues)
        if (moves.length > 0) {
            this.handleBlockMove(moves[0]);
        }

        // Updates
        for (const change of updates) {
            const prevBlock: BlockModel | undefined = change.data.prevBlock;
            const block: BlockModel = change.data.block;
            if ((prevBlock && block) && (prevBlock.blockType !== block.blockType)) {
                this.handleBlockTransformation(change);
            } else {
                this.handleBlockUpdateIncremental(change);
            }
        }

        // Insertions
        for (const change of insertions) {
            this.handleBlockInsertion(change);
        }

        // Deletions
        for (const change of deletions) {
            this.handleBlockDeletion(change);
        }
    }

    private handleBlockMove(change: any): void {
        const { currentParent, prevParent, fromBlockIds, toBlockId, isMovingUp } = change.data;

        this.moveBlocksYjs(fromBlockIds, toBlockId, isMovingUp, currentParent, prevParent);
    }

    private moveBlocksYjs(
        blockIds: string[],
        toBlockId: string | undefined,
        isMovingUp: boolean,
        currentParent: BlockModel | undefined,
        prevParent: BlockModel | undefined
    ): void {
        const yBlocks: Y.XmlElement[] = [];
        // Adjustment is only needed if moving across different parents to account for the shift caused by removal
        // (For ex. moving from root to callout child)
        const adjustmentValue: number = (currentParent !== prevParent) ? (isMovingUp ? 0 : 1) : 0;
        const dropIndex: number = (this.yBlockHelper.findBlockIndex(toBlockId, this.yBlocks) + adjustmentValue) || 0;
        const parentMap: Map<Y.XmlElement | Y.XmlFragment, number[]> = new Map<Y.XmlElement | Y.XmlFragment, number[]>();

        // 1. Collect indices grouped by parent
        for (const id of blockIds) {
            const block: BlockModel = getBlockModelById(id, this.blockManager!.getEditorBlocks());
            const found: YBlockLocation = this.yBlockHelper.findYBlockById(id, this.yBlocks);
            const parentY: Y.XmlElement | Y.XmlFragment = found.parent;
            const index: number = found.index;
            if (index < 0) { continue; }

            yBlocks.push(this.conversion.blockModelToYElement(block));
            if (!parentMap.has(parentY)) {
                parentMap.set(parentY, []);
            }
            parentMap.get(parentY)!.push(index);
        }

        parentMap.forEach((indices: number[], parentY: Y.XmlElement) => {
            indices.sort((a: any, b: any) => a - b);
            const ranges: Array<{ start: number; length: number }> = [];
            let start: number = indices[0];
            let prev: number = indices[0];
            for (let i: number = 1; i < indices.length; i++) {
                const curr: number = indices[i as number];
                if (curr === prev + 1) {
                    prev = curr;
                } else {
                    ranges.push({ start, length: prev - start + 1 });
                    start = curr;
                    prev = curr;
                }
            }
            ranges.push({ start, length: prev - start + 1 });
            // Delete in reverse order
            for (let i: number = ranges.length - 1; i >= 0; i--) {
                const r: { start: number; length: number } = ranges[i as number];
                parentY.delete(r.start, r.length);
            }
        });

        // Insert all at new position
        let targetParentY: Y.XmlFragment | Y.XmlElement = this.yBlocks;
        if (currentParent && currentParent.id) {
            targetParentY = this.yBlockHelper.findYBlockById(currentParent.id, this.yBlocks).node;
        }

        targetParentY.insert(dropIndex, yBlocks);
    }

    private renderFromYjs(): void {
        const editorBlocks: BlockModel[] = this.conversion.yFragmentToBlocks(this.yBlocks);

        if (editorBlocks.length === 0) {
            // Sync the default block to Yjs if Yjs is empty on first load
            this.broadcastBlocksToYjs(this.yBlocks, this.blockManager.getEditorBlocks());
            return;
        }

        const populatedBlocks: BlockModel[] = BlockFactory.populateBlockProperties(editorBlocks, this.blockManager);
        this.blockManager.setEditorBlocks(populatedBlocks);
        this.blockManager.stateManager.updateManagerBlocks();

        this.attachYTextObserversToAll();
    }

    private handleStructuralEvents(events: Y.XmlEvent[], transaction: Y.Transaction): void {
        this.isApplyingRemote = true;

        try {
            for (const event of events) {
                if (event.target === this.yBlocks) {
                    this.handleStructuralChange(event, transaction, { yContainer: this.yBlocks });
                } else {
                    this.handleNestedStructuralChange(event, transaction);
                }
            }
        } finally {
            // Use setTimeout to allow the editor to process changes
            setTimeout(() => { this.isApplyingRemote = false; }, 0);
        }
    }

    private handleNestedStructuralChange(event: Y.XmlEvent, transaction: Y.Transaction): void {
        const yElement: Y.XmlElement = event.target as Y.XmlElement;
        const yElementType: string = yElement.nodeName;

        if (yElementType === 'Table') {
            const tableBlockId: string = yElement.getAttribute('id') as string;
            const snapshot: TableSnapshot = this.preTransactionTableSnapshots.get(tableBlockId);

            this.tableAction.applyRemoteTableStructuralChange(event, tableBlockId, this.blockManager, snapshot);
            return;
        }

        if (yElementType === 'tableCell') {
            // A block was added or removed inside a cell (e.g. Enter key in cell)
            const tableBlockId: string = this.getTableBlockIdFromCell(yElement);
            const cellId: string = yElement.getAttribute('id') as string;

            this.tableAction.applyRemoteCellBlockChange(event, tableBlockId, cellId, this.blockManager);
            return;
        }

        // Get parent block context
        const context: ParentBlockContext = this.getParentBlockContext(yElement);

        if (context && isChildrenTypeBlock(yElementType)) {
            this.handleStructuralChange(event, transaction, {
                yContainer: yElement,
                parentBlockId: context.parentBlockId
            });
        }
    }

    private handleStructuralChange(
        event: Y.XmlEvent,
        transaction: Y.Transaction,
        context: {
            yContainer: Y.XmlFragment | Y.XmlElement,
            parentBlockId?: string
        }
    ): void {
        const delta: YjsDelta[] = event.changes.delta;
        const snapshotKey: string = context.parentBlockId || '';
        const snapshot: string[] = Array.from(this.preTransactionBlockSnapshots.get(snapshotKey)) as string[];

        const analysis: DeltaAnalysis = this.analyzeDelta(delta, snapshot);
        this.applyDeltaOps(analysis, transaction, context, snapshot);
    }

    private analyzeDelta(
        delta: YjsDelta[],
        snapshot: string[]
    ): DeltaAnalysis {
        let newIndex: number = 0;
        let snapshotIndex: number = 0;
        const inserts: DeltaAnalysis['inserts'] = [];
        const deletes: DeltaAnalysis['deletes'] = [];

        // Step 1: Collect raw inserts & deletes
        for (const op of delta) {
            if (op.retain !== undefined) {
                newIndex += op.retain;
                snapshotIndex += op.retain;
            }
            else if (op.insert !== undefined && Array.isArray(op.insert)) {
                for (let i: number = 0; i < op.insert.length; i++) {
                    const el: Y.XmlElement = op.insert[i as number];

                    inserts.push({
                        id: el.getAttribute('id'),
                        yElement: el,
                        index: newIndex + i
                    });
                }
                newIndex += op.insert.length;
            }
            else if (op.delete !== undefined) {
                for (let i: number = 0; i < op.delete; i++) {
                    const id: string = snapshot[snapshotIndex + i];
                    deletes.push({
                        id,
                        index: snapshotIndex + i
                    });
                }
                snapshotIndex += op.delete;
            }
        }

        // Step 2: Detect MOVE (same id in insert + delete)
        const deleteMap: Map<string, number> = new Map<string, number>();
        deletes.forEach((d: { id: string; index: number }) => deleteMap.set(d.id, d.index));
        const moves: DeltaAnalysis['moves'] = [];
        const transforms: DeltaAnalysis['transforms'] = [];
        const finalInserts: DeltaAnalysis['inserts'] = [];
        const finalDeletes: DeltaAnalysis['deletes'] = [];

        for (const ins of inserts) {
            if (deleteMap.has(ins.id)) {
                const deleteIndex: number = deleteMap.get(ins.id);
                // Same index → TRANSFORM
                if (deleteIndex === ins.index) {
                    transforms.push(ins);
                } else {
                    // Different index → MOVE
                    moves.push({
                        id: ins.id,
                        toIndex: ins.index
                    });
                }
                deleteMap.delete(ins.id); // consume
            } else {
                finalInserts.push(ins);
            }
        }

        // Remaining deletes = actual deletes
        deleteMap.forEach((index: number, id: string) => {
            finalDeletes.push({ id, index });
        });

        return {
            inserts: finalInserts,
            deletes: finalDeletes,
            moves,
            transforms
        };
    }

    private applyDeltaOps(
        analysis: DeltaAnalysis,
        transaction: Y.Transaction,
        context: {
            yContainer: Y.XmlFragment | Y.XmlElement,
            parentBlockId?: string
        },
        snapshot: string[]
    ): void {
        // 1. TRANSFORMS (highest priority)
        for (const t of analysis.transforms) {
            this.handleRemoteTransformation(t.id, t.yElement, t.index, transaction);
        }

        // 2. MOVES
        if (analysis.moves.length > 0) {
            const moveIds: string[] = analysis.moves.map((m: { id: string; toIndex: number; }) => m.id);
            const firstMove: { id: string; toIndex: number } = analysis.moves[0];
            const toBlockId: string = snapshot[firstMove.toIndex];
            this.blockManager.execCommand({
                command: 'MoveBlock',
                state: {
                    fromBlockIds: moveIds,
                    toBlockId
                }
            });
            // Attach observers
            for (const m of analysis.moves) {
                const { node } = this.yBlockHelper.findYBlockById(m.id, this.yBlocks);
                this.attachYTextObserverToBlock(node);
            }
        }

        // 3. INSERTS
        const workingOrder: string[] = [...snapshot];
        for (const ins of analysis.inserts) {
            let targetId: string = null;
            let isAfter: boolean = false;
            const blockModel: BlockModel = this.conversion.yElementToBlockModel(
                ins.yElement,
                context.parentBlockId
            );

            if (ins.index >= workingOrder.length) {
                // append at end
                targetId = workingOrder[workingOrder.length - 1] || null;
                isAfter = true;
            } else {
                // insert before existing item
                targetId = workingOrder[ins.index];
                isAfter = false;
            }

            this.blockManager.editorMethods.addBlock(
                blockModel,
                targetId,
                isAfter,
                true
            );

            workingOrder.splice(ins.index, 0, blockModel.id);
            this.attachYTextObserverToBlock(ins.yElement);
        }

        // 4. DELETES (only real deletes now)
        for (const del of analysis.deletes) {
            this.blockManager.editorMethods.removeBlock(del.id, context.parentBlockId);
        }
    }

    private handleRemoteTransformation(
        deletedId: string,
        newYBlock: Y.XmlElement,
        index: number,
        transaction: Y.Transaction
    ): void {
        this.isApplyingRemote = true;

        try {
            let newBlockModel: BlockModel = this.conversion.yElementToBlockModel(newYBlock);
            const currentBlock: BlockModel = getBlockModelById(deletedId, this.blockManager.getEditorBlocks());

            newBlockModel = BlockFactory.createBlockFromPartial(newBlockModel);
            const blockElement: HTMLElement = this.blockManager.blockContainer.querySelector(`#${deletedId}`) as HTMLElement;
            this.parent.blockManager.blockService.updateContent(deletedId, newBlockModel.content);
            this.blockManager.blockCommand.handleBlockTransformation({
                block: currentBlock,
                blockElement: blockElement,
                newBlockType: newBlockModel.blockType,
                props: newBlockModel.properties,
                indent: newBlockModel.indent,
                isUndoRedoAction: true,
                shouldPreventUpdates: !transaction.local
            });

        } finally {
            setTimeout(() => { this.isApplyingRemote = false; }, 0);
        }
    }

    private getParentBlockContext(yElement: Y.XmlElement): ParentBlockContext | null {
        let current: Y.XmlElement = yElement;

        while (current) {
            if (current instanceof this.YRuntime.XmlElement) {
                const nodeName: string = current.nodeName;
                const id: string = current.getAttribute('id');

                // For Callout/Quote/Collapsible: these directly contain child blocks
                if (id && (nodeName === 'Callout' || nodeName === 'Quote' || nodeName.startsWith('Collapsible'))) {
                    return {
                        parentBlockId: id as string,
                        yContainer: yElement, // The element itself is the container
                        containerType: nodeName.toLowerCase() as any
                    };
                }

                // Skip internal structures like tableRow (no id, structural only)
            }
            current = current.parent as any;
        }

        return null;
    }

    private getTableBlockIdFromCell(yCell: Y.XmlElement): string | null {
        const yRow: any = yCell.parent;
        const yTable: any = yRow.parent;

        return yTable.getAttribute('id') as string | null;
    }

    private handlePropertyEvent(event: Y.XmlEvent): void {
        const yElement: Y.XmlElement = event.target as Y.XmlElement;

        // tableColumn property changes (width, headerText, type)
        if (yElement.nodeName === 'tableColumn') {
            const yTable: Y.XmlElement = yElement.parent as Y.XmlElement;
            const tableBlockId: string = yTable.getAttribute('id') as string;

            this.tableAction.applyRemoteColumnPropertyChange(event, tableBlockId, this.blockManager);
            return;
        }

        const blockId: string = yElement.getAttribute('id') as string;

        // Get the changed keys
        const changedKeys: Map<string, any> = event.changes.keys;
        const block: BlockModel = getBlockModelById(blockId, this.blockManager.getEditorBlocks());

        changedKeys.forEach((change: { action: string }, key: string) => {
            const newValue: string = yElement.getAttribute(key);

            if (key === 'indent') {
                block.indent = parseInt(newValue as string || '0', 10);
            } else {
                try {
                    (block as any).properties[`${key}`] = JSON.parse(newValue as string);
                } catch {
                    (block as any).properties[`${key}`] = newValue;
                }
            }
        });


        this.blockManager.blockService.replaceBlock(blockId, block);
        this.blockManager.stateManager.updateManagerBlocks();
        this.blockManager.observer.notify('modelChanged', {
            type: 'ReplaceBlock',
            state: {
                targetBlockId: block.id,
                block: block,
                oldBlock: null,
                preventEventTrigger: true
            }
        });
    }

    private handleTextEventIncremental(event: Y.TextEvent): void {
        const yText: Y.XmlText = event.target as Y.XmlText;
        const blockId: string = this.yBlockHelper.findBlockIdForYText(yText, this.yBlocks);

        // Get current block
        const block: BlockModel = getBlockModelById(blockId, this.blockManager.getEditorBlocks()) as BlockModel;
        const blockElement: HTMLElement = this.blockManager.getBlockElementById(blockId) as HTMLElement;
        const contentContainer: HTMLElement = getBlockContentElement(blockElement) as HTMLElement;

        // Extract delta operations from the Y.XmlText event
        const delta: DeltaOp[] = this.incrementalSync.extractDeltaFromEvent(event);

        // Apply delta to DOM using offset-based mutations
        this.incrementalSync.applyDelta(contentContainer, delta, event);

        // Update the block content in the model
        const newContent: ContentModel[] = this.conversion.yTextToContentModel(yText);
        this.blockManager.blockService.updateContent(block.id, newContent);
    }

    private attachYTextObserverToBlock(yBlock: Y.XmlElement): void {
        for (const child of yBlock.toArray()) {
            if (child instanceof this.YRuntime.XmlText) {
                this.observeYText(child);
            } else if (child instanceof this.YRuntime.XmlElement) {
                // Recursively attach to nested blocks
                this.attachYTextObserverToBlock(child);
            }
        }
    }

    private observeYText(yText: Y.XmlText): void {
        if (this.observedYTexts.has(yText)) { return; }
        this.observedYTexts.add(yText);

        yText.observe((event: Y.TextEvent, transaction: Y.Transaction) => {
            // Skip if this is our own local change
            const localOrigins: Set<any> = new Set([ySyncPluginKey, yExcludedOrigin]);
            if (localOrigins.has(transaction.origin)) { return; }

            if (this.isApplyingRemote) { return; }
            // Mark this yText as handled so we don't process it again in applyYjsChanges
            this.handledYTextInTransaction.add(yText);

            this.handleTextEventIncremental(event);
        });
    }

    private attachYTextObserversToAll(): void {
        for (const child of this.yBlocks.toArray()) {
            if (child instanceof this.YRuntime.XmlElement) {
                this.attachYTextObserverToBlock(child);
            }
        }
    }

    private handleBlockInsertion(change: any): void {
        const block: BlockModel = change.data.block;
        const targetId: string = change.data.targetId;
        const place: 'after' | 'before' = change.data.isAfter ? 'after' : 'before';
        const parentId: string = block.parentId;
        const yBlock: Y.XmlElement = this.conversion.blockModelToYElement(block);

        if (parentId) {
            this.insertIntoParent(yBlock, parentId, targetId, place);
        } else {
            const targetIndex: number = this.yBlockHelper.findBlockIndex(targetId, this.yBlocks);
            const insertIndex: number = targetIndex >= 0
                ? (place === 'after' ? targetIndex + 1 : targetIndex)
                : this.yBlocks.length;

            this.yBlocks.insert(insertIndex, [yBlock] as any);
        }
    }

    private handleBlockDeletion(change: BlockChange): void {
        const blockId: string = change.data.block.id;
        const result: { node: Y.XmlElement; parent: Y.XmlFragment | Y.XmlElement } = this.yBlockHelper.findYBlockById(
            blockId, this.yBlocks
        );

        if (result) {
            const { node, parent } = result;
            const index: number = parent.toArray().indexOf(node);

            if (index >= 0) {
                parent.delete(index, 1);
            }
        }
    }

    private handleBlockTransformation(change: BlockChange): void {
        const block: BlockModel = change.data.block;

        const container: Y.XmlElement | Y.XmlFragment = block.parentId
            ? this.yBlockHelper.getParentContainer(block.parentId)
            : this.yBlocks;

        const newNode: Y.XmlElement = this.conversion.blockModelToYElement(block);

        this.transformNode(container, block.id, newNode);
    }

    private transformNode(
        container: Y.XmlElement | Y.XmlFragment,
        targetId: string,
        newNode: Y.XmlElement
    ): void {
        const index: number = this.yBlockHelper.findBlockIndex(targetId, container);

        container.delete(index, 1);
        container.insert(index, [newNode]);
    }

    private handleBlockUpdateIncremental(change: BlockChange): void {
        const block: BlockModel = change.data.block;
        const found: YBlockLocation = this.yBlockHelper.findYBlockById(block.id, this.yBlocks);
        if (!found) { return; }

        if (block.blockType === 'Table') {
            const prevBlock: BlockModel = change.data.prevBlock;
            if (prevBlock) {
                this.tableAction.syncTableUpdateToYjs(found.node, prevBlock, block, this.doc);
            }
        }

        this.updateYBlockAttributesIfChanged(found.node, block);

        if (found.node.get(0) instanceof this.YRuntime.XmlText) {
            const yText: Y.XmlText = found.node.get(0) as Y.XmlText;
            this.segmentSync.syncSegmentsToYText(yText as Y.XmlText, block.content);
        }
    }

    private updateYBlockAttributesIfChanged(yBlock: Y.XmlElement, block: BlockModel): void {
        // Update indent only if changed
        const newIndent: number = block.indent;
        const currentIndent: number = parseInt(yBlock.getAttribute('indent'), 10) || 0;

        if (newIndent !== currentIndent) {
            if (newIndent > 0) {
                yBlock.setAttribute('indent', String(newIndent));
            } else {
                yBlock.removeAttribute('indent');
            }
        }

        if (block.properties) {
            const { children, rows, columns, ...props } = block.properties as any;

            for (const key of Object.keys(props)) {
                const currentValue: string = yBlock.getAttribute(key);
                const newValue: string = typeof props[`${key}`] === 'object' ? JSON.stringify(props[`${key}`]) : String(props[`${key}`]);

                if (currentValue !== newValue) {
                    yBlock.setAttribute(key, newValue);
                }
            }
        }
    }

    private insertIntoParent(
        yBlock: Y.XmlElement,
        parentId: string,
        targetId: string | undefined,
        place: 'before' | 'after'
    ): void {
        const { node: parentYBlock } = this.yBlockHelper.findYBlockById(parentId, this.yBlocks);

        const childIndex: number = this.yBlockHelper.findChildIndex(parentYBlock, targetId);
        const insertIndex: number = place === 'after' ? childIndex + 1 : childIndex;
        parentYBlock.insert(insertIndex, [yBlock]);
    }

    private broadcastBlocksToYjs(yBlocks: Y.XmlFragment, blocks: any[]): void {
        yBlocks.doc.transact(() => {
            // Insert new blocks
            const yElements: Y.XmlElement[] = blocks.map((block: BlockModel) => this.conversion.blockModelToYElement(block));
            yBlocks.insert(0, yElements);
        }, ySyncPluginKey);

        for (const block of this.yBlocks.toArray()) {
            const yText: Y.XmlText | Y.XmlElement = (block as Y.XmlElement).get(0);
            if (yText instanceof this.YRuntime.XmlText) {
                this.observeYText(yText);
            }
        }
    }

    /**
     * Removes a mention character (e.g., "/") from Yjs at the specified position with excluded origin.
     * This prevents the removal from appearing in the undo/redo history.
     *
     * @param {BlockModel} block - The block model with content information
     * @param {ContentModel} affectedContent - The content model where "/" is located
     * @param {number} offsetInContent - Offset position within the affectedContent
     * @returns {void}
     * @hidden
     */
    public removeMentionCharFromYjs(
        block: BlockModel,
        affectedContent: ContentModel,
        offsetInContent: number
    ): void {
        const yBlockLocation: YBlockLocation = this.yBlockHelper.findYBlockById(block.id, this.yBlocks);
        if (!yBlockLocation || !yBlockLocation.node) {
            return;
        }
        const yBlock: Y.XmlElement = yBlockLocation.node;
        const yText: Y.XmlText = this.yBlockHelper.getYTextByBlock(yBlock);
        if (!yText || offsetInContent <= 0) {
            return;
        }
        // Calculate absolute offset in yText by summing all preceding content models
        // offsetInContent is offset within affectedContent, but yText contains the full block content
        let absoluteOffset: number = 0;
        for (const content of block.content) {
            if (content === affectedContent) {
                // Found the target content model, add its local offset
                absoluteOffset += offsetInContent - 1;
                break;
            }
            // Add length of preceding content models
            absoluteOffset += content.content ? content.content.length : 0;
        }
        // Delete "/" with excluded origin so it doesn't appear in undo history
        // This removal is PERMANENT and will persist even after undo/redo cycles
        yBlock.doc.transact(() => {
            yText.delete(absoluteOffset, 1);
        }, yExcludedOrigin);
    }

    destroy(): void {
        if (this.isDestroyed) { return; }
        this.isDestroyed = true;

        this.yBlocks.unobserveDeep(this._observeFunction);

        this.doc.off('beforeAllTransactions', this.beforeAllTransactions);
        this.doc.off('afterAllTransactions', this.afterAllTransactions);

        this.blockManager.observer.off('triggerBlockChange', this.onEditorChange);

        this.preTransactionBlockSnapshots.clear();

        this.tableAction = null;
        this.yjsPosition = null;
        this.conversion = null;
        this.incrementalSync = null;
        this.segmentSync = null;
        this.yBlockHelper = null;
    }
}
