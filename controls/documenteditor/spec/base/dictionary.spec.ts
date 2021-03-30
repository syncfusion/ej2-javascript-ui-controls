import { Dictionary } from '../../src/document-editor/base/dictionary';

describe('Dictionary API testing', () => {
    it('item count', () => {
console.log('item count');
        let dictionary: Dictionary<number, number> = new Dictionary<number, number>();
        dictionary.add(1, 1);
        dictionary.add(2, 2);
        dictionary.add(2, 2);
        expect(dictionary.length).toBe(2);
        expect(dictionary.keys.length).toBe(2);
        expect(dictionary.get(1)).toBe(1);
        expect(() => { dictionary.get(undefined) }).toThrowError();
        expect(() => { dictionary.get(undefined) }).toThrowError();
        expect(() => { dictionary.add(undefined, 2); }).toThrowError();
        dictionary.clear();
        expect(dictionary.add(2, 2)).toBe(1);
    });
    it('Set value in Dictionary', () => {
console.log('Set value in Dictionary');
        let dictionary: Dictionary<number, number> = new Dictionary<number, number>();
        dictionary.add(1, 1);
        dictionary.add(2, 2);
        dictionary.set(2, 5);
        expect(dictionary.get(2)).toBe(5);
        expect(() => { dictionary.set(undefined, 3) }).toThrowError();
        expect(() => { dictionary.set(5, 3) }).toThrowError();
        expect(() => { dictionary.remove(undefined) }).toThrowError();
        expect(() => { dictionary.remove(10) }).toThrowError();
        dictionary.remove(2);
        expect(dictionary.get(10)).toBeUndefined();
    });
    it('Set value in Dictionary', () => {
console.log('Set value in Dictionary');
        let dictionary: Dictionary<number, number> = new Dictionary<number, number>();
        dictionary.add(1, 1);
        dictionary.add(2, 2);
        dictionary.set(2, 5);
        expect(dictionary.containsKey(2)).toBe(true);
        expect(() => { dictionary.containsKey(undefined) }).toThrowError();
        expect(dictionary.containsKey(6)).toBe(false);
    });
})
