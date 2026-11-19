/**
 * Table / cell padding facade over `TableCellMargins` (points).
 *
 * Wire units remain DXA twips via tbl-pr / tc-pr serializers.
 *
 * @public
 */
import { TableCellMargins } from './tbl-pr';

/**
 * Host that reads/writes a full cell-margins bag.
 *
 * @private
 */
export interface PaddingsHost {
    read(): TableCellMargins | undefined;
    write(value: TableCellMargins | undefined): void;
}

/**
 * Four-sided padding values in points.
 *
 * @public
 */
export class Paddings {
    private readonly host: PaddingsHost;

    /**
     * @param {PaddingsHost} host - The host.
     * @private
     */
    constructor(host: PaddingsHost) {
        this.host = host;
    }

    get left(): number {
        const m: TableCellMargins = this.host.read();
        return m !== undefined && m.left !== undefined ? m.left : 0;
    }
    set left(value: number) {
        this.writeSide('left', value);
    }

    get right(): number {
        const m: TableCellMargins = this.host.read();
        return m !== undefined && m.right !== undefined ? m.right : 0;
    }
    set right(value: number) {
        this.writeSide('right', value);
    }

    get top(): number {
        const m: TableCellMargins = this.host.read();
        return m !== undefined && m.top !== undefined ? m.top : 0;
    }
    set top(value: number) {
        this.writeSide('top', value);
    }

    get bottom(): number {
        const m: TableCellMargins = this.host.read();
        return m !== undefined && m.bottom !== undefined ? m.bottom : 0;
    }
    set bottom(value: number) {
        this.writeSide('bottom', value);
    }

    /**
     * Common value when all sides match; otherwise the top side.
     */
    get all(): number {
        const top: number = this.top;
        if (this.bottom === top && this.left === top && this.right === top) {
            return top;
        }
        return top;
    }

    /**
     * Sets all four sides to the same point value.
     *
     * @param {number} value - The value.
     * @returns {void} Nothing is returned.
     */
    set all(value: number) {
        this.host.write({
            top: value,
            bottom: value,
            left: value,
            right: value
        });
    }

    private writeSide(side: 'top' | 'bottom' | 'left' | 'right', value: number): void {
        const prev: TableCellMargins = this.host.read();
        const top: number = side === 'top' ? value : (prev !== undefined ? prev.top : undefined);
        const bottom: number = side === 'bottom' ? value : (prev !== undefined ? prev.bottom : undefined);
        const left: number = side === 'left' ? value : (prev !== undefined ? prev.left : undefined);
        const right: number = side === 'right' ? value : (prev !== undefined ? prev.right : undefined);
        this.host.write({
            top: top,
            bottom: bottom,
            left: left,
            right: right
        });
    }
}
