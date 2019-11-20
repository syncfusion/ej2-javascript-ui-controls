# Changelog

## [Unreleased]

## 17.3.28 (2019-11-19)

### PDF Viewer

#### New Features

- `#251151`, `#254032` – Improved the annotation selection behavior in code behind.
- `#254776`, `#255304` – Provided the support to set the custom JSON data for AJAX request.
- `#253341` – Provided the support to customize the label content during initial rendering of annotations.
- `#252421` – Provided the support to set the zoom mode value during initial loading.

#### Bug Fixes

- `#253926` – Resolved the memory leak while rendering the PDF documents.

## 17.3.27 (2019-11-12)

### PDF Viewer

#### New Features

- `#251151`, `#254032` – Provided the support for annotation selection in code behind.
- `#249245` – Provided the support for UI customization of annotation selector border and resizer.
- Improved the PDF viewer mobile view performance.

#### Bug Fixes

- `#253317` – The measured annotation value is updated properly in the label when you disable the default toolbar.
- `#253888` – The Script error will no longer be thrown if we load the PDF documents using ASP.NET MVC web service.
- `#253317` – The measured value is now update properly for the measured annotation.

## 17.3.26 (2019-11-05)

### PDF Viewer

#### New Features

- `#252805` - Exposed the annotation unique ID in the annotationAdd event arguments.

#### Bug Fixes

- `#252806` - Annotation bounds are retrieved properly when importing and exporting the annotation details in rotated PDF documents.
- `#253016` - Free text annotation bounds are preserved properly in the rotated PDF document while saving the document.
- `#251152` - Text markup annotation resizer position will be updated properly in the doctype HTML pages.
- `#252879` - Script errors will no longer occur if we disable the magnification module.
- `#253504` - The character start and end indexes will be updated properly in the text markup annotationAdd event arguments.

## 17.3.21 (2019-10-30)

### PDF Viewer

#### New Features

- `#252111` - Provided the support for handwritten signature.
- `#251149` - Provided the support for customizing the text search highlight color.

#### Bug Fixes

- `#251864` - The pages in the landscape document will be rendered properly.
- `#250902` - Now, the text Markup annotations are working properly inside the Tab control.
- `#250538` - The ajaxRequestFailed event will be triggered for all the possible ajax error codes.
- `#252269` – The mouse cursor has been updated properly after adding the free text annotation.
- `#251401` - The annotationSelect event will be triggered properly while selecting the annotations.

## 17.3.19 (2019-10-22)

### PDF Viewer

#### New Features

- `#249703` - The quality of the printed copy has been improved.
- `#147267`, `#251146` - Provided the support to delete the annotations in code behind.
- `#248609` - Provided the support to customize the annotation selector.
- `#247224`, `#248179` - Provided the support to resize the text markup annotation bounds.

#### Bug Fixes

- `#251577` - The value of the isDocumentEdited property now returned properly for shapes, measure, stamps annotation and form filling features.
- `#249588` - The PDF Viewer control size is updated properly while using in tab control.
- `#251729` - The text markup annotation selector is cleared properly when loading the another PDF document.
- `#251742` - The perimeter shape type has been updated properly when exporting the annotation details.
- `#251494` - The reference error will no longer be thrown if you render the PDF document in docker Linux container environment.
- `#251153` – The previously imported annotations are no more cleared when import the other set of annotations.

## 17.3.17 (2019-10-15)

### PDF Viewer

#### New Features

- `#248585` - The start and end indexes of text markup annotation have been exposed in the annotationAdd event.

#### Bug Fixes

- `#249742` - The annotationSelect event will be triggered properly after selecting another text markup annotation.
- `#245008` - Notes of the measure annotations will now be updated properly after modifying the scale values.

## 17.3.16 (2019-10-09)

### PDF Viewer

#### New Features

- `#249725` - Provided the support to enable or disable the comment panel.
- `#248609` -  Exposed the API for textSelectionStart and textSelectionEnd events in the PDF Viewer.

#### Bug Fixes

- `#249017` - Multiline text markup annotation bounds will be returned properly in the annotationAdd event arguments.

## 17.3.14 (2019-10-03)

### PDF Viewer

#### New Features

- `#227046`, `#230887`, `#142366`, `#231973`, `#237847`, `#244849`, `#238686`, `#239233`, `#241638`, `#241638`, `#242232`, `#239221`, `#240051`, `#245255` – The support has been provided for filling the form fields.
- `#233655`, `#236240`, `#236825`, `#238694`, `#241974`, `#243864`, `#245087` – The support has been provided for free text annotation.
- `#246059` - Exposed the thumbnailClick event to identify the thumbnail clicks action.
- `#246767` – The support has been provided to export the annotation details as JSON object in client-side.
- `#245008` – The support has been provided to update the existing calibrate annotation if we modify the scale value.
- Improved the scrolling performance in mobile devices.

#### Bug Fixes

- `#247914` – The perimeter annotation will be rendered properly when the line is ended in the starting point.
- `#248062` – Extra edge will not be added to the polygon shapes when rendered in the page.
- `#248092` – Contents will not be swapped if you switch randomly between two documents.
- `#248093` – Script error will no longer be thrown if you switch randomly between two documents.
- `#247787` – The searched text will be highlighted properly in the provided document.
- `#146785` – Script error will no longer be thrown when the PDF Viewer control is used in the React application.

## 17.3.9-beta (2019-09-20)

### PDF Viewer

#### New Features

- `#227046`, `#230887`, `#142366`, `#231973`, `#I237847`, `#244849`, `#238686`, `#239233`, `#241638`, `#241638`, `#242232`, `#239221`, `#240051`, `#245255` – The support has been provided for filling the form fields.
- `#233655`, `#236240`, `#236825`, `#238694`, `#241974`, `#243864`, `#245087` – The support has been provided for free text annotation.
- `#246059` - Exposed the thumbnailClick event to identify the thumbnail clicks action.
- `#246767` – The support has been provided to export the annotation details as JSON object in client-side.
- `#245008` – The support has been provided to update the existing calibrate annotation if we modify the scale value.
- Improved the scrolling performance in mobile devices.

## 17.2.49 (2019-09-04)

### PDF Viewer

#### Bug Fixes

- `#246044` – The assigned author name is now preserved properly while loading or saving the document in PDF Viewer.
- `#245087` – The Polygon, Perimeter, and Volume annotations will be drawn properly in the low zoom values.
- `#245820` - Magnification on double tap will no longer happen when the pinch zoom is disabled in the PDF Viewer control.
- `#244787` – The Comment panel is now opened properly while double clicking the annotation created from the code behind.
- `#246041` - The warning message will no longer be thrown when the web action method is executed.

## 17.2.47 (2019-08-27)

### PDF Viewer

#### New Features

- `#243205`, `#245009` - Provided the support to include Custom stamps in stamp dropdown.
- `#243133` - Provided the support to customize tooltip of the hyperlink on mouse hover.
- `#245007` - Provided the Feet unit support in measurement annotation.

#### Bug Fixes

- `#244499` - The shape and measurement annotations will now be rendered properly in the rotated documents.
- `#244481` - The script errors will no longer be thrown in PDF Viewer in IE browser.

## 17.2.46 (2019-08-22)

### PDF Viewer

#### Breaking Changes

- The following API is renamed.

| Existing API name| New API Name |
|------|-------------|
| toolbarItem| toolbarItems|

#### New Features

- `#223065`, `#234860`, `#241770`, `#241487`, `#229426`, `#244801` – Provided the support for importing and exporting the annotation details as a JSON object.

#### Bug Fixes

- `#243837` – Exception will no longer be thrown while loading the PDF document as FileStream.

## 17.2.41 (2019-08-14)

### PDF Viewer

#### Bug Fixes

- `#241487`, `#243077` - Annotation author name is now updated properly in the comment panel.
- `#242804` - The Bookmark's destination value is now maintained properly during navigation.
- `#241487` - The provided PDF document will now be loaded properly in the PDF Viewer control.
- `#244437` - Resolved the typo errors in the PDF Viewer toolbar content.
- `#244654` - The editAnnotation API is now working properly.
- `#243134` - The PDF documents load properly when render the PDF Viewer control under multiple tab with fitToPage view mode during initial loading.

## 17.2.40 (2019-08-06)

### PDF Viewer

#### New Features

- `#242329` - Provided the support to customize scale ratio value of measurement annotation.
- `#241886` - Provided the support to display context menu in mouse up action.

#### Bug Fixes

- `#242495`, `#243160` – Hyperlink element is now rendered properly for the rotated page document.
- `#238064` – Searched target text is now highlighted properly for the provided document.
- `#241904`, `#241294` – Converted PDF document is now rendered properly in IE browser.
- `#242282` – Text search is now working properly while using PDF Viewer control inside the Tab control.

## 17.2.39 (2019-07-30)

### PDF Viewer

#### New Features

- `#240440` - More details have been provided in the ajaxRequestfailure event.
- `#242375` – Now, the annotation edit toolbar is enabled by default using the enableAnnotationToolbar property.
- `#241715` - Support has been provided to render the annotation modified date and time in the comment panel.

#### Bug Fixes

- `#242803` - The request handling has been optimized for retrieving the comments details from the PDF document.

## 17.2.36 (2019-07-24)

### PDF Viewer

#### New Features

- Provided the API to modify the scale ratio to change the quality of the pages rendered in the PDF Viewer.

## 17.2.35 (2019-07-17)

### PDF Viewer

#### Bug Fixes

- `#229426` - Provided the API to select, edit, and delete the annotations.

## 17.2.34 (2019-07-11)

### PDF Viewer

#### Breaking Changes

- The following event arguments are renamed.

| Existing Event Arguments Name| New Event Arguments Name |
|------|-------------|
|IUnloadEventArgs|UnloadEventArgs|
|ILoadEventArgs|LoadEventArgs|
|ILoadFailedEventArgs|LoadFailedEventArgs|
|IAjaxRequestFailureEventArgs|AjaxRequestFailureEventArgs|
|IPageChangeEventArgs|PageChangeEventArgs|
|IPageClickEventArgs|PageClickEventArgs|
|IZoomChangeEventArgs|ZoomChangeEventArgs|
|IHyperlinkClickEventArgs |HyperlinkClickEventArgs |
|IAnnotationAddEventArgs|AnnotationAddEventArgs|
|IAnnotationRemoveEventArgs|AnnotationRemoveEventArgs|
|IAnnotationPropertiesChangeEventArgs|AnnotationPropertiesChangeEventArgs|

#### New Features

- `#208298`, `#223253`, `#224643`, `#233655`, `#238694` - Provided the supports for shape annotations.
- `#219446`, `#224643`, `#230115`, `#233032`, `#F144297`, `#236825`, `#238694` - Provided the supports for stamp annotations.
- `#229426` - Provided the supports for calibrate annotations.
- `#223253`, `#238694` - Provided the supports for sticky notes annotations.
- `#238812` – Provided support to restrict the hyperlink navigation.
- `#236995` – Provided support to restrict the pinch zooming using the ‘enablePinchZoom’ property.

#### Bug Fixes

- `#233161` – Now, loading Indicator will be shown properly while loading a large page size document.
- `#233035` - HyperlinkClick event is now triggered properly.
- `#234364` - Pan interaction mode is now working properly when the toolbar is disabled.
- `#231436` - PDF document is now rendered properly while using the PDF Viewer control inside Tab control.
- `#232104` - Cleared the warnings in css files.
- `#238761` - Height of the PDF Viewer control is now maintained properly when using inside the tab control.

## 17.2.28-beta (2019-06-27)

### PDF Viewer

#### Breaking Changes

- The following event arguments are renamed.

| Existing Event Arguments Name| New Event Arguments Name |
|------|-------------|
|IUnloadEventArgs|UnloadEventArgs|
|ILoadEventArgs|LoadEventArgs|
|ILoadFailedEventArgs|LoadFailedEventArgs|
|IAjaxRequestFailureEventArgs|AjaxRequestFailureEventArgs|
|IPageChangeEventArgs|PageChangeEventArgs|
|IPageClickEventArgs|PageClickEventArgs|
|IZoomChangeEventArgs|ZoomChangeEventArgs|
|IHyperlinkClickEventArgs |HyperlinkClickEventArgs |
|IAnnotationAddEventArgs|AnnotationAddEventArgs|
|IAnnotationRemoveEventArgs|AnnotationRemoveEventArgs|
|IAnnotationPropertiesChangeEventArgs|AnnotationPropertiesChangeEventArgs|

#### New Features

- `#208298`, `#223253`, `#224643`, `#233655`, `#238694` - Provided the supports for shape annotations.
- `#219446`, `#224643`, `#230115`, `#233032`, `#F144297`, `#236825`, `#238694` - Provided the supports for stamp annotations.
- `#229426` - Provided the supports for calibrate annotations.
- `#223253`, `#238694` - Provided the supports for sticky notes annotations.

#### Bug Fixes

- `#233161` – Now, loading Indicator will be shown properly while loading a large page size document.
- `#233035` - HyperlinkClick event is now triggered properly.
- `#234364` - Pan interaction mode is now working properly when the toolbar is disabled.
- `#231436` - PDF document is now rendered properly while using the PDF Viewer control inside Tab control.
- `#232104` - Cleared the warnings in css files.

## 17.1.47 (2019-05-14)

### PDF Viewer

#### New Features

- Provided the supports for adding custom header to the AJAX requests in the PDF viewer control.

## 17.1.44 (2019-05-07)

### PDF Viewer

#### New Features

- Provided the supports for adding custom header to the AJAX requests in the PDF viewer control.

## 17.1.43 (2019-04-30)

### PDF Viewer

#### Bug Fixes

- The Loading Indicator is now shown properly while loading a large page size document.
- The pan interaction mode is now working properly when the toolbar is disabled.

## 17.1.42 (2019-04-23)

### PDF Viewer

#### Bug Fixes

- The issue "the hyperlinkClick event is not triggered for web links" has been fixed.

## 17.1.41 (2019-04-16)

### PDF Viewer

#### Bug Fixes

- The font size is missing warning will no longer be thrown from styles in the PDF Viewer.

## 17.1.40 (2019-04-09)

### PDF Viewer

#### Bug Fixes

- The PDF document is now rendered properly while using the PDF Viewer inside the Tab control.
- The font size is missing warning will no longer be thrown from styles in the PDF Viewer.

## 17.1.38 (2019-03-29)

### PDF Viewer

#### New Features

- Text Markup annotation support has been provided to PDF Viewer.
- Mobile view responsiveness support has been provided.
- Right-to-left support has been provided.
- Accessibility support has been provided to PDF Viewer.

#### Bug Fixes

- The issue “Added PDF document cache element did not maintain properly” has been fixed.
- The issue “PdfRenderer object is not disposing properly in EJ2 PDF Viewer library” has been fixed.
- The issue “PDF Viewer clears all the session storage” has been fixed.
- Resolved the script error while accessing invalid link annotation destination.
- Resolved Single Page Document Rendering issue.
- Document Load event not triggered for lower zoom value issue has been fixed.

## 17.1.32-beta (2019-03-13)

### PDF Viewer

#### Bug Fixes

- The PDF document is now rendered properly while using the PDF Viewer inside the Tab control.
- The font size is missing warning will no longer be thrown from styles in the PDF Viewer.

## 17.1.38 (2019-03-29)

### PDF Viewer

#### New Features

- Text Markup annotation support has been provided to PDF Viewer.
- Mobile view responsiveness support has been provided.
- Right-to-left support has been provided.
- Accessibility support has been provided to PDF Viewer.

#### Bug Fixes

- The issue “Added PDF document cache element did not maintain properly” has been fixed.
- The issue “PdfRenderer object is not disposing properly in EJ2 PDF Viewer library” has been fixed.
- The issue “PDF Viewer clears all the session storage” has been fixed.
- Resolved the script error while accessing invalid link annotation destination.
- Resolved Single Page Document Rendering issue.
- Document Load event not triggered for lower zoom value issue has been fixed.

## 17.1.32-beta (2019-03-13)

### PDF Viewer

#### New Features

- Text Markup annotation support has been provided to PDF Viewer.
- Mobile view responsiveness support has been provided.
- Right-to-left support has been provided.
- Accessibility support has been provided to PDF Viewer.

#### Bug Fixes

- The issue “Added PDF document cache element did not maintain properly” has been fixed.
- The issue “PdfRenderer object is not disposing properly in EJ2 PDF Viewer library” has been fixed.
- The issue “PDF Viewer clears all the session storage” has been fixed.
- Resolved the script error while accessing invalid link annotation destination.
- Resolved Single Page Document Rendering issue.
- Document Load event not triggered for lower zoom value issue has been fixed.

## 16.4.55 (2019-02-27)

### PDF Viewer

#### Bug Fixes

- Document Load event not triggered for lower zoom value issue was fixed.

## 16.4.52 (2019-02-05)

### PDF Viewer

#### Bug Fixes

- Resolved PDF Viewer Session Storage Clear Issue.
- Resolved single Page Document Rendering Issue.
- Resolved the script error while accessing invalid link annotation destination.
- The scrolling when the toolbar is clicked is prevented

## 16.4.48 (2019-01-22)

### PDF Viewer

#### Bug Fixes

- Resolved PDF Viewer Session Storage Clear Issue.
- Resolved single Page Document Rendering Issue.

## 16.4.46 (2019-01-08)

### PDF Viewer

#### Bug Fixes

- Resolved the script error while accessing invalid link annotation destination.

## 16.4.44 (2018-12-24)

### PDF Viewer

#### Bug Fixes

- The scrolling when the toolbar is clicked is prevented

## 16.4.40-beta (2018-12-10)

### PDF Viewer

The PDF Viewer component enables you to view and print the PDF files.

- Both normal and PDF files protected with AES and RC4 encryption can be opened and displayed.
- Core interactions are included: scrolling, zooming, panning, and page navigation.
- Built-in toolbar.
- Text can be selected and copied from PDF files.
- Text can be easily searched for across the PDF document.
- Easy navigation with the help of bookmarks, thumbnails, hyperlinks, and a table of contents.
- Two view modes are included: fit-to-page and fit-to-width.
- An entire document or a specific page can be printed directly from the browser.
