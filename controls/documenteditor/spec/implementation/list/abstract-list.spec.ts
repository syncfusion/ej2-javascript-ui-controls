import { WListLevel } from '../../../src/document-editor/implementation/list/list-level';
import { WAbstractList } from '../../../src/document-editor/implementation/list/abstract-list';

describe('WAbstractList Validation Testing', () => {
    it('Abstract List  Testing', () => {
console.log('Abstract List  Testing');
        let abstractList: WAbstractList = new WAbstractList();
        expect(abstractList.levels.length).toBe(0);
    });
});
