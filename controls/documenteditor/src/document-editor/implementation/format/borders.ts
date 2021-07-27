import { LineStyle } from '../../base/types';
import { WBorder } from './border';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IWidget } from '../viewer/page';

/**
 * @private
 */
export class WBorders implements IWidget {
    private leftIn: WBorder = new WBorder(this);
    private rightIn: WBorder = new WBorder(this);
    private topIn: WBorder = new WBorder(this);
    private bottomIn: WBorder = new WBorder(this);
    private horizontalIn: WBorder = new WBorder(this);
    private verticalIn: WBorder = new WBorder(this);
    private diagonalUpIn: WBorder = new WBorder(this);
    private diagonalDownIn: WBorder = new WBorder(this);
    private lineWidthIn: number = 0;
    private valueIn: LineStyle;

    public ownerBase: Object;

    public get left(): WBorder {
        return this.leftIn;
    }
    public set left(value: WBorder) {
        this.leftIn = value;
    }
    public get right(): WBorder {
        return this.rightIn;
    }
    public set right(value: WBorder) {
        this.rightIn = value;
    }
    public get top(): WBorder {
        return this.topIn;
    }
    public set top(value: WBorder) {
        this.topIn = value;
    }
    public get bottom(): WBorder {
        return this.bottomIn;
    }
    public set bottom(value: WBorder) {
        this.bottomIn = value;
    }
    public get horizontal(): WBorder {
        return this.horizontalIn;
    }
    public set horizontal(value: WBorder) {
        this.horizontalIn = value;
    }
    public get vertical(): WBorder {
        return this.verticalIn;
    }
    public set vertical(value: WBorder) {
        this.verticalIn = value;
    }
    public get diagonalUp(): WBorder {
        return this.diagonalUpIn;
    }
    public set diagonalUp(value: WBorder) {
        this.diagonalUpIn = value;
    }
    public get diagonalDown(): WBorder {
        return this.diagonalDownIn;
    }
    public set diagonalDown(value: WBorder) {
        this.diagonalDownIn = value;
    }

    public constructor(node?: Object) {
        this.ownerBase = node;
    }
    /* eslint-enable */
    public destroy(): void {
        if (!isNullOrUndefined(this.left)) {
            this.left.destroy();
        }
        if (!isNullOrUndefined(this.top)) {
            this.top.destroy();
        }
        if (!isNullOrUndefined(this.bottom)) {
            this.bottom.destroy();
        }
        if (!isNullOrUndefined(this.right)) {
            this.right.destroy();
        }
        if (!isNullOrUndefined(this.horizontal)) {
            this.horizontal.destroy();
        }
        if (!isNullOrUndefined(this.vertical)) {
            this.vertical.destroy();
        }
        if (!isNullOrUndefined(this.diagonalDown)) {
            this.diagonalDown.destroy();
        }
        if (!isNullOrUndefined(this.diagonalUp)) {
            this.diagonalUp.destroy();
        }
        this.topIn = undefined;
        this.bottomIn = undefined;
        this.leftIn = undefined;
        this.rightIn = undefined;
        this.horizontalIn = undefined;
        this.verticalIn = undefined;
        this.diagonalDownIn = undefined;
        this.diagonalUpIn = undefined;
        this.lineWidthIn = undefined;
        this.valueIn = undefined;
    }
    public cloneFormat(): WBorders {
        const borders: WBorders = new WBorders(undefined);
        borders.top = isNullOrUndefined(this.top) ? undefined : this.top.cloneFormat();
        borders.bottom = isNullOrUndefined(this.bottom) ? undefined : this.bottom.cloneFormat();
        borders.left = isNullOrUndefined(this.left) ? undefined : this.left.cloneFormat();
        borders.right = isNullOrUndefined(this.right) ? undefined : this.right.cloneFormat();
        borders.horizontal = isNullOrUndefined(this.horizontal) ? undefined : this.horizontal.cloneFormat();
        borders.vertical = isNullOrUndefined(this.vertical) ? undefined : this.vertical.cloneFormat();
        borders.diagonalUp = isNullOrUndefined(this.diagonalUp) ? undefined : this.diagonalUp.cloneFormat();
        borders.diagonalDown = isNullOrUndefined(this.diagonalDown) ? undefined : this.diagonalDown.cloneFormat();
        return borders;
    }
    public copyFormat(borders: WBorders): void {
        if (!isNullOrUndefined(borders.left) && borders.left instanceof WBorder) {
            this.left = new WBorder(this);
            (this.left as WBorder).copyFormat(borders.left);
        }
        if (!isNullOrUndefined(borders.right) && borders.right instanceof WBorder) {
            this.right = new WBorder(this);
            (this.right as WBorder).copyFormat(borders.right);
        }
        if (!isNullOrUndefined(borders.top) && borders.top instanceof WBorder) {
            this.top = new WBorder(this);
            (this.top as WBorder).copyFormat(borders.top);
        }
        if (!isNullOrUndefined(borders.bottom) && borders.bottom instanceof WBorder) {
            this.bottom = new WBorder(this);
            (this.bottom as WBorder).copyFormat(borders.bottom);
        }
        if (!isNullOrUndefined(borders.horizontal) && borders.horizontal instanceof WBorder) {
            this.horizontal = new WBorder(this);
            (this.horizontal as WBorder).copyFormat(borders.horizontal);
        }
        if (!isNullOrUndefined(borders.vertical) && borders.vertical instanceof WBorder) {
            this.vertical = new WBorder(this);
            (this.vertical as WBorder).copyFormat(borders.vertical);
        }
        if (!isNullOrUndefined(borders.diagonalDown) && borders.diagonalDown instanceof WBorder) {
            this.diagonalDown = new WBorder(this);
            (this.diagonalDown as WBorder).copyFormat(borders.diagonalDown);
        }
        if (!isNullOrUndefined(borders.diagonalUp) && borders.diagonalUp instanceof WBorder) {
            this.diagonalUp = new WBorder(this);
            (this.diagonalUp as WBorder).copyFormat(borders.diagonalUp);
        }
    }
}
