import { FormNode, FormSchema } from '@syncfusion/ej2-form-renderer';
import { defaultFormSchema, isDefaultFormSchema } from '../context/default-form-schema';

/** @private */
function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

/** @private */
function insertWithDropPosition(
    list: FormNode[],
    component: FormNode,
    dropTargetIndex?: number | null,
    dropPosition?: 'before' | 'after' | null
): FormNode[] {
    if (list.length === 0) {
        return [component];
    }
    if (
        typeof dropTargetIndex !== 'number' ||
        dropTargetIndex === null ||
        dropTargetIndex < 0 ||
        dropTargetIndex >= list.length
    ) {
        // No valid position — append at the tail.
        const tail: FormNode[] = list.slice();
        tail.push(component);
        return tail;
    }
    const idx: number = (dropPosition === 'after')
        ? dropTargetIndex + 1
        : dropTargetIndex;
    const out: FormNode[] = list.slice();
    out.splice(idx, 0, component);
    return out;
}

/** @private */
function appendOrInsertBeforeSubmit(
    components: FormNode[],
    component: FormNode
): FormNode[] {
    const out: FormNode[] = components.slice();
    if (out.length === 0) {
        out.push(component);
        return out;
    }
    const last: FormNode = out[out.length - 1];
    const isLastSubmit: boolean = !!last
        && last.type === 'button'
        && last.buttonType === 'submit';
    if (isLastSubmit) {
        out.splice(out.length - 1, 0, component);
    } else {
        out.push(component);
    }
    return out;
}

/** @private */
export function insertAtRoot(
    schema: FormSchema,
    component: FormNode,
    dropTargetIndex?: number | null,
    dropPosition?: 'before' | 'after' | null
): FormSchema {
    const components: FormNode[] = (schema && schema.components)
        ? schema.components.slice()
        : [];
    if (
        typeof dropTargetIndex === 'number' &&
        dropTargetIndex >= 0 &&
        dropTargetIndex < components.length
    ) {
        const idx: number = (dropPosition === 'after')
            ? dropTargetIndex + 1
            : dropTargetIndex;
        const out: FormNode[] = components.slice();
        out.splice(idx, 0, component);
        return { ...schema, components: out };
    }
    return {
        ...schema,
        components: appendOrInsertBeforeSubmit(components, component)
    };
}

/** @private */
export function insertAtNested(
    schema: FormSchema,
    parentId: string,
    parentPath: string | undefined,
    cellInfo: { row: number; col: number; tabIndex?: number } | undefined,
    component: FormNode,
    dropTargetIndex?: number | null,
    dropPosition?: 'before' | 'after' | null
): FormSchema {
    if (!schema || !parentId) {
        return schema;
    }
    return {
        ...schema,
        components: schema.components.map((c: FormNode) =>
            recurseInsert(c, parentPath, parentId, cellInfo, component, dropTargetIndex, dropPosition)
        )
    };
}

/** @private */
function recurseInsert(
    node: FormNode,
    path: string | undefined,
    parentId: string,
    cellInfo: { row: number; col: number; tabIndex?: number } | undefined,
    component: FormNode,
    dropTargetIndex?: number | null,
    dropPosition?: 'before' | 'after' | null
): FormNode {
    // If node matches the path hint, attempt structural insertion first.
    if (path && node.id === path) {
        const inserted: FormNode = insertIntoNode(node, parentId, cellInfo, component, dropTargetIndex, dropPosition);
        if (inserted !== node) {
            return inserted;
        }
        // otherwise parentId is deeper; fall through and keep recursing into structures.
    }
    // Match by parentId directly anywhere in the tree.
    if (node.id === parentId) {
        return insertIntoNode(node, parentId, cellInfo, component, dropTargetIndex, dropPosition);
    }
    if (node.children && node.children.length) {
        let mutated: boolean = false;
        const newChildren: FormNode[] = node.children.map((c: any) => {
            const updated: FormNode = recurseInsert(
                c, path, parentId, cellInfo, component, dropTargetIndex, dropPosition
            );
            if (updated !== c) { mutated = true; }
            return updated;
        });
        if (mutated) {
            return { ...node, children: newChildren };
        }
    }
    if (node.tabItems && node.tabItems.length) {
        let mutated: boolean = false;
        const newTabItems: any[] = node.tabItems.map((t: any) => {
            if (!t.content) { return t; }
            let tabMutated: boolean = false;
            const newContent: FormNode[] = t.content.map((c: any) => {
                const updated: FormNode = recurseInsert(
                    c, path, parentId, cellInfo, component, dropTargetIndex, dropPosition
                );
                if (updated !== c) { tabMutated = true; }
                return updated;
            });
            if (tabMutated) { mutated = true; }
            return tabMutated ? { ...t, content: newContent } : t;
        });
        if (mutated) {
            return { ...node, tabItems: newTabItems };
        }
    }
    if (node.tableCells && node.tableCells.length) {
        let mutated: boolean = false;
        const newTableCells: any[][] = node.tableCells.map((row: any) =>
            row.map((cell: any) => {
                let cellMutated: boolean = false;
                const newCell: FormNode[] = cell.map((c: FormNode) => {
                    const updated: FormNode = recurseInsert(
                        c, path, parentId, cellInfo, component, dropTargetIndex, dropPosition
                    );
                    if (updated !== c) { cellMutated = true; }
                    return updated;
                });
                if (cellMutated) { mutated = true; }
                return cellMutated ? newCell : cell;
            })
        );
        if (mutated) {
            return { ...node, tableCells: newTableCells };
        }
    }
    return node;
}

/** @private */
function insertIntoNode(
    node: FormNode,
    parentId: string,
    cellInfo: { row: number; col: number; tabIndex?: number } | undefined,
    component: FormNode,
    dropTargetIndex?: number | null,
    dropPosition?: 'before' | 'after' | null
): FormNode {
    if (node.id !== parentId) {
        return node;
    }
    if (cellInfo && typeof cellInfo.tabIndex === 'number' && node.tabItems) {
        const items = node.tabItems.slice();
        const ti: number = cellInfo.tabIndex;
        const current: FormNode[] = (items[ti as number] && items[ti as number].content)
            ? items[ti as number].content.slice()
            : [];
        items[ti as number] = {
            ...items[ti as number],
            content: insertWithDropPosition(
                current,
                component,
                dropTargetIndex,
                dropPosition
            )
        };
        return { ...node, tabItems: items };
    }
    if (cellInfo && typeof cellInfo.row === 'number' && node.tableCells) {
        const cells = node.tableCells.map((row: any) => row.slice());
        const row: FormNode[] = cells[cellInfo.row][cellInfo.col].slice();
        cells[cellInfo.row][cellInfo.col] = insertWithDropPosition(
            row,
            component,
            dropTargetIndex,
            dropPosition
        );
        return { ...node, tableCells: cells };
    }
    const children: FormNode[] = (node.children || []).slice();
    return {
        ...node,
        children: insertWithDropPosition(
            children,
            component,
            dropTargetIndex,
            dropPosition
        )
    };
}

/** @private */
export function removeById(schema: FormSchema, fieldId: string): FormSchema {
    if (!schema || !fieldId) {
        return schema;
    }
    const isSeed: boolean = isDefaultFormSchema(schema as any);
    const next: FormSchema = {
        ...schema,
        components: (schema.components || []).filter((c) => {
            if (c.id === fieldId) {
                return false;
            }
            return true;
        }).map((c) => removeFromNode(c, fieldId))
    };
    if (isSeed && next.components.length === 0) {
        return defaultFormSchemaForRemoval();
    }
    return next;
}

/** @private */
function removeFromNode(node: FormNode, fieldId: string): FormNode {
    if (node.children) {
        return {
            ...node,
            children: node.children
                .filter((c: FormNode) => c.id !== fieldId)
                .map((c: FormNode) => removeFromNode(c, fieldId))
        };
    }
    if (node.tabItems) {
        return {
            ...node,
            tabItems: node.tabItems.map((t: any) => ({
                ...t,
                content: t.content
                    ? t.content.filter((c: FormNode) => c.id !== fieldId).map((c: FormNode) => removeFromNode(c, fieldId))
                    : t.content
            }))
        };
    }
    if (node.tableCells) {
        return {
            ...node,
            tableCells: node.tableCells.map((row: any) =>
                row.map((cell: any) => cell.filter((c: any) => c.id !== fieldId).map((c: FormNode) => removeFromNode(c, fieldId)))
            )
        };
    }
    return node;
}

/** @private */
function defaultFormSchemaForRemoval(): any {
    return clone(defaultFormSchema());
}

/** @private */
export function reorderRoot(schema: FormSchema, newComponents: FormNode[]): FormSchema {
    return { ...schema, components: newComponents.slice() };
}

/** @private */
export function reorderNested(
    schema: FormSchema,
    parentId: string,
    newChildren: FormNode[],
    cellInfo?: { row?: number; col?: number; tabIndex?: number }
): FormSchema {
    if (!schema || !parentId) {
        return schema;
    }
    return {
        ...schema,
        components: (schema.components || []).map((component: FormNode) =>
            reorderNestedInNode(component, parentId, newChildren, cellInfo)
        )
    };
}

function reorderNestedInNode(
    node: FormNode,
    parentId: string,
    newChildren: FormNode[],
    cellInfo?: { row?: number; col?: number; tabIndex?: number }
): FormNode {
    if (node.id === parentId) {
        if (cellInfo && typeof cellInfo.tabIndex === 'number' && node.tabItems) {
            const items = node.tabItems.slice();
            const tabIndex: number = cellInfo.tabIndex;
            if (items[tabIndex]) {
                items[tabIndex] = { ...items[tabIndex], content: newChildren.slice() };
                return { ...node, tabItems: items };
            }
        }
        if (cellInfo && typeof cellInfo.row === 'number' &&
                typeof cellInfo.col === 'number' && node.tableCells) {
            const cells = node.tableCells.map((row: any[]) => row.slice());
            if (cells[cellInfo.row] && cells[cellInfo.row][cellInfo.col]) {
                cells[cellInfo.row][cellInfo.col] = newChildren.slice();
                return { ...node, tableCells: cells };
            }
        }
        return { ...node, children: newChildren.slice() };
    }
    if (node.children) {
        const children = node.children.map((child: FormNode) =>
            reorderNestedInNode(child, parentId, newChildren, cellInfo)
        );
        if (children.some((child: FormNode, index: number) => child !== node.children[index])) {
            return { ...node, children: children };
        }
    }
    if (node.tabItems) {
        const tabItems = node.tabItems.map((tab: any) => {
            if (!tab.content) {
                return tab;
            }
            const content = tab.content.map((child: FormNode) =>
                reorderNestedInNode(child, parentId, newChildren, cellInfo)
            );
            return content.some((child: FormNode, index: number) => child !== tab.content[index])
                ? { ...tab, content: content }
                : tab;
        });
        if (tabItems.some((tab: any, index: number) => tab !== node.tabItems[index])) {
            return { ...node, tabItems: tabItems };
        }
    }
    if (node.tableCells) {
        const tableCells = node.tableCells.map((row: any[]) => row.map((cell: FormNode[]) => {
            const updatedCell = cell.map((child: FormNode) =>
                reorderNestedInNode(child, parentId, newChildren, cellInfo)
            );
            return updatedCell.some((child: FormNode, index: number) => child !== cell[index])
                ? updatedCell
                : cell;
        }));
        if (tableCells.some((row: any[], rowIndex: number) =>
            row.some((cell: FormNode[], cellIndex: number) => cell !== node.tableCells[rowIndex][cellIndex]))) {
            return { ...node, tableCells: tableCells };
        }
    }
    return node;
}

/** @private */
export function moveById(schema: FormSchema, fieldId: string, delta: number): FormSchema {
    if (!schema || !schema.components) {
        return schema;
    }
    const idx: number = schema.components.findIndex((c) => c.id === fieldId);
    if (idx < 0) {
        return schema;
    }
    const target: number = idx + delta;
    if (target < 0 || target >= schema.components.length) {
        return schema;
    }
    const components: FormNode[] = schema.components.slice();
    const [item] = components.splice(idx, 1);
    components.splice(target, 0, item);
    return { ...schema, components: components };
}

/** @private */
export function moveNestedById(
    schema: FormSchema,
    fieldId: string,
    delta: number,
    parentId: string,
    cellInfo: { row?: number; col?: number; tabIndex?: number } | undefined
): FormSchema {
    if (!schema || !parentId) {
        return schema;
    }
    return {
        ...schema,
        components: schema.components.map((c: FormNode) => {
            if (c.id !== parentId) {
                return c;
            }
            return moveInContainer(c, fieldId, delta, cellInfo);
        })
    };
}

function moveInContainer(
    node: FormNode,
    fieldId: string,
    delta: number,
    cellInfo: { row?: number; col?: number; tabIndex?: number } | undefined
): FormNode {
    if (cellInfo && typeof cellInfo.tabIndex === 'number' && node.tabItems) {
        const ti: number = cellInfo.tabIndex;
        const items = node.tabItems.slice();
        const current: FormNode[] = items[ti as number] && items[ti as number].content
            ? items[ti as number].content.slice()
            : [];
        const idx: number = current.findIndex((c) => c.id === fieldId);
        if (idx < 0) {
            return node;
        }
        const target: number = idx + delta;
        if (target < 0 || target >= current.length) {
            return node;
        }
        const newChildren: FormNode[] = current.slice();
        const [item] = newChildren.splice(idx, 1);
        newChildren.splice(target, 0, item);
        items[ti as number] = { ...items[ti as number], content: newChildren };
        return Object.assign({}, node, { tabItems: items });
    }
    if (cellInfo && typeof cellInfo.row === 'number' &&
            typeof cellInfo.col === 'number' && node.tableCells) {
        const cells = node.tableCells.map((row: any) => row.slice());
        const current: FormNode[] = (cells[cellInfo.row] && cells[cellInfo.row][cellInfo.col])
            ? cells[cellInfo.row][cellInfo.col].slice()
            : [];
        const idx: number = current.findIndex((c) => c.id === fieldId);
        if (idx < 0) {
            return node;
        }
        const target: number = idx + delta;
        if (target < 0 || target >= current.length) {
            return node;
        }
        const newChildren: FormNode[] = current.slice();
        const [item] = newChildren.splice(idx, 1);
        newChildren.splice(target, 0, item);
        cells[cellInfo.row][cellInfo.col] = newChildren;
        return Object.assign({}, node, { tableCells: cells });
    }
    const current: FormNode[] = (node.children || []).slice();
    const idx: number = current.findIndex((c) => c.id === fieldId);
    if (idx < 0) {
        return node;
    }
    const target: number = idx + delta;
    if (target < 0 || target >= current.length) {
        return node;
    }
    const newChildren: FormNode[] = current.slice();
    const [item] = newChildren.splice(idx, 1);
    newChildren.splice(target, 0, item);
    return Object.assign({}, node, { children: newChildren });
}

/** @private */
export function switchWidgetType(
    schema: FormSchema,
    fieldId: string,
    newType: string
): FormSchema {
    if (!schema || !fieldId || !newType) {
        return schema;
    }
    return {
        ...schema,
        components: (schema.components || []).map(function (c) {
            return switchInNode(c, fieldId, newType);
        })
    };
}

/** @private */
function switchInNode(node: FormNode, fieldId: string, newType: string): FormNode {
    if (node.id === fieldId) {
        return Object.assign({}, node, { type: newType as any });
    }
    if (node.children) {
        return Object.assign({}, node, {
            children: node.children.map(function (c: FormNode) {
                return switchInNode(c, fieldId, newType);
            })
        });
    }
    if (node.tabItems) {
        return Object.assign({}, node, {
            tabItems: node.tabItems.map(function (t: any) {
                return Object.assign({}, t, {
                    content: t.content ? t.content.map(function (c: FormNode) {
                        return switchInNode(c, fieldId, newType);
                    }) : t.content
                });
            })
        });
    }
    if (node.tableCells) {
        return Object.assign({}, node, {
            tableCells: node.tableCells.map(function (row: any) {
                return row.map(function (cell: any) {
                    return cell.map(function (c: FormNode) {
                        return switchInNode(c, fieldId, newType);
                    });
                });
            })
        });
    }
    return node;
}

/** @private */
export function insertAfterById(
    components: FormNode[],
    targetId: string,
    newComp: FormNode
): { components: FormNode[]; inserted: boolean } {
    const out: FormNode[] = [];
    for (let i = 0; i < components.length; i++) {
        const comp = components[i as number];

        out.push(comp);
        if (comp.id === targetId) {
            out.push(newComp);
            out.push(...components.slice(i + 1));
            return { components: out, inserted: true };
        }

        if (comp.children) {
            const { components: updatedChildren, inserted } = insertAfterById(
                comp.children,
                targetId,
                newComp
            );
            if (inserted) {
                out[out.length - 1] = { ...comp, children: updatedChildren };
                out.push(...components.slice(i + 1));
                return { components: out, inserted: true };
            }
        }

        if (comp.tabItems) {
            let tabInserted = false;
            const newTabItems = comp.tabItems.map((t: any) => {
                if (!t.content) {
                    return t;
                }
                const { components: updatedContent, inserted } = insertAfterById(
                    t.content,
                    targetId,
                    newComp
                );
                if (inserted) {
                    tabInserted = true;
                }
                return { ...t, content: updatedContent };
            });
            if (tabInserted) {
                out[out.length - 1] = { ...comp, tabItems: newTabItems };
                out.push(...components.slice(i + 1));
                return { components: out, inserted: true };
            }
        }

        if (comp.tableCells) {
            let tableInserted = false;
            const newTableCells = comp.tableCells.map((row: any) =>
                row.map((cell: any) => {
                    const { components: updatedCell, inserted } = insertAfterById(
                        cell,
                        targetId,
                        newComp
                    );
                    if (inserted) {
                        tableInserted = true;
                    }
                    return updatedCell;
                })
            );
            if (tableInserted) {
                out[out.length - 1] = { ...comp, tableCells: newTableCells };
                out.push(...components.slice(i + 1));
                return { components: out, inserted: true };
            }
        }
    }
    return { components: out, inserted: false };
}
