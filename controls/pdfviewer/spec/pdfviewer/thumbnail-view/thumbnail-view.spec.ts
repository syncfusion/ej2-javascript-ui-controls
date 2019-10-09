// import { createElement } from "@syncfusion/ej2-base";
// import { PdfViewer, Magnification, LinkAnnotation, Toolbar, Navigation, ThumbnailView } from "../../../src/index"

// PdfViewer.Inject(Magnification, LinkAnnotation, Toolbar, Navigation, ThumbnailView);


// /**
//  * Thumbnail view spec
//  */

// describe("PdfViewer Thumbnail Enable Testing", () => {
//     let viewer: PdfViewer;
//     beforeAll((done) => {
//         let element: HTMLElement = createElement("div", { id: "container" });
//         document.body.appendChild(element);
//         viewer = new PdfViewer({});
//         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
//         viewer.appendTo("#container");
//         // viewer.load("HTTPSuccinctly.pdf", null);
//         setTimeout(() => { done(); }, 1000);
//     });
//     afterAll((done) => {
//         viewer.destroy();
//         viewer = null;
//         document.body.removeChild(document.getElementById("container"));
//         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
//             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
//         }
//         done();
//     });
//     it("Module Name",()=> {
//         expect(viewer.thumbnailViewModule.getModuleName()).toEqual("ThumbnailView");
//     });
//     // it("thumbnail view enable", (done) => {
//     //     var thumbnailDiv = document.getElementById("container_thumbnail_view");
//     //     expect(thumbnailDiv.className).toContain("e-pv-thumbnail-view");
//     //     done();
//     // });
//     // it("thumbnail view count", (done) => {
//     //     var thumbnailDiv = document.getElementById("container_thumbnail_view");
//     //     expect(thumbnailDiv.children.length).toBe(7);
//     //     done();
//     // });
// });

// // describe("PdfViewer Thumbnail Selection Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view selection", (done) => {
// //         var thumbnailDiv = document.getElementById("container_thumbnail_view");
// //         expect(thumbnailDiv.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-selection-ring");
// //         done();
// //     });
// // });

// // describe("PdfViewer Thumbnail Goto Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("Goto thumbnail view", (done) => {
// //         viewer.thumbnailViewModule.thumbnailView = document.getElementById("container_thumbnail_view");
// //         viewer.thumbnailViewModule.gotoThumbnailImage(1);
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[1].children[0].children[0].className).toContain("e-pv-thumbnail-focus");
// //         done();
// //     });
// // });

// // describe("PdfViewer Thumbnail Click Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view click", (done) => {
// //         viewer.thumbnailViewModule.thumbnailView = document.getElementById("container_thumbnail_view");
// //         let event: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailClick(event);
// //         // tslint:disable-next-line:max-line-length
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-selection");
// //         done();
// //     });
// // });

// // describe("PdfViewer Thumbnail mouseover Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view mouseover", (done) => {
// //         viewer.thumbnailViewModule.thumbnailView = document.getElementById("container_thumbnail_view");
// //         let event: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[2].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailMouseOver(event);
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[2].children[0].children[0].className).toContain("e-pv-thumbnail-hover");
// //         done();
// //     });
// // });
// // describe("PdfViewer Thumbnail mouse leave Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);        
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view mouse leave", (done) => {
// //         viewer.thumbnailViewModule.thumbnailView = document.getElementById("container_thumbnail_view");
// //         let event: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[2].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailMouseLeave(event);
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[2].children[0].children[0].className).toContain("e-pv-thumbnail-selection-ring");
// //         done();
// //     });
// // });

// // describe("PdfViewer Thumbnail click mouse leave Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view click mouse leave ", (done) => {
// //         viewer.thumbnailViewModule.thumbnailView = document.getElementById("container_thumbnail_view");
// //         let clickEvent: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailClick(clickEvent);
// //         // tslint:disable-next-line:max-line-length
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-selection");
// //         let event: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailMouseLeave(event);
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-focus");
// //         done();
// //     });
// // });

// // describe("PdfViewer Thumbnail click mouse over Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view click mouse over ", (done) => {
// //         viewer.thumbnailViewModule.thumbnailView = document.getElementById("container_thumbnail_view");
// //         let clickEvent: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailClick(clickEvent);
// //         // tslint:disable-next-line:max-line-length
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-selection");
// //         let event: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailMouseOver(event);
// //         // tslint:disable-next-line:max-line-length
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-selection");
// //         done();
// //     });
// // });

// // describe("PdfViewer Thumbnail click goto Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view click goto ", (done) => {
// //         viewer.thumbnailViewModule.thumbnailView = document.getElementById("container_thumbnail_view");
// //         let clickEvent: any = {
// //             srcElement: viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0],
// //             preventDefault: () => { return true; },
// //             ctrlKey: true,
// //             shiftKey: true,
// //         };
// //         viewer.thumbnailViewModule.thumbnailClick(clickEvent);
// //         // tslint:disable-next-line:max-line-length
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-selection");
// //         viewer.thumbnailViewModule.gotoThumbnailImage(0);
// //         expect(viewer.thumbnailViewModule.thumbnailView.children[0].children[0].children[0].className).toContain("e-pv-thumbnail-focus");
// //         done();
// //     });
// // });

// // describe("PdfViewer Thumbnail clear Testing", () => {
// //     let viewer: PdfViewer;
// //     beforeAll((done) => {
// //         let element: HTMLElement = createElement("div", { id: "container" });
// //         document.body.appendChild(element);
// //         viewer = new PdfViewer({});
// //         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
// //         viewer.appendTo("#container");
// //         viewer.load("HTTPSuccinctly.pdf", null);
// //         setTimeout(() => { done(); }, 1000);
// //     });
// //     afterAll((done) => {
// //         viewer.destroy();
// //         viewer = null;
// //         document.body.removeChild(document.getElementById("container"));
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         done();
// //     });
// //     it("thumbnail view clear", (done) => {
// //         viewer.thumbnailViewModule.clear();
// //         while (document.getElementById("container_thumbnail_view").hasChildNodes()) {
// //             document.getElementById("container_thumbnail_view").removeChild(document.getElementById("container_thumbnail_view").lastChild);
// //         }
// //         expect(document.getElementById("container_thumbnail_view").children.length).toBe(0);
// //         done();
// //     });
// // });

