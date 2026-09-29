import { ExpressionEngine } from './expression-engine';

/**
 * @private
 */
export class GridExpressions {
    private engine: ExpressionEngine;

    constructor() {
        this.engine = new ExpressionEngine();
    }

    /**
     * Convert a column value to the proper JS type for expression evaluation.
     * Form inputs return strings; numeric/boolean values must be coerced.
     */
    public parseColumnValue(value: any, columnType?: string): any {
        // Handle null/undefined/empty
        if (value === null || value === undefined || value === '') {
            return value;
        }

        // Parse number types
        if (columnType === 'number') {
            const parsed: number = parseFloat(String(value));
            return isNaN(parsed) ? 0 : parsed;
        }

        // Parse boolean types
        if (columnType === 'boolean') {
            if (typeof value === 'boolean') { return value; }
            return value === 'true' || value === '1' || value === 1 || value === true;
        }

        // Return as-is for string and other types
        return value;
    }

    /**
     * Evaluate all expression-bearing columns for a single row.
     * Returns a new row object with calculated values merged in.
     */
    public evaluateRowExpressions(
        row: Record<string, any>,
        columns: any[]
    ): Record<string, any> {
        const calculatedRow: Record<string, any> = { ...row };

        // Find all columns with expressions
        const calculatedColumns = columns.filter((col: any) => col.expression && col.expression.toString().trim());

        for (const column of calculatedColumns) {
            if (!column.expression) { continue; }

            try {
                // Prepare row values with proper type conversion
                const typedRow: Record<string, any> = {};
                columns.forEach((col: any) => {
                    const value: any = calculatedRow[col.field];
                    typedRow[col.field] = this.parseColumnValue(value, col.type);
                });

                // Evaluate expression with current row as context
                const result: any = this.engine.evaluate(column.expression, typedRow, {
                    throwOnError: false
                });

                // Update row with calculated value
                calculatedRow[column.field] = result;
            } catch (error) {
                calculatedRow[column.field] = null;
            }
        }

        return calculatedRow;
    }

    /**
     * Extract the subset of columns that carry a non-empty `expression`.
     */
    public extractCalculatedColumns(columns: any[]): any[] {
        return columns.filter((col: any) => col.expression && col.expression.toString().trim());
    }

    public getEngine(): ExpressionEngine { return this.engine; }
}

export default GridExpressions;
