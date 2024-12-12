# Changelog

## [Unreleased]

## 25.1.35 (2024-03-15)

### ProgressBar

#### Bug Fixes

- `#I558909` - The progress bar label now renders properly when setting the `textAlignment` as center.

## 24.2.5 (2024-02-13)

### ProgressBar

#### Bug Fixes

- `#I548132` - Optimized the inline style of the progress bar.

## 23.2.6 (2023-11-28)

### ProgressBar

#### Bug Fixes

- `#I520806` - The progress bar now renders properly when it exceeds the `maximum` value.

## 23.2.5 (2023-11-23)

### ProgressBar

#### Bug Fixes

- `#I520853` - The circular progress bar now renders properly for all the values.

## 23.1.38 (2023-09-26)

### ProgressBar

#### Bug Fixes

- `#I501894` - Now, the linear progress bar label renders properly when the alignment is set to center.

## 21.1.37 (2023-03-29)

### ProgressBar

#### Bug Fixes

- `#F180771` - The progress bar range color issue has been resolved.

## 21.1.35 (2023-03-23)

### ProgressBar

#### New Features

- `#I386691` - Provided support to display tooltips during initial load of progress bars and mouse hover with numeric or text values of the progress.
- Provided support to customize the width and color of the secondary progress bar.

## 20.4.38 (2022-12-21)

### ProgressBar

#### Bug Fixes

- `#I420052` - Now progress bar API reference are refreshing properly.

## 20.3.57 (2022-11-15)

### ProgressBar

#### Bug Fixes

- `#I416343` - Now corner radius is applied when applying the range colors for Progress bar.

## 20.3.56 (2022-11-08)

### ProgressBar

#### Bug Fixes

- `#I414756` - Now animation duration is working properly for indeterminate mode.

## 19.1.54 (2021-03-30)

### ProgressBar

#### Bug Fixes

- `#F159325` - ProgressBar renders inside the Grid with out any console error.

## 18.2.47 (2020-07-28)

### ProgressBar

#### Bug Fixes

- `#156094` - ShowProgressValue is now working properly on dynamic update.

## 18.2.46 (2020-07-21)

### ProgressBar

#### Bug Fixes

- `#16027` - Progress bar not updating when initially having value null or zero issue fixed.

## 18.2.45 (2020-07-14)

### ProgressBar

#### New Features

- Provided support to indicate the active state of the progress.
- Provided support for striped progress bar.
- Provided support to place the labels at the center and far ends of the track.
- Provided support to segment the progress of a task.
- Provided support to indicate success, info, warning, and danger of using different colors.

#### Bug Fixes

- Progress bar label not render at end of the progress has been fixed.
- SetAttribute of undefined issue raised when calling show() method has been fixed.

## 18.2.44 (2020-07-07)

### ProgressBar

#### Bug Fixes

- Progress bar label not render at end of the progress has been fixed.

## 18.1.42 (2020-04-01)

### ProgressBar

ProgressBar control is used to visualize the changing status of an extended operation such as a download, file transfer, or installation. All Progress bar elements are rendered by using Scalable Vector Graphics (SVG).

### Key features

- Visualizes the progress in different shapes, such as rectangle and circle.
- Customizes the ranges with different colors.
- Customizes the progress and tracks thickness.
- Displays the custom content at the center of the circular progress bar.
- Visualizes the progress in segments.
- Customizes the angle of the circular progress bar.
