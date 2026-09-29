/**
 * UnknownNodeTypeError — thrown when a deserialized document references a
 * node type that is not registered in the supplied schema.
 */
export class UnknownNodeTypeError extends Error {
    public readonly name: string = 'UnknownNodeTypeError';
    public readonly nodeType: string;
    public readonly nodeId: string;

    constructor(nodeType: string, nodeId: string) {
        super(`UnknownNodeTypeError: node type "${nodeType}" is not registered in the schema (nodeId="${nodeId}").`);
        this.nodeType = nodeType;
        this.nodeId = nodeId;
        Object.setPrototypeOf(this, UnknownNodeTypeError.prototype);
    }
}
