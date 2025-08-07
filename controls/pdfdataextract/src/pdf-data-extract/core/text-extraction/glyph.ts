const _onCurvePoint: number = 1 << 0;
const _xShortVector: number = 1 << 1;
const _yShortVector: number = 1 << 2;
const _repeatFlag: number = 1 << 3;
const _xOrPostiveXshortVector: number = 1 << 4;
const _yOrPostiveXshortVector: number = 1 << 5;
const _simpleOverlap: number = 1 << 6;
const _words: number = 1 << 0;
const _argsAreXYValues: number = 1 << 1;
const _scale: number = 1 << 3;
const _moreComponents: number = 1 << 5;
const _xyScale: number = 1 << 6;
const _twoByTwo: number = 1 << 7;
const _instructions: number = 1 << 8;
export class _PdfGlyphTable {
    glyphs: _PdfGlyph[];
    constructor({
        glyfTable,
        isGlyphLocationsLong,
        locaTable,
        numGlyphs
    }: {
        glyfTable: DataView;
        isGlyphLocationsLong: boolean;
        locaTable: DataView;
        numGlyphs: number;
    }) {
        this.glyphs = [];
        const loca: DataView = new DataView(
            locaTable.buffer,
            locaTable.byteOffset,
            locaTable.byteLength
        );
        const data: DataView = new DataView(
            glyfTable.buffer,
            glyfTable.byteOffset,
            glyfTable.byteLength
        );
        const offsetSize: number = isGlyphLocationsLong ? 4 : 2;
        let prev: number = isGlyphLocationsLong ? loca.getUint32(0) : 2 * loca.getUint16(0);
        let pos: number = 0;
        for (let i: number = 0; i < numGlyphs; i++) {
            pos += offsetSize;
            const next: number = isGlyphLocationsLong ? loca.getUint32(pos) : 2 * loca.getUint16(pos);
            if (next === prev) {
                this.glyphs.push(new _PdfGlyph({}));
                continue;
            }
            const pdfGlyph: _PdfGlyph = new _PdfGlyph();
            const glyph: any = pdfGlyph.parse(prev, data); //eslint-disable-line
            this.glyphs.push(glyph);
            prev = next;
        }
    }
    _getSize(): number {
        return this.glyphs.reduce((a, g) => { //eslint-disable-line
            const size: number = g._getSize();
            return a + ((size + 3) & ~3);
        }, 0);
    }
    _write(): {
        isLocationLong: boolean;
        loca: Uint8Array;
        data: Uint8Array;
    } {
        const totalSize: number = this._getSize();
        const glyfTable: DataView = new DataView(new ArrayBuffer(totalSize));
        const isLocationLong: boolean = totalSize > /* 0xffff * 2 */ 0x1fffe;
        const offsetSize: number = isLocationLong ? 4 : 2;
        const locaTable: DataView = new DataView(
            new ArrayBuffer((this.glyphs.length + 1) * offsetSize)
        );
        if (isLocationLong) {
            locaTable.setUint32(0, 0);
        } else {
            locaTable.setUint16(0, 0);
        }
        let pos: number = 0;
        let locaIndex: number = 0;
        for (const glyph of this.glyphs) {
            pos += glyph._write(pos, glyfTable);
            pos = (pos + 3) & ~3;
            locaIndex += offsetSize;
            if (isLocationLong) {
                locaTable.setUint32(locaIndex, pos);
            } else {
                locaTable.setUint16(locaIndex, pos >> 1);
            }
        }
        return {
            isLocationLong,
            loca: new Uint8Array(locaTable.buffer),
            data: new Uint8Array(glyfTable.buffer)
        };
    }
    scale(factors: number[]): void {
        for (let i: number = 0, ii: number = this.glyphs.length; i < ii; i++) {
            this.glyphs[Number.parseInt(i.toString(), 10)]._scale(factors[Number.parseInt(i.toString(), 10)]);
        }
    }
}
export class _PdfGlyph {
    header: _GlyphHeader | null;
    simple: _SimpleGlyph | null;
    composites: _CompositeGlyph[] | null;
    constructor();
    constructor({ header, simple, composites }: { header?: _GlyphHeader | null; simple?: _SimpleGlyph | null;
        composites?: _CompositeGlyph[] | null; });
    constructor(params?: { header?: _GlyphHeader; simple?: _SimpleGlyph; composites?: _CompositeGlyph[]; }) {
        if (params) {
            this.header = params.header;
            this.simple = params.simple;
            this.composites = params.composites;
        } else {
            this.header = null;
            this.simple = null;
            this.composites = null;
        }
    }
    parse(pos: number, data: any): _PdfGlyph { //eslint-disable-line
        const glyphHeader: _GlyphHeader = new _GlyphHeader();
        const [read, header] = glyphHeader.parse(pos, data);
        pos += read;
        if (header.numberOfContours < 0) {
            const composites: _CompositeGlyph[] = [];
            const compositeGlyph: _CompositeGlyph = new _CompositeGlyph();
            while (true) { //eslint-disable-line
                const [n, composite] = compositeGlyph.parse(pos, data);
                pos += n;
                composites.push(composite);
                if (!(composite.flags & _moreComponents)) {
                    break;
                }
            }
            return new _PdfGlyph({ header, composites });
        }
        const simpleGlyph: _SimpleGlyph = new _SimpleGlyph();
        const simple: any = simpleGlyph.parse(pos, data, header.numberOfContours); //eslint-disable-line 
        return new _PdfGlyph({ header, simple });
    }
    _getSize(): number {
        if (!this.header) {
            return 0;
        }
        const size: any = this.simple //eslint-disable-line
            ? this.simple.getSize()
            : this.composites!.reduce((a, c) => a + c.getSize(), 0); //eslint-disable-line 
        return this.header.getSize() + size;
    }
    _write(pos: number, buffer: any): number { //eslint-disable-line
        if (!this.header) {
            return 0;
        }
        const spos: number = pos;
        pos += this.header.write(pos, buffer);
        if (this.simple) {
            pos += this.simple.write(pos, buffer);
        } else {
            for (const composite of this.composites) {
                pos += composite.write(pos, buffer);
            }
        }
        return pos - spos;
    }
    _scale(factor: number): void {
        if (!this.header) {
            return;
        }
        const xMiddle: number = (this.header.xMin + this.header.xMax) / 2;
        this.header.scale(xMiddle, factor);
        if (this.simple) {
            this.simple.scale(xMiddle, factor);
        }
    }
}
export class _GlyphHeader {
    numberOfContours: number;
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    constructor();
    constructor({ numberOfContours, xMin, yMin, xMax, yMax }:
    { numberOfContours: number; xMin: number; yMin: number; xMax: number; yMax: number; });
    constructor(params?: { numberOfContours: number; xMin: number; yMin: number; xMax: number; yMax: number; }) {
        if (params) {
            this.numberOfContours = params.numberOfContours;
            this.xMin = params.xMin;
            this.yMin = params.yMin;
            this.xMax = params.xMax;
            this.yMax = params.yMax;
        } else {
            this.numberOfContours = 0;
            this.xMin = 0;
            this.yMin = 0;
            this.xMax = 0;
            this.yMax = 0;
        }
    }
    parse(pos: number, data: DataView): [number, _GlyphHeader] {
        return [
            10,
            new _GlyphHeader({
                numberOfContours: data.getInt16(pos),
                xMin: data.getInt16(pos + 2),
                yMin: data.getInt16(pos + 4),
                xMax: data.getInt16(pos + 6),
                yMax: data.getInt16(pos + 8)
            })
        ];
    }
    getSize(): number {
        return 10;
    }
    write(pos: number, buffer: any): number { //eslint-disable-line
        buffer.setInt16(pos, this.numberOfContours);
        buffer.setInt16(pos + 2, this.xMin);
        buffer.setInt16(pos + 4, this.yMin);
        buffer.setInt16(pos + 6, this.xMax);
        buffer.setInt16(pos + 8, this.yMax);
        return 10;
    }
    scale(x: number, factor: number): void {
        this.xMin = Math.round(x + (this.xMin - x) * factor);
        this.xMax = Math.round(x + (this.xMax - x) * factor);
    }
}
export class _Contour {
    xCoordinates: number[];
    yCoordinates: number[];
    flags: number[];
    constructor({ flags, xCoordinates, yCoordinates }: { flags: number[]; xCoordinates: number[]; yCoordinates: number[]; }) {
        this.xCoordinates = xCoordinates;
        this.yCoordinates = yCoordinates;
        this.flags = flags;
    }
}
export class _SimpleGlyph {
    contours: _Contour[];
    instructions: Uint8Array;
    constructor();
    constructor({ contours, instructions }: { contours: _Contour[]; instructions: Uint8Array });
    constructor(params?: { contours: _Contour[]; instructions: Uint8Array }) {
        if (params) {
            this.contours = params.contours;
            this.instructions = params.instructions;
        } else {
            this.contours = [];
        }
    }
    parse(pos: number, data: DataView, numberOfContours: number): _SimpleGlyph {
        const endPtsOfContours: number[] = [];
        for (let i: number = 0; i < numberOfContours; i++) {
            const endPt: number = data.getUint16(pos);
            pos += 2;
            endPtsOfContours.push(endPt);
        }
        const numberOfPt: number = endPtsOfContours[numberOfContours - 1] + 1;
        const instructionLength: number = data.getUint16(pos);
        pos += 2;
        const instructions: Uint8Array = new Uint8Array(data.buffer, pos, instructionLength);
        pos += instructionLength;
        const flags: number[] = [];
        for (let i: number = 0; i < numberOfPt; pos++, i++) {
            let flag: number = data.getUint8(pos);
            flags.push(flag);
            if (flag & _repeatFlag) {
                const count: number = data.getUint8(++pos);
                flag ^= _repeatFlag;
                for (let m: number = 0; m < count; m++) {
                    flags.push(flag);
                }
                i += count;
            }
        }
        const allXCoordinates: number[][] = [];
        let xCoordinates: number[] = [];
        let yCoordinates: number[] = [];
        let pointFlags: number[] = [];
        const contours: _Contour[] = [];
        let endPtsOfContoursIndex: number = 0;
        let lastCoordinate: number = 0;
        for (let i: number = 0; i < numberOfPt; i++) {
            const flag: number = flags[Number.parseInt(i.toString(), 10)];
            if (flag & _xShortVector) {
                const x: number = data.getUint8(pos++);
                lastCoordinate += flag & _xOrPostiveXshortVector ? x : -x;
                xCoordinates.push(lastCoordinate);
            } else if (flag & _xOrPostiveXshortVector) {
                xCoordinates.push(lastCoordinate);
            } else {
                lastCoordinate += data.getInt16(pos);
                pos += 2;
                xCoordinates.push(lastCoordinate);
            }
            if (endPtsOfContours[Number.parseInt(endPtsOfContoursIndex.toString(), 10)] === i) {
                endPtsOfContoursIndex++;
                allXCoordinates.push(xCoordinates);
                xCoordinates = [];
            }
        }
        lastCoordinate = 0;
        endPtsOfContoursIndex = 0;
        for (let i: number = 0; i < numberOfPt; i++) {
            const flag: number = flags[Number.parseInt(i.toString(), 10)];
            if (flag & _yShortVector) {
                const y: number = data.getUint8(pos++);
                lastCoordinate += flag & _yOrPostiveXshortVector ? y : -y;
                yCoordinates.push(lastCoordinate);
            } else if (flag & _yOrPostiveXshortVector) {
                yCoordinates.push(lastCoordinate);
            } else {
                lastCoordinate += data.getInt16(pos);
                pos += 2;
                yCoordinates.push(lastCoordinate);
            }
            pointFlags.push((flag & _onCurvePoint) | (flag & _simpleOverlap));
            if (endPtsOfContours[Number.parseInt(endPtsOfContoursIndex.toString(), 10)] === i) {
                xCoordinates = allXCoordinates[Number.parseInt(endPtsOfContoursIndex.toString(), 10)];
                endPtsOfContoursIndex++;
                contours.push(
                    new _Contour({
                        flags: pointFlags,
                        xCoordinates,
                        yCoordinates
                    })
                );
                yCoordinates = [];
                pointFlags = [];
            }
        }
        return new _SimpleGlyph({
            contours,
            instructions
        });
    }
    getSize(): number {
        let size: number = this.contours.length * 2 + 2 + this.instructions.length;
        let lastX: number = 0;
        let lastY: number = 0;
        for (const contour of this.contours) {
            size += contour.flags.length;
            for (let i: number = 0, ii: number = contour.xCoordinates.length; i < ii; i++) {
                const x: number = contour.xCoordinates[Number.parseInt(i.toString(), 10)];
                const y: number = contour.yCoordinates[Number.parseInt(i.toString(), 10)];
                let abs: number = Math.abs(x - lastX);
                if (abs > 255) {
                    size += 2;
                } else if (abs > 0) {
                    size += 1;
                }
                lastX = x;
                abs = Math.abs(y - lastY);
                if (abs > 255) {
                    size += 2;
                } else if (abs > 0) {
                    size += 1;
                }
                lastY = y;
            }
        }
        return size;
    }
    write(pos: number, buffer: DataView): number {
        const spos: number = pos;
        const xCoordinates: number[] = [];
        const yCoordinates: number[] = [];
        const flags: number[] = [];
        let lastX: number = 0;
        let lastY: number = 0;
        for (const contour of this.contours) {
            for (let i: number = 0, ii: number = contour.xCoordinates.length; i < ii; i++) {
                let flag: number = contour.flags[Number.parseInt(i.toString(), 10)];
                const x: number = contour.xCoordinates[Number.parseInt(i.toString(), 10)];
                let delta: number = x - lastX;
                if (delta === 0) {
                    flag |= _xOrPostiveXshortVector;
                    xCoordinates.push(0);
                } else {
                    const abs: number = Math.abs(delta);
                    if (abs <= 255) {
                        flag |=
                            delta >= 0
                                ? _xShortVector | _xOrPostiveXshortVector
                                : _xShortVector;
                        xCoordinates.push(abs);
                    } else {
                        xCoordinates.push(delta);
                    }
                }
                lastX = x;
                const y: number = contour.yCoordinates[Number.parseInt(i.toString(), 10)];
                delta = y - lastY;
                if (delta === 0) {
                    flag |= _yOrPostiveXshortVector;
                    yCoordinates.push(0);
                } else {
                    const abs: number = Math.abs(delta);
                    if (abs <= 255) {
                        flag |=
                delta >= 0
                    ? _yShortVector | _yOrPostiveXshortVector
                    : _yShortVector;
                        yCoordinates.push(abs);
                    } else {
                        yCoordinates.push(delta);
                    }
                }
                lastY = y;
                flags.push(flag);
            }
            buffer.setUint16(pos, xCoordinates.length - 1);
            pos += 2;
        }
        buffer.setUint16(pos, this.instructions.length);
        pos += 2;
        if (this.instructions.length) {
            new Uint8Array(buffer.buffer, 0, buffer.buffer.byteLength).set(
                this.instructions,
                pos
            );
            pos += this.instructions.length;
        }
        for (const flag of flags) {
            buffer.setUint8(pos++, flag);
        }
        for (let i: number = 0, ii: number = xCoordinates.length; i < ii; i++) {
            const x: number = xCoordinates[Number.parseInt(i.toString(), 10)];
            const flag: number = flags[Number.parseInt(i.toString(), 10)];
            if (flag & _xShortVector) {
                buffer.setUint8(pos++, x);
            } else if (!(flag & _xOrPostiveXshortVector)) {
                buffer.setInt16(pos, x);
                pos += 2;
            }
        }
        for (let i: number = 0, ii: number = yCoordinates.length; i < ii; i++) {
            const y: number = yCoordinates[Number.parseInt(i.toString(), 10)];
            const flag: number = flags[Number.parseInt(i.toString(), 10)];
            if (flag & _yShortVector) {
                buffer.setUint8(pos++, y);
            } else if (!(flag & _yOrPostiveXshortVector)) {
                buffer.setInt16(pos, y);
                pos += 2;
            }
        }
        return pos - spos;
    }
    scale(x: number, factor: number): void {
        for (const contour of this.contours) {
            if (contour.xCoordinates.length === 0) {
                continue;
            }
            for (let i: number = 0, ii: number = contour.xCoordinates.length; i < ii; i++) {
                contour.xCoordinates[Number.parseInt(i.toString(), 10)] = Math.round(
                    x + (contour.xCoordinates[Number.parseInt(i.toString(), 10)] - x) * factor
                );
            }
        }
    }
}
export  class _CompositeGlyph {
    flags: number;
    glyphIndex: number;
    argument1: number;
    argument2: number;
    transform: number[];
    instructions: Uint8Array | null;
    constructor();
    constructor({
        flags,
        glyphIndex,
        argument1,
        argument2,
        transform,
        instructions
    }: {
        flags: number;
        glyphIndex: number;
        argument1: number;
        argument2: number;
        transform: number[];
        instructions: Uint8Array | null;
    });
    constructor(params?: {
        flags: number;
        glyphIndex: number;
        argument1: number;
        argument2: number;
        transform: number[];
        instructions: Uint8Array | null;
    }) {
        if (params) {
            this.flags = params.flags;
            this.glyphIndex = params.glyphIndex;
            this.argument1 = params.argument1;
            this.argument2 = params.argument2;
            this.transform = params.transform;
            this.instructions = params.instructions;
        } else {
            this.flags = 0;
            this.glyphIndex = 0;
            this.argument1 = 0;
            this.argument2 = 0;
            this.transform = [];
            this.instructions = null;
        }
    }
    parse(pos: number, data: DataView): [number, _CompositeGlyph] {
        const spos: number = pos;
        const transform: number[] = [];
        let flags: number = data.getUint16(pos);
        const glyphIndex: number = data.getUint16(pos + 2);
        pos += 4;
        let argument1: number;
        let argument2: number;
        if (flags & _words) {
            if (flags & _argsAreXYValues) {
                argument1 = data.getInt16(pos);
                argument2 = data.getInt16(pos + 2);
            } else {
                argument1 = data.getUint16(pos);
                argument2 = data.getUint16(pos + 2);
            }
            pos += 4;
            flags ^= _words;
        } else {
            if (flags & _argsAreXYValues) {
                argument1 = data.getInt8(pos);
                argument2 = data.getInt8(pos + 1);
            } else {
                argument1 = data.getUint8(pos);
                argument2 = data.getUint8(pos + 1);
            }
            pos += 2;
        }
        if (flags & _scale) {
            transform.push(data.getUint16(pos));
            pos += 2;
        } else if (flags & _xyScale) {
            transform.push(data.getUint16(pos), data.getUint16(pos + 2));
            pos += 4;
        } else if (flags & _twoByTwo) {
            transform.push(
                data.getUint16(pos),
                data.getUint16(pos + 2),
                data.getUint16(pos + 4),
                data.getUint16(pos + 6)
            );
            pos += 8;
        }
        let instructions: Uint8Array | null = null;
        if (flags & _instructions) {
            const instructionLength: number = data.getUint16(pos);
            pos += 2;
            instructions = new Uint8Array(data.buffer.slice(pos, pos + instructionLength));
            pos += instructionLength;
        }
        return [
            pos - spos,
            new _CompositeGlyph({
                flags,
                glyphIndex,
                argument1,
                argument2,
                transform,
                instructions
            })
        ];
    }
    getSize(): number {
        let size: number = 2 + 2 + this.transform.length * 2;
        if (this.flags & _instructions) {
            size += 2 + (this.instructions ? this.instructions.length : 0);
        }
        size += 2;
        if (this.flags & 2) {
            if (!(this.argument1 >= -128 && this.argument1 <= 127 && this.argument2 >= -128 && this.argument2 <= 127)) {
                size += 2;
            }
        } else if (!(this.argument1 >= 0 && this.argument1 <= 255 && this.argument2 >= 0 && this.argument2 <= 255)) {
            size += 2;
        }
        return size;
    }
    write(pos: number, buffer: DataView): number {
        const spos: number = pos;
        if (this.flags & _argsAreXYValues) {
            if (!(this.argument1 >= -128 && this.argument1 <= 127 && this.argument2 >= -128 && this.argument2 <= 127)) {
                this.flags |= _words;
            }
        } else if (!(this.argument1 >= 0 && this.argument1 <= 255 && this.argument2 >= 0 && this.argument2 <= 255)) {
            this.flags |= _words;
        }
        buffer.setUint16(pos, this.flags);
        buffer.setUint16(pos + 2, this.glyphIndex);
        pos += 4;
        if (this.flags & _words) {
            if (this.flags & _argsAreXYValues) {
                buffer.setInt16(pos, this.argument1);
                buffer.setInt16(pos + 2, this.argument2);
            } else {
                buffer.setUint16(pos, this.argument1);
                buffer.setUint16(pos + 2, this.argument2);
            }
            pos += 4;
        } else {
            buffer.setUint8(pos, this.argument1);
            buffer.setUint8(pos + 1, this.argument2);
            pos += 2;
        }
        if (this.flags & _instructions) {
            buffer.setUint16(pos, this.instructions ? this.instructions.length : 0);
            pos += 2;
            if (this.instructions && this.instructions.length) {
                new Uint8Array(buffer.buffer, 0, buffer.buffer.byteLength).set(this.instructions, pos);
                pos += this.instructions.length;
            }
        }
        return pos - spos;
    }
}
