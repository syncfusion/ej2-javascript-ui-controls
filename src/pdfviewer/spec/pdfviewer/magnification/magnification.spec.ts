// import { createElement } from "@syncfusion/ej2-base"
// import { PdfViewer, Magnification, LinkAnnotation } from "../../../src/index"

// PdfViewer.Inject(Magnification, LinkAnnotation);

// /**
//  * Magnification spec  
//  */

// describe("PdfViewer Magnification Testing", () => {
//     let viewer: PdfViewer; 
//     beforeAll(() => {
//         let element: HTMLElement = createElement("div", { id: "container" });
//         document.body.appendChild(element);
//         viewer = new PdfViewer({});
//         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
//         viewer.appendTo("#container");
//     });
//     beforeEach(function (done) {                                      
//         viewer.load("HTTPSuccinctly.pdf", null);             
//         setTimeout(() => { done(); }, 1000);        
//     });
//     afterAll((done) => {
//         viewer.destroy();
//         viewer = null;
//         document.body.removeChild(document.getElementById("container"));
//         done();
//     });
//     it("Module Name",()=>{
//         expect(viewer.magnificationModule.getModuleName()).toEqual("Magnification");
//     });
//     // describe("zoom To",()=>{
//     //     beforeEach(function (done) {                                                  
//     //         viewer.zoomTo(200);
//     //         done();
//     //     });
//     //     it("zoomTo",(done)=>{
//     //         expect(viewer.zoomPercentage).toBe(200);
//     //         done();
//     //     });
//     // });
//     // describe("zoom In",()=>{
//     //     beforeEach(function (done) {                                                  
//     //         viewer.zoomIn();
//     //         done();
//     //     });
//     //     it("zoomIn",(done)=>{
//     //         expect(viewer.zoomPercentage).toBe(125);
//     //         done();
//     //     });
//     // });
//     // describe("zoom Out",()=>{
//     //     beforeEach(function (done) {                                                  
//     //         viewer.zoomOut();
//     //         done();
//     //     });
//     //     it("zoomOut",(done)=>{
//     //         expect(viewer.zoomPercentage).toBe(75);
//     //         done();
//     //     });
//     // });
//     // describe("fit To Width",()=>{
//     //     beforeEach(function (done) {                                                  
//     //         viewer.fitToWidth();
//     //         done();
//     //     });
//     //     it("fitToWidth",(done)=>{
//     //         expect(parseInt(viewer.zoomPercentage.toString())).toBe(117);
//     //         done();
//     //     });
//     // });
//     // describe("fit To Page",()=>{
//     //     beforeEach(function (done) {                                                  
//     //         viewer.fitToPage();
//     //         done();
//     //     });
//     //     it("fitToPage",(done)=>{
//     //         expect(parseInt(viewer.zoomPercentage.toString())).toBe(700);
//     //         done();
//     //     });
//     // }); 
// });