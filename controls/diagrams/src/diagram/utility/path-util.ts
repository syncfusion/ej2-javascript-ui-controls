import { PathSegment } from './../rendering/canvas-interface';
import { PointModel } from '../primitives/point-model';

/**
 * These utility methods help to process the data and to convert it to desired dimensions
 */
/**
 * processPathData method \
 *
 * @returns {Object[]} processPathData method .\
 * @param { string } data - provide the data  value.
 * @private
 */
export function processPathData(data: string): Object[] {
    const collection: Object[] = []; let j: number;
    const arrayCollection: Object[] = parsePathData(data);
    if (arrayCollection.length > 0) {
        for (let i: number = 0; i < arrayCollection.length; i++) {
            const ob: Object = arrayCollection[parseInt(i.toString(), 10)];
            let char: string = '';
            char = ob[0];
            switch (char.toLowerCase()) {
            case 'm':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({ command: char, x: ob[parseInt(j.toString(), 10)], y: ob[j + 1] });
                    j = j + 1;
                    if (char === 'm') {
                        char = 'l';
                    } else if (char === 'M') {
                        char = 'L';
                    }
                }
                break;
            case 'l':
            case 't':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({ command: char, x: ob[parseInt(j.toString(), 10)], y: ob[j + 1] });
                    j = j + 1;
                }
                break;
            case 'h':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({ command: char, x: ob[parseInt(j.toString(), 10)] });
                }
                break;
            case 'v':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({ command: char, y: ob[parseInt(j.toString(), 10)] });
                }
                break;
            case 'z':
                collection.push({ command: char });
                break;
            case 'c':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({
                        command: char, x1: ob[parseInt(j.toString(), 10)], y1: ob[j + 1], x2: ob[j + 2], y2: ob[j + 3], x: ob[j + 4], y: ob[j + 5]
                    });
                    j = j + 5;
                }
                break;
            case 's':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({ command: char, x2: ob[parseInt(j.toString(), 10)], y2: ob[j + 1], x: ob[j + 2], y: ob[j + 3] });
                    j = j + 3;
                }
                break;
            case 'q':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({ command: char, x1: ob[parseInt(j.toString(), 10)], y1: ob[j + 1], x: ob[j + 2], y: ob[j + 3] });
                    j = j + 3;
                }
                break;
            case 'a':
                for (j = 1; j < (ob as Object[]).length; j++) {
                    collection.push({
                        command: char, r1: ob[parseInt(j.toString(), 10)], r2: ob[j + 1], angle: ob[j + 2], largeArc: ob[j + 3],
                        sweep: ob[j + 4], x: ob[j + 5], y: ob[j + 6]
                    });
                    j = j + 6;
                }
                break;
            }
        }
    }
    return collection;
}

/**
 * parsePathData method \
 *
 * @returns {Object[]} parsePathData method .\
 * @param { string } data - provide the data  value.
 * @private
 */
export function parsePathData(data: string): Object[] {
    const tokenizer: RegExp = /([a-z]+)|([+-]?(?:\d+\.?\d*|\.\d+))/gi;
    let current: Object[] = [];
    const commands: Object[] = [];
    let match: Object = {};
    tokenizer.lastIndex = 0;
    let isExponential: boolean = false;
    match = tokenizer.exec(data);
    while (match) {
        if (match[1] === 'e') {
            //let s1: string = '';
            isExponential = true;
        } else if (match[1]) {
            if (match[1].toLowerCase() === 'zm') {
                if (current.length) {
                    commands.push(current);
                }
                commands.push(['Z']);
                current = [match[1].substring(1, 2)];
            } else {
                if (current.length) {
                    commands.push(current);
                }
                current = [match[1]];
            }
            isExponential = false;
        } else {
            if (!current.length) {
                current = [];
            }
            if (!isExponential) {
                current.push(Number(match[2]));
            }
            isExponential = false;
        }
        match = tokenizer.exec(data);
    }
    if (current.length) {
        commands.push(current);
    }
    return commands;
}

/**
 * getRectanglePath method \
 *
 * @returns {string} getRectanglePath method .\
 * @param { number } cornerRadius - provide the data  value.
 * @param { number } height - provide the height  value.
 * @param { number } width - provide the width  value.
 * @private
 */
export function getRectanglePath(cornerRadius: number, height: number, width: number): string {
    const x: number = 0;
    const y: number = 0;
    let path: string = '';
    const points: PointModel[] = [{ x: x + cornerRadius, y: y }, { x: x + width - cornerRadius, y: y },
        { x: x + width, y: y + cornerRadius }, { x: x + width, y: y + height - cornerRadius },
        { x: x + width - cornerRadius, y: y + height }, { x: x + cornerRadius, y: y + height },
        { x: x, y: y + height - cornerRadius }, { x: x, y: y + cornerRadius }
    ];
    const corners: PointModel[] = [{ x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y + height }, { x: x, y: y }];
    let corner: number = 0;
    let point2: PointModel;
    let next: PointModel;
    path = 'M' + points[0].x + ' ' + points[0].y;
    let i: number;
    for (i = 0; i < points.length; i = i + 2) {
        point2 = points[i + 1];
        path += 'L' + point2.x + ' ' + point2.y;
        next = points[i + 2] || points[0];
        path += 'Q' + corners[parseInt(corner.toString(), 10)].x + ' ' + corners[parseInt(corner.toString(), 10)].y + ' ' + next.x + ' ' + next.y;
        corner++;
    }
    return path;
}

/**
 * getPolygonPath method \
 *
 * @returns {string} getPolygonPath method .\
 * @param { PointModel[] } collection - provide the data  value.
 * @private
 */
export function getPolygonPath(collection: PointModel[]): string {
    let path: string = '';
    let seg: PointModel;
    path = 'M' + collection[0].x + ' ' + collection[0].y;
    let i: number;
    for (i = 1; i < collection.length; i++) {
        seg = collection[parseInt(i.toString(), 10)];
        path += 'L' + seg.x + ' ' + seg.y;
    }
    path += 'Z';
    return path;
}
/**
 * getFreeHandPath method \
 *
 * @returns {string} getFreeHandPath method .\
 * @param { PointModel[] } collection - provide the data  value.
 * @private
 */
export function getFreeHandPath(collection: any): string {
    var k: number;
    for (k = 0; k < collection.length; k++)
    {
        collection[parseInt(k.toString(), 10)].x = Math.round(collection[parseInt(k.toString(), 10)].x);
        collection[parseInt(k.toString(), 10)].y = Math.round(collection[parseInt(k.toString(), 10)].y);
    }
    let path: string = '';
    let seg: PointModel;
    path = 'M' + collection[0].x + ' ' + collection[0].y;
    let i: number;
    for (i = 1; i < collection.length; i++) {
        seg = collection[parseInt(i.toString(), 10)];
        path += 'L' + seg.x + ' ' + seg.y;
    }
    return path;
}


/* eslint-disable */
/**
 * pathSegmentCollection method \
 *
 * @returns {string} pathSegmentCollection method .\
 * @param { Object[]} collection - provide the collection  value.
 * @private
 */
export function pathSegmentCollection(collection: Object[]): Object[] {
    let x0: number; let y0: number; let x1: number; let y1: number; let x2: number; let y2: number;
    let x: number; let y: number; let length: number; let i: number;
    let initx: number; let inity: number;
    const segments: PathSegment[] = [];
    for (x = 0, y = 0, i = 0, length = collection.length; i < length; ++i) {
        const obj: Object = collection[i];
        const seg: PathSegment = obj;
        let char: string = ''; char = seg.command;
        if ('y1' in seg) { y1 = seg.y1; }
        if ('y2' in seg) { y2 = seg.y2; }
        if ('x1' in seg) { x1 = seg.x1; }
        if ('x2' in seg) { x2 = seg.x2; }
        if ('x' in seg) { x = seg.x; }
        if ('y' in seg) { y = seg.y; }
        const prev: PathSegment = segments[segments.length - 1];
        switch (char) {
        case 'M':
            segments.push({ command: 'M', x: x, y: y });
            break;
        case 'L':
            segments.push({ command: 'L', x0: x0, y0: y0, x: x, y: y });
            break;
        case 'H':
            segments.push({ command: 'L', x0: x0, y0: y0, x: x, y: y0 });
            break;
        case 'V':
            segments.push({ command: 'L', x0: x0, y0: y0, x: x0, y: y });
            break;
        case 'C':
            segments.push({ command: 'C', x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y });
            break;
        case 'S':
            if (prev) {
                let ctrl: PointModel;
                if (prev.command === 'C' || prev.command === 'S') {
                    ctrl = { x: prev.x2, y: prev.y2 };
                } else {
                    ctrl = { x: x0, y: y0 };
                }
                const cpt2: PointModel = { x: 2 * x0 - ctrl.x, y: 2 * y0 - ctrl.y };
                segments.push({ command: 'C', x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x2: x2, y2: y2, x: x, y: y });
            }
            break;
        case 'Q':
            //ctx.quadraticCurveTo(x1, y1, x, y);
            segments.push({ command: 'Q', x0: x0, y0: y0, x1: x1, y1: y1, x: x, y: y });
            break;
        case 'T':
            if (prev) {
                let ctrl: PointModel;
                if (prev.command === 'Q') {
                    ctrl = { x: prev.x1, y: prev.y1 };
                } else {
                    ctrl = { x: x0, y: y0 };
                }
                const cpt2: PointModel = { x: 2 * x0 - ctrl.x, y: 2 * y0 - ctrl.y };
                segments.push({ command: 'Q', x0: x0, y0: y0, x1: cpt2.x, y1: cpt2.y, x: x, y: y });
            }
            break;
        case 'A':
            const newSeg: PathSegment = seg;
            newSeg.command = 'A';
            segments.push(newSeg);
            break;
        case 'Z':
        case 'z':
            segments.push({ command: 'Z' });
            x = x0; y = y0;
            break;
        }
        if (char === 'M' || char === 'm') {
            initx = x; inity = y;
        }

        x0 = x; y0 = y;
    }
    return segments;
}

/**
 * transformPath method \
 *
 * @returns {string} transformPath method .\
 * @param { Object[]} arr - provide the collection  value.
 * @param { number} sX - provide the collection  value.
 * @param { number} sY - provide the collection  value.
 * @param { boolean} s - provide the collection  value.
 * @param {number} bX - provide the collection  value.
 * @param { number} bY - provide the collection  value.
 * @param { number} iX - provide the collection  value.
 * @param { number} iY - provide the collection  value.
 * @private
 */
export function transformPath(arr: Object[], sX: number, sY: number, s: boolean, bX: number, bY: number, iX: number, iY: number): string {
    let x0: number; let y0: number; let x1: number; let y1: number; let x2: number; let y2: number;
    let x: number; let y: number; let length: number; let i: number; let newSeg: PathSegment;
    for (x = 0, y = 0, i = 0, length = arr.length; i < length; ++i) {
        const obj: Object = arr[i]; const seg: PathSegment = obj;
        const char: string = seg.command;
        if ('x' in seg) { x = seg.x; }
        if ('y' in seg) { y = seg.y; }
        if ('y1' in seg) { y1 = seg.y1; }
        if ('y2' in seg) { y2 = seg.y2; }
        if ('x1' in seg) { x1 = seg.x1; }
        if ('x2' in seg) { x2 = seg.x2; }
        if (s) {
            if (x !== undefined) {
                x = scalePathData(x, sX, bX, iX);
            }
            if (y !== undefined) {
                y = scalePathData(y, sY, bY, iY);
            }
            if (x1 !== undefined) {
                x1 = scalePathData(x1, sX, bX, iX);
            }
            if (y1 !== undefined) {
                y1 = scalePathData(y1, sY, bY, iY);
            }
            if (x2 !== undefined) {
                x2 = scalePathData(x2, sX, bX, iX);
            }
            if (y2 !== undefined) {
                y2 = scalePathData(y2, sY, bY, iY);
            }
        } else {
            if (x !== undefined) {
                x = Number((x + sX).toFixed(2));
            }
            if (y !== undefined) {
                y = Number((y + sY).toFixed(2));
            }
            if (x1 !== undefined) {
                x1 = Number((x1 + sX).toFixed(2));
            }
            if (y1 !== undefined) {
                y1 = Number((y1 + sY).toFixed(2));
            }
            if (x2 !== undefined) {
                x2 = Number((x2 + sX).toFixed(2));
            }
            if (y2 !== undefined) {
                y2 = Number((y2 + sY).toFixed(2));
            }
        }
        const scaledPath: PathSegment = { x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2, r1: seg.r1, r2: seg.r2 };
        newSeg = updatedSegment(seg, char, scaledPath, s, sX, sY);
        if (newSeg) {
            arr[i] = newSeg;
        }
        // Record the start of a subpath
        if (char === 'M' || char === 'm') {
            x0 = x; y0 = y;
        }
    }
    const pathData: string = getPathString(arr);
    return pathData;
}


/**
 * updatedSegment method \
 *
 * @returns {string} updatedSegment method .\
 * @param { PathSegment} segment - provide the collection  value.
 * @param { PathSegment} char - provide the collection  value.
 * @param { number} obj - provide the collection  value.
 * @param { boolean} isScale - provide the collection  value.
 * @param {number} sX - provide the collection  value.
 * @param { number} sY - provide the collection  value.
 * @private
 */
export function updatedSegment(segment: PathSegment, char: string, obj: PathSegment, isScale: boolean, sX: number, sY: number): Object {
    switch (char) {
    case 'M':
        segment.x = obj.x;
        segment.y = obj.y;
        break;
    case 'L':
        segment.x = obj.x;
        segment.y = obj.y;
        break;
    case 'H':
        segment.x = obj.x;
        break;
    case 'V':
        segment.y = obj.y;
        break;
    case 'C':
        segment.x = obj.x; segment.y = obj.y;
        segment.x1 = obj.x1; segment.y1 = obj.y1;
        segment.x2 = obj.x2; segment.y2 = obj.y2;
        break;
    case 'S':
        segment.x = obj.x; segment.y = obj.y;
        segment.x2 = obj.x2; segment.y2 = obj.y2;
        break;
    case 'Q':
        segment.x = obj.x; segment.y = obj.y;
        segment.x1 = obj.x1; segment.y1 = obj.y1;
        break;
    case 'T':
        segment.x = obj.x; segment.y = obj.y;
        break;
    case 'A':
        let r1: number = obj.r1;
        let r2: number = obj.r2;
        if (isScale) {
            obj.r1 = r1 = (r1 * sX);
            obj.r2 = r2 = (r2 * sY);
        }
        segment.x = obj.x; segment.y = obj.y;
        segment.r1 = obj.r1; segment.r2 = obj.r2;
        break;
    case 'z':
    case 'Z':
        segment = { command: 'Z' };
        break;
    }
    return segment;
}
/* eslint-enable */
/**
 * scalePathData method \
 *
 * @returns {string} scalePathData method .\
 * @param { number} val - provide the val  value.
 * @param { number} scaleFactor - provide the scaleFactor  value.
 * @param { number} oldOffset - provide the oldOffset  value.
 * @param { number} newOffset - provide the newOffset  value.
 * @private
 */
export function scalePathData(val: number, scaleFactor: number, oldOffset: number, newOffset: number): number {
    if (val !== oldOffset) {
        if (newOffset !== oldOffset) {
            val = (((val * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)))
                + (newOffset - Number(oldOffset)));
        } else {
            val = ((Number(val) * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)));
        }
    } else {
        if (newOffset !== oldOffset) {
            val = newOffset;
        }
    }
    return Number(val.toFixed(2));
}

/**
 * splitArrayCollection method \
 *
 * @returns {Object[]} splitArrayCollection method .\
 * @param { Object[]} arrayCollection - provide the val  value.
 * @private
 */
export function splitArrayCollection(arrayCollection: Object[]): Object[] {
    let x0: number; let y0: number; let x1: number; let y1: number; let x2: number; let y2: number;
    let x: number; let y: number; let length: number; let i: number;
    for (x = 0, y = 0, i = 0, length = arrayCollection.length; i < length; ++i) {
        const path: Object = arrayCollection[parseInt(i.toString(), 10)];
        const seg: PathSegment = path;
        const char: string = seg.command;
        if (/[MLHVCSQTA]/.test(char)) {
            if ('x' in seg) { seg.x = x = seg.x; }
            if ('y' in seg) { seg.y = y = seg.y; }
        } else {
            if ('x1' in seg) { seg.x1 = x1 = x + seg.x1; }
            if ('x2' in seg) { seg.x2 = x2 = x + seg.x2; }
            if ('y1' in seg) { seg.y1 = y1 = y + seg.y1; }
            if ('y2' in seg) { seg.y2 = y2 = y + seg.y2; }
            if ('x' in seg) { seg.x = x += seg.x; }
            if ('y' in seg) { seg.y = y += seg.y; }
            let newSeg: PathSegment;
            switch (char) {
            case 'm':
            case 'M':
                newSeg = { command: 'M', x: x, y: y };
                break;
            case 'l':
            case 'L':
                newSeg = { command: 'L', x: x, y: y };
                break;
            case 'h':
            case 'H':
                newSeg = { command: 'H', x: x };
                break;
            case 'v':
            case 'V':
                newSeg = { command: 'V', y: y };
                break;
            case 'c':
            case 'C':
                newSeg = { command: 'C', x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2 };
                break;
            case 's':
            case 'S':
                newSeg = { command: 'S', x: x, y: y, x2: x2, y2: y2 };
                break;
            case 'q':
            case 'Q':
                newSeg = { command: 'Q', x: x, y: y, x1: x1, y1: y1 };
                break;
            case 't':
            case 'T':
                newSeg = { command: 'T', x: x, y: y };
                break;
            case 'a':
            case 'A':
                newSeg = { command: 'A', x: x, y: y };
                newSeg.r1 = seg.r1; newSeg.r2 = seg.r2; newSeg.angle = seg.angle; newSeg.largeArc = seg.largeArc;
                newSeg.sweep = seg.sweep;
                break;
            case 'z':
            case 'Z':
                newSeg = { command: 'Z' };
                x = x0; y = y0;
                newSeg = arrayCollection[parseInt(i.toString(), 10)];
                break;
            }
            if (newSeg) {
                arrayCollection[parseInt(i.toString(), 10)] = newSeg;
            }
        }
        if (char === 'M' || char === 'm') {
            x0 = x; y0 = y;
        }
    }
    return arrayCollection;
}

/**
 * getPathString method \
 *
 * @returns {string} getPathString method .\
 * @param { Object[]} arrayCollection - provide the val  value.
 * @private
 */
export function getPathString(arrayCollection: Object[]): string {
    let getNewString: string = '';
    let i: number;
    for (i = 0; i < arrayCollection.length; i++) {
        if (i === 0) {
            getNewString += getString(arrayCollection[parseInt(i.toString(), 10)]);
        } else {
            getNewString += ' ' + getString(arrayCollection[parseInt(i.toString(), 10)]);
        }
    }
    return getNewString;
}
/* eslint-disable */
/**
 * getString method \
 *
 * @returns {string} getString method .\
 * @param { PathSegment} arrayCollection - provide the val  value.
 * @private
 */
export function getString(obj: PathSegment): string {
    let string: string = '';
    switch (obj.command) {
    case 'Z':
    case 'z':
        string = obj.command;
        break;
    case 'M':
    case 'm':
    case 'L':
    case 'l':
        string = obj.command + ' ' + obj.x + ' ' + obj.y;
        break;
    case 'C':
    case 'c':
        string = obj.command + ' ' + obj.x1 + ' ' + obj.y1 + ' ' + obj.x2 + ' ' + obj.y2 + ' ' + obj.x + ' ' + obj.y;
        break;
    case 'Q':
    case 'q':
        string = obj.command + ' ' + obj.x1 + ' ' + obj.y1 + ' ' + obj.x + ' ' + obj.y;
        break;
    case 'A':
    case 'a':
        const cmd: string = obj.command; let ang: number = obj.angle;
        const l: string = (obj.largeArc ? '1' : '0');
        const s: string = (obj.sweep ? '1' : '0');
        string = cmd + ' ' + obj.r1 + ' ' + obj.r2 + ' ' + ang + ' ' + l + ' ' + s + ' ' + obj.x + ' ' + obj.y;
        break;
    case 'H':
    case 'h':
        string = obj.command + ' ' + obj.x;
        break;
    case 'V':
    case 'v':
        string = obj.command + ' ' + obj.y;
        break;
    case 'S':
    case 's':
        string = obj.command + ' ' + obj.x2 + ' ' + obj.y2 + ' ' + obj.x + ' ' + obj.y;
        break;
    case 'T':
    case 't':
        string = obj.command + ' ' + obj.x + ' ' + obj.y;
    }
    return string;
}

