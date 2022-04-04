import { HelperMethods } from '../../../src/index';
/**
 * Helper methods validation
 */
describe('Editor Helper Methods', () => {
    beforeAll(() => {
    });
    afterAll((done) => {
        setTimeout(() => {
            done();
        }, 750);
    });
    it('Modified date parsing', () => {
        expect(HelperMethods.getModifiedDate('2022-02-09T22:27:00Z')).toBe('February 9, 2022 10:27 PM');
    });
    it('New date creation', () => {
        const now = new Date();
        let expected: string = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
        expect(HelperMethods.getUtcDate()).toBe(expected);
    });
});