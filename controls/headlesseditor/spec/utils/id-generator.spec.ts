import { DefaultIdGenerator, IdGenerator } from '../../src/utils/id-generator';

describe('DefaultIdGenerator', () => {
    const UUID_V4_PATTERN: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    it('generate() returns a UUID v4 string', () => {
        const gen: DefaultIdGenerator = new DefaultIdGenerator();
        const id: string = gen.generate();
        expect(typeof id).toBe('string');
        expect(UUID_V4_PATTERN.test(id)).toBe(true);
    });

    it('generate() returns a different ID each time', () => {
        const gen: DefaultIdGenerator = new DefaultIdGenerator();
        const id1: string = gen.generate();
        const id2: string = gen.generate();
        expect(id1).not.toBe(id2);
    });
});

describe('IdGenerator — custom injection', () => {
    it('custom IdGenerator is called instead of DefaultIdGenerator', () => {
        let callCount: number = 0;
        const customGen: IdGenerator = {
            generate(): string {
                callCount++;
                return `test-id-${callCount}`;
            }
        };

        const id1: string = customGen.generate();
        const id2: string = customGen.generate();

        expect(callCount).toBe(2);
        expect(id1).toBe('test-id-1');
        expect(id2).toBe('test-id-2');
    });
});
