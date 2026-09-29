/**
 * Toolbar items reconciliation module.
 * Implements the algorithm for detecting adds, removes, and reorders
 * in toolbar items arrays during property changes.
 *
 * @module toolbar-reconciler
 */

import { ToolbarItem, ToolbarItemUpdate, AddToolbarItem, RemoveToolbarItem, BuiltInToolbarItem, CustomToolbarItem } from './toolbar.types';

/**
 * Generates a stable toolbar item ID.
 *
 * @param {ToolbarItem} item - The toolbar item
 * @param {number} position - The item index
 * @returns {string} - The item ID
 */
function deriveItemId(item: ToolbarItem, position: number): string {
    if (typeof item === 'string') {
        // Built-in item or separator
        if (item === '|') {
            return `__separator_${position}`;
        }
        return item as BuiltInToolbarItem;
    }

    if ('item' in item && 'actionId' in item === false) {
        // Built-in config: { item: 'Bold', ... }
        return item.item;
    }

    if ('id' in item) {
        // Custom item: { id, actionId, ... }
        return item.id;
    }

    // Fallback (should not reach here with valid types)
    return `__unknown_${position}`;
}

/**
 * Builds an item ID-to-position map.
 *
 * @param {ToolbarItem[]} items - The toolbar items
 * @returns {Map<string, number>} - The ID-to-position map
 */
function buildIdMap(items: ToolbarItem[]): Map<string, number> {
    const map: Map<string, number> = new Map<string, number>();

    items.forEach(function(item: ToolbarItem, position: number): void {
        const id: string = deriveItemId(item, position);

        // Skip duplicate IDs during reconciliation (they will be caught by the normalizer)
        if (map.has(id)) {
            return;
        }

        map.set(id, position);
    });

    return map;
}

/**
 * Reconciles two toolbar item collections.
 *
 * Detects added and removed items and returns
 * the required update operations.
 *
 * @param {ToolbarItem[]} newItems - The updated toolbar items
 * @param {ToolbarItem[]} oldItems - The previous toolbar items
 * @returns {ToolbarItemUpdate[]} - The update operations
 */
export function reconcileToolbarItems(
    newItems: ToolbarItem[],
    oldItems: ToolbarItem[]
): ToolbarItemUpdate[] {
    const operations: ToolbarItemUpdate[] = [];

    // Build ID maps for O(1) lookups
    const oldIdMap: Map<string, number> = buildIdMap(oldItems);
    const newIdMap: Map<string, number> = buildIdMap(newItems);

    // Track which operations to emit
    const toRemove: Array<{ id: string; index: number }> = [];
    const toAdd: Array<{ item: ToolbarItem; index: number }> = [];

    // Detect removes (old IDs not in new)
    oldIdMap.forEach((oldIndex: number, id: string) => {
        if (!newIdMap.has(id)) {
            toRemove.push({ id, index: oldIndex });
        }
    });

    // Detect adds (new IDs not in old)
    newIdMap.forEach((newIndex: number, id: string) => {
        if (!oldIdMap.has(id)) {
            const item: ToolbarItem = newItems[newIndex as number];
            toAdd.push({ item, index: newIndex });
        }
    });

    // Emit remove operations first (in reverse order to avoid index shifting)
    toRemove
        .sort(function(a: { id: string; index: number }, b: { id: string; index: number }): number { return b.index - a.index; })
        .forEach(function({ id, index }: { id: string; index: number }): void {
            const removeOp: RemoveToolbarItem = {
                action: 'remove',
                index,
                itemId: id
            };
            operations.push(removeOp);
        });

    // Emit add operations (in forward order)
    toAdd
        .sort(function(a: { item: ToolbarItem; index: number },
                       b: { item: ToolbarItem; index: number }): number { return a.index - b.index; })
        .forEach(function({ item, index }: { item: ToolbarItem; index: number }): void {
            const addOp: AddToolbarItem = {
                action: 'add',
                index,
                item
            };
            operations.push(addOp);
        });

    return operations;
}
