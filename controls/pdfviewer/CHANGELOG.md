# Changelog

## [Unreleased]

## 21.1.37 (2023-03-29)

### PDF Viewer

#### Bug Fixes

- `#F180886` - Now, the `setAnnotationMode` API supports switching between annotations.
- `#I181023` - Now, the time is shown properly in the comment panel while adding the free text annotation programmatically.
- `#I180982`, `#I180983` - Now, able to post a comment with single character or pasted content.
- `#I180968` - Now, red vertical lines are not showing in the highlight annotation on viewing the downloaded document on other viewers.
- `#F180997` - Now, the free text content is updated if we directly type in the comment panel.

## 21.1.35 (2023-03-23)

### PDF Viewer

#### Bug Fixes

- `#I437765` - Now, the script error does not occur when the update form field value API is used when a signature already has signature content.
- `#F180666` - Now, the exception does not occur while downloading the document after adding the type and uploading the handwritten signature and initial annotation.
- `#I428493` - Now, the signature image in the signature field is visible while printing in the other viewers changes made on the server side.
- `#I441773` - Now, the annotation positions are moving properly.
- Now, the `PDFium` package has been updated.
- `#I438960` - Now, the different culture date time is working properly while exporting annotations.
- `#I444307` - Now, the check box is not added to the left-most corner of the page.
- `#I444707` - Now, the signature dialog box footer button alignment is proper in the fluent theme.
- `#I440251` - Now, the typed handwritten signature is not broken into a new line after downloading and viewing in other viewers.
- `#I429508` - Now, the form fields appear properly in mobile mode.
- `#I433831` - The A4 document size is now properly set during printing.
- `#F180764` - Now, if you move the arrow or line annotations programmatically, their position won't be changed during export.
- `#I429549` - Now, the checkbox displays properly during the print preview.
- `#I436286` - Now that the enable shape annotation is false, the script error no longer occurs.
- `#I429775` - Now, the problem with some specific document's slow rendering has been resolved.
- `#I437396` - Now, when the page's zoom level is higher, the resizer will not enable inside the annotation.
- `#I435370` - Now, the border color is preserved properly for the transparent textbox field.
- `#I438421` - Now, the script error does not occur while loading an annotation restricted document when the `enableAnnotation` API is set to false.
- `#F180082` - Now, while adding the text markup annotation programmatically, the text markup content is added properly.
- `#I434198` - Now, the custom stamp is added properly on the form fields.
- `#I180081` - Now, when attempting to delete a post in the comment panel, the annotations are not deleted from the comment panel.
- `#I431466` - Now, the toolbar behavior is stable in mobile mode.
- `#I432820`, `#I432145`, `#F179720` - Now, the formFields with the same name in non-rendered pages are downloaded successfully.
- `#I429549` - Now, the checkboxes are no longer offset to the right in the print preview.
- `#I429288` - Now, the delete option for a draw signature type will be visible in the context menu.
- `#I431758` - Now, the checkboxes with the same name are correctly selected.
- `#I429416` - The checkbox layer is now rendered properly when loading the provided PDF document.
- `#I431679` - Now, the handwritten signature does not become empty when a random signature is added.
- `#I431466` - Now, the toolbar icon is properly visible in mobile mode.
- `#I431286` - Now, the radio button selector size is proper in the given document.
- `#I408530`, `#I428623` - Now, the free text annotations do not shift towards the left side in edit mode.

#### New Features

- `#I344527` - Now, the support provided is navigated to the next and previous signature field in the form designer.
- `#I443775` - Now, support is provided for the saving type and image signatures in the form fields.
- Now, the JSON structure has been modified based on the PDF library.
- `#I411856` - Now, support is provided to render the accessibility tags in the PDF Viewer.
- `#I426307` - Improvements to page rendering for zoom levels under 25% by using thumbnail images.
- Now, support is provided for the tab navigation in the form fields and form designer.

## 20.4.54 (2023-03-14)

### PDF Viewer

#### Bug Fixes

- `#I438960` - Now, different culture date time is working properly while exporting annotations.
- `#I444307` - Now, the check box is not added to the left-most corner of the page.
- `#I444707` - Now, signature dialog box footer button alignment is proper in fluent theme.
- `#I440251` - Now, typed handwritten signature is not broken into a new line after downloading and viewing in other viewers.

## 20.4.53 (2023-03-07)

### PDF Viewer

#### Bug Fixes

- `#I429508` - Now, the form fields appears properly in mobile mode.
- `#I433831` - The A4 documents size is now properly set during printing.
- `#F180764` - Now, if we move arrow/line annotations programmatically, their position won't be changed during export.
- `#I429549` - Now, the checkbox displays properly during the print preview.

## 20.4.52 (2023-02-28)

### PDF Viewer

#### Bug Fixes

- `#I436286` - Now, the script error is not occurred the enable shape annotation is set to false.
- `#I429775` - Now that the problem with some specific document's slow rendering has been resolved.
- `#I437396` - Now, when the page's zoom level is higher, the resizer will not enable inside annotation.

## 20.4.51 (2023-02-21)

### PDF Viewer

#### Bug Fixes

- `#I435370` - Now, the border color is preserved properly for transparent textbox field.
- `#I438421` - Now, the script error is not occurred while loading an annotation restricted document when `enableAnnotation` API is set as false.
- `#F180082` - Now, while adding the text markup annotation programmatically, the text markup content is added properly.

## 20.4.50 (2023-02-14)

### PDF Viewer

#### Bug Fixes

- `#I434198` - Now, the custom stamp is added properly on form fields.
- `#I180081` - Now, when attempting to delete a post in the comment panel, annotations are not deleted from the comment panel.
- `#I431466` - Now, the toolbar behavior is stable in mobile mode.
- `#I432820`, `#I432145`, `#F179720` - Now, formFields with same name present in non-rendered pages are download successfully.

## 20.4.49 (2023-02-07)

### PDF Viewer

#### New Features

- `#I426307` - Improvements to page rendering for zoom levels under 25% by using thumbnail images.
- Now, support provided for tab navigation in form fields and form designer.

#### Bug Fixes

- `#I429549` - Now, the check boxes are no longer offset to the right in the print preview.
- `#I429288` - Now, the deletion option for a draw signature type will visible in the context menu.
- `#I431758` - Now, the checkboxes with the same name are correctly selected.
- `#I429416` - Checkbox layer is now rendered properly when loading the provided PDF document.
- `#I431679` - Now, the handwritten signature does not now become empty when a random signature is added.
- `#I431466` - Now, the toolbar icon is properly visible in mobile mode.
- `#I431286` - Now, the radio button selector size is proper in the given document.
- `#I408530`,`#I428623` - Now, free text annotations does not shifted towards left side in edit mode.

## 20.4.48 (2023-02-01)

### PDF Viewer

#### Bug Fixes

- `#I425450` - Now, when exporting as XFDF, the border no longer displays on a free text annotation.
- `#F179811` - Now, the `AnnotationResize` event is triggered properly for the Line and Arrow annotation.
- `#I426541` - Now, the signature renders successfully even if the document contains an invalid signature field name.
- `#F179704` - If the `enableMeasureAnnotation` is set to false, the Annotation events for shape annotations are now properly triggered.
- `#I426591` - Now, the focus form field functions after programmatically updating the signature field.
- `#I427179` - Now, the blank pages print on the iPad printing issue has been fixed.
- `#I427451` - Now, the script error does not occur while changing the dropdown value.
- `#I427404` - Now, the signature field indicator sizes have been adjusted in consistent with the signature fields.
- `#I422857` - Now, the problem with the signature value disappearing from the collection while scrolling has been fixed.
- `#I411856` - Fixed the accessibility issues with the PDF Viewer component.
- `#I423893` - Now, the script error does not occur while double-clicking on the free text annotation.
- `#I427362` - Now, the checkbox background color is properly updated while rendering using the form field module.
- `#I427364` - Now, the button images are rendered properly while scrolling the document.
- `#I421445` - Now, the multiple Font-styles(bold, italic, underline, and strikeout) can be applied together for the textbox fields.
- `#I426174` - Now, the form fields that have been selected programmatically can be deleted by using the delete key.
- `#I422813` - Now, the value in the free text annotation will be updated properly in the mobile environment.
- `#I420988` - Now, the annotations are not deleted while dragging, resizing, or deleting the form fields.
- `#I422542` - Now, the `strikethrough` can now be added to the free text annotations programmatically.
- `#I424231` - Now, the issue with the document's signature disappearing has been fixed.

#### Features

- `#I424468` - Provided support for rendering the existing comb-type textbox in the form designer module.

## 20.4.44 (2023-01-18)

### PDF Viewer

#### Bug Fixes

- `#I426541` - Now, the signature renders successfully even if the document contains an invalid signature field name.
- `#F179704` - If `enableMeasureAnnotation` is set to false, the Annotation events for shape annotations are now properly triggered.
- `#I426591` -  After programmatically updating the signature field, the focus form field is now functioning.
- `#I427179` - Now, blank pages prints on iPad printing issue has been fixed.
- `#I427451` - Now, script error does not occurs while changing the dropdown value.
- `#I427404` - Now, the signature field indicator sizes have been adjusted in consistent with the signature fields.

## 20.4.42 (2023-01-04)

### PDF Viewer

#### Bug Fixes

- `#I422857` - Now, the problem with the signature value disappearing from the collection while scrolling has been fixed.
- `#I411856` - Fixed the accessibility issues with the PDF Viewer component.
- `#I423893` - Now, script error not occurs while double clicking on free text annotation.
- `#I427362` - Now, the checkbox background color is properly updated while rendering using form field module.
- `#I427364` - Now, the button images are rendered properly while scrolling the document.
- `#I421445` - Now, the multiple Font-styles(bold, italic, underline and strikeout) can be applied together for textbox fields.
- `#I426174` - Now, the form fields that have been selected programmatically can be deleted by using the delete key.
- `#I422813` - Now, value in the free text annotation will be updated properly in mobile environment.

#### New Features

- `#I424468` - Provided support for rendering the existing comb type textbox in form designer module.

## 20.4.40 (2022-12-28)

### PDF Viewer

#### Bug Fixes

- `#I420988` - Now, the annotations are not delete while drag, resize or deleting the form fields.
- `#I422542` - Now, the strike through can now be added to free text annotations programmatically.
- `#I424231` - Now, the issue with the document's signature disappearing has been fixed.

## 20.4.38 (2022-12-21)

### PDF Viewer

#### Bug Fixes

- `#F178667` - Now, the zero thickness property is applied to the form fields.
- `#I421990` - Updating read-only to false for a form field is working properly.
- `#I420531` - The free text annotations are no longer scaled on double clicks.
- `#F178453` - Cut, copy, and paste at the form fields are working properly on downloading.
- `#I419557` - The `IsPrint` property value of the text markup annotation is properly updated.
- `#I418726` - The draw and image type signatures are now preserved while changing the tabs on mobile devices.
- `#I420588` - Printing the PDF document that contains signature fields on non-rendered pages won’t throw script errors.
- `#I420304` - Programmatically updating the read only properties won’t throw script errors.
- `#I416032` - The radio button now triggers the form field click event.
- `#I420423` - The background color of the initial indicator settings can be applied programmatically while adding form fields.
- `#I422736` - Fixed issue with saving the PDF document on form fields export.
- `#I418731` - Export and import values of form fields with same name have been properly updated.
- `#I416298` - Focusing the signature and initial fields are proper on different zoom levels.
- `#I411856` - The issue with programmatically updating the initial indicator properties has been resolved.
- `#F178660` - Fixed issue with `RenderAnnotationComments` on the .NET 6.0 platform.
- `#I418199` - Programmatically updating images in the form fields won’t throw script errors.
- `#I408281` - Switching between the PDF view and the text view won’t throw script errors.
- `#I413254` - Aspect ratio is maintained for the image type signatures.
- `#F178250` - Now, the color palette is no longer obscured in the PDF Viewer.
- `#I178667` - Now, the text box's border color is properly updated and no longer hidden.
- `#I418214` - Session items of the older documents are cleared now.
- `#I178018` - Searching for a multiple-sentence phrase no longer causes the PDF Viewer to freeze.
- `#I421388` - Handwritten signatures will appear properly on loading the document again.
- `#F178018` - Now, the script issue no longer occurs when doing multiline searches in the Pdf document.

#### Features

- Form fields values can be exported to FDF and XFDF formats and the same can be imported into the PDF Viewer, programmatically.
- Digital signatures of the existing PDF documents are now rendered in the PDF Viewer.
- `#I369895`, `#I403367`, `#I406191` - Now, the text selection `strikethrough` has been improved.
- `#I419679` - Provided the support to show or hide the `FormDesignerToolbar` after document loading.
- `#I421694` - Angular applications renders PDF Viewer controls without ID properties by generating the ID internally, if not provided.
- `#I409823` - Margin can be set to the value was preserved for the free text annotation in the downloaded document.
- `#I412460` - Provided the support for retrying Ajax requests with a status code collection.

## 20.3.60 (2022-12-06)

### PDF Viewer

#### New Features

- `#I369895`,`#I403367`,`#I406191` - Now, improvements in text selection `strikethrough` for specific document.
- `#I419679` - Provided the ability to display or hide the `FormDesignerToolbar` after document loading.

#### Bug Fixes

- `#F178453` - Now, cut, copy and paste of form field are working properly on downloading.

## 20.3.59 (2022-11-29)

### PDF Viewer

#### New Features

- `#I421694` - Now, Angular applications may render PDF Viewer controls without ID properties.
- `#I409823` - Support was given for a custom margin property in the free text annotation.

#### Bug Fixes

- `#I419557` - Now, the `IsPrint` property values for text markup annotation have been properly updated.
- `#I418726` - Now, the draw and image signature is now preserved while changing tabs on mobile devices.
- `#I420588` - Now, the Script error does not occur while printing the document contains signature fields on non-rendered pages.
- `#I420304` - Now, the script error does not occur while updating read only property programmatically.
- `#I416032` - The radio button now triggers the form field click event.
- `#I420423` - Now, the background color of the initial indicator settings is now applied when adding form fields programmatically.
- `#I422736` - Fixed issue with saving PDF document on form fields export.

## 20.3.58 (2022-11-22)

### PDF Viewer

#### New Features

- `#I412460` - Now, the ability to support retrying Ajax requests with a status code collection.

#### Bug Fixes

- `#I418731` - Now, for fields with the same name, the export and import form fields' values have been properly updated.
- `#I416298` - Now, the focus for signature and initial fields are proper in different zoom levels.
- `#I411856` - The issue with programmatically updating the initial indicator properties has been resolved.
- `#F178660` - Fixed issue with `RenderAnnotationComments` on `.NET 6.0` platform.

## 20.3.57 (2022-11-15)

### PDF Viewer

#### Bug Fixes

- `#I418199` - Now, the Script error does not occur while updating the image in the form fields programmatically.
- `#I408281` - Now, the Script error does not occur while changing the PDF view to the text view in the sample.
- `#I413254` - Now, the aspect ratio value for the image type signature has been properly handled.
- `#F178250` - Now, the Color Palette is no longer obscured in the PDF Viewer.
- `#I178667` - Now, the text box's border color is now properly updated and no longer hidden.
- `#I418214` - Cleared session items for the older documents.
- `#I178018` - Now, searching for a multiple-sentence phrase no longer causes the PDF Viewer to freeze.

## 20.3.56 (2022-11-08)

### PDF Viewer

#### New Features

- `#I408588` - Touchpad pinch zooming has been implemented in Windows and Mac environments.

#### Bug Fixes

- `#I411644` - Now, Signature are added properly in the respective signature fields.
- `#I412264` - Now, Exposed the API for show and hide the digital signature form fields in the PDF Viewer.
- `#I408609` - Now, properties dialog and context menu are open on right click.
- `#I414492`,`#I414536` - Now, the Signature dialogue is vertical.
- `#I413111` - Now the Ink annotation auto-write issue is resolved.
- `#I406980` - Now, the Values of free text annotation properties are not missing on importing.
- `#I408171` - Now, Annotation added above free text annotation does not hide behind after downloading and flattening.
- `#I412525` - Now we are able to update form field values from code behind if the pages are not rendered.
- `#I408588` - Pinch zoom pivot point calculation for touch-based devices has been improved.

## 20.3.52 (2022-10-26)

### PDF Viewer

#### New Features

- `#I408588` - Mouse wheel zooming has been implemented based on cursor position. On iPad/iOS devices, the zooming issue has been fixed. and enhanced mobile device pinch zooming functionality.
- `#I409164` - Now the thickness property for signature and initial fields has been added, so now the signature field and initial field will allow changing their border thickness.

#### Bug Fixes

- `#I408281` - Now, The Script error does not occur while changing the PDF view to the text view in the sample.
- `#I412183` - Now, Vertical images are rendered properly in the signature fields.
- `#I397357` - Now, Radio buttons are rendered properly while printing the document.
- `#I411792` - Now, able to export annotation after `strikethrough`.
- `#I401159` - Now, backward text selection is working properly.

## 20.3.50 (2022-10-18)

### PDF Viewer

#### Bug Fixes

- `#I409189` - Now, no blank pages are created while printing the document.
- `#I411098` - Now, Form fields are rendered properly while printing the document.
- `#I405132` - Now, the copied text content from pdf document is contain the space lining.
- `#I409184` - Now, able to change the background color of Initial field indicator element.
- `#I409766` - Now, type signature is working properly.

## 20.3.49 (2022-10-11)

### PDF Viewer

#### Bug Fixes

- `#F177655` - Now we can select the search-highlighted text content.
- `#I408819`,`#I409541`,`#I409234` - Now, ink annotations are rendered properly while loading the document.
- `#I408950` - Now the script error does not occur when ink annotation moves out of the document.
- `#I409797` - Now, Form fields value are not missing on scrolling the pages using keyboard shortcut.
- `#I407919` - Now, Custom data property from free text annotation is updating in the imported annotation.

## 20.3.48 (2022-10-05)

### PDF Viewer

#### Bug Fixes

- `#I406164` - Now, the Ink annotations from the import JSON file present on the last page.
- `#I406143` - Now, the Page Index property is present in the form field collections while adding the form fields.
- `#I406883` - Now, the Deleted ink annotations do not exist after scrolling the document.
- `#I408609` - Now, the Keyboard shortcuts are working properly.
- `#I383963` - Now, the Form fields are allowed to rename without affecting any other field.
- `#I406552` - Now, The removal of fields from other pages is prevented while the field is programmatically focused.
- `#I406586` - Now, Ink annotation is not missing in the annotation collection.
- `#I408087` - Now, adequate space in the type signature field.
- `#I404936` - Now, Typed signature is appeared from the downloaded document.
- `#I406793` - Now, two custom stamps can't be selected at the same time.

## 20.3.47 (2022-09-29)

### PDF Viewer

#### New Features

- `#I391994` - The document download performance has improved for larger PDF files, over 5000+ pages.

#### Bug Fixes

- `#I397357` - Now, Radio button values update properly.
- `#I401805` - Now, Form fields updates proper value on download.
- `#I382837` - Now, Interaction on checkbox in mobile device is working fine.
- `#I404631` - Now, `isFormDesignerToolbarVisible=true` property opens in the Form designer toolbar.
- `#I385978` - Now, Free Text Annotations can be edited in iPhone, iPad and iPod Devices.
- `#I403614` - Now, the annotation signature key not found error is resolved in the customer document.
- `#I403632` - Now, custom stamp position is not wrong on mobile device.
- `#I404420` - Now, Selection of the closely placed Signature Field is improved in Mobile devices.
- `#I403607` - Now, the Add Signature event is triggered when adding the signature, and the Remove Signature event is triggered while removing the signature.
- `#I397357` - Now, Radio button values update properly.
- `#I401805` - Now, Form fields updates the proper value on download.
- `#I382837` - Now, the interaction on a checkbox in the mobile device is working fine.
- `#I404631` - Now, `isFormDesignerToolbarVisible=true` property opens in the Form designer toolbar.
- `#I385978` - Now, Free Text Annotations can be edited on iPhone, iPad, and iPod Devices.
- `#I403614` - Now, the annotation signature key not found error is resolved in the customer document.
- `#I403632` - Now, the custom stamp position is not wrong on the mobile device.
- `#I404420` - Now, the Selection of the closely placed Signature Field is improved in Mobile devices.
- `#I403607` - Now, the Add Signature event is triggered when adding the signature, and the Remove Signature event is triggered while removing the signature.
- `#I176922` - Now, comments are not duplicated if a shape annotation is added inside an annotation.
- `#I390997`,`#I392717`,`#I394607` - The signature is now displayed and properly positioned in change the width and height and in the read-only mode of the document that was downloaded.
- `#I398911` - Provided support for suppressing the Digital signature without affecting the download of the same.
- `#I400958` - Now, Adding a signature field programmatically and from the UI level does not have the same signature field name.
- `#I398958` - Now, the Script error does not occur while adding signature and initial fields when enabling form field is false.
- `#I397605` - Now, If a portion of the free text annotation is outside the viewer, moving or resizing it will bring that annotation inside the viewer.
- `#I392269` - Now, considered both GUID and description while importing the annotations.
- `#I398972` - Now, The Script error does not occur while saving the PDF consecutively with Calibrate perimeter control.
- `#I399220` - Now, Some form fields are not removed on reloading the downloaded document.
- `#I389566` - Now, The Script error does not occur while trying to change the PDF view to the text view in the sample.
- `#I369895` - When an image signature is added programmatically, the width is now properly maintained.
- `#I388895` - Now, stamp annotations comments display valid time in the comment panel for any culture.
- `#I391994` - Now, Programmatically able to add all form fields in read-only mode.
- `#I394117` - Now, Tapping a page with a signature field does not moves to another page on mobile devices.
- `#I395979` - Now, Deleted annotations are updated in the annotation collection properly.
- `#I369895` - Now, The selection and strike-through are now aligned properly.
- `#I389679` - Now, the form field color should not be changed on read-only mode.
- `#I383430` - Now, form fields do not generate duplicates while using CTRL c and CRTL v.
- `#I394763` - Now, form fields are not deleted while trying to delete the text with the delete key in the property dialog.
- `#I394979` - The problem with continuously and programmatically adding a signature image disappearing has been resolved.
- `#I397495` - Now, the signature and Initial field are visible in chrome downloaded in the PDF Viewer.
- `#F176687` - Now, markup text of Free Text annotation is proper for Arabic text.
- `#I386832` - Now if the `zoomMode` is set to `FitToWidth`, we can update or get the form field values properly.
- `#I394274`,`#I394827` - Now, the signature and initials are updated after the 10th page.
- `#I395889` - Now, the script error that occurs without injecting annotation has been fixed.
- `#F173061` - Now, we can able to zoom to a specific annotation if the annotation is not visible in the viewport.
- `#I396556` - Now, import and export for JSON and XFDF is the document working properly.
- `#I401240` - Now, search content text highlight is working fine.
- `#I401761`,`#I399940`,`#I405109`,`#I406172` - Now, the Page is not scrolled when deleting annotations using `deleteAnnotationById()` method.

## 20.2.49 (2022-09-13)

### PDF Viewer

#### Bug Fixes

- `#I176922` - Now, comments are not duplicated if a shape annotation is added inside an annotation.
- `#I390997`,`#I392717`,`#I394607` - The signature is now displayed and properly positioned in change the width and height the document that was downloaded.
- `#I398911` - Provided support for suppressing of the Digital signature without affecting download of the same.
- `#I400958` - Now, Adding signature field programmatically and from UI level does not have same signature field name.

## 20.2.48 (2022-09-06)

### PDF Viewer

#### Bug Fixes

- `#I398958` -  Now, Script error does not occurs while adding signature and initial fields when enable form field is false.
- `#I397605` -  Now, If a portion of the free text annotation is outside the viewer, moving or resizing it will bring that annotation inside viewer.
- `#I392269` -  Now, considered both GUID and description while importing the annotations .
- `#I398972` -  Now, The Script error is not occurred while saving the PDF consecutively with Calibrate perimeter control .
- `#I399220` -  Now, Some form fields are not removed on reloading the downloaded document .
- `#I389566` -  Now, The Script error is not occurred while try to change PDF view to text view in sample .
- `#I369895` -  When an image signature is added programmatically, the width is now properly maintained.
- `#I388895` -  Now, stamp annotations comments displays valid time in comment panel for any culture.

## 20.2.46 (2022-08-30)

### PDF Viewer

#### Bug Fixes

- `#I391994` -  Now, Programmatically able to add a all form fields in read only mode .
- `#I394117` -  Now, Tapping a page with signature field does not moves to another page on mobile devices.
- `#I395979` -  Now, Deleted annotations are updated in the annotation collection properly.
- `#I369895` -  Now, The selection and strike through is now aligned properly.

## 20.2.45 (2022-08-23)

### PDF Viewer

#### Bug Fixes

- `#I389679` -  Now ,form fields color should not be changed on read only mode.
- `#I390997`,`#I392717`,`#I394607` - The signature is now displayed and properly positioned in read only mode the document that was downloaded.
- `#I383430` -   Now , form fields does not generate duplicates while using CTRL c and CRTL v.
- `#I394763` -   Now , form fields is not deleted while trying to delete the text with delete key in property dialog.
- `#I394979` -  The problem with continuously and programmatically adding a signature image disappearing has been resolved.
- `#I397495` - Now the signature and Initial field is visible in chrome downloaded in the PDF Viewer.
- `#F176687` - Now, markup text of Free Text annotation is proper for Arabic text.
- `#I394979` -  The problem with continuously and programmatically adding a signature image disappearing has been resolved.
- `#I386832` - Now if the `zoomMode` is set to `FitToWidth`, we can update or get the form field values properly.
- `#I391994` - Now, The document download performance is improved if the PDF document contains above 1000 pages.

## 20.2.44 (2022-08-16)

### PDF Viewer

#### Bug Fixes

- `#I394274`,`#I394827` -  Now ,The signature and initial is updated after the 10th page.
- `#I395889` -  Now ,script error occurs without injecting annotation has been fixed.
- `#F173061` - Now, we can able to zoom to specific annotation if the annotation is not visible in the viewport.
- `#I396556` -  Now ,import and export for JSON and XFDF is document working properly.

## 20.2.43 (2022-08-08)

### PDF Viewer

#### Bug Fixes

- `#F176277` - Context menus will now open all the pages that are visible in the viewport.
- `#I3813` - The signature is now being downloaded without any pixel issue.
- `#I390997`,`#I392717`,`#I394607` - The signature is now displayed and properly positioned in the document that was downloaded.
- `#I383108` - Now,the custom stamp annotations are added properly in touch mode
- `#I377362` - Annotations are now placed in the correct position in the download PDF document with crop value.
- `#I383385` - The delete key can be used to remove annotations added in touch mode.
- `#I381030` - Unloading a PDF document from the first PDF Viewer component no longer affects the rendering of the PDF document in the second PDF Viewer component.
- `#I385936` - The value of the Add Signature button will not extend outside the button and missing Portuguese tooltips have been translated.
- `#I372855`, `#F173951` - An annotation can now be added and resized up to the edge of the PDF document.
- `#I380996` - The `TextSearchComplete` event will be triggered when the text is searched in the PDF viewer.
- `#I377035`,`#I379948` - A tooltip will be displayed in a form field even if the FormDesignerService is not injected.
- `#I380472` - Added form fields after pressing escape no longer shades form fields.
- `#I384112` - The `formFieldSelect` event will be triggered while selecting the first form field in the document.
- `#I386568` - In the Bootstrap5 theme, the search icon will change to a clear icon after a search has been initiated.
- `#I382999` - The type signature in the signature fields will be modified based on the height of the Signature field while resizing.
- `#I379221` - Now, cache values (PDF_CONTENT) are updated in the `getCache()` method.
- `#I385864` - Now, the dropdown values will be changed programmatically in the PDF Viewer.
- `#I386545` - Now, the signature field color will appear while scrolling down long document.
- `#I272377` - Now, the position and size of the arrow shapes in the shape annotation are same as in the downloaded document.
- `#F173953` - Now, Script error have been resolved.
- `#I378591` - The issue with the comment panel not opening after disabling and enabling again has been fixed.
- `#I386545` - Now, the signature field color will appear with opacity while scrolling down long document.
- `#I390764` - The issue of is document edited API is false while editing a document has been resolved.
- `#I388086` - The issue of replied comments merging with other annotations has been resolved.
- `#I379142`,`#I391296` - The x,y bounds of the form fields are proper while adding the form field.
- `#I386887` - The issue with radio button alignment with different zoom settings has been resolved.
- `#F175614` - For load failed and PDF file path not found errors, an error message is now displayed.
- `#I379627` - formFieldMouseover and formFieldMouseLeave is now trigger properly.
- `#I387260` - Now Signature Indicator Properties can be modified Programmatically in DOM.
- `#I384670` - Now that the type has been fixed, the signature value for the second time has been updated using form field collections.
- `#I382941`,`#I383132` - Now duplicate form fields able to select, move, delete and edit after deleting original form fields.
- `#I389566` - Now, Script Error is not occurs while try to change Pdf view to text view in sample.
- `#I376222` - Now, Annotation selector binds while dragging with right click and then clicking left click.
- `#I382568` - Now text boxes with the same name are saved and preserved after downloading and loading the document.
- `#I387261` - The signature in the signature field is not visible on Adobe Reader's print preview has been resolved.
- `#I380373` - Now the event triggering is fixed for Hand Written Signature only, if it is a Signature field, then the add and remove signature events are skipped.
- `#I383430` - Now copy, cut and paste does not generate any duplicates while using key short cut.
- `#I376526` - Now, Mobile device resizing of the Signature Form Field has been improved.
- `#I392270` - Now Signature is not drawn few inches away from the cursor on signature dialog.
- `#I389178` - If the target position is within the document, a form field will be added. As a result, adding Inaccessible Form fields is prevented.

## 20.2.40 (2022-07-26)

### PDF Viewer

#### Bug Fixes

- `#I389566` - Now, Script Error is not occurs while try to change Pdf view to text view in sample.
- `#I376222` - Now, Annotation selector binds while dragging with right click and then clicking left click.
- `#I382568` - Now text boxes with the same name are saved and preserved after downloading and loading the document.
- `#I387261` - The signature in the signature field is not visible on Adobe Reader's print preview has been resolved.
- `#I380373` - Now the event triggering is fixed for Hand Written Signature only, if it is a Signature field, then the add and remove signature events are skipped.
- `#I383430` - Now copy, cut and paste does not generate any duplicates while using key short cut.
- `#I376526` - Now, Mobile device resizing of the Signature Form Field has been improved.
- `#I392270` - Now Signature is not drawn few inches away from the cursor on signature dialog.

## 20.2.39 (2022-07-19)

### PDF Viewer

#### Bug Fixes

- `#I390764` - The issue of is document edited API is false while editing a document has been resolved.
- `#I388086` - The issue of replied comments merging with other annotations has been resolved.
- `#I379142`,`#I391296` - The x,y bounds of the form fields are proper while adding the form field.
- `#I386887` - The issue with radio button alignment with different zoom settings has been resolved.
- `#F175614` - For load failed and PDF file path not found errors, an error message is now displayed.
- `#I379627` - formFieldMouseover and formFieldMouseLeave is now trigger properly.
- `#I387260` - Now Signature Indicator Properties can be modified Programmatically in DOM.
- `#I384670` - Now that the type has been fixed, the signature value for the second time has been updated using form field collections.
- `#I382941`,`#I383132` - Now duplicate form fields able to select, move, delete and edit after deleting original form fields.

## 20.2.38 (2022-07-12)

### PDF Viewer

#### Bug Fixes

- `#I383108` - Now,the custom stamp annotations are added properly in touch mode
- `#I377362` - Annotations are now placed in the correct position in the download PDF document with crop value.
- `#I383385` - The delete key can be used to remove annotations added in touch mode.
- `#I381030` - Unloading a PDF document from the first PDF Viewer component no longer affects the rendering of the PDF document in the second PDF Viewer component.
- `#I385936` - The value of the Add Signature button will not extend outside the button and missing Portuguese tooltips have been translated.
- `#I372855`, `#F173951` - An annotation can now be added and resized up to the edge of the PDF document.
- `#I380996` - The `TextSearchComplete` event will be triggered when the text is searched in the PDF viewer.
- `#I377035`,`#I379948` - A tooltip will be displayed in a form field even if the FormDesignerService is not injected.
- `#I380472` - Added form fields after pressing escape no longer shades form fields.
- `#I384112` - The `formFieldSelect` event will be triggered while selecting the first form field in the document.
- `#I386568` - In the Bootstrap5 theme, the search icon will change to a clear icon after a search has been initiated.
- `#I382999` - The type signature in the signature fields will be modified based on the height of the Signature field while resizing.
- `#I379221` - Now, cache values (PDF_CONTENT) are updated in the `getCache()` method.
- `#I385864` - Now, the dropdown values will be changed programmatically in the PDF Viewer.
- `#I386545` - Now, the signature field color will appear while scrolling down long document.
- `#I272377` - Now, the position and size of the arrow shapes in the shape annotation are same as in the downloaded document.
- `#F173953` - Now, Script error have been resolved.
- `#I378591` - The issue with the comment panel not opening after disabling and enabling again has been fixed.
- `#I386545` - Now, the signature field color will appear with opacity while scrolling down long document.

## 20.2.36 (2022-06-30)

### PDF Viewer

#### Bug Fixes

- `#I371792` - Pan mode is now activated for all mobile devices by default.
- `#I363298` - The issue when form fields had different names when the form designer module is enabled and disabled has been fixed.
- `#F173953` - The issue with the incorrect sentence search functionality in the PDF Viewer has been resolved.
- `#I368423` - Now, rotation for form elements is considered.
- `#F173751` - Radio buttons that have been dynamically imported can now preserve its checked status.
- `#I376227` - The issue with the PDF Viewer's annotation FillColor not updating correctly has been fixed.
- `#I376346` - This issue with an annotation moving to the top of multiple pages has been resolved.
- `#F173061` - A `zoomToRect()` method is now used to zoom a particular area multiple times with different scroll positions in the viewport.
- `#I377714` - The problem with pinch zooming and form field position has been fixed.
- `#I377638` - The issue with the Read Only radio button value changing when downloading has been fixed.
- `#I378257` - The issue with the checkbox printing multiple times has been resolved.
- `#I378394` - Changes to form field properties that are made using the `formFieldPropertiesChange` event are no longer lost is now working properly.
- `#I379205` - Drawing a freehand signature when switching between tabs in the Add signature dialogue is no longer possible.
- `#I379120` - The pixel quality of the handwritten signature has now improved.
- `#I386899` - Issue with signature rendering is now resolved.
- `#I383513` - When a textbox is marked as required, it no longer has a red border in the document that's been downloaded is now working properly.
- `#I369733` - The free text annotation is no longer rotated when it is added programmatically to rotated documents.
- `#I383963` - Issue with cloned form field value is duplicated has been fixed.

## 20.1.60 (2022-06-14)

### PDF Viewer

#### Bug Fixes

- `#I378257` - The issue with the checkbox printing multiple times has been resolved.
- `#F173751` - Radio buttons that have been dynamically imported can now preserve its checked status.
- `#F173061` - A `zoomToRect()` method is now used to zoom a particular area multiple times with different scroll positions in the viewport.
- `#I371792` - Pan mode is now activated for all mobile devices by default.
- `#I368423` - Now, rotation for form elements is considered.
- `#I379205` - Drawing a freehand signature when switching between tabs in the Add signature dialogue is no longer possible.
- `#I379120` - The pixel quality of the handwritten signature has now improved.

## 20.1.59 (2022-06-07)

### PDF Viewer

#### Bug Fixes

- `#F174154`- Now, the signature value for all signature fields in the PDF document will be updated programmatically using the `updateFormFieldsValue()` method.
- `#I376222`- Now, Annotation selector binds correctly to annotations when dragging.
- `#I367416`- The `FindText()` method of PDF Base allows for finding the number.
- `#I372876`- The `annotationSelect` and `commentAdd` events are triggered properly for the sticky notes annotation.

## 20.1.58 (2022-05-31)

### PDF Viewer

#### Bug Fixes

- `#I377034`- Now, the existing form fields value can be retrieved using the `retrieveFormFields()` method.
- `#I367416`- The radio buttons on the iPad are displayed properly after zooming in and out.
- `#I374726`- Signatures will appear in the PDF viewer for the provided document.

## 20.1.57 (2022-05-24)

### PDF Viewer

#### Bug Fixes

- `#I376240`- Multiple words in the typed handwritten signature and signature fields are preserved correctly in the downloaded document.
- `#F174506`- Improved the printing quality of the PDF viewer.
- `#I372853`- Now, ink annotation will be added programmatically with path data available in the annotationAdd event.

## 20.1.56 (2022-05-17)

### PDF Viewer

#### Bug Fixes

- `#I371824`- The properties of form fields will be updated properly using the `updateFormField` method while scrolling over pages.

## 20.1.55 (2022-05-12)

### PDF Viewer

#### New Features

- `#I368647`, `#I366041` - Exposed a method to focus form fields on a document.
- `#I362221`, `#I364814`, `#I368380`, `#I363379` - Provided the support for field Id and field Name for the Form Fields events.
- `#I353301` - Implemented the `GetPageNumberFromClientPoint`, `ConvertClientPointToPagePoint`, `ConvertPagePointToClientPoint`, `ConvertPagePointToScrollingPoint` and `zoomToRect` methods.

#### Bug Fixes

- `#I372732` - A signature in the signature field will be displayed in the downloaded document when the form field properties have been updated using the `updateFormFields` method.
- `#I361979` - Now, signature fields with the same value for the name property will be visible when the document is downloaded and reloaded.
- `#I367560`, `#I367313` - Improved the pinch-zoom in and out responsiveness in the mobile device.
- `#I368770`, `#I373344`, `#I372215` - Now, the properties of text box fields are changed properly using the `textFieldSettings` property.
- `#I369002` - A signature will be downloaded in the correct position for rotated and scanned documents.
- `#I369554` - The form fields are now added horizontally to the page, even for rotated documents.
- `#I371560` - Form fields in a rotated document will be rendered according to the field rotation.
- `#I373137` - The `ArgumentOutOfRangeException` exception will no longer occur when extracting the text for the provided document.
- `#I375548`, `#I374826`, `#I375215`, `#I376171`, `#I376531` - The `Microsoft.Extensions.Caching.Memory` was changed into a stable version.
- `#I364871` - Now, the handwritten signature images and custom stamps will be resized proportionally.
- `#I368168` - PDF Viewer toolbar appeared properly from view on zooming in mobile mode.
- `#I370140` - The label content of calibrating annotations is correctly updated when their properties are edited programmatically.
- `#I370758` - The Script error will no longer be thrown while downloading the document after adding the handwritten type signature on a mobile device.
- `#I370904` - The signature collection and some signature properties are properly defined in the `addSignature` event on a mobile device.
- `#I377746` - The PDF Viewer download button no longer opens the blob URL in Firefox for downloading the document.
- `#I367878` - The Script error will no longer be thrown while clicking the form field for the second time.
- `#I373785` - The initial field will no longer be undefined after filling the field.
- `#I363381` - The `formFieldPropertiesChange` event triggers on removing the signature from the signature field.
- `#I371825` - Now, the form fields will appear while scrolling through the different pages.
- `#I371838` - The Custom stamp annotation will be rendered correctly for the PDF document provided.
- `#I365736`, `#I366420` - In mobile devices, the Script error will no longer occur when adding the signature.

## 20.1.52 (2022-05-04)

### PDF Viewer

#### Bug Fixes

- `#I361979`- Now, signature fields with the same value for the name property will be visible when the document is downloaded and reloaded.

## 20.1.51 (2022-04-26)

### PDF Viewer

#### Bug Fixes

- `#I369554`- The form fields are now added horizontally to the page, even for rotated documents.
- `#I369733`- The free text annotation is no longer rotated when it is added programmatically to rotated documents.
- `#I371560`- Form fields in a rotated document will be rendered according to the field rotation.

## 20.1.50 (2022-04-19)

### PDF Viewer

#### New Features

- `#I362221`,`#I364814`,`#I368380`,`#I363379`- Provided the support for field Id and field Name for the Form Fields events.
- `#I353301`- Implemented the `zoomTo` method.

#### Bug Fixes

- `#I366955`- Now, the page can be scrolled in mobile mode when it is in fitToPage mode.
- `#I368168`- PDF Viewer toolbar appeared properly from view on zooming in mobile mode.
- `#I367878`- The Script error will no longer be thrown while clicking the form field for the second time.
- `#I368770`,`#I373344`,`#I372215`- Now, the properties of text box fields are changed properly using the `textFieldSettings` property.
- `#I370140`- The label content of calibrate annotations is correctly updated when their properties are edited programmatically.
- `#I370758`- The Script error will no longer be thrown while downloading the document after adding the handwritten type signature in mobile device.
- `#I370904`- The signature collection and some signature properties are properly defined in the `addSignature` event on mobile device.
- `#I373344`,`#I372215`- The Script error will no longer be thrown while adding PDF Viewer to the Angular application.

## 20.1.47 (2022-04-04)

### PDF Viewer

#### New Features

- `#I368647`, `#I366041`- Exposed a method to focus form fields in a document.

#### Bug Fixes

- `#I366679`- Selection is working properly for the overlapped stamp annotations.
- `#I364656`- Now, the signature fields are read-only when the annotation and form designer modules are disabled.

## 19.4.55 (2022-03-08)

### PDF Viewer

#### Bug Fixes

- `#I365496`- In editable mode, the free text annotation remains in the same position during zooming.
- `#I366345`- In mobile devices, context menus will not appear when moving annotations.

## 19.4.54 (2022-03-01)

### PDF Viewer

#### Bug Fixes

- `#I362858`- The existing form fields are now cleared completely from the collections when loading another document.
- `#F172325`- The Script error will no longer be thrown while scrolling the landscape PDF documents before loading.
- `#I364909`- The Ink annotation curve is now smooth on mobile devices at higher zoom factors.
- `#I364296`- The free text annotation is now not visible in the print preview when the `isPrint` property is set to false.
- `#I364510`, `#I363938`- The signature is now drawn correctly in the signature field on switching the tabs.
- `#I364296`- The PDF document is now downloaded properly when the form field background color is transparent.
- `#I363381`- The `formFieldPropertiesChange` event triggers on removing the signature from the signature field.
- `#I362811`, `#I364480`- The existing from field collections are now updated properly when loading the document.

## 19.4.53 (2022-02-22)

### PDF Viewer

#### Bug Fixes

- `#I362122` - Now, the shape annotation bounds are updated properly in the `annotationResize` event.
- `#I361850` - Now, the annotation toolbar icons are aligned correctly after resizing.
- `#I363301` - The script error is no longer thrown while hovering the toolbar icons without using the `showTooltip` property.
- `#I362647` - Now, the signature, and initial fields are unable to edit in the read-only mode.
- `#I361801` - Script error is no longer thrown while destroying the viewer control in the IE browser.
- `#I363899` - Now, the `annotationUnSelect` event triggers for custom stamp annotations.
- `#I363936` - Now, the signature panel will not be opened on right-click of signature fields.
- `#F168155` - The downloaded document displays Czech characters.

## 19.4.52 (2022-02-15)

### PDF Viewer

#### Bug Fixes

- `#I361967`- Copy and paste is now working properly for the signature field when it is added at the bottom of the page.
- `#I361906`- The text position for the provided PDF document is now correct.
- `#I361379`- While importing the annotations, the FontColor and FillColor properties are now updated properly.
- `#I360076`- In the signature field, the drawn signature is not stretched now.
- `#I364148`, `#F172304`- The Script error will no longer be thrown in the mobile view while destroying the PDF Viewer.
- `#I362874`- The form field names are now added properly to the form fields.
- `#I365411`, `#I360719`- The annotations are now properly added to the pages when enableDesktopMode is true on mobile devices.

## 19.4.50 (2022-02-08)

### PDF Viewer

#### Bug Fixes

- `#I360337`- Exception is thrown while downloading the empty list box field is now resolved.
- `#I360635`,`#I361422`,`#I361359`- Now, the form field is hidden properly when setting the visible property to hidden.
- `#I358375`- Now, the PDF document loaded properly in the PDF Viewer when you set the size limit for the memory cache.
- `#I359388`- Now, the form fields position is correct for a rotated PDF document.
- `#I354638`- Now, the free text annotation is not hidden when clicking outside of the free text annotation.
- `#I360405`- Now, the Free text annotations and ink annotations are rendered properly in the lower zoom factors.
- `#F171647`- Now, the annotationAdd event is triggered after adding the sticky notes annotation in the annotation collection.
- `#I361639`- The Script error will no longer be thrown when loading the form-fields document without injecting the form field module.
- `#I362311`- Now, the Move cursor is not showing above the custom stamp while the custom stamp annotation is selected.
- `#I359233`- The hidden issue of free text characters is now resolved.
- `#I363626`- The Script error will no longer be thrown while loading a PDF document when the enableHyperlink is set to false.
- `#I363055`- Now, the free text becomes edited properly while clicking the selector.
- `#I363411`- Now, the free text position on a downloaded document is accurate on the Chrome browser.

## 19.4.43 (2022-01-18)

### PDF Viewer

#### Bug Fixes

`#I359772`,`#I359880`- Now, the form fields are editable on the mobile device.
`#I359042`- Free text annotations are downloaded properly without hiding any last character.
`#I358308`- Spinners are hidden properly while removing the display as none for the spinner.
`#I360035`- The Script error will no longer be thrown while using the editAnnotation method in mobile mode.
`#I358584`- Stamps are saved properly in the rotated PDF document.

## 19.4.42 (2022-01-11)

### PDF Viewer

#### Bug Fixes

- `#I358006`- Overlapped stamp annotations are now placed at the exact position in the saved PDF document.
- `#I357273`- Exception thrown while loading the provided PDF document due to an invalid key, is now resolved.
- `#I357655`- The PDF pages are now exported to image in a multi-threaded environment.
- `#I357060`- Now, the typed handwritten signature content does not exceed the text area.

## 19.4.41 (2022-01-04)

### PDF Viewer

#### Bug Fixes

- `#I357108` - Now, the annotations are displayed properly for the rotated documents.
- `#I357489` - Now, the unnecessary thumbnail requests are restricted.

## 19.4.40 (2021-12-28)

### PDF Viewer

#### Bug Fixes

- `#I299110`, `#I348963` - Now, the font size is updated properly while export and import shape annotations.

## 19.4.38 (2021-12-17)

### PDF Viewer

#### New Features

- `#I354638` - Provided auto fit support to the free text annotations.

#### Bug Fixes

- `#I346343`- Now, the text wraps based on the word length regardless of character length in free-text annotation.

## 19.3.56 (2021-12-02)

### PDF Viewer

#### New Features

- `#I336589`, `#I339329`, `#I346113` - Provided annotation toolbar settings support in mobile view.

#### Bug Fixes

- `#I347402`, `#I347555`- Now, the signature dialog is opened correctly on clicking the signature field in Firefox and Safari browser.
- `#I344549`- The ink annotations are preserved correctly in the Adobe.
- `#I346607`- Now, the signature dialog width is proper on resizing the browser window.
- `#I345897`- The ink annotations are now drawn over the free-text annotations when the 'allowEditTextOnly' property is enabled.
- `#I347427`- The form designer tooltip is now hidden when the 'showToolTip' property is set to FALSE.
- `#I348023`- The 'isReadOnly' property is now updated correctly once we set the value to TRUE.
- `#I345130`- Now, the exact shape of the image is maintained when added to the signature field.
- `#I347558`- Now, the custom stamp position is added properly in mobile view.

## 19.3.54 (2021-11-17)

### PDF Viewer

#### Bug Fixes

- `#I346152`- The script error will not be thrown for the document which contains link annotation.

## 19.3.48 (2021-11-02)

### PDF Viewer

#### Bug Fixes

- `#I344888`, `#F169870` - Now, signature dialog settings is working properly for the handwritten signature dialog.
- `#I346090`- Now, the primary toolbar should not hide if form designer toolbar is visible.
- `#I344897`, `#I345574` - Now, the indicator text and required properties for signature fields settings are working properly.
- `#I344082`- Now, signature text annotation is rendered properly on loading the document.

## 19.3.47 (2021-10-26)

### PDF Viewer

#### Bug Fixes

- `#I344034` - The Script error will no longer be thrown if we select text markup annotation when text selection is disabled.

## 19.3.46 (2021-10-19)

### PDF Viewer

#### Bug Fixes

- `#I339329`, `#I341199` - Now, the default context menu of browser will no longer be shown on selecting the text in mobile view.

## 19.3.45 (2021-10-12)

### PDF Viewer

#### Bug Fixes

- `#F169102` - Now, the download action is working properly after importing the provided customer document.
- `#I342951` - Now, the Bookmark navigation is working properly in mobile mode.
- `#I343011` - Now, the download action is working properly after adding the text markup annotation.

## 19.3.44 (2021-10-05)

### PDF Viewer

#### Bug Fixes

- `#I297147`, `#I339056` - Now, the free text annotations with 90 and 270 rotated angle are rotated properly.
- `#I341677` - Now, the opacity is applied properly for the custom stamps.
- `#I341074` - Now, the search icon is visible to close the search dialog.

## 19.1.67 (2021-06-08)

### PDF Viewer

#### Bug Fixes

- `#I328989` - Now, the clear and create button in the signature panel is enabled only on drawing the signature.
- `#I328499` - Now, the stamp annotations are downloaded correctly in the PDF document.

## 19.1.66 (2021-06-01)

### PDF Viewer

#### Bug Fixes

- `#I328030` - The dynamic stamp annotation size is maintained properly while importing and exporting the stamp annotation in XFDF format.

## 19.1.65 (2021-05-25)

### PDF Viewer

#### New Features

- `#I326021` - hyperlinkClick event must be handled to cancel the navigation or change the URL.

## 19.1.64 (2021-05-19)

### PDF Viewer

#### Bug Fixes

- `#I328989` - Now, the clear and create button in the signature panel is enabled only on drawing the signature.
- `#I328499` - Now, the stamp annotations are downloaded correctly in the PDF document.

## 19.1.66 (2021-06-01)

### PDF Viewer

#### Bug Fixes

- `#I328030` - The dynamic stamp annotation size is maintained properly while importing and exporting the stamp annotation in XFDF format.

## 19.1.65 (2021-05-25)

### PDF Viewer

#### New Features

- `#I326021` - hyperlinkClick event must be handled to cancel the navigation or change the URL.

## 19.1.64 (2021-05-19)

### PDF Viewer

#### Bug Fixes

- `#I325096` - The Script error will no longer be thrown if we add form fields value by code behind.
- `#I326083` - Now, the signature is appeared inside of the Signature Field in the PDF Viewer.
- `#I326054` - The Script error will no longer be thrown while clicking the provided document hyperlink content.
- `#I324660` - Now, the distance annotation can be added after deleting the incompletely drawn distance annotation.

## 19.1.59 (2021-05-04)

### PDF Viewer

#### Bug Fixes

- `#I322039` - The Arrow icon is shown properly in the custom stamp dropdown.

## 19.1.58 (2021-04-27)

### PDF Viewer

#### Bug Fixes

- `#I322799` - The imported stamp annotation position is updated correctly in the MVC platform.

## 19.1.57 (2021-04-20)

### PDF Viewer

#### Bug Fixes

- `#I317344` - The Script error will no longer be thrown if we add the custom stamp image more than 4MB size.

## 19.1.56 (2021-04-13)

### PDF Viewer

#### Bug Fixes

- `#I315264` - Now, the User names in comments are working properly.

## 19.1.54 (2021-03-30)

### PDF Viewer

#### New Features

- `#F158073`, `#I291648` - Exposed the annotation UnSelect event in PDF Viewer.

## 18.2.56 (2020-09-01)

### PDF Viewer

#### New Features

- `#I289233` - Provided the support to add expiration timing for cache.

#### Bug Fixes

- `#I289417` - Now, the annotation toolbar position is maintained correctly.

## 18.2.47 (2020-07-28)

### PDF Viewer

#### New Features

- `#I267670` - Exposed the toolbar option to retrieve the form field data in JSON format.

#### Bug Fixes

- `#I282486` - Now, undo and redo is working properly for the freetext annotations.
- `#F155593`- Exception will no longer be thrown while exporting the formfields.

## 18.2.46 (2020-07-21)

### PDF Viewer

#### Bug Fixes

- `#I282530` - The Script error will no longer be thrown if we select the handwritten signature in mobile devices.

## 18.2.45 (2020-07-14)

### PDF Viewer

#### New Features

- `#I281898` - Provided the support to add comments programmatically for the newly added annotations.

#### Bug Fixes

- `#F155593`, `#I283379` - Now, PDF Viewer control is working in IE.

## 18.2.44 (2020-07-07)

### PDF Viewer

#### Bug Fixes

- `#I273237` - Now, Annotation comments are locked properly when locked the annotations.

## 18.1.55 (2020-06-02)

### PDF Viewer

#### New Features

- `#F154248` - Provided the Support to show/hide the annotation toolbar in code behind.
- `#F153946` - Provided the Options to disable AutoComplete options in form filling documents.
- `#I273237` - Provided the Support to lock the text markup annotations.
- `#I277143` - Provided the support for ink annotation.

## 18.1.54 (2020-05-26)

### PDF Viewer

#### New Features

- `#I254075` , `#I266559` - Provided the support  to render the hyperlinks which are preserved as plain text

#### Bug Fixes

- `#I274036` - Now, the page does not gets refreshed on clicking the import annotation button
- `#I267062` - Size of the Stamp is rendered correctly after saving and loading the file in PDF Viewer.
- `#I268505` - Download is working correctly For French Culture Environment.
- `#F153465` - Digital Signature in the exported image is preserved correctly.
- `#F153465` - Style of the form fields are preserved properly in PDF Viewer.
- `#I274694` -Text highlight is working properly.
- `#I276547` -Text selection is working properly for lower zoom factor.

## 18.1.48 (2020-05-05)

### PDF Viewer

#### New Features

- `#I272985` - Provided the support to edit the annotation properties without selecting the annotation.

## 18.1.45 (2020-04-21)

### PDF Viewer

#### New Features

- `#I267283` - Provided the support to identify the imported annotation and drawn annotation
- `#I268736` - Exposed the text search events in PDF Viewer.
- `#I258786` - Exposed the signature Select event in PDF Viewer.

#### Bug Fixes

- `#I272053` - The annotation bounds value is now preserved properly in annotation events.
- `#I269001` - Improved the page rendering behaviour in PDF Viewer.

## 18.1.44 (2020-04-14)

### PDF Viewer

#### New Features

- `#I263306` - Provided the support for Meter Calibration ratio in PDF Viewer.
- `#I271053` - Provided the support to enable and disable the multiline annotations in overlapping collections.

#### Bug Fixes

- `#I271180` - Free Text Annotation and annotation label text position updated properly in downloaded rotational documents.
- `#F153036` - Now, Annotation toolbar separator shown properly when hiding some annotation toolbar items.

## 18.1.43 (2020-04-07)

### PDF Viewer

#### New Features

- `#I267524` - Provided the support for feet inch Calibration ratio in PDF Viewer.
- `#I269003` - Exposed the non filled form fields value in the fireValidatedFailed event arguments.
- `#I268276` - Provided the support to customize the annotation resize  cursor type in PDF Viewer.
- `#I268715` - Exposed the 'Not Approved' stamp annotation under dynamic stamp type.

#### Bug Fixes

- `#I271163` - Errors will no longer occur when the print module in disabled state.
- `#I268829` - Now, the deleted annotations are removed properly from the PDF document.

## 18.1.42 (2020-04-01)

### PDF Viewer

#### New Features

- `#I268975` - Exposed the event for notifying page mouse over action.
- `#I264529` - Exposed the volume calibrate annotation depth value in annotationSelect event arguments and provide options to edit the depth value.
- `#I263297`, `#I268677` - Provided the options to enable and disable the tile rendering mode.
- `#I263473` - Provided the isLock options to  individual annotation object level.

#### Bug Fixes

- `#I269004` – The typo errors in PDF Viewer JSON objects has been resolved.
- `#I266218`, `#I266559` - The import/export form fields are now working properly for the form fields data contains special characters.
- `#I268505` - Download is now working properly for different culture settings.
- `#I268109` - The updated label content is now preserved properly in the exported annotation data.

## 18.1.36-beta (2020-03-19)

### PDF Viewer

#### New Features

- `#I235592` - Provided the support for setting the lower zoomfactor value to the PDF Viewer control.
- `#I259521` - Provided the support for importing the form fields data from JSON object.
- `#I261558` - Provided the support for customizing the distance measurement annotation leader length property.
- `#I256687` - Provided the support for setting the custom data for annotation objects.
- `#I252340` - Provided the support for setting the minimum or maximum size and isLock properties at individual annotation level.
- `#I262008` - Exposed the event for notifying annotation mouse over action.
- `#F149148` - Provided the binding support for the enableFormFields property.
- `#I258769` - Provided the option to suppress the error dialog in PDF Viewer.
- `#I261269` - Provided the support to allow credential for XMLHttpRequest in PDF Viewer.
- `#I262787` - Exposed the event to notify the getPDFDocumentTexts method completed for all the pages.

#### Bug Fixes

- `#I262525` – The render PDF pages method triggers properly for the provided PDF document.
- `#I262692` - The text markup resizer position is now updated properly for the provided document.
- `#I262692` - The text content bounds are now rendered properly for the provided document.

## 17.4.50 (2020-02-18)

### PDF Viewer

#### New Features

- `#I262787` - Exposed the event to notify the getPDFDocumentTexts method completed for all the pages.

## 17.4.49 (2020-02-11)

### PDF Viewer

#### New Features

- `#I235592` - Provided the support for setting the lower zoomfactor value to the PDF Viewer control.
- `#I259521` - Provided the support for importing the form fields data from JSON object.
- `#I261558` - Provided the support for customizing the distance measurement annotation leader length property.
- `#I256687` - Provided the support for setting the custom data for annotation objects.
- `#I252340` - Provided the support for setting the minimum or maximum size and isLock properties at individual annotation level.
- `#I262008` - Exposed the event for notifying annotation mouse over action.
- `#F149148` - Provided the binding support for the enableFormFields property.

#### Bug Fixes

- `#I262525` – The render PDF pages method triggers properly for the provided PDF document.
- `#I262692` - The text markup resizer position is now updated properly for the provided document.
- `#I262692` - The text content bounds are now rendered properly for the provided document.

### PDF Viewer

#### New Features

- `#I258769` - Provided the option to suppress the error dialog in PDF Viewer.
- `#I261269` - Provided the support to allow credential for XMLHttpRequest in PDF Viewer.

## 17.4.46 (2020-01-30)

### PDF Viewer

#### New Features

- `#I258172` - Provided the support to open the command panel while loading the PDF document if the isCommandPanelOpen property is set to true.
- `#I259159` - Provided the support to open the thumbnail view panel while loading the PDF document if the isThumbnailViewOpen property is set to true.
- `#I259961` - Exposed the annotation label settings value in the annotationAdd event arguments.
- `#I259615` - Exposed the annotation label settings value in import/export JSON data.
- `#I256596` - Exposed the annotation selector settings value for individual annotation objects and import/export JSON data.

## 17.4.44 (2021-01-21)

### PDF Viewer

#### New Features

- `#I257519` - Provided Support to edit the free Text annotation value in code behind.

#### Bug Fixes

- `#I259848` – Now, the deleted annotations are removed properly from the PDF document.
- `#I259734` - Custom Stamp annotations are drawn properly while importing the annotations.
- `#I260512` - Errors will no longer occur while importing the annotations in the documentLoad event.
- `#I260575` - The download file name is now set properly if we provide during the control initialization.

## 17.4.43 (2020-01-14)

### PDF Viewer

#### New Features

- `#I255057` – Provided the support for validating the form fields value whether it is filled or not in the loaded PDF document.
- `#I258786`, `#I259327` – Provided the support for exporting and importing the handwritten signature.

#### Bug Fixes

- `#I149882` – The downloadEnd event triggers properly if we save the document in server side.
- `#I257630` – The importSuccess event triggers properly if we save the document in server side.
- `#I260295` – The distance calibrate annotation now resized properly.
- `#I260128` – The volume and area calibrate annotation fill color is updated correctly on importing the annotations.

## 17.4.41 (2020-01-07)

### PDF Viewer

#### New Features

- `#I257514` – Provided the support for import/export the custom stamp annotations.
- `#I257231` – Exposed the property to access the search count value.
- `#I258386` – Exposed the API to retrieve the text content and bounds along with page size details.

#### Bug Fixes

- `#I259524` – Annotations are rendered properly in the large page size document if the page rendered in fitToPage mode initially.
- `#I259523` – Errors will no longer occur while exporting the annotation if the document contains text web link annotation.
- `#I259134` – The annotationSelect event now triggers properly if we add the multiple annotations to a page.
- `#I258949` – The opacity value is now applied properly if set it on annotation during initialization.
- `#I259383` – The errors will no longer occur if we import the annotations after deleting the added annotations.
- `#I259166` – The text content will be selected properly at the end of the page.
- `#I259078` – The annotations will now be created if we resize the annotation through multipage.
- `#I259564` – The Null reference error will no longer occur while loading the provided PDF document.

## 17.4.40 (2019-12-24)

### PDF Viewer

#### New Features

- `#I256131` – Improved the rendering quality and performance for the large size PDF document.

#### Bug Fixes

- `#I258250` – The imported annotations are rendered properly if we import the annotation details in the documentLoad event.

## 17.4.39 (2019-12-17)

### PDF Viewer

#### New Features

- `#I251150` – Provided the support to find the interlinked annotations while selecting the annotations.
- `#I243077` , `#I241487`, `#I244802`, `#I252340` – Provided the support for setting the annotation UI properties.
- `#I254634` – Provided the support to maintain the aspect ratio for custom stamp annotation.
- `#I253745`, `#I256518` – Exposed the event to notify the annotation object being moved.
- `#I254275` – Exposed the event to notify the download process in the PDF Viewer control.

#### Bug Fixes

- `#I253751` – Resolved the typo error in annotation exported data.
- `#I255345` – Errors will no longer occur while rendering the annotation in the Firefox browser.
- `#I255137` – Errors will no longer occur in mobile view mode if we set the Pan interaction mode.
- `#I253704` – The form fields are downloaded properly while loading the PDF document in tab control.
- `#I253745` – The annotationAdd and annotationPropertiesChange events are triggered properly for the annotations.
- `#I252881` – The toolbar settings property is working for mobile device.
- `#I255042`, `#I255073` – Errors will no longer occur if the session storage exceeds the maximum limit.
- `#I254115`, `#I254942` – The annotation modified date is preserved properly in different localization.
- `#I256044` – The font family and text alignment are rendered properly from the exported FreeText annotation data.
- `#I255124` – The text markup annotations are now added properly if the PDF Viewer element ID contains characters.
- `#I256220` – The context menu will now be shown/hidden properly if we disable the default toolbar.
- `#I256131` – The annotation toolbar will now be shown/hidden properly if we disable the annotation toolbar.
- `#I256932` - Errors will no longer occur while resizing the text markup annotations.
- `#I252805` – The annotationId value is now preserved properly for all annotation events.
- `#I255647` - The form fields contents are rendered properly in the printed document, which has been printed in IE browser.

## 17.3.28 (2019-11-19)

### PDF Viewer

#### New Features

- `#I251151`, `#I254032` – Improved the annotation selection behavior in code behind.
- `#I254776`, `#I255304` – Provided the support to set the custom JSON data for AJAX request.
- `#I253341` – Provided the support to customize the label content during initial rendering of annotations.
- `#I252421` – Provided the support to set the zoom mode value during initial loading.

#### Bug Fixes

- `#I253926` – Resolved the memory leak while rendering the PDF documents.

## 17.3.27 (2019-11-12)

### PDF Viewer

#### New Features

- `#I251151`, `#I254032` – Provided the support for annotation selection in code behind.
- `#I249245` – Provided the support for UI customization of annotation selector border and resizer.
- Improved the PDF viewer mobile view performance.

#### Bug Fixes

- `#I253317` – The measured annotation value is updated properly in the label when you disable the default toolbar.
- `#I253888` – The Script error will no longer be thrown if we load the PDF documents using ASP.NET MVC web service.
- `#I253317` – The measured value is now update properly for the measured annotation.

## 17.3.26 (2019-11-05)

### PDF Viewer

#### New Features

- `#I252805` - Exposed the annotation unique ID in the annotationAdd event arguments.

#### Bug Fixes

- `#I252806` - Annotation bounds are retrieved properly when importing and exporting the annotation details in rotated PDF documents.
- `#I253016` - Free text annotation bounds are preserved properly in the rotated PDF document while saving the document.
- `#I251152` - Text markup annotation resizer position will be updated properly in the doctype HTML pages.
- `#I252879` - Script errors will no longer occur if we disable the magnification module.
- `#I253504` - The character start and end indexes will be updated properly in the text markup annotationAdd event arguments.

## 17.3.21 (2019-10-30)

### PDF Viewer

#### New Features

- `#I252111` - Provided the support for handwritten signature.
- `#I251149` - Provided the support for customizing the text search highlight color.

#### Bug Fixes

- `#I251864` - The pages in the landscape document will be rendered properly.
- `#I250902` - Now, the text Markup annotations are working properly inside the Tab control.
- `#I250538` - The ajaxRequestFailed event will be triggered for all the possible ajax error codes.
- `#I252269` – The mouse cursor has been updated properly after adding the free text annotation.
- `#I251401` - The annotationSelect event will be triggered properly while selecting the annotations.

## 17.3.19 (2019-10-22)

### PDF Viewer

#### New Features

- `#I249703` - The quality of the printed copy has been improved.
- `#I147267`, `#I251146` - Provided the support to delete the annotations in code behind.
- `#I248609` - Provided the support to customize the annotation selector.
- `#I247224`, `#I248179` - Provided the support to resize the text markup annotation bounds.

#### Bug Fixes

- `#I251577` - The value of the isDocumentEdited property now returned properly for shapes, measure, stamps annotation and form filling features.
- `#I249588` - The PDF Viewer control size is updated properly while using in tab control.
- `#I251729` - The text markup annotation selector is cleared properly when loading the another PDF document.
- `#I251742` - The perimeter shape type has been updated properly when exporting the annotation details.
- `#I251494` - The reference error will no longer be thrown if you render the PDF document in docker Linux container environment.
- `#I251153` – The previously imported annotations are no more cleared when import the other set of annotations.

## 17.3.17 (2019-10-15)

### PDF Viewer

#### New Features

- `#I248585` - The start and end indexes of text markup annotation have been exposed in the annotationAdd event.

#### Bug Fixes

- `#I249742` - The annotationSelect event will be triggered properly after selecting another text markup annotation.
- `#I245008` - Notes of the measure annotations will now be updated properly after modifying the scale values.

## 17.3.16 (2019-10-09)

### PDF Viewer

#### New Features

- `#I249725` - Provided the support to enable or disable the comment panel.
- `#I248609` -  Exposed the API for textSelectionStart and textSelectionEnd events in the PDF Viewer.

#### Bug Fixes

- `#I249017` - Multiline text markup annotation bounds will be returned properly in the annotationAdd event arguments.

## 17.3.14 (2019-10-03)

### PDF Viewer

#### New Features

- `#I227046`, `#I230887`, `#I142366`, `#I231973`, `#I237847`, `#I244849`, `#I238686`, `#I239233`, `#I241638`, `#I241638`, `#I242232`, `#I239221`, `#I240051`, `#I245255` – The support has been provided for filling the form fields.
- `#I233655`, `#I236240`, `#I236825`, `#I238694`, `#I241974`, `#I243864`, `#I245087` – The support has been provided for free text annotation.
- `#I246059` - Exposed the thumbnailClick event to identify the thumbnail clicks action.
- `#I246767` – The support has been provided to export the annotation details as JSON object in client-side.
- `#I245008` – The support has been provided to update the existing calibrate annotation if we modify the scale value.
- Improved the scrolling performance in mobile devices.

#### Bug Fixes

- `#I247914` – The perimeter annotation will be rendered properly when the line is ended in the starting point.
- `#I248062` – Extra edge will not be added to the polygon shapes when rendered in the page.
- `#I248092` – Contents will not be swapped if you switch randomly between two documents.
- `#I248093` – Script error will no longer be thrown if you switch randomly between two documents.
- `#I247787` – The searched text will be highlighted properly in the provided document.
- `#I146785` – Script error will no longer be thrown when the PDF Viewer control is used in the React application.

## 17.3.9-beta (2019-09-20)

### PDF Viewer

#### New Features

- `#I227046`, `#I230887`, `#I142366`, `#I231973`, `#I237847`, `#I244849`, `#I238686`, `#I239233`, `#I241638`, `#I241638`, `#I242232`, `#I239221`, `#I240051`, `#I245255` – The support has been provided for filling the form fields.
- `#I233655`, `#I236240`, `#I236825`, `#I238694`, `#I241974`, `#I243864`, `#I245087` – The support has been provided for free text annotation.
- `#I246059` - Exposed the thumbnailClick event to identify the thumbnail clicks action.
- `#I246767` – The support has been provided to export the annotation details as JSON object in client-side.
- `#I245008` – The support has been provided to update the existing calibrate annotation if we modify the scale value.
- Improved the scrolling performance in mobile devices.

## 17.2.49 (2019-09-04)

### PDF Viewer

#### Bug Fixes

- `#I246044` – The assigned author name is now preserved properly while loading or saving the document in PDF Viewer.
- `#I245087` – The Polygon, Perimeter, and Volume annotations will be drawn properly in the low zoom values.
- `#I245820` - Magnification on double tap will no longer happen when the pinch zoom is disabled in the PDF Viewer control.
- `#I244787` – The Comment panel is now opened properly while double clicking the annotation created from the code behind.
- `#I246041` - The warning message will no longer be thrown when the web action method is executed.

## 17.2.47 (2019-08-27)

### PDF Viewer

#### New Features

- `#I243205`, `#I245009` - Provided the support to include Custom stamps in stamp dropdown.
- `#I243133` - Provided the support to customize tooltip of the hyperlink on mouse hover.
- `#I245007` - Provided the Feet unit support in measurement annotation.

#### Bug Fixes

- `#I244499` - The shape and measurement annotations will now be rendered properly in the rotated documents.
- `#I244481` - The script errors will no longer be thrown in PDF Viewer in IE browser.

## 17.2.46 (2019-08-22)

### PDF Viewer

#### Breaking Changes

- The following API is renamed.

| Existing API name| New API Name |
|------|-------------|
| toolbarItem| toolbarItems|

#### New Features

- `#I223065`, `#I234860`, `#I241770`, `#I241487`, `#I229426`, `#I244801` – Provided the support for importing and exporting the annotation details as a JSON object.

#### Bug Fixes

- `#I243837` – Exception will no longer be thrown while loading the PDF document as FileStream.

## 17.2.41 (2019-08-14)

### PDF Viewer

#### Bug Fixes

- `#I241487`, `#I243077` - Annotation author name is now updated properly in the comment panel.
- `#I242804` - The Bookmark's destination value is now maintained properly during navigation.
- `#I241487` - The provided PDF document will now be loaded properly in the PDF Viewer control.
- `#I244437` - Resolved the typo errors in the PDF Viewer toolbar content.
- `#I244654` - The editAnnotation API is now working properly.
- `#I243134` - The PDF documents load properly when render the PDF Viewer control under multiple tab with fitToPage view mode during initial loading.

## 17.2.40 (2019-08-06)

### PDF Viewer

#### New Features

- `#I242329` - Provided the support to customize scale ratio value of measurement annotation.
- `#I241886` - Provided the support to display context menu in mouse up action.

#### Bug Fixes

- `#I242495`, `#I243160` – Hyperlink element is now rendered properly for the rotated page document.
- `#I238064` – Searched target text is now highlighted properly for the provided document.
- `#I241904`, `#I241294` – Converted PDF document is now rendered properly in IE browser.
- `#I242282` – Text search is now working properly while using PDF Viewer control inside the Tab control.

## 17.2.39 (2019-07-30)

### PDF Viewer

#### New Features

- `#I240440` - More details have been provided in the ajaxRequestfailure event.
- `#I242375` – Now, the annotation edit toolbar is enabled by default using the enableAnnotationToolbar property.
- `#I241715` - Support has been provided to render the annotation modified date and time in the comment panel.

#### Bug Fixes

- `#I242803` - The request handling has been optimized for retrieving the comments details from the PDF document.

## 17.2.36 (2019-07-24)

### PDF Viewer

#### New Features

- Provided the API to modify the scale ratio to change the quality of the pages rendered in the PDF Viewer.

## 17.2.35 (2019-07-17)

### PDF Viewer

#### Bug Fixes

- `#I229426` - Provided the API to select, edit, and delete the annotations.

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

- `#I208298`, `#I223253`, `#I224643`, `#I233655`, `#I238694` - Provided the supports for shape annotations.
- `#I219446`, `#I224643`, `#I230115`, `#I233032`, `#F144297`, `#I236825`, `#I238694` - Provided the supports for stamp annotations.
- `#I229426` - Provided the supports for calibrate annotations.
- `#I223253`, `#I238694` - Provided the supports for sticky notes annotations.
- `#I238812` – Provided support to restrict the hyperlink navigation.
- `#I236995` – Provided support to restrict the pinch zooming using the ‘enablePinchZoom’ property.

#### Bug Fixes

- `#I233161` – Now, loading Indicator will be shown properly while loading a large page size document.
- `#I233035` - HyperlinkClick event is now triggered properly.
- `#I234364` - Pan interaction mode is now working properly when the toolbar is disabled.
- `#I231436` - PDF document is now rendered properly while using the PDF Viewer control inside Tab control.
- `#I232104` - Cleared the warnings in css files.
- `#I238761` - Height of the PDF Viewer control is now maintained properly when using inside the tab control.

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

- `#I208298`, `#I223253`, `#I224643`, `#I233655`, `#I238694` - Provided the supports for shape annotations.
- `#I219446`, `#I224643`, `#I230115`, `#I233032`, `#F144297`, `#I236825`, `#I238694` - Provided the supports for stamp annotations.
- `#I229426` - Provided the supports for calibrate annotations.
- `#I223253`, `#I238694` - Provided the supports for sticky notes annotations.

#### Bug Fixes

- `#I233161` – Now, loading Indicator will be shown properly while loading a large page size document.
- `#I233035` - HyperlinkClick event is now triggered properly.
- `#I234364` - Pan interaction mode is now working properly when the toolbar is disabled.
- `#I231436` - PDF document is now rendered properly while using the PDF Viewer control inside Tab control.
- `#I232104` - Cleared the warnings in css files.

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

#### Bug Fixes

The PDF Viewer component enables you to view and print the PDF files.

- Both normal and PDF files protected with AES and RC4 encryption can be opened and displayed.
- Core interactions are included: scrolling, zooming, panning, and page navigation.
- Built-in toolbar.
- Text can be selected and copied from PDF files.
- Text can be easily searched for across the PDF document.
- Easy navigation with the help of bookmarks, thumbnails, hyperlinks, and a table of contents.
- Two view modes are included: fit-to-page and fit-to-width.
- An entire document or a specific page can be printed directly from the browser.
