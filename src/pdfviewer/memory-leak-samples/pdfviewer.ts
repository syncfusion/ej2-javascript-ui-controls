import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
    TextSelection, TextSearch, Print, Annotation,FormFields} from "../src/index";
    
PdfViewer.Inject(Toolbar);

let viewer: PdfViewer;

document.getElementById('render').addEventListener('click',function() {
    viewer = new PdfViewer();
    viewer.documentPath = "https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf";
    viewer.resourceUrl = 'https://cdn.syncfusion.com/ej2/29.1.35/dist/ej2-pdfviewer-lib';
    viewer.appendTo("#pdfViewer");
});

document.getElementById('destroy').addEventListener('click',function() {
    if (viewer && !viewer.isDestroyed) {
        viewer.destroy();
        viewer = null;
    }
});