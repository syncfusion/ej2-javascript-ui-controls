import { validateAttributeDefinition } from '../../src/schema/types/attribute-definition';

describe('validateAttributeDefinition', () => {
    it('should pass for a valid string attribute', () => {
        expect(() => validateAttributeDefinition({ name: 'id', type: 'string' })).not.toThrow();
    });

    it('should pass for a valid number attribute with a default', () => {
        expect(() => validateAttributeDefinition({ name: 'level', type: 'number', default: 1 })).not.toThrow();
    });

    it('should pass for a valid enum attribute with non-empty values', () => {
        expect(() => validateAttributeDefinition({
            name: 'align',
            type: 'enum',
            values: ['left', 'center', 'right']
        })).not.toThrow();
    });

    it('should preserve string default as-is', () => {
        const def = { name: 'href', type: 'string' as const, default: 'https://example.com' };
        validateAttributeDefinition(def);
        expect(def.default).toBe('https://example.com');
    });

    it('should throw when enum type has an empty values array', () => {
        expect(() => validateAttributeDefinition({
            name: 'align',
            type: 'enum',
            values: []
        })).toThrowError(/enum.*values/i);
    });

    it('should throw when enum type has no values array', () => {
        expect(() => validateAttributeDefinition({
            name: 'align',
            type: 'enum'
        })).toThrowError(/enum.*values/i);
    });

    it('should throw when enum type has undefined values', () => {
        expect(() => validateAttributeDefinition({
            name: 'align',
            type: 'enum',
            values: undefined
        })).toThrowError(/enum.*values/i);
    });
});
