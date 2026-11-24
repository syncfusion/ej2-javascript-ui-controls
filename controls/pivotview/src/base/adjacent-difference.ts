/**
 * Pure helpers for the adjacent-member difference (`(previous)` / `(next)` base items).
 * These functions hold no DOM and no engine state so that they can be unit tested on their own.
 */

/** Reserved `baseItem` token that compares a member with the one before it. */
export const ADJACENT_PREVIOUS: string = '(previous)';
/** Reserved `baseItem` token that compares a member with the one after it. */
export const ADJACENT_NEXT: string = '(next)';

/** Minimal header shape needed to resolve neighbours. */
export interface IAdjacentHeader {
    type?: string;
    valueSort?: { axis?: string | number | boolean; levelName?: string | number | boolean };
    members?: IAdjacentHeader[];
}

/** Previous and next member level names of a header. */
export interface INeighbours {
    previous?: string;
    next?: string;
}

/** Result of a single adjacent calculation. */
export interface IAdjacentResult {
    /** `empty` - no usable operand, `value` - a number, `notApplicable` - percent over a zero neighbour. */
    kind: 'empty' | 'value' | 'notApplicable';
    value?: number;
}

/**
 * Checks whether the base item is one of the reserved adjacent tokens.
 *
 * @param {string} baseItem - The base item of a value field.
 * @returns {boolean} - True for `(previous)` and `(next)`. Matching is exact and case-sensitive.
 */
export function isAdjacentToken(baseItem: string): boolean {
    return baseItem === ADJACENT_PREVIOUS || baseItem === ADJACENT_NEXT;
}

/**
 * Lists the value fields that use a `(previous)` or `(next)` token. The OLAP provider owns its values, so such a field is
 * never computed locally and is reported instead.
 *
 * @param {Object[]} values - The value fields of a report.
 * @returns {string[]} - Names of the value fields that carry a token.
 */
export function getTokenFields(values: { name?: string; baseItem?: string }[]): string[] {
    const names: string[] = [];
    for (const value of values || []) {
        if (value && isAdjacentToken(value.baseItem) && names.indexOf(value.name) === -1) {
            names.push(value.name);
        }
    }
    return names;
}

/**
 * Builds the previous/next lookup for every member of the base field, in displayed order.
 *
 * @param {IAdjacentHeader[]} roots - The displayed (filtered and sorted) header tree of the base axis.
 * @param {string} baseField - Name of the field that defines the comparison axis.
 * @param {boolean} crossGroup - When true the neighbour may belong to another parent member.
 * @returns {Object} - Neighbours keyed by the member level name.
 */
export function buildNeighbourMap(
    roots: IAdjacentHeader[], baseField: string, crossGroup: boolean): { [key: string]: INeighbours } {
    const groups: string[][] = [];
    const collect: (nodes: IAdjacentHeader[]) => void = (nodes: IAdjacentHeader[]): void => {
        const siblings: string[] = [];
        for (const node of nodes) {
            if (node.type === 'grand sum') {
                continue;
            }
            if (node.valueSort && node.valueSort.axis === baseField) {
                siblings.push(node.valueSort.levelName as string);
            }
        }
        if (siblings.length > 0) {
            groups.push(siblings);
        }
        for (const node of nodes) {
            if (node.members && node.members.length > 0 && !(node.valueSort && node.valueSort.axis === baseField)) {
                collect(node.members);
            }
        }
    };
    collect(roots);
    const lists: string[][] = crossGroup ? [([] as string[]).concat(...groups)] : groups;
    const map: { [key: string]: INeighbours } = {};
    for (const list of lists) {
        for (let i: number = 0; i < list.length; i++) {
            map[list[i as number]] = { previous: list[i - 1], next: list[i + 1] };
        }
    }
    return map;
}

/**
 * Finds the base-field member that a header path belongs to.
 *
 * @param {string} path - The row or column header path of a value cell (level names joined by the delimiter).
 * @param {string} delimiter - The header delimiter.
 * @param {Object} neighbours - Neighbours keyed by member level name.
 * @returns {string} - The member level name, or undefined when the cell is not under a base-field member.
 */
export function findBaseMember(path: string, delimiter: string, neighbours: { [key: string]: INeighbours }): string {
    if (!path) {
        return undefined;
    }
    if (neighbours[path as string]) {
        return path;
    }
    let index: number = path.indexOf(delimiter);
    while (index > 0) {
        const prefix: string = path.substring(0, index);
        if (neighbours[prefix as string]) {
            return prefix;
        }
        index = path.indexOf(delimiter, index + delimiter.length);
    }
    return undefined;
}

/**
 * Calculates the difference between a cell and its neighbour.
 * A missing operand (undefined, null or empty) is not zero; a numeric 0 is a real value.
 *
 * @param {number} current - Un-differenced value of the cell.
 * @param {number} neighbour - Un-differenced value of the neighbour cell.
 * @param {boolean} isPercent - True for the percentage form, dividing by the neighbour.
 * @returns {IAdjacentResult} - The result kind and value.
 */
export function calculateAdjacent(current: number, neighbour: number, isPercent: boolean): IAdjacentResult {
    if (!isNumber(current) || !isNumber(neighbour)) {
        return { kind: 'empty' };
    }
    const difference: number = current - neighbour;
    if (!isPercent) {
        return { kind: 'value', value: difference };
    }
    if (neighbour === 0) {
        return { kind: 'notApplicable' };
    }
    return { kind: 'value', value: difference / neighbour };
}

/**
 * Checks whether a value is a usable number.
 *
 * @param {number} value - The value to check.
 * @returns {boolean} - True for a finite-or-infinite number that is not NaN.
 */
function isNumber(value: number): boolean {
    return typeof value === 'number' && !isNaN(value);
}
