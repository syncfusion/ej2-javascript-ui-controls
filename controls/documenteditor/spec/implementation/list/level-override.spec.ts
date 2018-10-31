import { WListLevel } from '../../../src/document-editor/implementation/list/list-level';
import { WLevelOverride } from '../../../src/document-editor/implementation/list/level-override';

describe('WLevelOverride Validation Testing', () => {
    it('Level Override  Testing', () => {
        let levelOverride: WLevelOverride = new WLevelOverride();
        levelOverride.startAt = 6;
        expect(levelOverride.startAt).toBe(6);
        levelOverride.destroy();
        expect(levelOverride.overrideListLevel).toBe(undefined);
        expect(() => { levelOverride.destroy() }).not.toThrowError();
    });
});