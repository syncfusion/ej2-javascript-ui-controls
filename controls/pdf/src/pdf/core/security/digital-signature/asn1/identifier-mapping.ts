export class _PdfObjectIdentifier {
    _encoding: Uint8Array = new Uint8Array(0);
    _period: number = '.'.charCodeAt(0);
    _fromParts(nodes: number[], prefix?: _PdfObjectIdentifier | number): _PdfObjectIdentifier {
        const resolvedNodes: number[] = typeof prefix === 'number' ? [prefix, ...nodes] : nodes;
        if (!prefix || typeof prefix === 'number') {
            if (resolvedNodes.length < 2) {
                throw new Error('An oid must contain at least two nodes');
            } else if (resolvedNodes[0] < 0 || resolvedNodes[0] > 2) {
                throw new Error('Invalid oid: The first node must be 0, 1, or 2.');
            } else if (resolvedNodes[0] < 2 && resolvedNodes[1] > 39) {
                throw new Error(`Invalid oid: When Node #1 is 0 or 1, Node #2 must be 0–39. Received: ${resolvedNodes}.`);
            }
        }
        const oid: _PdfObjectIdentifier = new _PdfObjectIdentifier();
        const encoded: Uint8Array = oid._encodeRelativeObjectIdentifier(
            typeof prefix === 'number'
                ? [(resolvedNodes[0] * 40) + resolvedNodes[1], ...resolvedNodes.slice(2)]
                : resolvedNodes
        );
        if (prefix && typeof prefix !== 'number') {
            oid._encoding = this._mergeUint8Arrays(prefix._encoding, encoded);
        } else {
            oid._encoding = encoded;
        }
        return oid;
    }
    _getNodes(): number[] {
        const subcomponents: number[] = this._decodeRelativeObjectIdentifier(this._encoding);
        return [
            Math.min(2, Math.floor(subcomponents[0] / 40)),
            subcomponents[0] >= 80 ? subcomponents[0] - 80 : subcomponents[0] % 40,
            ...subcomponents.slice(1)
        ];
    }
    _getDotDelimitedNotation(): string {
        return this._getNodes().join('.');
    }
    _getAbstractSyntaxNotation(): string {
        return `{ ${this._getNodes().map((node: number) => node.toString()).join(' ')} }`;
    }
    _mergeUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
        const result: Uint8Array = new Uint8Array(a.length + b.length);
        result.set(a, 0);
        result.set(b, a.length);
        return result;
    }
    _fromString(str: string): _PdfObjectIdentifier {
        const arcs: number[] = [];
        let last: number = 0;
        for (let i: number = 0; i < str.length; i++) {
            if (str.charCodeAt(i) === this._period) {
                const arc: number = Number.parseInt(str.slice(last, i), 10);
                arcs.push(arc);
                last = i + 1;
            }
        }
        const arc: number = Number.parseInt(str.slice(last), 10);
        arcs.push(arc);
        return this._fromParts(arcs);
    }
    _fromBytes(bytes: Uint8Array): _PdfObjectIdentifier {
        if (bytes.length === 0) {
            throw new Error('Encoded value was too short to be an object identifier');
        } else if ((bytes[bytes.length - 1] & 0b10000000) !== 0) {
            throw new Error('oid was truncated.');
        }
        let currentNode: number = 0;
        for (let i: number = 1; i < bytes.length; i++) {
            const byte: number = bytes[<number>i];
            if (currentNode === 0 && byte === 0x80) {
                throw new Error('Padding is not allowed in object identifier nodes');
            }
            if (byte < 0x80) {
                currentNode = 0;
            } else {
                currentNode++;
            }
        }
        const oid: _PdfObjectIdentifier = new _PdfObjectIdentifier();
        oid._encoding = new Uint8Array(bytes);
        return oid;
    }
    _fromBytesUnsafe(bytes: Uint8Array): _PdfObjectIdentifier {
        const oid: _PdfObjectIdentifier = new _PdfObjectIdentifier();
        oid._encoding = new Uint8Array(bytes);
        return oid;
    }
    toString(): string {
        return this._getDotDelimitedNotation();
    }
    _toJson(): string {
        return this._getDotDelimitedNotation();
    }
    _toBytes(): Uint8Array {
        return new Uint8Array(this._encoding);
    }
    _encodeRelativeObjectIdentifier(value: number[]): Uint8Array {
        const result: number[] = [];
        for (const arc of value) {
            if (arc < 128) {
                result.push(arc);
                continue;
            }
            let length: number = 0;
            let tempArc: number = arc;
            while (tempArc > 0) {
                length++;
                tempArc >>>= 7;
            }
            for (let j: number = length - 1; j >= 0; j--) {
                let byte: number = (arc >>> (j * 7)) & 0x7f;
                if (j !== 0) {
                    byte |= 0x80;
                }
                result.push(byte);
            }
        }
        return new Uint8Array(result);
    }
    _decodeRelativeObjectIdentifier(value: Uint8Array): number[] {
        if (value.length === 0) {
            return [];
        } else if (value.length > 1 && (value[value.length - 1] & 0b10000000) !== 0) {
            throw new Error('The relative object identifier is too long and was shortened.');
        }
        const nodes: number[] = [];
        let currentNode: number = 0;
        for (let i: number = 0; i < value.length; i++) {
            const byte: number = value[<number>i];
            if (byte === 0x80 && currentNode === 0) {
                throw new Error('Relative oid node has unsupported padding.');
            }
            currentNode <<= 7;
            currentNode += (byte & 0x7f);
            if ((byte & 0x80) === 0) {
                nodes.push(currentNode);
                currentNode = 0;
            }
        }
        return nodes;
    }
}
