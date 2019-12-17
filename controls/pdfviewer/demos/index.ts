import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
TextSelection, TextSearch, Print, Annotation,FormFields} from "../src/index";

PdfViewer.Inject(Toolbar,Magnification,Navigation, LinkAnnotation,ThumbnailView,BookmarkView,
TextSelection, TextSearch, Print, Annotation,FormFields);
let viewer: PdfViewer = new PdfViewer();
viewer.serviceUrl = "http://localhost:62978/api/PdfViewer";
viewer.appendTo("#pdfViewer");
