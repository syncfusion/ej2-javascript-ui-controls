import { setValue } from '../src/util';

/**
 * Component base
 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('=> Template Component => ', () => {
    it('setObject function', () => {
        let obj: any = { type: 'Fiat', model: '500', fields: { text: 'name' } };
        setValue('check', true, obj);
        expect(obj.check).toBe(true);
        expect(Object.keys(obj).length).toBe(4);
    });

    it('setObject function namespace empty obj', () => {
        let obj: any = {};
        let val: any;
        setValue('check.name', true, obj);
        expect(obj.check.name).toBe(true);
    });
    it('setObject function namespace value undefined', () => {
        let obj: any = { check: {} };
        let val: any;
        setValue('check.name', val, obj);
        expect(obj.check.name).toEqual({});
    });
});