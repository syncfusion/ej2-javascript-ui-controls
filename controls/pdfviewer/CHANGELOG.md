# Changelog

## [Unreleased]

## 19.4.55 (2022-03-08)

### PDF Viewer

#### Bug Fixes

- `#SF-362122` - Now, the shape annotation bounds are updated properly in the `annotationResize` event.
- `#SF-361850` - Now, the annotation toolbar icons are aligned correctly after resizing.
- `#SF-363301` - The script error is no longer thrown while hovering the toolbar icons without using the `showTooltip` property.
- `#SF-362647` - Now, the signature, and initial fields are unable to edit in the read-only mode.
- `#SF-361801` - Script error is no longer thrown while destroying the viewer control in the IE browser.
- `#SF-363899` - Now, the `annotationUnSelect` event triggers for custom stamp annotations.
- `#SF-363936` - Now, the signature panel will not be opened on right-click of signature fields.
- `#F168155` - The downloaded document displays Czech characters.

## 19.4.52 (2022-02-15)

### PDF Viewer

#### Bug Fixes

- `#SF-361967`- Copy and paste is now working properly for the signature field when it is added at the bottom of the page.
- `#SF- 361906`- The text position for the provided PDF document is now correct.
- `#SF-361379`- While importing the annotations, the FontColor and FillColor properties are now updated properly.
- `#SF-360076`- In the signature field, the drawn signature is not stretched now.
- `#SF-364148`, `#F172304`- The Script error will no longer be thrown in the mobile view while destroying the PDF Viewer.
- `#SF-362874`- The form field names are now added properly to the form fields.
- `#SF-365411`, `#SF-360719`- The annotations are now properly added to the pages when enableDesktopMode is true on mobile devices.

## 19.4.50 (2022-02-08)

### PDF Viewer

#### Bug Fixes

- `#SF-360337`- Exception is thrown while downloading the empty list box field is now resolved.
- `#SF-360635`,`#SF-361422`,`#SF-361359`- Now, the form field is hidden properly when setting the visible property to hidden.
- `#SF-358375`- Now, the PDF document loaded properly in the PDF Viewer when you set the size limit for the memory cache.
- `#SF-359388`- Now, the form fields position is correct for a rotated PDF document.
- `#SF-354638`- Now, the free text annotation is not hidden when clicking outside of the free text annotation.
- `#SF-360405`- Now, the Free text annotations and ink annotations are rendered properly in the lower zoom factors.
- `#F171647`- Now, the annotationAdd event is triggered after adding the sticky notes annotation in the annotation collection.
- `#SF-361639`- The Script error will no longer be thrown when loading the form-fields document without injecting the form field module.
- `#SF-362311`- Now, the Move cursor is not showing above the custom stamp while the custom stamp annotation is selected.
- `#SF-359233`- The hidden issue of free text characters is now resolved.
- `#SF-363626`- The Script error will no longer be thrown while loading a PDF document when the enableHyperlink is set to false.
- `#SF-363055`- Now, the free text becomes edited properly while clicking the selector.
- `#SF-363411`- Now, the free text position on a downloaded document is accurate on the Chrome browser.

## 19.4.43 (2022-01-18)

### PDF Viewer

#### Bug Fixes

`#SF-359772`,`#SF-359880`- Now, the form fields are editable on the mobile device.
`#SF-359042`- Free text annotations are downloaded properly without hiding any last character.
`#SF-358308`- Spinners are hidden properly while removing the display as none for the spinner.
`#SF-360035`- The Script error will no longer be thrown while using the editAnnotation method in mobile mode.
`#SF-358584`- Stamps are saved properly in the rotated PDF document.

## 19.4.42 (2022-01-11)

### PDF Viewer

#### Bug Fixes

- `#SF-358006`- Overlapped stamp annotations are now placed at the exact position in the saved PDF document.
- `#SF-357273`- Exception thrown while loading the provided PDF document due to an invalid key, is now resolved.
- `#SF-357655`- The PDF pages are now exported to image in a multi-threaded environment.
- `#SF-357060`- Now, the typed handwritten signature content does not exceed the text area.

## 19.4.41 (2022-01-04)

### PDF Viewer

#### Bug Fixes

- `#SF-357108` - Now, the annotations are displayed properly for the rotated documents.
- `#SF-357489` - Now, the unnecessary thumbnail requests are restricted.

## 19.4.40 (2021-12-28)

### PDF Viewer

#### Bug Fixes

- `#299110`, `#348963` - Now, the font size is updated properly while export and import shape annotations.

## 19.4.38 (2021-12-17)

### PDF Viewer

#### New Features

- `#354638` - Provided auto fit support to the free text annotations.

#### Bug Fixes

- `346343`- Now, the text wraps based on the word length regardless of character length in free-text annotation.

## 19.3.56 (2021-12-02)

### PDF Viewer

#### New Features

- `#336589`, `#339329`, `#346113` - Provided annotation toolbar settings support in mobile view.

#### Bug Fixes

- `#347402`, `#347555`- Now, the signature dialog is opened correctly on clicking the signature field in Firefox and Safari browser.
- `#344549`- The ink annotations are preserved correctly in the Adobe.
- `#346607`- Now, the signature dialog width is proper on resizing the browser window.
- `#345897`- The ink annotations are now drawn over the free-text annotations when the 'allowEditTextOnly' property is enabled.
- `#347427`- The form designer tooltip is now hidden when the 'showToolTip' property is set to FALSE.
- `#348023`- The 'isReadOnly' property is now updated correctly once we set the value to TRUE.
- `#345130`- Now, the exact shape of the image is maintained when added to the signature field.
- `#347558`- Now, the custom stamp position is added properly in mobile view.

## 19.3.54 (2021-11-17)

- `#346152`- The script error will not be thrown for the document which contains link annotation.

## 19.3.48 (2021-11-02)

### PDF Viewer

#### Bug Fixes

- `#344888`, `#F169870` - Now, signature dialog settings is working properly for the handwritten signature dialog.
- `#346090`- Now, the primary toolbar should not hide if form designer toolbar is visible.
- `#344897`, `#345574` - Now, the indicator text and required properties for signature fields settings are working properly.
- `#344082`- Now, signature text annotation is rendered properly on loading the document.

## 19.3.47 (2021-10-26)

### PDF Viewer

#### Bug Fixes

- `#344034` - The Script error will no longer be thrown if we select text markup annotation when text selection is disabled.

## 19.3.46 (2021-10-19)

### PDF Viewer

#### Bug Fixes

- `#339329`, `#341199` - Now, the default context menu of browser will no longer be shown on selecting the text in mobile view.

## 19.3.45 (2021-10-12)

### PDF Viewer

#### Bug Fixes

- `#F169102` - Now, the download action is working properly after importing the provided customer document.
- `#342951` - Now, the Bookmark navigation is working properly in mobile mode.
- `#343011` - Now, the download action is working properly after adding the text markup annotation.

## 19.3.44 (2021-10-05)

### PDF Viewer

#### Bug Fixes

- `#297147`, `#339056` - Now, the free text annotations with 90 and 270 rotated angle are rotated properly.
- `#341677` - Now, the opacity is applied properly for the custom stamps.
- `#341074` - Now, the search icon is visible to close the search dialog.

## 19.1.67 (2021-06-08)

### PDF Viewer

#### Bug Fixes

- `#328989` - Now, the clear and create button in the signature panel is enabled only on drawing the signature.
- `#328499` - Now, the stamp annotations are downloaded correctly in the PDF document.

## 19.1.66 (2021-06-01)

### PDF Viewer

#### Bug Fixes

- `#328030` - The dynamic stamp annotation size is maintained properly while importing and exporting the stamp annotation in XFDF format.

## 19.1.65 (2021-05-25)

### PDF Viewer

#### New Features

- `#326021` - hyperlinkClick event must be handled to cancel the navigation or change the URL.

## 19.1.64 (2021-05-19)

### PDF Viewer

#### Bug Fixes

- `#328989` - Now, the clear and create button in the signature panel is enabled only on drawing the signature.
- `#328499` - Now, the stamp annotations are downloaded correctly in the PDF document.

## 19.1.66 (2021-06-01)

### PDF Viewer

#### Bug Fixes

- `#328030` - The dynamic stamp annotation size is maintained properly while importing and exporting the stamp annotation in XFDF format.

## 19.1.65 (2021-05-25)

### PDF Viewer

#### New Features

- `#326021` - hyperlinkClick event must be handled to cancel the navigation or change the URL.

## 19.1.64 (2021-05-19)

### PDF Viewer

#### Bug Fixes

- `#325096` - The Script error will no longer be thrown if we add form fields value by code behind.
- `#326083` - Now, the signature is appeared inside of the Signature Field in the PDF Viewer.
- `#326054` - The Script error will no longer be thrown while clicking the provided document hyperlink content.
- `#324660` - Now, the distance annotation can be added after deleting the incompletely drawn distance annotation.

## 19.1.59 (2021-05-04)

### PDF Viewer

#### Bug Fixes

- `#322039` - The Arrow icon is shown properly in the custom stamp dropdown.

## 19.1.58 (2021-04-27)

### PDF Viewer

#### Bug Fixes

- `#322799` - The imported stamp annotation position is updated correctly in the MVC platform.

## 19.1.57 (2021-04-20)

### PDF Viewer

#### Bug Fixes

- `#317344` - The Script error will no longer be thrown if we add the custom stamp image more than 4MB size.

## 19.1.56 (2021-04-13)

### PDF Viewer

#### Bug Fixes

- `#315264` - Now, the User names in comments are working properly.

## 19.1.54 (2021-03-30)

### PDF Viewer

#### New Features

- `#F158073`, `#291648` - Exposed the annotation UnSelect event in PDF Viewer.

## 18.2.56 (2020-09-01)

### PDF Viewer

#### New Features

- `#289233` - Provided the support to add expiration timing for cache.

#### Bug Fixes

- `#289417` - Now, the annotation toolbar position is maintained correctly.

## 18.2.47 (2020-07-28)

### PDF Viewer

#### New Features

- `#267670` - Exposed the toolbar option to retrieve the form field data in JSON format.

#### Bug Fixes

- `#282486` - Now, undo and redo is working properly for the freetext annotations.
- `#F155593`- Exception will no longer be thrown while exporting the formfields.

## 18.2.46 (2020-07-21)

### PDF Viewer

#### Bug Fixes

- `#282530` - The Script error will no longer be thrown if we select the handwritten signature in mobile devices.

## 18.2.45 (2020-07-14)

### PDF Viewer

#### New Features

- `#281898` - Provided the support to add comments programmatically for the newly added annotations.

#### Bug Fixes

- `#F155593`, `#283379` - Now, PDF Viewer control is working in IE.

## 18.2.44 (2020-07-07)

### PDF Viewer

#### Bug Fixes

- `#273237` - Now, Annotation comments are locked properly when locked the annotations.

## 18.1.55 (2020-06-02)

### PDF Viewer

#### New Features

- `#F154248` - Provided the Support to show/hide the annotation toolbar in code behind.
- `#F153946` - Provided the Options to disable AutoComplete options in form filling documents.
- `#273237` - Provided the Support to lock the text markup annotations.
- `#277143` - Provided the support for ink annotation.

## 18.1.54 (2020-05-26)

### PDF Viewer

#### New Features

- `#254075` , `#266559` - Provided the support  to render the hyperlinks which are preserved as plain text

#### Bug Fixes

- `#274036` - Now, the page does not gets refreshed on clicking the import annotation button
- `#267062` - Size of the Stamp is rendered correctly after saving and loading the file in PDF Viewer.
- `#268505` - Download is working correctly For French Culture Environment.
- `#F153465` - Digital Signature in the exported image is preserved correctly.
- `#F153465` - Style of the form fields are preserved properly in PDF Viewer.
- `#274694` -Text highlight is working properly.
- `#276547` -Text selection is working properly for lower zoom factor.

## 18.1.48 (2020-05-05)

### PDF Viewer

#### New Features

- `#272985` - Provided the support to edit the annotation properties without selecting the annotation.

## 18.1.45 (2020-04-21)

### PDF Viewer

#### New Features

- `#267283` - Provided the support to identify the imported annotation and drawn annotation
- `#268736` - Exposed the text search events in PDF Viewer.
- `#258786` - Exposed the signature Select event in PDF Viewer.

#### Bug Fixes

- `#272053` - The annotation bounds value is now preserved properly in annotation events.
- `#269001` - Improved the page rendering behaviour in PDF Viewer.

## 18.1.44 (2020-04-14)

### PDF Viewer

#### New Features

- `#263306` - Provided the support for Meter Calibration ratio in PDF Viewer.
- `#271053` - Provided the support to enable and disable the multiline annotations in overlapping collections.

#### Bug Fixes

- `#271180` - Free Text Annotation and annotation label text position updated properly in downloaded rotational documents.
- `#F153036` - Now, Annotation toolbar separator shown properly when hiding some annotation toolbar items.

## 18.1.43 (2020-04-07)

### PDF Viewer

#### New Features

- `#267524` - Provided the support for feet inch Calibration ratio in PDF Viewer.
- `#269003` - Exposed the non filled form fields value in the fireValidatedFailed event arguments.
- `#268276` - Provided the support to customize the annotation resize  cursor type in PDF Viewer.
- `#268715` - Exposed the 'Not Approved' stamp annotation under dynamic stamp type.

#### Bug Fixes

- `#271163` - Errors will no longer occur when the print module in disabled state.
- `#268829` - Now, the deleted annotations are removed properly from the PDF document.

## 18.1.42 (2020-04-01)

### PDF Viewer

#### New Features

- `#268975` - Exposed the event for notifying page mouse over action.
- `#264529` - Exposed the volume calibrate annotation depth value in annotationSelect event arguments and provide options to edit the depth value.
- `#263297`, `#268677` - Provided the options to enable and disable the tile rendering mode.
- `#263473` - Provided the isLock options to  individual annotation object level.

#### Bug Fixes

- `#269004` – The typo errors in PDF Viewer JSON objects has been resolved.
- `#266218`, `#266559` - The import/export form fields are now working properly for the form fields data contains special characters.
- `#268505` - Download is now working properly for different culture settings.
- `#268109` - The updated label content is now preserved properly in the exported annotation data.

## 18.1.36-beta (2020-03-19)

### PDF Viewer

#### New Features

- `#235592` - Provided the support for setting the lower zoomfactor value to the PDF Viewer control.
- `#259521` - Provided the support for importing the form fields data from JSON object.
- `#261558` - Provided the support for customizing the distance measurement annotation leader length property.
- `#256687` - Provided the support for setting the custom data for annotation objects.
- `#252340` - Provided the support for setting the minimum or maximum size and isLock properties at individual annotation level.
- `#262008` - Exposed the event for notifying annotation mouse over action.
- `#F149148` - Provided the binding support for the enableFormFields property.
- `#258769` - Provided the option to suppress the error dialog in PDF Viewer.
- `#261269` - Provided the support to allow credential for XMLHttpRequest in PDF Viewer.
- `#262787` - Exposed the event to notify the getPDFDocumentTexts method completed for all the pages.

#### Bug Fixes

- `#262525` – The render PDF pages method triggers properly for the provided PDF document.
- `#262692` - The text markup resizer position is now updated properly for the provided document.
- `#262692` - The text content bounds are now rendered properly for the provided document.

## 17.4.50 (2020-02-18)

### PDF Viewer

#### New Features

- `#262787` - Exposed the event to notify the getPDFDocumentTexts method completed for all the pages.

## 17.4.49 (2020-02-11)

### PDF Viewer

#### New Features

- `#235592` - Provided the support for setting the lower zoomfactor value to the PDF Viewer control.
- `#259521` - Provided the support for importing the form fields data from JSON object.
- `#261558` - Provided the support for customizing the distance measurement annotation leader length property.
- `#256687` - Provided the support for setting the custom data for annotation objects.
- `#252340` - Provided the support for setting the minimum or maximum size and isLock properties at individual annotation level.
- `#262008` - Exposed the event for notifying annotation mouse over action.
- `#F149148` - Provided the binding support for the enableFormFields property.

#### Bug Fixes

- `#262525` – The render PDF pages method triggers properly for the provided PDF document.
- `#262692` - The text markup resizer position is now updated properly for the provided document.
- `#262692` - The text content bounds are now rendered properly for the provided document.

### PDF Viewer

#### New Features

- `258769` - Provided the option to suppress the error dialog in PDF Viewer.
- `261269` - Provided the support to allow credential for XMLHttpRequest in PDF Viewer.

## 17.4.46 (2020-01-30)

### PDF Viewer

#### New Features

- `258172` - Provided the support to open the command panel while loading the PDF document if the isCommandPanelOpen property is set to true.
- `259159` - Provided the support to open the thumbnail view panel while loading the PDF document if the isThumbnailViewOpen property is set to true.
- `259961` - Exposed the annotation label settings value in the annotationAdd event arguments.
- `259615` - Exposed the annotation label settings value in import/export JSON data.
- `256596` - Exposed the annotation selector settings value for individual annotation objects and import/export JSON data.

## 17.4.44 (2021-01-21)

### PDF Viewer

#### New Features

- `#257519` - Provided Support to edit the free Text annotation value in code behind.

#### Bug Fixes

- `#259848` – Now, the deleted annotations are removed properly from the PDF document.
- `#259734` - Custom Stamp annotations are drawn properly while importing the annotations.
- `#260512` - Errors will no longer occur while importing the annotations in the documentLoad event.
- `#260575` - The download file name is now set properly if we provide during the control initialization.

## 17.4.43 (2020-01-14)

### PDF Viewer

#### New Features

- `#255057` – Provided the support for validating the form fields value whether it is filled or not in the loaded PDF document.
- `#258786`, `#259327` – Provided the support for exporting and importing the handwritten signature.

#### Bug Fixes

- `#149882` – The downloadEnd event triggers properly if we save the document in server side.
- `#257630` – The importSuccess event triggers properly if we save the document in server side.
- `#260295` – The distance calibrate annotation now resized properly.
- `#260128` – The volume and area calibrate annotation fill color is updated correctly on importing the annotations.

## 17.4.41 (2020-01-07)

### PDF Viewer

#### New Features

- `#257514` – Provided the support for import/export the custom stamp annotations.
- `#257231` – Exposed the property to access the search count value.
- `#258386` – Exposed the API to retrieve the text content and bounds along with page size details.

#### Bug Fixes

- `#259524` – Annotations are rendered properly in the large page size document if the page rendered in fitToPage mode initially.
- `#259523` – Errors will no longer occur while exporting the annotation if the document contains text web link annotation.
- `#259134` – The annotationSelect event now triggers properly if we add the multiple annotations to a page.
- `#258949` – The opacity value is now applied properly if set it on annotation during initialization.
- `#259383` – The errors will no longer occur if we import the annotations after deleting the added annotations.
-`#259166` – The text content will be selected properly at the end of the page.
- `#259078` – The annotations will now be created if we resize the annotation through multipage.
- `#259564` – The Null reference error will no longer occur while loading the provided PDF document.

## 17.4.40 (2019-12-24)

### PDF Viewer

#### New Features

- `#256131` – Improved the rendering quality and performance for the large size PDF document.

#### Bug Fixes

- `#258250` – The imported annotations are rendered properly if we import the annotation details in the documentLoad event.

## 17.4.39 (2019-12-17)

### PDF Viewer

#### New Features

- `#251150` – Provided the support to find the interlinked annotations while selecting the annotations.
- `#243077` , `#241487`, `#244802`, `#252340` – Provided the support for setting the annotation UI properties.
- `#254634` – Provided the support to maintain the aspect ratio for custom stamp annotation.
- `#253745`, `#256518` – Exposed the event to notify the annotation object being moved.
- `#254275` – Exposed the event to notify the download process in the PDF Viewer control.

#### Bug Fixes

- `#253751` – Resolved the typo error in annotation exported data.
- `#255345` – Errors will no longer occur while rendering the annotation in the Firefox browser.
- `#255137` – Errors will no longer occur in mobile view mode if we set the Pan interaction mode.
- `#253704` – The form fields are downloaded properly while loading the PDF document in tab control.
- `#253745` – The annotationAdd and annotationPropertiesChange events are triggered properly for the annotations.
- `#252881` – The toolbar settings property is working for mobile device.
- `#255042`, `#255073` – Errors will no longer occur if the session storage exceeds the maximum limit.
- `#254115`, `#254942` – The annotation modified date is preserved properly in different localization.
- `#256044` – The font family and text alignment are rendered properly from the exported FreeText annotation data.
- `#255124` – The text markup annotations are now added properly if the PDF Viewer element ID contains characters.
- `#256220` – The context menu will now be shown/hidden properly if we disable the default toolbar.
- `#256131` – The annotation toolbar will now be shown/hidden properly if we disable the annotation toolbar.
- `#256932` - Errors will no longer occur while resizing the text markup annotations.
- `#252805` – The annotationId value is now preserved properly for all annotation events.
- `#255647` - The form fields contents are rendered properly in the printed document, which has been printed in IE browser.

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
