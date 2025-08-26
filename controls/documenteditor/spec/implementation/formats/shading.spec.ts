import { WShading } from '../../../src/document-editor/implementation/format/shading';
describe('Shading Validation Testing', () => {
    afterEach(() => {
        WShading.clear();
    });
    it('Get Value  Testing', () => {
console.log('Get Value  Testing');
        let shading: WShading = new WShading();
        let foregroundColor: string = shading.foregroundColor;
        let backgroundColor: string = shading.backgroundColor;
        let textureStyle: string = shading.textureStyle;
        expect(backgroundColor).toBe('empty');
    });
    it('Set Value  Testing', () => {
console.log('Set Value  Testing');
        let shading: WShading = new WShading();
        shading.foregroundColor = 'black';
        shading.backgroundColor = 'red';
        shading.textureStyle = 'Texture5Percent';
        expect(shading.foregroundColor).toBe('black');
    });
    it('Set Invalid Value  Testing', () => {
console.log('Set Invalid Value  Testing');
        let shading: WShading = new WShading();
        shading.foregroundColor = '';
        shading.backgroundColor = undefined;
        shading.textureStyle = undefined;
        expect(shading.foregroundColor).toBe('empty');
    });
    it('Set Invalid Value  Testing', () => {
console.log('Set Invalid Value  Testing');
        let shading: WShading = new WShading();
        shading.foregroundColor = 'blue';
        shading.foregroundColor = 'blue';
        expect(shading.foregroundColor).toBe('blue');
    });
    it('copy format  Testing', () => {
console.log('copy format  Testing');
        let shading1: WShading = new WShading();
        let shading: WShading = new WShading();
        shading.backgroundColor = 'blue';
        shading1.copyFormat(shading);
        expect(shading1.backgroundColor).toBe('blue');
    });
    it('copy format undefined  Testing', () => {
console.log('copy format undefined  Testing');
        let shading1: WShading = new WShading();
        let shading: WShading = new WShading();
        shading1.copyFormat(shading);
        expect('').toBe('');
    });
    it('copy format undefined  Testing', () => {
console.log('copy format undefined  Testing');
        let shading: WShading = new WShading();
        shading.copyFormat(undefined);
        expect('').toBe('');
    });
});
