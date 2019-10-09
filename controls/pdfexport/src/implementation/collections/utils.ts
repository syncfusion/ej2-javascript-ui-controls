/**
 * Utils.ts class for EJ2-PDF
 * @private
 * @hidden
 */
export interface ICompareFunction<T> {
    (a: T, b: T): number;
}
/**
 * @private
 * @hidden
 */
export interface IEqualsFunction<T> {
    (a: T, b: T): boolean;
}
/**
 * @private
 * @hidden
 */
export interface ILoopFunction<T> {
    (a: T): boolean | void;
}
/**
 * @private
 * @hidden
 */
export function defaultToString(item: string|number|string[]|number[]|Object|Object[]|boolean): string {
    // if (item === null) {
    //     return 'COLLECTION_NULL';
    // } else if (typeof item === 'undefined') {
    //     return 'COLLECTION_UNDEFINED';
    // } else if (Object.prototype.toString.call(item) === '[object String]') {
    if (Object.prototype.toString.call(item) === '[object String]') {
        return '$s' + item;
    } else {
        return '$o' + item.toString();
    }
}