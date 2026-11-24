/**
 * Public WrapFormat owned by Shape / GroupShape (Shape.md §8).
 *
 * @packageDocumentation
 */
import {
    assertEnumMember,
    TEXT_WRAPPING_STYLE_SET,
    TEXT_WRAPPING_TYPE_SET,
    TextWrappingStyle,
    TextWrappingType
} from '../images/layout-types';

/**
 * Owner hooks for {@link WrapFormat}.
 *
 * @private
 */
export interface WrapFormatOwner {
    /**
     * @private
     */
    readWrapStyle(): TextWrappingStyle;
    /**
     * @private
     */
    writeWrapStyle(value: TextWrappingStyle): void;
    /**
     * @private
     */
    readWrapType(): TextWrappingType;
    /**
     * @private
     */
    writeWrapType(value: TextWrappingType): void;
    /**
     * @private
     */
    readAllowOverlap(): boolean;
    /**
     * @private
     */
    writeAllowOverlap(value: boolean): void;
    /**
     * @private
     */
    readDistanceTop(): number;
    /**
     * @private
     */
    writeDistanceTop(value: number): void;
    /**
     * @private
     */
    readDistanceBottom(): number;
    /**
     * @private
     */
    writeDistanceBottom(value: number): void;
    /**
     * @private
     */
    readDistanceLeft(): number;
    /**
     * @private
     */
    writeDistanceLeft(value: number): void;
    /**
     * @private
     */
    readDistanceRight(): number;
    /**
     * @private
     */
    writeDistanceRight(value: number): void;
}

/**
 * Drawing host text-wrap formatting.
 *
 * @public
 */
export class WrapFormat {
    private readonly owner: WrapFormatOwner;

    /**
     *  @private
     *
     * @param {WrapFormatOwner} owner - The owner.
     */
    constructor(owner: WrapFormatOwner) {
        this.owner = owner;
    }

    /**
     * @public
     */
    get textWrappingStyle(): TextWrappingStyle {
        return this.owner.readWrapStyle();
    }

    set textWrappingStyle(value: TextWrappingStyle) {
        assertEnumMember('textWrappingStyle', value, TEXT_WRAPPING_STYLE_SET);
        this.owner.writeWrapStyle(value);
    }

    /**
     * @public
     */
    get textWrappingType(): TextWrappingType {
        return this.owner.readWrapType();
    }

    set textWrappingType(value: TextWrappingType) {
        if (value === TextWrappingType.Unknown) {
            throw new RangeError('WrapFormat.textWrappingType cannot be set to TextWrappingType.Unknown');
        }
        assertEnumMember('textWrappingType', value, TEXT_WRAPPING_TYPE_SET);
        this.owner.writeWrapType(value);
    }

    /**
     * @public
     */
    get allowOverlap(): boolean {
        return this.owner.readAllowOverlap();
    }

    set allowOverlap(value: boolean) {
        if (value !== true && value !== false) {
            throw new RangeError('WrapFormat.allowOverlap must be a boolean');
        }
        this.owner.writeAllowOverlap(value);
    }

    /**
     * @public
     */
    get distanceTop(): number {
        return this.owner.readDistanceTop();
    }

    set distanceTop(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new RangeError('WrapFormat.distanceTop must be a finite number of points');
        }
        this.owner.writeDistanceTop(value);
    }

    /**
     * @public
     */
    get distanceBottom(): number {
        return this.owner.readDistanceBottom();
    }

    set distanceBottom(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new RangeError('WrapFormat.distanceBottom must be a finite number of points');
        }
        this.owner.writeDistanceBottom(value);
    }

    /**
     * @public
     */
    get distanceLeft(): number {
        return this.owner.readDistanceLeft();
    }

    set distanceLeft(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new RangeError('WrapFormat.distanceLeft must be a finite number of points');
        }
        this.owner.writeDistanceLeft(value);
    }

    /**
     * @public
     */
    get distanceRight(): number {
        return this.owner.readDistanceRight();
    }

    set distanceRight(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new RangeError('WrapFormat.distanceRight must be a finite number of points');
        }
        this.owner.writeDistanceRight(value);
    }
}
