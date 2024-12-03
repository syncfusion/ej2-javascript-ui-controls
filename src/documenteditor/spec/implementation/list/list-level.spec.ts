import { WListLevel } from '../../../src/document-editor/implementation/list/list-level';

describe('WListLevel Validation Testing', () => {
    afterEach(() => {
        WListLevel.clear();
    });
    it('List Level  Testing', () => {
console.log('List Level  Testing');
        let list: WListLevel = new WListLevel(undefined);
        list.followCharacter = 'Tab';
        list.listLevelPattern = 'Arabic';
        list.followCharacter;
        list.listLevelPattern;
        expect('').toBe('');
        list.destroy();
        expect(list.characterFormat).toBe(undefined);
        expect(() => { list.destroy() }).not.toThrowError();
    });
});
