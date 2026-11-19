/**
 * UnknownNodeTypeError — thrown when a deserialized document references a
 * node type that is not registered in the supplied schema.
 */
export class UnknownNodeTypeError extends Error {
    public readonly name: string = 'UnknownNodeTypeError';
    public readonly nodeType: string;
    public readonly nodePath: readonly number[];

    constructor(nodeType: string, nodePath: readonly number[]) {
        super(`UnknownNodeTypeError: node type "${nodeType}" is not registered in the schema (nodePath=${JSON.stringify(nodePath)}).`);
        this.nodeType = nodeType;
        this.nodePath = nodePath;
        Object.setPrototypeOf(this, UnknownNodeTypeError.prototype);
    }
}
