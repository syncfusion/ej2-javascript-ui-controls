import { paragraphExtension } from '../../../src/extensions/builtins/paragraph';

describe('Built-in: paragraph', () => {
    it('should have correct name', () => {
        expect(paragraphExtension.name).toBe('paragraph');
    });

    it('does not have an inputRules contributor', () => {
        expect(paragraphExtension.config.inputRules).toBeUndefined();
    });
});
