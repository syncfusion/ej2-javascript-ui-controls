import { browser, element, By } from "@syncfusion/ej2-base/e2e/index";

// if (browser.isDesktop === true) {
//     browser.driver.manage().window().setSize(1600, 1200);
// }
describe('pdfviewer', function () {

    it('load', function () {
        browser.load('/demos/PdfViewer/loadpage.html');
        browser.sleep(5000);
        browser.compareScreen(element(By.id('pdfViewer1')), 'load');
    });
    it('zoomchange', function () {
        browser.load('/demos/PdfViewer/zoomchange.html');
        browser.sleep(5000);
        browser.compareScreen(element(By.id('pdfViewer2')), 'zoomchange');
    });
    it('nextpage', function () {
        browser.load('/demos/PdfViewer/nextpage.html');
        browser.sleep(5000);
        browser.compareScreen(element(By.id('pdfViewer3')), 'nextpage');
    });
});
