/**
 * Public TextFrame owned by Shape.
 *
 * @packageDocumentation
 */
import {
    TextDirection,
    TextVerticalAlignment,
    isTextVerticalType,
    isTextAnchoring
} from './body-pr';

/**
 * Owner hooks for {@link TextFrame} / {@link InternalMargin}.
 *
 * @private
 */
export interface TextFrameOwner {
    /**
     * @private
     */
    readTextFrameDirection(): TextDirection | undefined;
    /**
     * @private
     */
    writeTextFrameDirection(value: TextDirection): void;
    /**
     * @private
     */
    readTextFrameVerticalAlignment(): TextVerticalAlignment | undefined;
    /**
     * @private
     */
    writeTextFrameVerticalAlignment(value: TextVerticalAlignment): void;
    /**
     * @private
     */
    readInternalMarginLeft(): number;
    /**
     * @private
     */
    writeInternalMarginLeft(value: number): void;
    /**
     * @private
     */
    readInternalMarginTop(): number;
    /**
     * @private
     */
    writeInternalMarginTop(value: number): void;
    /**
     * @private
     */
    readInternalMarginRight(): number;
    /**
     * @private
     */
    writeInternalMarginRight(value: number): void;
    /**
     * @private
     */
    readInternalMarginBottom(): number;
    /**
     * @private
     */
    writeInternalMarginBottom(value: number): void;
}

/**
 * Internal text-frame margins in points.
 *
 * @public
 */
export class InternalMargin {
    private readonly owner: TextFrameOwner;

    /**
     *  @private
     *
     * @param {TextFrameOwner} owner - The owner.
     */
    constructor(owner: TextFrameOwner) {
        this.owner = owner;
    }

    /**
     * Gets or sets the distance between the text and the left shape boundary, in points.
     *
     * @public
     */
    get left(): number {
        return this.owner.readInternalMarginLeft();
    }

    set left(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
            throw new RangeError('InternalMargin.left must be a finite non-negative number of points');
        }
        this.owner.writeInternalMarginLeft(value);
    }

    /**
     * Gets or sets the distance between the text and the top shape boundary, in points.
     *
     * @public
     */
    get top(): number {
        return this.owner.readInternalMarginTop();
    }

    set top(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
            throw new RangeError('InternalMargin.top must be a finite non-negative number of points');
        }
        this.owner.writeInternalMarginTop(value);
    }

    /**
     * Gets or sets the distance between the text and the right shape boundary, in points.
     *
     * @public
     */
    get right(): number {
        return this.owner.readInternalMarginRight();
    }

    set right(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
            throw new RangeError('InternalMargin.right must be a finite non-negative number of points');
        }
        this.owner.writeInternalMarginRight(value);
    }

    /**
     * Gets or sets the distance between the text and the bottom shape boundary, in points.
     *
     * @public
     */
    get bottom(): number {
        return this.owner.readInternalMarginBottom();
    }

    set bottom(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
            throw new RangeError('InternalMargin.bottom must be a finite non-negative number of points');
        }
        this.owner.writeInternalMarginBottom(value);
    }
}

/**
 * Text frame body properties.
 *
 * @public
 */
export class TextFrame {
    private readonly owner: TextFrameOwner;
    private readonly internalMarginValue: InternalMargin;

    /**
     *  @private
     *
     * @param {TextFrameOwner} owner - The owner.
     */
    constructor(owner: TextFrameOwner) {
        this.owner = owner;
        this.internalMarginValue = new InternalMargin(owner);
    }

    /**
     * Gets or sets the text direction.
     *
     * @public
     */
    get textDirection(): TextDirection {
        const value: TextDirection = this.owner.readTextFrameDirection();
        return value !== undefined ? value : TextDirection.Horizontal;
    }

    set textDirection(value: TextDirection) {
        if (!isTextVerticalType(value)) {
            throw new RangeError(`Invalid TextFrame.textDirection "${String(value)}"`);
        }
        if ((value as string) === 'unknown') {
            throw new RangeError('TextFrame.textDirection cannot be set to Unknown');
        }
        this.owner.writeTextFrameDirection(value);
    }

    /**
     * Gets or sets the vertical text alignment inside the frame.
     *
     * @public
     */
    get textVerticalAlignment(): TextVerticalAlignment {
        const value: TextVerticalAlignment = this.owner.readTextFrameVerticalAlignment();
        return value !== undefined ? value : TextVerticalAlignment.Top;
    }

    set textVerticalAlignment(value: TextVerticalAlignment) {
        if (!isTextAnchoring(value)) {
            throw new RangeError(`Invalid TextFrame.textVerticalAlignment "${String(value)}"`);
        }
        if ((value as string) === 'unknown') {
            throw new RangeError('TextFrame.textVerticalAlignment cannot be set to Unknown');
        }
        this.owner.writeTextFrameVerticalAlignment(value);
    }

    /**
     * Gets the internal margins between the shape boundary and its text (points). The returned object is owned by the text frame for the shape lifetime.
     *
     * @public
     */
    get internalMargin(): InternalMargin {
        return this.internalMarginValue;
    }
}
