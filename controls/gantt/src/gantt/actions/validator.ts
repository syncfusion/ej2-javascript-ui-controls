import { Gantt } from '../base/gantt';
import { IGanttData, IPredecessor } from '../base/interface';
interface CycleCheckResult {
    wouldCreate: boolean;
    cycles: string[][];
}
export class cyclicValidator {
    private idToItem: Map<string, IGanttData> = new Map<string, IGanttData>();
    private parentToChildren: Map<string, string[]> = new Map<string, string[]>();
    private leafCache: Map<string, string[]> = new Map<string, string[]>(); // memoize leaf descendants
    private adjacency: Map<string, Set<string>> = new Map<string, Set<string>>(); // from -> set(to)
    private resolvedEdgesPerTask: Map<string, {
        fromLeaf: string;
        toLeaf: string;
        source: IPredecessor;
    }[]> = new Map<string, Array<{ fromLeaf: string; toLeaf: string; source: IPredecessor }>>();
    private cycles: {fromId: string, toId: string}[] = [];
    private topoOrder: string[] | null = null;
    private parent: Gantt;
    constructor(gantt: Gantt, flatDataCollection: Map<string, IGanttData>) {
        this.parent = gantt;
        this.buildMaps(flatDataCollection);
    }
    private buildMaps(flatDataCollection?: Map<string, IGanttData>): void {
        this.idToItem.clear();
        if (flatDataCollection) {
            flatDataCollection.clear();
        }
        this.parentToChildren.clear();
        if (this.parent.viewType === 'ProjectView') {
            for (const item of this.parent.flatData) {
                if (flatDataCollection) {
                    flatDataCollection.set(item.ganttProperties.rowUniqueID.toString(), item);
                }
                const id: string = String(item.ganttProperties.taskId);
                this.idToItem.set(id, item);
                // initialize adjacency/containers
                if (!this.adjacency.has(id)) {
                    this.adjacency.set(id, new Set());
                }
                // parent map
                let parent: string;
                if (item.parentItem && item.parentItem.taskId) {
                    parent = item.parentItem.taskId;
                }
                if (parent !== undefined && parent !== null && parent !== '') {
                    const pid: string = (parent);
                    if (!this.parentToChildren.has(pid)) {
                        this.parentToChildren.set(pid, []);
                    }
                    this.parentToChildren.get(pid)!.push(id);
                }
            }
        }
    }
    private getLeafDescendants(nodeId: string): string[] {
        if (this.leafCache.has(nodeId)) {
            return this.leafCache.get(nodeId)!;
        }
        const result: string[] = [];
        result.push(nodeId);
        const stack: string[] = [nodeId];
        while (stack.length) {
            const cur: string = stack.pop()!;
            const children: string[] = this.parentToChildren.get(cur);
            if (!children || children.length === 0) {
                result.push(cur);
            } else {
                for (const c of children) {
                    stack.push(c);
                }
            }
        }
        this.leafCache.set(nodeId, result);
        return result;
    }
    private resolveOnePred(p: IPredecessor): {
        fromLeaf: string;
        toLeaf: string;
        source: IPredecessor;
    }[] {
        const fromId: string = (p.from);
        const toId: string = (p.to);
        const fromLeaves: string[] = this.getLeafDescendants(fromId);
        const toLeaves: string[] = this.getLeafDescendants(toId);
        const edges: Array<{ fromLeaf: string; toLeaf: string; source: IPredecessor }> = [];
        for (const f of fromLeaves) {
            for (const t of toLeaves) {
                edges.push({ fromLeaf: f, toLeaf: t, source: p });
            }
        }
        return edges;
    }
    /**
     * Resolve every predecessor in the dataset once.
     * Runs in O(N + E) total time complexity.
     *
     * @returns {void} Nothing is returned.
     */
    public resolve(): void {
        this.adjacency.clear();
        this.resolvedEdgesPerTask.clear();
        this.leafCache.clear();
        this.cycles = [];
        this.topoOrder = null;
        // Ensure adjacency nodes exist
        const keys: string[] = Array.from(this.idToItem.keys());
        for (let i: number = 0; i < keys.length; i++) {
            const id: string = keys[i as number];
            if (!this.adjacency.has(id)) {
                this.adjacency.set(id, new Set<string>());
            }
        }
        // For each task, expand its predecessor collection and add edges
        const iterator: IterableIterator<[string, IGanttData]> = this.idToItem.entries();
        let entry: IteratorResult<[string, IGanttData]> = iterator.next();
        while (!entry.done) {
            const [id, item]: [string, IGanttData] = entry.value;
            const preds: IPredecessor[] = item.ganttProperties.predecessor || [];
            const resolvedList: Array<{ fromLeaf: string; toLeaf: string; source: IPredecessor }> = [];
            for (let i: number = 0; i < preds.length; i++) {
                const p: IPredecessor = preds[i as number];
                const edges: {
                    fromLeaf: string;
                    toLeaf: string;
                    source: IPredecessor;
                }[] = this.resolveOnePred(p);
                for (let j: number = 0; j < edges.length; j++) {
                    const e: {
                        fromLeaf: string;
                        toLeaf: string;
                        source: IPredecessor;
                    } = edges[j as number];
                    if (!this.adjacency.has(e.fromLeaf)) {
                        this.adjacency.set(e.fromLeaf, new Set<string>());
                    }
                    this.adjacency.get(e.fromLeaf)!.add(e.toLeaf);
                    resolvedList.push(e);
                }
            }
            this.resolvedEdgesPerTask.set(id, resolvedList);
            // Advance iterator
            entry = iterator.next();
        }
        // After adjacency built, run cycle detection once
        this.cycles = this.detectAllCycles();
        if (this.cycles.length === 0) {
            this.topoOrder = this.computeTopologicalOrder();
        }
    }
    /**
     * Returns resolved predecessor edges for a given task ID.
     *
     * @param {string | number} taskId - Task ID (string or number) to retrieve resolved predecessors for
     * @returns {{ fromLeaf: string; toLeaf: string; source: IPredecessor }[]} Array of resolved edges, empty if none
     * @private
     */
    // eslint-disable-next-line
    private getResolvedPredecessorsForTask(taskId: string | number): {
        fromLeaf: string;
        toLeaf: string;
        source: IPredecessor;
    }[] {
        return this.resolvedEdgesPerTask.get(String(taskId)) || [];
    }
    /**
     * Creates a deep clone of the current adjacency map.
     *
     * @returns {Map<string, Set<string>>} A new Map with the same keys and independently cloned Sets
     * @private
     */
    // eslint-disable-next-line
    private cloneAdjacency(): Map<string, Set<string>> {
        const m: Map<string, Set<string>> = new Map<string, Set<string>>();
        const entries: IterableIterator<[string, Set<string>]> = this.adjacency.entries();
        let entryResult: IteratorResult<[string, Set<string>]> = entries.next();
        while (!entryResult.done) {
            const pair: [string, Set<string>] = entryResult.value;
            const k: string = pair[0];
            const set: Set<string> = pair[1];
            m.set(k, new Set<string>(Array.from(set)));
            entryResult = entries.next();
        }
        return m;
    }
    /**
     * Creates a temporary clone of the adjacency map and adds resolved edges from the given predecessor.
     * Used by cycle detection to simulate adding a dependency without modifying the original graph.
     *
     * @param {IPredecessor} pred - The predecessor object to resolve and add
     * @returns {Map<string, Set<string>>} A new adjacency map including the resolved edges
     * @private
     */
    // eslint-disable-next-line
    private addPredToAdjacencyClone(pred: IPredecessor): Map<string, Set<string>> {
        const clone: Map<string, Set<string>> = this.cloneAdjacency();
        // we must use existing leafCache + maps to resolve quickly
        const edges: {
            fromLeaf: string;
            toLeaf: string;
            source: IPredecessor;
        }[] = this.resolveOnePred(pred);
        for (const e of edges) {
            if (clone && !clone.has(e.fromLeaf)) {
                clone.set(e.fromLeaf, new Set());
            }
            clone.get(e.fromLeaf)!.add(e.toLeaf);
        }
        return clone;
    }
    /**
     * Check if adding the given predecessor would create a cycle.
     *
     * @param {IPredecessor} pred - The predecessor to test for cycle creation.
     * @returns {CycleCheckResult} An object describing whether a cycle would be created and the cycles found.
     * @private
     */
    public wouldCreateCycleWhenAdding(pred: IPredecessor): CycleCheckResult {
        const adj: Map<string, Set<string>> = this.addPredToAdjacencyClone(pred);
        const cycles: string[][] = this.detectCyclesStatic(adj);
        return {
            wouldCreate: cycles.length > 0,
            cycles
        };
    }
    private detectAllCycles(): {
        fromId: string;
        toId: string;
    }[] {
        const cycles: string[][] = this.detectCyclesStatic(this.adjacency);
        const result: Array<{ fromId: string; toId: string }> = [];
        for (const cycle of cycles) {
            if (cycle[0] && cycle[1]) {
                result.push({ fromId: cycle[0], toId: cycle[1] });
            }
        }
        return result;
    }
    private removePredecessor(predecessorString: string, toRemove: string): string {
        if (!predecessorString) {
            return '';
        }
        if (predecessorString === toRemove) {
            return '';
        }
        const parts: string[] = predecessorString
            .split(',')
            .map((s: string) => s.trim())
            .filter((part: string) => part !== toRemove && part !== toRemove.trim());
        return parts.join(',');
    }
    private getCyclesWithDetails(cycles: { fromId: string, toId: string }[]): string {
        const parts: string[] = cycles.map((cycle: {
            fromId: string;
            toId: string;
        }) => {
            const fromId: string = cycle['fromId'];
            const toId: string = cycle['toId'];
            const toTask: IGanttData = this.idToItem.get(toId);
            const fromTask: IGanttData = this.idToItem.get(fromId);
            const toPredecessors: IPredecessor[] = toTask.ganttProperties.predecessor;

            // Default error label
            let errorLabel: string = `Task ID ${fromId} to Task ID ${toId}`;

            const newPred: IPredecessor[] = [];

            // STRICTLY check the 'toTask' (Successor) only.
            if (toPredecessors) {
                for (let i: number = 0; i < toPredecessors.length; i++) {
                    const pred: IPredecessor = toPredecessors[i as number];
                    // Resolve the predecessor's ID to its leaves
                    const leaves: string[] = this.getLeafDescendants(pred.from);

                    // Check if the predecessor (or its children) matches the cycle source 'fromId'
                    if (pred.from === fromId || (leaves && leaves.indexOf(fromId) !== -1)) {

                        // Update label to show the actual Predecessor ID (e.g., "1" instead of "3")
                        errorLabel = `Task ID ${pred.from} to Task ID ${toId}`;

                        let predType: string = pred.from + pred.type;
                        predType = this.parent.predecessorModule['generatePredecessorValue'](pred, predType);

                        // Remove ONLY this invalid dependency from the 'toTask'
                        const dependencyField: string = this.parent.taskFields.dependency;
                        toTask.taskData[dependencyField as string] = toTask[dependencyField as string] =
                            (toTask.ganttProperties.predecessorsName as string) =
                            this.removePredecessor(toTask.ganttProperties.predecessorsName as string, predType);
                        const removedString: string[] = predType.split(',');
                        removedString.forEach((str: string) => {
                            const id: string = str.replace(/(FS|SS|SF|FF).*$/, '');
                            const targetTask: IGanttData = this.idToItem.get(id);
                            if (targetTask.ganttProperties.predecessor) {
                                targetTask.ganttProperties.predecessor = targetTask.ganttProperties.predecessor.filter(
                                    (pred: IPredecessor) => pred.to.toString() !== toTask.ganttProperties.taskId.toString()
                                );
                            }
                        });
                        continue;
                    } else {
                        newPred.push(pred);
                    }
                }
                // Update the task with the clean list
                toTask.ganttProperties.predecessor = newPred;
            }
            return errorLabel;
        });

        // Remove duplicates from the error messages (e.g. if 3->6 and 4->6 both map to "1->6", show it once)
        const uniqueParts: string[] = parts.filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
        const list: string = uniqueParts.join(', ');

        return `Cyclic dependency is detected for the tasks from ${list}. Please provide valid dependency`;
    }
    private detectCyclesStatic(adj: Map<string, Set<string>>): string[][] {
        const WHITE: number = 0;
        const GRAY: number = 1;
        const BLACK: number = 2;
        const state: Map<string, number> = new Map<string, number>();
        // Initialize all nodes as WHITE
        const keysInit: string[] = Array.from(adj.keys());
        for (let i: number = 0; i < keysInit.length; i++) {
            const k: string = keysInit[i as number];
            state.set(k, WHITE);
        }
        const stack: string[] = [];
        const cycles: string[][] = [];
        const dfs: any = (node: string): void => {
            state.set(node, GRAY);
            stack.push(node);
            const neighbors: Set<string> | undefined = adj.get(node);
            if (neighbors) {
                const neighborArray: string[] = Array.from(neighbors);
                for (let i: number = 0; i < neighborArray.length; i++) {
                    const nb: string = neighborArray[i as number];
                    const s: number = state.has(nb) ? state.get(nb)! : WHITE;
                    if (s === WHITE) {
                        dfs(nb);
                    } else if (s === GRAY) {
                        // Cycle detected
                        let idx: number = -1;
                        for (let j: number = 0; j < stack.length; j++) {
                            if (stack[j as number] === nb) {
                                idx = j;
                                break;
                            }
                        }
                        if (idx !== -1) {
                            const cyclePath: string[] = [];
                            for (let k: number = idx; k < stack.length; k++) {
                                cyclePath.push(stack[k as number]);
                            }
                            cycles.push(cyclePath);
                        }
                    }
                    // BLACK → do nothing
                }
            }
            stack.pop();
            state.set(node, BLACK);
        };
        // Run DFS from all nodes
        const keys: string[] = Array.from(adj.keys());
        for (let i: number = 0; i < keys.length; i++) {
            const node: string = keys[i as number];
            if (state.get(node) === WHITE) {
                dfs(node);
            }
        }
        // Deduplicate cycles using canonical rotation
        const unique: string[][] = [];
        const seen: Set<string> = new Set<string>();
        for (const c of cycles) {
            if (c.length === 0) {
                continue;
            }
            const nodes: string[] = c.slice();
            let minIdx: number = 0;
            for (let i: number = 1; i < nodes.length; i++) {
                if (nodes[i as number] < nodes[minIdx as number]) {
                    minIdx = i;
                }
            }
            const rot: string[] = [...nodes.slice(minIdx), ...nodes.slice(0, minIdx)];
            const key: string = rot.join('->');
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(rot);
            }
        }
        return unique;
    }
    /**
     * Compute topological order using Kahn's algorithm.
     * Only valid when no cycles exist in the graph.
     *
     * @returns {string[]} The nodes in topological order.
     */
    private computeTopologicalOrder(): string[] {
        const indeg: Map<string, number> = new Map<string, number>();
        const keys: string[] = Array.from(this.adjacency.keys());
        for (let i: number = 0; i < keys.length; i++) {
            indeg.set(keys[i as number], 0);
        }
        const entries: IterableIterator<[string, Set<string>]> = this.adjacency.entries();
        let entryResult: IteratorResult<[string, Set<string>]> = entries.next();
        while (!entryResult.done) {
            const pair: [string, Set<string>] = entryResult.value;
            const successors: Set<string> = pair[1];
            const successorIter: IterableIterator<string> = successors.values();
            let successorResult: IteratorResult<string> = successorIter.next();
            while (!successorResult.done) {
                const to: string = successorResult.value;
                const current: number = indeg.has(to) ? indeg.get(to)! : 0;
                indeg.set(to, current + 1);
                successorResult = successorIter.next();
            }
            entryResult = entries.next();
        }
        const q: string[] = [];
        indeg.forEach(function (degree: number, taskId: string): void {
            if (degree === 0) {
                q.push(taskId);
            }
        });
        const order: string[] = [];
        while (q.length) {
            const n: string = q.shift()!;  // Non-null assertion: we know q has elements
            order.push(n);
            const neighbors: Set<string> | undefined = this.adjacency.get(n);
            if (neighbors) {
                const iterator: IterableIterator<string> = neighbors.values();
                let iterNext: IteratorResult<string> = iterator.next();
                while (!iterNext.done) {
                    const nb: string = iterNext.value;  // This is exactly what you had
                    const currentDegree: number = indeg.has(nb) ? indeg.get(nb)! : 0;
                    indeg.set(nb, currentDegree - 1);
                    if (indeg.get(nb) === 0) {
                        q.push(nb);
                    }
                    // Advance to next item
                    iterNext = iterator.next();
                }
            }
        }
        return order;
    }
}
