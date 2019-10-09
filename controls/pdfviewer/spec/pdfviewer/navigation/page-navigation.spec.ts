// import { createElement } from "@syncfusion/ej2-base";
// import { PdfViewer,Navigation,LinkAnnotation } from "../../../src/index";

// PdfViewer.Inject(PdfViewer,Navigation,LinkAnnotation);

// /**
//  * Navigation spec 
//  */

// describe("PdfViewer Navigation testing", () => {
//     let viewercontainer: PdfViewer;
//     beforeAll((done) => {
//         let element: HTMLElement = createElement("div", { id: "viewercontainer" });
//         document.body.appendChild(element);
//         viewercontainer = new PdfViewer({});
//         viewercontainer.serviceUrl = "http://localhost:62978/api/pdfviewer";
//         viewercontainer.appendTo("#viewercontainer");   
//         done();     
//     });
//     // async function nextPage() {
//     //     await viewercontainer.goToNextPage();                  
//     // }
//     beforeEach(function(done) {
//         viewercontainer.load("HTTPSuccinctly.pdf", null);        
//         setTimeout(function() { done();}, 1000);    
//         done();
//       });
//     afterAll((done) => {
//         viewercontainer.destroy();
//         viewercontainer = null;
//         document.body.removeChild(document.getElementById("container"));
//         done();
//     });    
//     // async function GetCurrentPageNumber():Promise<number>{        
//     //     let pagenumber:number = await viewercontainer.currentPageNumber;            
//     //     return pagenumber;
//     // }
//     // it("Next Page", async(done) => {      
//     //     await viewercontainer.goToNextPage();  
//     //     await setTimeout(() => {
//     //         GetCurrentPageNumber().then(x=>{
//     //             expect(x).toEqual(2);
//     //             done();
//     //         });
//     //      }, 3000);     
//     // });
//     // it("goToPreviousPage", async(done) => {
//     //      await viewercontainer.goToPage(5);
//     //      await viewercontainer.goToPreviousPage();
//     //      await setTimeout(()=>{
//     //         expect(viewercontainer.currentPageNumber).toEqual(4);
//     //         done();
//     //     },3000);           
//     //  }); 
//     //  it("goToPage", async(done) => {
//     //     await viewercontainer.goToPage(5);        
//     //     await setTimeout(()=>{
//     //        expect(viewercontainer.currentPageNumber).toEqual(5);
//     //        done();
//     //    },3000);          
//     // }); 
//     // it("goToFirstPage", async(done) => {
//     //     await viewercontainer.goToFirstPage();        
//     //     await setTimeout(()=>{
//     //        expect(viewercontainer.currentPageNumber).toEqual(1);
//     //        done();
//     //    },3000);          
//     // }); 
//     // it("goToLastPage", async(done) => {
//     //     await viewercontainer.goToLastPage();        
//     //     await setTimeout(()=>{
//     //        expect(viewercontainer.currentPageNumber).toEqual(7);
//     //        done();
//     //    },3000);          
//     // }); 
//     it("get Module Name", () => {        
//         expect(viewercontainer.navigationModule.getModuleName()).toEqual("Navigation");
//     }); 
// });