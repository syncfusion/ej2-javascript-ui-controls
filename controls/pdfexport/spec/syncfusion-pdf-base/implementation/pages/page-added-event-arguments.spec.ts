/**
 * spec document for PageAddedEventArgs.ts class
 */
import { PdfPage } from '../../../../src/implementation/pages/pdf-page';
import { PageAddedEventArgs } from '../../../../src/implementation/pages/page-added-event-arguments';
describe('PageAddedEventArgs.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfPage = new PdfPage();
        let t2 : PageAddedEventArgs = new PageAddedEventArgs(t1);
        it('-Page != undefined', () => {
            expect(t2.page).not.toBeUndefined();
        })
        let t3 : PageAddedEventArgs = new PageAddedEventArgs(t1);
        it('-Page != undefined', () => {
            expect(t3.page).not.toEqual(null);
        })
    })
})