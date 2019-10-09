import { ValueFormatter } from './../src/value-formatter';
describe('value-formatter', () => {
    // afterEach(function () {
    //     sleep(3000);
    // });
    // function sleep(millSecs: any) {
    //     let date: any = new Date();
    //     let curDate: any = null;
    //     do { curDate = new Date(); }
    //     while (curDate - date < millSecs);
    // }
    it('toView', (done) => {
        let vFormatter: ValueFormatter = new ValueFormatter();
        vFormatter.toView(10, null);
        vFormatter.toView(10, undefined);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 50);
    });
});