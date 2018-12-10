// import { createElement } from "@syncfusion/ej2-base"
// import { PdfViewer, Magnification, LinkAnnotation, Toolbar,Navigation } from "../../../src/index"

// PdfViewer.Inject(Magnification, LinkAnnotation,Toolbar,Navigation);

// /**
//  * Toolbar spec  
//  */

// describe("PdfViewer Toolbar Testing", () => {
//     let viewer: PdfViewer; 
//     beforeAll(() => {
//         let element: HTMLElement = createElement("div", { id: "viewer" });
//         document.body.appendChild(element);
//         viewer = new PdfViewer();
//         viewer.serviceUrl = "http://localhost:62869/api/pdfviewer";
//         viewer.appendTo("#viewer");
//     });
//     beforeEach(function (done) {                                      
//         // viewer.load("HTTPSuccinctly.pdf", null);                    
//         setTimeout(() => { done(); }, 1000);        
//     });
//     afterAll((done) => {
//         viewer.destroy();
//         viewer = null;
//         document.body.removeChild(document.getElementById("viewer"));
//         done();
//     });      
//     // it("intialize Toolbar",()=>{                
//     //     var toolbarDiv = document.getElementById("viewer_toolbarContainer");
//     //     expect(toolbarDiv.className).toContain("e-pv-toolbar");
//     // });
//     // it("show Toolbar",(done)=>{
//     //     viewer.showToolbar(true);
//     //     setTimeout(() => {
//     //         let toolbarDiv:HTMLElement = document.getElementById("viewer_toolbarContainer");
//     //         expect(toolbarDiv.style.display).toEqual('block');
//     //         done();   
//     //     }, 1000);        
//     // });
//     // it("hide Open Option",(done)=>{
//     //     viewer.showOpenOption(false);
//     //     let openOptionElement = document.getElementById("viewer_openContainer");
//     //     expect(openOptionElement.className).toContain('e-hidden');                
//     //     done();
//     // });
//     // it("show Open Option",()=>{
//     //     viewer.showOpenOption(true);
//     //     let openOptionElement:HTMLElement = document.getElementById("viewer_openContainer");
//     //     expect(openOptionElement.className).not.toContain("e-hidden");
//     // });
//     // it("hide PageNavigation Tool",(done)=>{
//     //     viewer.showPageNavigationTool(false);
//     //     let first_pageContainer = document.getElementById("viewer_firstPageContainer");
//     //     expect(first_pageContainer.className).toContain("e-hidden");
//     //     let previous_PageContainer = document.getElementById("viewer_previousPageContainer");
//     //     expect(previous_PageContainer.className).toContain("e-hidden");
//     //     let next_PageContainer = document.getElementById("viewer_nextPageContainer");
//     //     expect(next_PageContainer.className).toContain("e-hidden");
//     //     let last_PageContainer = document.getElementById("viewer_lastPageContainer");
//     //     expect(last_PageContainer.className).toContain("e-hidden");
//     //     let current_PageContainer = document.getElementById("viewer_currentPageInputContainer");
//     //     expect(current_PageContainer.className).toContain("e-hidden");
//     //     let total_PageContainer = document.getElementById("viewer_totalPageContainer");             
//     //     expect(total_PageContainer.className).toContain("e-hidden");
//     //     done();
//     // });
//     // it("show PageNavigation Tool",(done)=>{
//     //     viewer.showPageNavigationTool(true);
//     //     let first_pageContainer = document.getElementById("viewer_firstPageContainer");
//     //     expect(first_pageContainer.className).not.toContain("e-hidden");
//     //     let previous_PageContainer = document.getElementById("viewer_previousPageContainer");
//     //     expect(previous_PageContainer.className).not.toContain("e-hidden");
//     //     let next_PageContainer = document.getElementById("viewer_nextPageContainer");
//     //     expect(next_PageContainer.className).not.toContain("e-hidden");
//     //     let last_PageContainer = document.getElementById("viewer_lastPageContainer");
//     //     expect(last_PageContainer.className).not.toContain("e-hidden");
//     //     let current_PageContainer = document.getElementById("viewer_currentPageInputContainer");
//     //     expect(current_PageContainer.className).not.toContain("e-hidden");
//     //     let total_PageContainer = document.getElementById("viewer_totalPageContainer");             
//     //     expect(total_PageContainer.className).not.toContain("e-hidden");
//     //     done();
//     // });
//     // it("hide Magnification Tool",(done)=>{
//     //     viewer.showMagnificationTool(false);
//     //     let zoomOutContainer = document.getElementById("viewer_zoomOutContainer");
//     //     expect(zoomOutContainer.className).toContain("e-hidden");
//     //     let zoomInContainer = document.getElementById("viewer_zoomInContainer");
//     //     expect(zoomInContainer.className).toContain("e-hidden");
//     //     let zoomDropDownContainer = document.getElementById("viewer_zoomDropDownContainer");
//     //     expect(zoomDropDownContainer.className).toContain("e-hidden");
//     //     done();
//     // });
//     // it("show Magnification Tool",(done)=>{
//     //     viewer.showMagnificationTool(true);
//     //     let zoomOutContainer = document.getElementById("viewer_zoomOutContainer");
//     //     expect(zoomOutContainer.className).not.toContain("e-hidden");
//     //     let zoomInContainer = document.getElementById("viewer_zoomInContainer");
//     //     expect(zoomInContainer.className).not.toContain("e-hidden");
//     //     let zoomDropDownContainer = document.getElementById("viewer_zoomDropDownContainer");
//     //     expect(zoomDropDownContainer.className).not.toContain("e-hidden");
//     //     done();
//     // });
//     // it("hide Download Option",(done)=>{
//     //     viewer.showDownloadOption(false);
//     //     let downloadOptionElement = document.getElementById("viewer_downloadContainer");
//     //     expect(downloadOptionElement.className).toContain("e-hidden");
//     //     done();
//     // });
//     // it("show Download Option",(done)=>{
//     //     viewer.showDownloadOption(true);
//     //     let downloadOptionElement = document.getElementById("viewer_downloadContainer");
//     //     expect(downloadOptionElement.className).not.toContain("e-hidden");
//     //     done();
//     // });
//     // it("reset Toolbar",async(done)=>{
//     //     await viewer.goToPage(5);        
//     //     await viewer.toolbarModule.resetToolbar();
//     //     let currentPageInputElement:HTMLInputElement = <HTMLInputElement>document.getElementById("viewer_currentPageInput");
//     //     expect(currentPageInputElement.value).toEqual('5');
//     //     done();
//     // });      
//     // it("update Zoom Percentage",(done)=>{        
//     //     viewer.zoomTo(200);
//     //     setTimeout(() => {
//     //         let zoomPercentageElement:HTMLInputElement = <HTMLInputElement>document.getElementById("viewer_zoomDropDown");
//     //         expect(zoomPercentageElement.value).toEqual("200%");    
//     //         done();
//     //     }, 1000);        
//     // });
//     // describe("Upload Toolbar Item",()=>{    
//     //     let viewer1:PdfViewer = null;    
//     //     beforeAll(() => {
//     //         let element: HTMLElement = createElement("div", { id: "viewer1" });
//     //         document.body.appendChild(element);
//     //         viewer1 = new PdfViewer();
//     //         viewer1.serviceUrl = "http://localhost:62869/api/pdfviewer";
//     //         viewer1.appendTo("#viewer1");
//     //     });
//     //     beforeEach(function (done) {                                      
//     //         viewer1.load("HTTPSuccinctly.pdf", null);                    
//     //         setTimeout(() => { done(); }, 1000);        
//     //     });
//     //     afterAll((done) => {
//     //         viewer1.destroy();
//     //         viewer1 = null;
//     //         document.body.removeChild(document.getElementById("viewer1"));
//     //         done();
//     //     });      
//     //     it("Update Toolbar Item", (done) => {
//     //         let firstPageElement:HTMLElement = document.getElementById("viewer1_firstPage");
//     //         let previousPagelement:HTMLElement = document.getElementById("viewer1_previousPage");
//     //         let nextPageElement:HTMLElement = document.getElementById("viewer1_nextPage");
//     //         let lastPageElement:HTMLElement = document.getElementById("viewer1_lastPage");
//     //         let zoomOutElement:HTMLElement = document.getElementById("viewer1_zoomOut");
//     //         let zoomInElement:HTMLElement = document.getElementById("viewer1_zoomIn");
//     //         let downloadElement:HTMLElement = document.getElementById("viewer1_download");
          
//     //         expect(firstPageElement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(previousPagelement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(nextPageElement.getAttribute("aria-disabled")).toEqual('false');          
//     //         expect(lastPageElement.getAttribute("aria-disabled")).toEqual('false');         
//     //         expect(zoomOutElement.getAttribute("aria-disabled")).toEqual('false');         
//     //         expect(zoomInElement.getAttribute("aria-disabled")).toEqual('false');        
//     //         expect(downloadElement.getAttribute("aria-disabled")).toEqual('false');  
    
//     //         viewer1.unload();            
//     //         expect(firstPageElement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(previousPagelement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(nextPageElement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(lastPageElement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(zoomOutElement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(zoomInElement.getAttribute("aria-disabled")).toEqual('true');
//     //         expect(downloadElement.getAttribute("aria-disabled")).toEqual('true');
//     //         done();
//     //    });
//     // });       

//     // describe("Update Navigation Item",()=>{    
//     //     let viewer2:PdfViewer = null;    
//     //     beforeAll(() => {
//     //         let element: HTMLElement = createElement("div", { id: "viewer2" });
//     //         document.body.appendChild(element);
//     //         viewer2 = new PdfViewer();
//     //         viewer2.serviceUrl = "http://localhost:62869/api/pdfviewer";
//     //         viewer2.appendTo("#viewer2");
//     //     });
//     //     beforeEach(function (done) {                                      
//     //         viewer2.load("HTTPSuccinctly.pdf", null);                    
//     //         setTimeout(() => { done(); }, 1000);        
//     //     });
//     //     afterAll((done) => {
//     //         viewer2.destroy();
//     //         viewer2 = null;
//     //         document.body.removeChild(document.getElementById("viewer2"));
//     //         done();
//     //     });     
//     //     it("Update Navigation Button",async(done)=>{
//     //         let firstPageElement:HTMLElement = document.getElementById("viewer2_firstPage");
//     //         let previousPagelement:HTMLElement = document.getElementById("viewer2_previousPage");
//     //         let nextPageElement:HTMLElement = document.getElementById("viewer2_nextPage");
//     //         let lastPageElement:HTMLElement = document.getElementById("viewer2_lastPage");
            
//     //         expect(firstPageElement.getAttribute("aria-disabled")).toEqual('true');        
//     //         expect(previousPagelement.getAttribute("aria-disabled")).toEqual('true'); 
//     //         expect(nextPageElement.getAttribute("aria-disabled")).toEqual('false');      
//     //         expect(lastPageElement.getAttribute("aria-disabled")).toEqual('false'); 
            
//     //         await viewer.goToLastPage();
//     //         await setTimeout(() => {
//     //             expect(firstPageElement.getAttribute("aria-disabled")).toEqual('false');        
//     //             expect(previousPagelement.getAttribute("aria-disabled")).toEqual('false');           
//     //             expect(nextPageElement.getAttribute("aria-disabled")).toEqual('true');            
//     //             expect(lastPageElement.getAttribute("aria-disabled")).toEqual('true');          
//     //         }, 1000);                                   
            
//     //         await viewer.goToPage(3);           
//     //         setTimeout(()=>{
//     //             expect(firstPageElement.getAttribute("aria-disabled")).toEqual('false');         
//     //             expect(previousPagelement.getAttribute("aria-disabled")).toEqual('false');            
//     //             expect(nextPageElement.getAttribute("aria-disabled")).toEqual('false');          
//     //             expect(lastPageElement.getAttribute("aria-disabled")).toEqual('false');          
//     //         },1000);        
            
//     //         await viewer.unload();            
//     //         setTimeout(()=>{
//     //             expect(firstPageElement.getAttribute("aria-disabled")).toEqual('true');         
//     //             expect(previousPagelement.getAttribute("aria-disabled")).toEqual('true');            
//     //             expect(nextPageElement.getAttribute("aria-disabled")).toEqual('true');        
//     //             expect(lastPageElement.getAttribute("aria-disabled")).toEqual('true');    
//     //         },1000);            
//     //         done();                                          
//     //     });          
//     // });
//     // it("update zoom button",async(done)=>{
//     //     await viewer.zoomTo(25);
//     //     let zoomOutElement:HTMLElement = document.getElementById("viewer_zoomOut");
//     //     let zoomInElement:HTMLElement = document.getElementById("viewer_zoomIn");
//     //     await setTimeout(() => {            
//     //         expect(zoomOutElement.getAttribute("aria-disabled")).toEqual('true');        
//     //         expect(zoomInElement.getAttribute("aria-disabled")).toEqual('false');        
//     //     }, 1000);
        
//     //     await viewer.zoomTo(100);        
//     //     setTimeout(() => {
//     //         expect(zoomOutElement.getAttribute("aria-disabled")).toEqual('false');        
//     //         expect(zoomInElement.getAttribute("aria-disabled")).toEqual('false');        
//     //     }, 1000);
              
//     //     await viewer.zoomTo(400);
//     //     setTimeout(() => {
//     //         expect(zoomOutElement.getAttribute("aria-disabled")).toEqual('false');        
//     //         expect(zoomInElement.getAttribute("aria-disabled")).toEqual('true');        
//     //     }, 1000);        
//     //     done();
//     // });
//     // it("update current page",(done)=>{
//     //     let currentPageInputElement :HTMLInputElement = <HTMLInputElement>document.getElementsByName("viewer_currentPageInput")[0];
//     //     expect(currentPageInputElement.value).toEqual("1");
//     //     done();
//     // });
//     // it("update Total page",(done)=>{
//     //     expect(document.getElementById("viewer_totalPage").innerText).toEqual("of 7");
//     //     done();
//     // });
//     // it("hide Toolbar",(done)=>{
//     //     viewer.showToolbar(false);
//     //     setTimeout(() => {
//     //         let toolbarDiv:HTMLElement = document.getElementById("viewer_toolbarContainer");
//     //         expect(toolbarDiv.style.display).toEqual('none');                        
//     //         done();   
//     //     }, 3000); 
//     // });
//     it("get Module Name",()=>{
//         expect(viewer.toolbarModule.getModuleName()).toEqual("Toolbar");
//     });
// });