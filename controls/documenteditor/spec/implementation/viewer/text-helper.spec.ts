import { TextHelper } from "../../../src/document-editor/implementation/viewer/text-helper";


describe('text-helper function validation',()=>{
    let helper: TextHelper;
    beforeAll((): void => {
        helper=new TextHelper(undefined);
    });
    afterAll((done): void => {
       helper.destroy();
    });
    it('Reverse string validation open brackets', () => {
console.log('Reverse string validation open brackets');
        let specString:string='({[<.';
        expect(helper.containsSpecialChar(specString)).toBe(true);
        specString = '(';
        expect(helper.inverseCharacter(specString)).toBe(')');
        specString = '{';
        expect(helper.inverseCharacter(specString)).toBe('}');
        specString = '[';
        expect(helper.inverseCharacter(specString)).toBe(']');
        specString = '<';
        expect(helper.inverseCharacter(specString)).toBe('>');
    });
    it('Reverse string validation', () => {
console.log('Reverse string validation');
        let specString:string=')}]>,';
        expect(helper.containsSpecialChar(specString)).toBe(true);
        specString = ')';
        expect(helper.inverseCharacter(specString)).toBe('(');
        specString = '}';
        expect(helper.inverseCharacter(specString)).toBe('{');
        specString = ']';
        expect(helper.inverseCharacter(specString)).toBe('[');
        specString = '>';
        expect(helper.inverseCharacter(specString)).toBe('<');
        specString = '.';
        expect(helper.inverseCharacter(specString)).toBe('.');
    });
});
