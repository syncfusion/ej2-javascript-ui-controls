/**
 * ER Columnar Layout Utilities
 *
 * Handles dynamic column-based annotation layout for ER entity fields.
 * Columns are determined by what's actually needed across all fields.
 * Each field renders only the columns that contain data.
 */

import { ErShapeModel, AnnotationModel, ShapeAnnotationModel, NodeModel, Diagram } from '..';
import { MarginModel, TextStyleModel } from '../core/appearance-model';
import { cloneObject } from '../utility/base-util';
import { AnnotationConstraints } from '../enum/enum';
import { ErFieldModel } from '../objects/er-objects-model';
import { TextElement } from '../core/elements/text-element';
import { measureText } from '../utility/dom-util';
import { Size } from '../primitives/size';

/**
 * Represents the layout metadata for annotations
 * @private
 */
interface ColumnConfig {
    hasKey: boolean;
    hasName: boolean;
    hasType: boolean;
    hasNotNull: boolean;
    hasUnique: boolean;
    hasDualKey: boolean;
}

/**
 * Represents calculated positions for each column
 * @private
 */
interface ColumnPositions {
    key: number;
    name: number;
    type: number;
    constraint: number;
}

/**
 * Represents measured widths for each column
 * Key, Type, and Constraint have static widths.
 * Name column is measured dynamically from field names.
 * @private
 */
interface ColumnWidths {
    keyWidth: number;      // Static: 25px
    nameWidth: number;     // Dynamic: measured from field names + padding
    typeWidth: number;     // Static: 55px
    constraintWidth: number;  // Static: 35px
}

/**
 * Column layout constants (in pixels)
 * @private
 */
const MARGIN_LEFT: number = 5;
const MARGIN_RIGHT: number = 5;
const SEPARATOR_WIDTH: number = 8;
const NAME_WIDTH: number = 55;

/**
 * Special layout configuration for specific column scenarios
 * Allows easy customization of positioning for two-column layouts
 * Modify these values to adjust spacing without changing the logic
 * @private
 */
const STATIC_KEY_WIDTH: number = 15;
const STATIC_TYPE_WIDTH: number = 50;
const STATIC_CONSTRAINT_WIDTH: number = 25;
// measureText() over-reports visual width due to browser/canvas metrics.
// A scale factor < 1 corrects this proportionally for any text length.
const TEXT_MEASURE_SCALE: number = 0.72; // Corrects measureText over-reporting
const DUAL_KEY_EXTRA: number = 12; // Extra width when a field can be both PK and FK

/**
 * Measure the name column width dynamically based on field names
 *
 * Examines all field names in the entity and computes the maximum
 * text width needed, adding padding. This allows the name column
 * to adapt to long or short field names while keeping other columns fixed.
 *
 * @param {ErShapeModel} entityShape - The ER entity shape model
 * @returns {number} Measured name column width in pixels
 * @private
 */
function measureNameColumnWidth(entityShape: ErShapeModel): number {
    const fields: ErFieldModel[] = entityShape.fields || [];
    if (fields.length === 0) {
        return NAME_WIDTH;  // Use default if no fields
    }

    let maxNameWidth: number = 0;

    // Measure each field name
    for (const field of fields) {
        if (field.name) {
            // Use TextElement measurement for consistent sizing
            const tempTextElement: TextElement = new TextElement();
            tempTextElement.style = {
                fontSize: 11,
                fontFamily: 'Arial'
            };
            tempTextElement.content = field.name;

            // Measure the field name text
            const measuredSize: Size = measureText(tempTextElement, tempTextElement.style, field.name, 200);
            // Apply scale factor to correct measureText over-reporting (proportional correction)
            maxNameWidth = Math.max(maxNameWidth, measuredSize.width * TEXT_MEASURE_SCALE);
        }
    }

    // Ensure minimum width
    const MIN_NAME_WIDTH: number = 45;
    return Math.max(maxNameWidth, MIN_NAME_WIDTH);
}

/**
 * Analyze all fields in an entity to determine which columns are needed
 *
 * Returns what data exists across all fields:
 * - hasKey: true if ANY field has isPrimaryKey or isForeignKey
 * - hasName: always true (required column)
 * - hasType: true if ANY field has dataType
 * - hasNotNull: true if ANY field has constraints including 'NotNull'
 * - hasUnique: true if ANY field has constraints including 'Unique'
 *
 * @param {ErShapeModel} entityShape - The ER entity shape model
 * @returns {ColumnConfig} Column configuration for the entity
 * @private
 */
function analyzeColumns(entityShape: ErShapeModel): ColumnConfig {
    const fields: ErFieldModel[] = entityShape.fields || [];

    const config: ColumnConfig = {
        hasKey: fields.some((f: ErFieldModel) => f.isPrimaryKey === true || f.isForeignKey === true),  // Check if any field is PK or FK
        hasName: true,     // Always show name column
        hasType: fields.some((f: ErFieldModel) => !!f.dataType),  // Only if at least one field has dataType
        hasNotNull: fields.some((f: ErFieldModel) => f.constraints && f.constraints.indexOf('NotNull') !== -1),
        hasUnique: fields.some((f: ErFieldModel) => f.constraints && f.constraints.indexOf('Unique') !== -1),
        hasDualKey: fields.some((f: ErFieldModel) => f.isPrimaryKey === true && f.isForeignKey === true)
    };

    //config.hasNotNull = entityShape.showFieldConstraints ? config.hasNotNull : false;
    //config.hasUnique = entityShape.showFieldConstraints ? config.hasUnique : false;

    return config;
}

/**
 * Calculates X positions for each column using measured widths.
 * Applies margin, spacing, and sequential layout.
 *
 * Position rules:
 * - Margin: 5px left, 5px right
 * - Key column: static 25px (only if hasKey is true)
 * - Name column: dynamic measured width (from field names + padding)
 * - Type column: static 55px (only if hasType is true)
 * - Constraint column (NN/U): static 35px, right-aligned
 * - Separator: 8px (only between columns that exist)
 *
 * Special cases (for name + type or key + name only):
 * - Compute positions sequentially from measured widths
 * - Maintain proper spacing between columns
 *
 * @param {ColumnConfig} config - Column configuration flags
 * @param {ColumnWidths} columnWidths - Measured widths for each column
 * @param {number} fieldWidth - Total available width for the field (used for right-aligned constraint)
 * @returns {ColumnPositions} Calculated X positions for each column in pixels
 * @private
 */
function calculateColumnPositions(config: ColumnConfig, columnWidths: ColumnWidths, fieldWidth: number): ColumnPositions {
    const positions: ColumnPositions = {
        key: 0,
        name: 0,
        type: 0,
        constraint: 0
    };

    let currentX: number = MARGIN_LEFT;

    // Key column (only if it has data)
    if (config.hasKey) {
        positions.key = currentX;
        currentX += columnWidths.keyWidth;
        // Add separator after key if other columns follow
        if (config.hasName || config.hasType || config.hasNotNull || config.hasUnique) {
            currentX += SEPARATOR_WIDTH;
        }
    }

    // Name column (always present)
    if (config.hasName) {
        positions.name = currentX;
        currentX += columnWidths.nameWidth;

        // Add separator after name if more columns follow
        if (config.hasType || config.hasNotNull || config.hasUnique) {
            currentX += SEPARATOR_WIDTH;
        }
    }

    // Type column
    if (config.hasType) {
        positions.type = currentX;
        currentX += columnWidths.typeWidth;

        // Add separator before constraint column if it exists
        if (config.hasNotNull || config.hasUnique) {
            currentX += SEPARATOR_WIDTH;
        }
    }

    // Single constraint column positioned from the right edge
    if (config.hasNotNull || config.hasUnique) {
        // Position constraint column from right edge (negative means from right)
        positions.constraint = -columnWidths.constraintWidth;
    }

    return positions;
}

/**
 * Calculate minimum width needed for an entity based on columns and measured content
 *
 * Returns the total width required to display all columns without clipping.
 * - Static columns (key, type, constraint) use fixed widths
 * - Name column uses measured width from field names
 * - Constraint columns are right-aligned and factored into total width
 *
 * @param {ColumnConfig} config - Column configuration
 * @param {ColumnWidths} columnWidths - Measured column widths
 * @returns {number} Minimum width in pixels
 * @private
 */
export function calculateMinimumEntityWidth(config: ColumnConfig, columnWidths: ColumnWidths): number {
    const MARGIN: number = MARGIN_LEFT + MARGIN_RIGHT;

    let totalWidth: number = MARGIN;
    let hasContentColumns: number = 0;

    // Add column widths for non-empty columns
    if (config.hasKey) {
        totalWidth += columnWidths.keyWidth;
        hasContentColumns++;
    }

    if (config.hasName) {
        totalWidth += columnWidths.nameWidth;
        hasContentColumns++;
    }

    if (config.hasType) {
        totalWidth += columnWidths.typeWidth;
        hasContentColumns++;
    }

    // Add constraint column width if needed
    if (config.hasNotNull || config.hasUnique) {
        totalWidth += columnWidths.constraintWidth;
        hasContentColumns++;
    }

    // Add separators only between columns that have content
    // If we have N columns, we need N-1 separators
    if (hasContentColumns > 1) {
        totalWidth += SEPARATOR_WIDTH * (hasContentColumns - 1);
    }

    return totalWidth;
}

/**
 * Get key indicator for a field
 *
 * Returns:
 * - 'PK, FK' if both primary and foreign key
 * - 'PK' if primary key
 * - 'FK' if foreign key
 * - '' (empty) if neither
 *
 * @param {ErFieldModel} field - The ER field model
 * @returns {string} Key indicator string
 * @private
 */
function getKeyIndicator(field: ErFieldModel): string {
    if (field.isPrimaryKey && field.isForeignKey) {
        return 'PK, FK';
    }
    if (field.isPrimaryKey) {
        return 'PK';
    }
    if (field.isForeignKey) {
        return 'FK';
    }
    return '';
}

/**
 * Creates annotation objects for a single field row in a columnar layout.
 * Generates annotations for key, name, type, NN (not null), and U (unique),
 * including separators ('|') between columns that exist.
 *
 * Constraint columns (NN, U) are right-aligned and positioned from the right edge.
 *
 * Example output for a field with PK, NN, U:
 * - Annotation 0: 'PK' (key)
 * - Annotation 1: '|' (separator)
 * - Annotation 2: 'UnitPrice' (name)
 * - Annotation 3: '|' (separator)
 * - Annotation 4: 'DECIMAL(10,2)' (type)
 * - Annotation 5: '|' (separator)
 * - Annotation 6: 'NN' (notNull, right-aligned)
 * - Annotation 7: 'U' (unique, right-aligned)
 *
 * @param {ErFieldModel} field - ER field model containing metadata for the field
 * @param {ColumnConfig} config - Column configuration flags for the entity
 * @param {ColumnPositions} positions - Calculated X positions for columns (negative = from right)
 * @param {number} fieldWidth - Width of the field node in pixels
 * @param {number[]} columnWidths - Widths of each column in pixels
 * @param {string} [separatorColor='#9c9c9c'] - Color used for separator annotations
 * @returns {AnnotationModel[]} Array of annotation objects for rendering
 * @private
 */
export function createFieldAnnotations(
    field: ErFieldModel,
    config: ColumnConfig,
    positions: ColumnPositions,
    fieldWidth: number,
    columnWidths?: ColumnWidths,
    separatorColor: string = '#9c9c9c'
): AnnotationModel[] {
    const annotations: AnnotationModel[] = [];

    const FONT_SIZE: number = 11;
    const SEPARATOR_FONT_SIZE: number = 29;

    // If columnWidths is not provided (legacy calls), fall back to static widths
    if (!columnWidths) {
        columnWidths = {
            keyWidth: STATIC_KEY_WIDTH,
            nameWidth: NAME_WIDTH,
            typeWidth: STATIC_TYPE_WIDTH,
            constraintWidth: STATIC_CONSTRAINT_WIDTH
        } as ColumnWidths;
    }

    const addAnnotation: any = (
        field: ErFieldModel,
        content: string,
        xPixel: number,
        id: string,
        isSeparator: boolean = false,
        isRightAligned: boolean = false,
        customMargin?: { left?: number; right?: number }
    ): void => {
        // Normalize pixel position to 0-1 range based on field width
        let xOffset: number;
        if (isRightAligned || xPixel < 0) {
            // Right-aligned: negative xPixel means distance from right edge
            xOffset = 1 + (xPixel / fieldWidth);  // Negative xPixel moves left from right edge
        } else {
            // Left-aligned: positive xPixel is distance from left edge
            xOffset = xPixel / fieldWidth;
        }
        let fieldAnnotationStyle: TextStyleModel = { } as TextStyleModel;

        if (field.annotation && (field.annotation as ShapeAnnotationModel).style) {
            fieldAnnotationStyle = (field.annotation as ShapeAnnotationModel).style as TextStyleModel;
        }
        const margin: MarginModel = customMargin ?
            { left: customMargin.left || 3, right: customMargin.right || 3, top: 0, bottom: 0 } :
            { left: 3, right: 3, top: 0, bottom: 0 };

        const annotationObj: ShapeAnnotationModel = {
            id: `er${id.charAt(0).toUpperCase()}${id.slice(1)}`,
            content: content,
            offset: { x: xOffset, y: 0.5 },
            style: cloneObject(fieldAnnotationStyle),
            horizontalAlignment: isRightAligned ? 'Right' : 'Left',
            verticalAlignment: 'Center',
            margin: margin
        };

        // Mark separator annotations as read-only (non-editable) and apply seperator styles
        if (isSeparator) {
            annotationObj.constraints = AnnotationConstraints.ReadOnly;
            (annotationObj.style as TextStyleModel).fontSize = SEPARATOR_FONT_SIZE;
            (annotationObj.style as TextStyleModel).color = separatorColor;
            (annotationObj.style as TextStyleModel).fontFamily = 'Source Code Pro';
        }

        annotations.push(annotationObj);
    };

    // Key column (only if it has data across any field)
    if (config.hasKey) {
        const keyIndicator: string = getKeyIndicator(field);
        addAnnotation(field, keyIndicator, positions.key, 'Key', false, false);

        // Separator after key if other columns follow
        if (config.hasName || config.hasType || config.hasNotNull || config.hasUnique) {
            // Place separator exactly after key column
            const separatorPos: number = positions.key + columnWidths.keyWidth;
            addAnnotation(field, '|', separatorPos, 'SepAfterKey', true, false);
        }
    }

    // Name column (always present)
    if (config.hasName) {
        addAnnotation(field, field.name, positions.name, 'Name', false, false);

        // Separator after name (only if more columns follow)
        if (config.hasType || config.hasNotNull || config.hasUnique) {
            // Place separator exactly after name column
            const separatorPos: number = positions.name + columnWidths.nameWidth;
            addAnnotation(field, '|', separatorPos, 'SepAfterName', true, false);
        }
    }

    // Type column (only if it has data across any field)
    if (config.hasType) {
        addAnnotation(field, field.dataType || '', positions.type, 'Type', false, false);

        // Separator after type (only if constraint column follows)
        if (config.hasNotNull || config.hasUnique) {
            // Place separator exactly after type column
            const separatorPos: number = positions.type + columnWidths.typeWidth;
            addAnnotation(field, '|', separatorPos, 'SepAfterType', true, false);
        }
    }

    // Single constraint column combining NN and U (positioned from right edge but text left-aligned)
    if (config.hasNotNull || config.hasUnique) {
        let constraintText: string = '';
        if (field.constraints && field.constraints.indexOf('NotNull') !== -1 && field.constraints.indexOf('Unique') !== -1) {
            // Both constraints present
            constraintText = 'NN, U';
        } else if (field.constraints && field.constraints.indexOf('NotNull') !== -1) {
            // Only NotNull
            constraintText = 'NN';
        } else if (field.constraints && field.constraints.indexOf('Unique') !== -1) {
            // Only Unique
            constraintText = 'U';
        }
        // If neither constraint is set on this field, don't show anything but keep the column space
        // Column is positioned from right edge but text is left-aligned for readability
        addAnnotation(field, constraintText, positions.constraint, 'Constraint', false, false, { left: 3, right: 5 });
    }

    return annotations;
}

function getAnnotationOffsetX(annotations: any[], annotationId: string): number | undefined {
    if (!annotations) {
        return undefined;
    }
    for (let i: number = 0; i < annotations.length; i++) {
        const annotation: any = annotations[parseInt(i.toString(), 10)];
        if (annotation && annotation.id === annotationId && annotation.offset && annotation.offset.x !== undefined) {
            return annotation.offset.x;
        }
    }
    return undefined;
}

function getFieldAnnotationPositions(annotations: any[]): ColumnPositions {
    return {
        key: getAnnotationOffsetX(annotations, 'erKey') !== undefined ? getAnnotationOffsetX(annotations, 'erKey') as number : 0,
        name: getAnnotationOffsetX(annotations, 'erName') !== undefined ? getAnnotationOffsetX(annotations, 'erName') as number : 0,
        type: getAnnotationOffsetX(annotations, 'erType') !== undefined ? getAnnotationOffsetX(annotations, 'erType') as number : 0,
        constraint: getAnnotationOffsetX(annotations, 'erConstraint') !== undefined ? getAnnotationOffsetX(annotations, 'erConstraint') as number : 0
    };
}

function arePositionsEqual(positionA: ColumnPositions, positionB: ColumnPositions): boolean {
    const TOLERANCE: number = 0.0001;
    return Math.abs(positionA.key - positionB.key) < TOLERANCE &&
        Math.abs(positionA.name - positionB.name) < TOLERANCE &&
        Math.abs(positionA.type - positionB.type) < TOLERANCE &&
        Math.abs(positionA.constraint - positionB.constraint) < TOLERANCE;
}

export function areFieldRowPositionsEqual(fieldNode: NodeModel, parentEntity: NodeModel, diagram: Diagram): boolean {
    if (!fieldNode || !fieldNode.annotations || !parentEntity || !parentEntity.shape) {
        return true;
    }

    const erEntity: ErShapeModel = parentEntity.shape as ErShapeModel;
    const fieldNodeAsAny: any = fieldNode;
    const fieldIndex: number = (fieldNodeAsAny.umlIndex !== undefined && fieldNodeAsAny.umlIndex !== null)
        ? fieldNodeAsAny.umlIndex - 1 : -1;
    const fields: ErFieldModel[] = erEntity.fields || [];
    if (fieldIndex < 0 || fieldIndex >= fields.length) {
        return true;
    }

    const expectedAnnotations: AnnotationModel[] = generateFieldRowAnnotations(parentEntity, fields[parseInt(fieldIndex.toString(), 10)], diagram, '#cccccc');
    const expectedPositions: ColumnPositions = getFieldAnnotationPositions(expectedAnnotations);
    const actualPositions: ColumnPositions = getFieldAnnotationPositions(fieldNode.annotations);

    return arePositionsEqual(expectedPositions, actualPositions);
}

/**
 * Generates all annotation objects for a single ER field row
 * using a columnar layout with measured column widths.
 *
 * Two sizing modes:
 * 1. Explicit width (user-provided): Use static column widths within that width
 * 2. Auto-size (no explicit width): Measure name column dynamically,
 *    allowing entity to size itself based on content
 *
 * Creates annotations for key, name, type, NN (not null), and U (unique),
 * with separators ('|') between columns. Constraint columns are right-aligned.
 *
 * @param {NodeModel} parentEntity - Parent ER entity node containing the field
 * @param {ErFieldModel} field - ER field model with metadata
 * @param {Diagram} diagram - Diagram instance used for rendering
 * @param {string} [separatorColor='#cccccc'] - Color used for separator annotations
 * @returns {AnnotationModel[]} Array of annotation objects for the field row
 * @private
 */
export function generateFieldRowAnnotations(
    parentEntity: NodeModel,
    field: ErFieldModel,
    diagram: Diagram,
    separatorColor: string = '#cccccc'
): AnnotationModel[] {
    const entityShape: ErShapeModel = parentEntity.shape as ErShapeModel;

    // Analyze which columns are needed
    const config: ColumnConfig = analyzeColumns(entityShape);

    // Mode 2: Auto-size (no existing fields) - measure name column dynamically
    // Measure the name column based on all field names
    const measuredNameWidth: number = measureNameColumnWidth(entityShape);

    // Use static widths for other columns
    const columnWidths: ColumnWidths = {
        keyWidth: STATIC_KEY_WIDTH + (config.hasDualKey ? DUAL_KEY_EXTRA : 0),
        nameWidth: measuredNameWidth,
        typeWidth: STATIC_TYPE_WIDTH,
        constraintWidth: STATIC_CONSTRAINT_WIDTH
    };

    // Compute the minimum field width based on measured columns
    const fieldWidth: number = calculateMinimumEntityWidth(config, columnWidths);

    // Calculate column positions based on measured/static widths
    const positions: ColumnPositions = calculateColumnPositions(config, columnWidths, fieldWidth);

    // Generate data annotations for this field with measured column widths and separator color
    const annotations: AnnotationModel[] = createFieldAnnotations(field, config, positions, fieldWidth, columnWidths, separatorColor);

    return annotations;
}

/**
 * Factory for ER columnar layout utilities
 * @constructor ERColumnarLayoutFactory
 * @private
 */
export class ERColumnarLayoutFactory {
    /**
     * Get column configuration for an entity
     *
     * @param {ErShapeModel} entityShape - The ER entity shape model
     * @returns {ColumnConfig} Column configuration
     * @private
     */
    static getColumnConfig(entityShape: ErShapeModel): ColumnConfig {
        return analyzeColumns(entityShape);
    }

    /**
     * Get column positions for an entity with measured column widths
     *
     * Computes measured name column width and uses static widths for other columns,
     * then calculates positions based on those widths.
     *
     * @param {ErShapeModel} entityShape - The ER entity shape model
     * @param {number} fieldWidth - The available field width (used for constraint positioning)
     * @returns {ColumnPositions} Calculated column positions
     * @private
     */
    static getColumnPositions(entityShape: ErShapeModel, fieldWidth: number = 220): ColumnPositions {
        const config: ColumnConfig = analyzeColumns(entityShape);

        // Measure the name column based on all field names
        const measuredNameWidth: number = measureNameColumnWidth(entityShape);

        // Use static widths for other columns (adjust key width for dual-key fields)
        const columnWidths: ColumnWidths = {
            keyWidth: STATIC_KEY_WIDTH + (config.hasDualKey ? DUAL_KEY_EXTRA : 0),
            nameWidth: measuredNameWidth,
            typeWidth: STATIC_TYPE_WIDTH,
            constraintWidth: STATIC_CONSTRAINT_WIDTH
        };

        return calculateColumnPositions(config, columnWidths, fieldWidth);
    }

    /**
     * Calculate minimum width for an entity based on measured content
     *
     * Combines column widths (measured name, static for others) to compute
     * the minimum width the entity needs to display all content properly.
     *
     * @param {ErShapeModel} entityShape - The ER entity shape model
     * @returns {number} Minimum width in pixels
     * @private
     */
    static calculateMinimumWidth(entityShape: ErShapeModel): number {
        const config: ColumnConfig = analyzeColumns(entityShape);
        const measuredNameWidth: number = measureNameColumnWidth(entityShape);

        const columnWidths: ColumnWidths = {
            keyWidth: STATIC_KEY_WIDTH + (config.hasDualKey ? DUAL_KEY_EXTRA : 0),
            nameWidth: measuredNameWidth,
            typeWidth: STATIC_TYPE_WIDTH,
            constraintWidth: STATIC_CONSTRAINT_WIDTH
        };

        return calculateMinimumEntityWidth(config, columnWidths);
    }
}
