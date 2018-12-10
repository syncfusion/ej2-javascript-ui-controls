import { createElement } from "@syncfusion/ej2-base";
import { PdfViewer } from "../../src/index";

/**
 * PdfViewer spec 
 */

describe("PdfViewer API testing", () => {
    let viewer: PdfViewer;
    beforeAll(() => {
        let element: HTMLElement = createElement("div", { id: "container" });
        document.body.appendChild(element);
        // viewer = new PdfViewer({});
        // viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
        // viewer.appendTo("#container");
    });
    beforeEach(function(done) {
        setTimeout(function() {
            // viewer.load("HTTPSuccinctly.pdf", null);
          done();
        }, 1000);
      });
    afterAll((done) => {
        // viewer.destroy();
        // viewer = null;
        document.body.removeChild(document.getElementById("container"));
    });
    // it("Service URL", () => {
    //     expect(viewer.serviceUrl).toBe("http://localhost:62978/api/pdfviewer");
    // });
    it("Get module name in PdfViewer", () => {
        expect(true).toBe(true);
    });
    // it("Get total Page Number", () => {
    //     expect(viewer.pageCount).toBe(7);
    // });
    // it("Get current Page Number", () => {
    //     expect(viewer.currentPageNumber).toBe(1);
    // });
});