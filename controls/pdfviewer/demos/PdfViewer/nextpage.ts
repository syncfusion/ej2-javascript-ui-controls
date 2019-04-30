import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
    TextSelection, TextSearch, Print} from "../../src/index";
    
    PdfViewer.Inject(Toolbar,Magnification,Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
    TextSelection, TextSearch, Print);
    let viewer: PdfViewer = new PdfViewer();
    viewer.serviceUrl = "https://ej2services.syncfusion.com/production/web-services/api/pdfviewer";
    viewer.documentPath="PDF_Succinctly.pdf";
    viewer.appendTo("#pdfViewer3");
    viewer.documentLoad = () => {viewer.navigation.goToNextPage();};
    
