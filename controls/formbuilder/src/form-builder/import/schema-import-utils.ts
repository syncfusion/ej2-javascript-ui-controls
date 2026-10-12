import { UniversalJsonParser, ValidationResult } from '@syncfusion/ej2-form-renderer';
import {
    splitSchema,
    mergeSchema,
    mergeWithIDRemapping,
    convertComponentsToDataSchema,
    UISchema, FormSchema, UIField
} from '@syncfusion/ej2-form-renderer';

/** @private */
export const validateSplitSchemas = (
    dataSchemaInput: string,
    _uiSchemaInput: string
): ValidationResult => {
    const errors: string[] = [];

    const trimmedDataInput = dataSchemaInput.trim();

    if (!trimmedDataInput) {
        return {
            valid: false,
            errors: ['Please provide a schema']
        };
    }

    try {
        const testParse = JSON.parse(trimmedDataInput);

        // Check if it's unified schema (has properties and layout)
        const isUnifiedSchema =
            testParse.properties &&
            Array.isArray(testParse.layout);

        if (isUnifiedSchema) {
            // Validate unified schema structure
            if (typeof testParse.properties !== 'object') {
                errors.push(
                    'Invalid schema: "properties" must be an object'
                );
                return { valid: false, errors: errors };
            }

            return { valid: true };
        }

        // Legacy format validation
        const parser = new UniversalJsonParser();
        const parseResult = parser.parse(trimmedDataInput);

        if (!parseResult.success) {
            errors.push(
                'Failed to parse schema: ' +
                parseResult.errors.join(', ')
            );

            return {
                valid: false,
                errors: errors
            };
        }

        return { valid: true };
    } catch (e) {
        errors.push(
            'Invalid JSON: ' +
            (e && e.message ? e.message : String(e))
        );

        return {
            valid: false,
            errors: errors
        };
    }
};

/** @private */
export const validateFullSchema = (
    input: string
): ValidationResult => {
    const trimmedInput = input.trim();

    if (!trimmedInput || trimmedInput.length === 0) {
        return {
            valid: false,
            errors: ['Please paste a full form schema JSON']
        };
    }

    const parser = new UniversalJsonParser();
    const parseResult = parser.parse(trimmedInput);

    return {
        valid: parseResult && parseResult.success
            ? true
            : false,

        errors:
            parseResult &&
            parseResult.errors &&
            parseResult.errors.length > 0
                ? parseResult.errors
                : undefined,

        warnings:
            parseResult &&
            parseResult.warnings &&
            parseResult.warnings.length > 0
                ? parseResult.warnings
                : undefined
    };
};

/** @private */
export const importSplitSchemas = (
    dataSchemaInput: string,
    currentFormSchema: FormSchema
): FormSchema => {
    const trimmedDataInput = dataSchemaInput.trim();

    if (!trimmedDataInput) {
        throw new Error('Please provide a schema');
    }

    let mergedSchema: any;

    const testParse = JSON.parse(trimmedDataInput);

    const isUnifiedSchema =
        testParse.properties &&
        Array.isArray(testParse.layout);

    if (isUnifiedSchema) {
        // Unified schema path
        mergedSchema = mergeSchema(testParse);
    } else {
        // Legacy schema path
        const parser = new UniversalJsonParser();
        const parseResult = parser.parse(trimmedDataInput);

        if (!parseResult.success || !parseResult.schema) {
            throw new Error(
                'Failed to parse schema: ' +
                parseResult.errors.join(', ')
            );
        }

        const dataSchema = convertComponentsToDataSchema(
            parseResult.schema.components
        );

        const currentUnified = splitSchema(currentFormSchema as any);

        const currentUISchema: UISchema = {
            properties: currentUnified.properties as Record<string, UIField>,
            layout: currentUnified.layout
        };

        mergedSchema = mergeWithIDRemapping(
            dataSchema,
            currentUISchema
        );
    }

    return mergedSchema;
};

/** @private */
export const importFullSchema = (
    input: string
): FormSchema => {
    const trimmedInput = input.trim();

    if (!trimmedInput || trimmedInput.length === 0) {
        throw new Error('Please paste JSON content');
    }

    const parser = new UniversalJsonParser();
    const parseResult = parser.parse(trimmedInput);

    if (parseResult && parseResult.success && parseResult.schema) {
        return parseResult.schema;
    }

    throw new Error(
        parseResult && parseResult.errors
            ? parseResult.errors.join(', ')
            : 'Failed to parse schema'
    );
};