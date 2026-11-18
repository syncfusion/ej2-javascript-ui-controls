import { validateSectionLength } from './section-validation';

/**
 * One explicit text column (`CT_Column`).
 *
 * @public
 */
export class Column {
    private widthValue: number;
    private spacingValue: number;

    /**
     * @param {number} width - The width.
     * @param {number} spacing - The spacing.
     * @private
     */
    constructor(width: number, spacing: number) {
        this.widthValue = validateSectionLength(width, 'column.width');
        this.spacingValue = validateSectionLength(spacing, 'column.spacing');
    }

    get width(): number {
        return this.widthValue;
    }

    set width(value: number) {
        this.widthValue = validateSectionLength(value, 'column.width');
    }

    get spacing(): number {
        return this.spacingValue;
    }

    set spacing(value: number) {
        this.spacingValue = validateSectionLength(value, 'column.spacing');
    }
}
