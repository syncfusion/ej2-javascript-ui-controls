# Changelog

## [Unreleased]

## 25.2.4 (2024-05-14)

### Image Editor

#### Bug Fixes

- `#I587459` - The issue with "Image size increased" has been resolved.

## 25.2.3 (2024-05-08)

### Image Editor

#### Bug Fixes

- `#I585515` - The issue with "script error throws when custom toolbar with frame option in image editor" has been resolved.

### Image Editor

#### Bug Fixes

- The issue with "dropdown button `popup` has empty space when using toolbar property in ImageEditor" has been resolved.

## 25.1.42 (2024-04-30)

### Image Editor

#### Bug Fixes

- `#I584239` - The issue with "Add Image dropdown item not displayed while using custom toolbar property as annotate" has been resolved.

## 25.1.40 (2024-04-16)

### Image Editor

#### Bug Fixes

- The issue with "content and close icon not proper in alert dialog of the ImageEditor" has been resolved.

## 25.1.39 (2024-04-09)

### Image Editor

#### Bug Fixes

- `#I564880` - The issue with "unable to restore the old image position after reopening the same image" has been resolved.
- `#I575218` - The issue with "Image annotation not selected when we set the drawImage method with isSelected parameter as true." has been resolved.

## 25.1.38 (2024-04-02)

### Image Editor

#### Bug Fixes

- `#I875625` - The issue with "need to add all default toolbar items in `API` link" has been resolved.

## 25.1.37 (2024-03-26)

### Image Editor

#### Bug Fixes

- `#I567703` - The issue with "Script error thrown in ProfilePicture ImageEditor sample on a mobile device" has been resolved.

- `#I565340` - The issue with "Script error thrown when attempting to reopen a base64 URL using a custom toolbar in mobile mode" has been resolved.

- `#I566745` - The issue with "FontSize is not updated properly while using the updateShape method" has been resolved.

- `#I570160` - "Provide the option to change stroke color for annotations using the shapeChanging event at the beginning of the toolbar render" has been completed.

## 25.1.35 (2024-03-15)

### Image Editor

#### Bug Fixes

- The issue with "Resizing event argument value not proper while resizing " has been resolved.

### Image Editor

#### Bug Fixes

- `#I555243` - The issue with "Text area not applied while using GetImageData method" has been resolved.

### Image Editor

#### Bug Fixes

- Issue with "Toolbar not refreshing while using select public method" has been resolved.

## 24.1.41 (2023-12-18)

### ImageEditor

#### Features

- Provided support for image straightening allows users to adjust an image by rotating it clockwise or counter clockwise. The rotating degree value should be within the range of -45 to +45 degrees for accurate straightening. Positive values indicate clockwise rotation, while negative values indicate counter clockwise rotation.

- Provided support to add additional font families for text annotation.

## 23.1.36 (2023-09-15)

### ImageEditor

#### Features

- Provided support for image annotations allowing users to insert and display multiple images in addition to the main image they are editing.
- Provided support for frames allowing users to add decorative borders or frames around images. Frames can enhance the visual appeal of an image..
- Provided resizing support allowing users to adjust the size and dimensions of an image to suit their needs, such as printing, web display, or other purposes.

## 22.2.11 (2023-08-29)

### Image Editor

#### Bug Fixes

- `#I494726` - The issue with "Annotations pen drawing not working properly in ipad" has been resolved.

## 22.2.10 (2023-08-22)

### Image Editor

#### Bug Fixes

- Issue with "toolbar" property has been resolved.

- Issue with "Script error thrown while editing multiple text area" has been resolved.

## 22.2.9 (2023-08-15)

### Image Editor

#### Bug Fixes

- Issue with "Script error thrown while applying text area changes to canvas" has been resolved.

## 22.2.5 (2023-07-27)

### Image Editor

#### Bug Fixes

- Issue with "Path size not proper after saving" has been resolved.

## 22.1.39 (2023-07-18)

### Image Editor

#### Bug Fixes

- Issue with "Circle cropped image is not saved properly" has been resolved.

## 22.1.38 (2023-07-11)

### Image Editor

#### Bug Fixes

- Issue with "Image not drawn properly after opening image as ImageData" has been resolved.

## 22.1.37 (2023-07-04)

### Image Editor

#### Bug Fixes

- Issue with "Touch events are not un-wired properly while destroying control" has been resolved.

## 22.1.36 (2023-06-28)

### Image Editor

#### Bug Fixes

- Issue with "Refreshing the Image Editor dimension while resizing" has been resolved.

## 22.1.34 (2023-06-21)

### Image Editor

#### Features

- Provided support for path annotations allowing users to annotate specific paths or routes within a document or graphical representation.
- Provided support for arrow annotations allowing users to easily indicate direction or flow within their content.
- Provided quick access toolbar support which improve accessibility when working with shapes. It automatically appears when shapes are selected, providing convenient access to commonly used tools and options.

#### Breaking Changes

- Previously, the "ShapeChanging" event was triggered for both shape modifications and selection customizations. However, a new event called "SelectionChanging" has been introduced specifically for selection customizations.

### Image Editor

#### Bug Fixes

- Issue with "GetImageData method returns low resolution data" has been resolved.

## 21.1.39 (2023-04-11)

### Image Editor

#### Bug Fixes

- Issue with "Shape changing event not triggered while inserting crop selection" has been resolved.

## 21.1.37 (2023-03-29)

### Image Editor

#### Bug Fixes

- Issue with "Shape changing event not triggered while inserting crop selection" has been resolved.

### Image Editor

#### Bug Fixes

- Issue with "Script error thrown while using Toolbar Template" has been resolved.

## 21.1.35 (2023-03-23)

### Image Editor

#### Features

- Provided the undo/redo support, that records all the actions so that it can be reverted later if necessary.
- Provided pinch zoom support to zoom in or out the image while performing pinch on touch enabled devices.
- Provided mouse wheel zoom support to zoom in/out the image while scrolling mouse wheel with ctrl key press.
- Provided public method 'getImageDimension' to get the current image size with its coordinates.
- Provided click event to get the current cursor position on the image.

#### Breaking Changes

|Previous Enum Name|Modified Enum Name|
|-----------|-----------|
|ImageFinetuneOptions|ImageFinetuneOption|
|ImageFilterOptions|ImageFilterOption|
|ImageEditorCommands|ImageEditorCommand|

#### Bug Fixes

- Issue with "Script error thrown while resizing control without toolbar" has been resolved.

## 20.4.40 (2022-12-28)

### Image Editor

#### Bug Fixes

- Issue with "Toolbar Alignment" has been resolved.

## 20.4.38 (2022-12-21)

### Image Editor

#### Bug Fixes

- Issue with "Save Button Alignment in mobile mode" has been resolved.

### Image Editor

#### Bug Fixes

- Issue with "Toolbar Template Alignment" has been resolved.

## 20.3.48 (2022-10-05)

### Image Editor

#### Bug Fixes

- Issue with "Screen Orientation Alignment in mobile mode" has been resolved.

## 20.3.47 (2022-09-29)

### Image Editor

The Image Editor control is a graphical user interface used for editing images. It provides built-in support for rotate, flip, zoom, and crop the images based on the selection. It also has support for inserting an annotations including rectangle, ellipse, line, text, and freehand drawings.

- **Selection** - The selection region can be a `square` or `circle`, customized to various aspects ratios, and customized by dragging and resizing.
- **Crop** - The image can be cropped based on the selection.
- **Rotate** - The image can be rotated both clockwise and anticlockwise by 90 degrees.
- **Flip** - The image can be flipped both horizontally and vertically.
- **Zoom** - The image can be zoomed in and out.
- **Pan** - View the entire image by toggling the pan option from the toolbar.
- **Freehand drawing** - Draw freehand on the image and adjust the pen's stroke width and stroke color.
- **Reset** - Revert all the edited states and load the original image.
- **Save** - Save the edited image in JPEG, PNG, and SVG formats.
- **Annotation** - `Text`, `rectangle`, `ellipse`, and `line` annotation shapes are supported.
