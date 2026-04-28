import { WBorders } from '../../../src/document-editor/implementation/format/borders';
describe('Border Validation Testing', () => {
    afterEach(() => {

    });;
     it('Borders destroy Testing', () => {
console.log('Borders destroy Testing');
        let borders: WBorders = new WBorders();
        borders.destroy();
        expect('').toBe('');
        borders.cloneFormat();
        expect(() => { borders.destroy() }).not.toThrowError();
    });
    it('Borders clone format Testing', () => {
console.log('Borders clone format Testing');
        let borders: WBorders = new WBorders();
        borders.cloneFormat();
        borders.destroy();
        borders.cloneFormat();
        expect('').toBe('');
    });
    it('Borders copy format Testing', () => {
console.log('Borders copy format Testing');
        let borders: WBorders = new WBorders();
        borders.copyFormat(borders);
        expect('').toBe('');
    });
    it('Borders copy format undefined Testing', () => {
console.log('Borders copy format undefined Testing');
        let borders: WBorders = new WBorders(undefined);
        borders.left = undefined;
        borders.top = undefined;
        borders.right = undefined;
        borders.bottom = undefined;
        borders.diagonalDown = undefined;
        borders.diagonalUp = undefined;
        borders.vertical = undefined;
        borders.horizontal = undefined;
        borders.copyFormat(borders);
        expect('').toBe('');
    });
});
