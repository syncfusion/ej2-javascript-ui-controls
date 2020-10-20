import { Dictionary } from '../../src/document-editor/base/dictionary';
import { WUniqueFormat } from '../../src/document-editor/base/unique-format';
import { WUniqueFormats } from '../../src/document-editor/base/unique-formats';

describe('Unique Format validation', () => {

    it('Constructor validation', () => {
console.log('Constructor validation');
        let unique: WUniqueFormat = new WUniqueFormat(11);
        let isEqual: boolean = unique.isEqual(new Dictionary<number, Object>(), 'color', 9 as Object);
        expect(isEqual).toBe(false);
    });
});
describe('Unique Formats validation', () => {

    it('Constructor validation', () => {
console.log('Constructor validation');
        let unique: WUniqueFormats = new WUniqueFormats();
        unique.destroy();
        expect(unique.items).toBe(undefined);
    });
});
