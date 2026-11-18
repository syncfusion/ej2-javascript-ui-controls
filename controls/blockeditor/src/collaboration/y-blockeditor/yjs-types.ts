/* Yjs Compatibility Types for Legacy TypeScript */

export type Origin = any;

/* -------------------------------------------------------------------------- */
/*                                Core Types                                  */
/* -------------------------------------------------------------------------- */

export interface ID {
    client: number;
    clock: number;
}

export interface RelativePosition {
    type?: ID | null;
    tname?: string | null;
    item?: ID | null;
    assoc?: number;
}

export interface AbsolutePosition {
    type: AbstractType<any>;
    index: number;
    assoc: number;
}

export type TextAttributes = { [key: string]: any };

/* -------------------------------------------------------------------------- */
/*                                Delta Types                                 */
/* -------------------------------------------------------------------------- */

export interface TextDeltaItem {
    insert?: string;
    delete?: number;
    retain?: number;
    attributes?: TextAttributes | null;
}

export type TextDelta = TextDeltaItem[];

export interface XmlDeltaItem {
    insert?: Array<XmlElement | XmlText>;
    delete?: number;
    retain?: number;
    attributes?: { [key: string]: any } | null;
}

export type XmlDelta = XmlDeltaItem[];

/* -------------------------------------------------------------------------- */
/*                                Transactions                                */
/* -------------------------------------------------------------------------- */

export interface Transaction {
    doc: Doc;
    origin: Origin;
    local: boolean;
    deleteSet: any;
    changed: Set<AbstractType<any>>;
    changedParentTypes: Set<AbstractType<any>>;
    beforeState: Map<number, number>;
    afterState: Map<number, number>;
    meta: Map<any, any>;
}

/* -------------------------------------------------------------------------- */
/*                                 Events                                     */
/* -------------------------------------------------------------------------- */

export interface YEvent<T extends AbstractType<any> = AbstractType<any>> {
    target: T;
    currentTarget: T;
    transaction: Transaction;
    path: Array<string | number>;
}

export interface XmlEvent extends YEvent<XmlFragment | XmlElement> {
    changes: {
        delta: XmlDelta;
        keys: Map<string, any>;
    };
}

export interface TextEvent extends YEvent<Text> {
    delta: TextDelta;
}

/* -------------------------------------------------------------------------- */
/*                              Abstract Type                                 */
/* -------------------------------------------------------------------------- */

export declare abstract class AbstractType<T = any> {
    doc: Doc | null;
    parent: AbstractType<any> | null;

    observe(f: (event: any, transaction: Transaction) => void): void;
    unobserve(f: (event: any, transaction: Transaction) => void): void;

    observeDeep(f: (events: YEvent<any>[], transaction: Transaction) => void): void;
    unobserveDeep(f: (events: YEvent<any>[], transaction: Transaction) => void): void;

    toJSON(): any;
}

/* -------------------------------------------------------------------------- */
/*                                  Doc                                       */
/* -------------------------------------------------------------------------- */

export declare class Doc {
    clientID: number;

    constructor(opts?: {
        guid?: string;
        gc?: boolean;
        collectionId?: string;
        meta?: any;
        autoLoad?: boolean;
        shouldLoad?: boolean;
    });

    getText(name: string): Text;
    getArray<T = any>(name: string): YArray<T>;
    getMap<T = any>(name: string): YMap<T>;
    getXmlFragment(name: string): XmlFragment;

    transact<T = any>(f: (transaction: Transaction) => T, origin?: Origin): T;

    on(event: string, handler: (...args: any[]) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;

    destroy(): void;
}

/* -------------------------------------------------------------------------- */
/*                                   YMap                                     */
/* -------------------------------------------------------------------------- */

export declare class YMap<T = any> extends AbstractType<any> {
    get(key: string): T | undefined;
    set(key: string, value: T): this;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;

    keys(): any;
    values(): any;
    entries(): any;

    forEach(cb: (value: T, key: string, map: YMap<T>) => void): void;

    toJSON(): { [key: string]: any };
}

/* -------------------------------------------------------------------------- */
/*                                  YArray                                    */
/* -------------------------------------------------------------------------- */

export declare class YArray<T = any> extends AbstractType<any> {
    length: number;

    get(index: number): T | undefined;
    insert(index: number, content: T[]): void;
    delete(index: number, length: number): void;
    push(content: T[]): void;
    unshift(content: T[]): void;
    slice(start?: number, end?: number): T[];
    toArray(): T[];
    toJSON(): T[];
    forEach(cb: (value: T, index: number, array: YArray<T>) => void): void;
    map<R>(cb: (value: T, index: number, array: YArray<T>) => R): R[];

    observe(f: (event: any, transaction: Transaction) => void): void;
    observeDeep(f: (events: YEvent<any>[], transaction: Transaction) => void): void;
}

/* -------------------------------------------------------------------------- */
/*                                   Text                                     */
/* -------------------------------------------------------------------------- */

export declare class Text extends AbstractType<any> {
    length: number;

    insert(index: number, text: string, attributes?: TextAttributes): void;
    delete(index: number, length: number): void;

    format(index: number, length: number, attributes: TextAttributes): void;

    applyDelta(delta: TextDelta): void;
    toDelta(): TextDelta;

    toString(): string;
}

export declare class XmlText extends Text { }

/* -------------------------------------------------------------------------- */
/*                               XmlElement                                   */
/* -------------------------------------------------------------------------- */

export declare class XmlElement extends AbstractType<any> {
    constructor(nodeName: string);

    readonly nodeName: string;
    readonly length: number;
    readonly firstChild: XmlElement | XmlText | null;

    getAttribute(name: string): any;
    setAttribute(name: string, value: any): void;
    removeAttribute(name: string): void;
    getAttributes(): Record<string, any>;

    insert(index: number, content: XmlElement[] | XmlText[]): void;
    insertAfter(ref: XmlElement | XmlText | null, content: Array<XmlElement | XmlText>): void;
    delete(index: number, length: number): void;
    push(content: XmlElement[] | XmlText[]): void;
    unshift(content: Array<XmlElement | XmlText>): void;
    get(index: number): XmlElement | XmlText | undefined;
    slice(start?: number, end?: number): Array<XmlElement | XmlText>;

    createTreeWalker(filter: (yxml: XmlElement | XmlText) => boolean): Iterable<XmlElement | XmlText>;
    clone(): XmlElement;
    toDOM(): Element;
    toJSON(): string;
    toArray(): (XmlElement | XmlText)[];

    observe(f: (event: XmlEvent, transaction: Transaction) => void): void;
    observeDeep(f: (events: YEvent<any>[], transaction: Transaction) => void): void;
}

/* -------------------------------------------------------------------------- */
/*                               XmlFragment                                  */
/* -------------------------------------------------------------------------- */

export declare class XmlFragment extends AbstractType<any> {
    length: number;
    firstChild: XmlElement | XmlText | null;

    insert(index: number, content: XmlElement[] | XmlText[]): void;
    insertAfter(ref: XmlElement | XmlText | null, content: Array<XmlElement | XmlText>): void;
    delete(index: number, length: number): void;
    push(content: Array<XmlElement | XmlText>): void;
    unshift(content: Array<XmlElement | XmlText>): void;
    get(index: number): XmlElement | XmlText | undefined;
    slice(start?: number, end?: number): Array<XmlElement | XmlText>;

    createTreeWalker(filter: (yxml: XmlElement | XmlText) => boolean): Iterable<XmlElement | XmlText>;
    clone(): XmlFragment;
    toDOM(): DocumentFragment;
    toJSON(): string;
    toArray(): (XmlElement | XmlText)[];

    observe(f: (event: XmlEvent, transaction: Transaction) => void): void;
    observeDeep(f: (events: YEvent<any>[], transaction: Transaction) => void): void;
}

/* -------------------------------------------------------------------------- */
/*                              Undo Manager                                  */
/* -------------------------------------------------------------------------- */

export interface UndoManagerOptions {
    trackedOrigins?: Set<any>;
    captureTimeout?: number;
    deleteFilter?: (item: any) => boolean;
}

export interface StackItem {
    meta: Map<any, any>;
    insertions?: any;
    deletions?: any;
}

export interface UndoManagerEvent {
    stackItem: StackItem;
    origin?: Origin;
    transaction?: Transaction;
    type?: 'undo' | 'redo';
}

export declare class UndoManager {
    readonly scope: AbstractType<any>[];
    readonly undoStack: StackItem[];
    readonly redoStack: StackItem[];

    constructor(scope: AbstractType<any> | AbstractType<any>[], options?: UndoManagerOptions);

    canUndo(): boolean;
    canRedo(): boolean;

    undo(): void;
    redo(): void;
    stopCapturing(): void;
    clear(): void;
    destroy(): void;

    on(event: 'stack-item-added' | 'stack-item-popped' | 'stack-cleared', handler: (event: UndoManagerEvent) => void): void;
    on(event: string, handler: (...args: any[]) => void): void;
    off(event: 'stack-item-added' | 'stack-item-popped' | 'stack-cleared', handler: (event: UndoManagerEvent) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;
}

/* -------------------------------------------------------------------------- */
/*                               Awareness                                    */
/* -------------------------------------------------------------------------- */

export interface AwarenessChange {
    added: number[];
    updated: number[];
    removed: number[];
}

export declare class Awareness<TState = any> {
    clientID: number;

    constructor(doc: Doc);

    getLocalState(): TState | null;
    setLocalState(state: TState | null): void;

    setLocalStateField(field: string, value: any): void;

    getStates(): Map<number, TState>;

    on(event: 'change', handler: (changes: AwarenessChange, origin: any) => void): void;
    off(event: 'change', handler: (changes: AwarenessChange, origin: any) => void): void;

    destroy(): void;
}

/* -------------------------------------------------------------------------- */
/*                          Relative Position APIs                            */
/* -------------------------------------------------------------------------- */

export declare function createRelativePositionFromTypeIndex(
    type: AbstractType<any>,
    index: number,
    assoc?: number
): RelativePosition;

export declare function createAbsolutePositionFromRelativePosition(
    relativePosition: RelativePosition,
    doc: Doc | null
): AbsolutePosition | null;

export declare function encodeRelativePosition(relativePosition: RelativePosition): Uint8Array;
export declare function decodeRelativePosition(encoded: Uint8Array): RelativePosition;

/* -------------------------------------------------------------------------- */
/*                              Update APIs                                   */
/* -------------------------------------------------------------------------- */

export declare function encodeStateAsUpdate(doc: Doc, target?: Uint8Array): Uint8Array;
export declare function applyUpdate(doc: Doc, update: Uint8Array, origin?: Origin): void;
export declare function encodeStateVector(doc: Doc): Uint8Array;
