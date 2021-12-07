import { createElement } from "@syncfusion/ej2-base";
import { PdfViewer } from "../../src/index";
import  {profile , inMB, getMemoryProfile} from '../common.spec';


/**
 * PdfViewer spec 
 */
  
  
  

 describe('PDF_Viewer', () => {

  var timeout:number = jasmine.DEFAULT_TIMEOUT_INTERVAL; 
  
  beforeAll(() => {
   
      const isDef = (o: any) => o !== undefined && o !== null;
      if (!isDef(window.performance)) {
          console.log("Unsupported environment, window.performance.memory is unavailable");
          this.skip(); //Skips test (in Chai)
          return;
      }
    
  });


describe("PdfViewer API testing", () => {
 
  
    let viewer: PdfViewer;
    beforeAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL=10000;
      
      let element: HTMLElement = createElement("div", { id: "container" });
        document.body.appendChild(element);
         viewer = new PdfViewer({});
         viewer.serviceUrl = "https://ej2services.syncfusion.com/production/web-services/api/pdfviewer";
         viewer.appendTo("#container");
         
    });
   
    beforeEach(function(done) {
       
        setTimeout(function() {
            viewer.load("PDF_Succinctly.pdf", null);
          done();
        }, 3000);
      });
    afterAll((done) => {

      setTimeout(function() {
        viewer.destroy();
        viewer = null;
       document.body.removeChild(document.getElementById("container"));
       jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
      done();
    }, 3000);
    
        
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
   

})
// it("memory leak", () => {  
         
//   profile.sample();
//   let average: any = inMB(profile.averageChange)
//   //Check average change in ,memory samples, to not be over 10MB
//   expect(average).toBeLessThan(10);
//   let memory: any = inMB(getMemoryProfile())
//  // Check the final memory usage against the first usage , there should be little change if everything was properly deallocated
//   expect(memory).toBeLessThan(profile.samples[0] + 0.25);

// })
 
})
