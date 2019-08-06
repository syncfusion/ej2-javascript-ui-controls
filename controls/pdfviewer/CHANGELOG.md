# Changelog

## [Unreleased]

## 17.2.40 (2019-08-06)

### PDF Viewer

#### New Features

- #242329 - Provided the support to customize scale ratio value of measurement annotation.
- #241886 - Provided the support to display context menu in mouse up action.

#### Bug Fixes

- #242495, 243160 – Hyperlink element is now rendered properly for the rotated page document.
- #238064 – Searched target text is now highlighted properly for the provided document.
- #241904, 241294 – Converted PDF document is now rendered properly in IE browser.
- #242282 – Text search is now working properly while using PDF Viewer control inside the Tab control.

## 17.2.39 (2019-07-30)

### PDF Viewer

#### New Features

- #240440 - More details have been provided in the ajaxRequestfailure event.
- #242375 – Now, the annotation edit toolbar is enabled by default using the enableAnnotationToolbar property.
- #241715 - Support has been provided to render the annotation modified date and time in the comment panel.

#### Bug Fixes

- #242803 - The request handling has been optimized for retrieving the comments details from the PDF document.

## 17.2.36 (2019-07-24)

### PDF Viewer

#### New Features

- Provided the API to modify the scale ratio to change the quality of the pages rendered in the PDF Viewer.

## 17.2.35 (2019-07-17)

### PDF Viewer

#### Bug Fixes

- #229426 - Provided the API to select, edit, and delete the annotations.

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

- #208298, #223253, #224643, #233655, #238694 - Provided the supports for shape annotations.
- #219446, #224643, #230115, #233032, #F144297, #236825, #238694 - Provided the supports for stamp annotations.
- #229426 - Provided the supports for calibrate annotations.
- #223253, #238694 - Provided the supports for sticky notes annotations.
- #238812 – Provided support to restrict the hyperlink navigation.
- #236995 – Provided support to restrict the pinch zooming using the ‘enablePinchZoom’ property.

#### Bug Fixes

- #233161 – Now, loading Indicator will be shown properly while loading a large page size document.
- #233035 - HyperlinkClick event is now triggered properly.
- #234364 - Pan interaction mode is now working properly when the toolbar is disabled.
- #231436 - PDF document is now rendered properly while using the PDF Viewer control inside Tab control.
- #232104 - Cleared the warnings in css files.
- #238761 - Height of the PDF Viewer control is now maintained properly when using inside the tab control.

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

- #208298, #223253, #224643, #233655, #238694 - Provided the supports for shape annotations.
- #219446, #224643, #230115, #233032, #F144297, #236825, #238694 - Provided the supports for stamp annotations.
- #229426 - Provided the supports for calibrate annotations.
- #223253, #238694 - Provided the supports for sticky notes annotations.

#### Bug Fixes

- #233161 – Now, loading Indicator will be shown properly while loading a large page size document.
- #233035 - HyperlinkClick event is now triggered properly.
- #234364 - Pan interaction mode is now working properly when the toolbar is disabled.
- #231436 - PDF document is now rendered properly while using the PDF Viewer control inside Tab control.
- #232104 - Cleared the warnings in css files.

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
