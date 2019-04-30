import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
TextSelection, TextSearch, Print, Annotation} from "../src/index";

PdfViewer.Inject(Toolbar,Magnification,Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
TextSelection, TextSearch, Print, Annotation);
let viewer: PdfViewer = new PdfViewer();
viewer.serviceUrl = "http://localhost:62978/api/pdfviewer";
viewer.appendTo("#pdfViewer");
