# Changelog

## [Unreleased]

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
