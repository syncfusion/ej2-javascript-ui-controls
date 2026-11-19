import { validateSectionLength } from './section-validation';

/**
 * Live page margins for a section (`CT_PageMar` left/top/right/bottom).
 *
 * Header distance, footer distance, and gutter remain internal on PageSetup
 * and are not part of this public surface.
 *
 * @public
 */
export class Margins {
    private leftValue: number;
    private topValue: number;
    private rightValue: number;
    private bottomValue: number;

    /**
     * @param {number} left - The left.
     * @param {number} top - The top.
     * @param {number} right - The right.
     * @param {number} bottom - The bottom.
     * @private
     */
    constructor(left: number, top: number, right: number, bottom: number) {
        this.leftValue = left;
        this.topValue = top;
        this.rightValue = right;
        this.bottomValue = bottom;
    }

    /**
     * When all four sides share one value, returns that value; otherwise the
     * left margin (DocIO-style convenience read).
     */
    get all(): number {
        if (
            this.leftValue === this.topValue &&
            this.topValue === this.rightValue &&
            this.rightValue === this.bottomValue
        ) {
            return this.leftValue;
        }
        return this.leftValue;
    }

    set all(value: number) {
        const next: number = validateSectionLength(value, 'margins.all');
        this.leftValue = next;
        this.topValue = next;
        this.rightValue = next;
        this.bottomValue = next;
    }

    get left(): number {
        return this.leftValue;
    }

    set left(value: number) {
        this.leftValue = validateSectionLength(value, 'margins.left');
    }

    get top(): number {
        return this.topValue;
    }

    set top(value: number) {
        this.topValue = validateSectionLength(value, 'margins.top');
    }

    get right(): number {
        return this.rightValue;
    }

    set right(value: number) {
        this.rightValue = validateSectionLength(value, 'margins.right');
    }

    get bottom(): number {
        return this.bottomValue;
    }

    set bottom(value: number) {
        this.bottomValue = validateSectionLength(value, 'margins.bottom');
    }

    /**
     * @returns {Object} The result.
     * @private
     */
    snapshot(): { left: number; top: number; right: number; bottom: number } {
        return {
            left: this.leftValue,
            top: this.topValue,
            right: this.rightValue,
            bottom: this.bottomValue
        };
    }

    /**
     * @param {number} left - The left.
     * @param {number} top - The top.
     * @param {number} right - The right.
     * @param {number} bottom - The bottom.
     * @returns {void} Nothing is returned.
     * @private
     */
    replace(left: number, top: number, right: number, bottom: number): void {
        this.leftValue = validateSectionLength(left, 'margins.left');
        this.topValue = validateSectionLength(top, 'margins.top');
        this.rightValue = validateSectionLength(right, 'margins.right');
        this.bottomValue = validateSectionLength(bottom, 'margins.bottom');
    }
}
