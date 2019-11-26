# Changelog

## [Unreleased]

## 17.3.29 (2019-11-26)

### Dashboard Layout

#### Bug Fixes

- `#256123` - Issue with removing `e-dragging` class after panel resize has been resolved.

### Splitter

#### Bug Fixes

- `#I255141` -Resolved the issue with separator's visible state when collapsible the last pane .

- `#252195` - The alignment issue with expand and collapse icons in the internet explorer browser has been resolved.

## 17.3.28 (2019-11-19)

### Dashboard Layout

#### Bug Fixes

- `#F149164` - Resolved the issue with panel resizing when more than one Dashboard Layout component is used in a page.

### Splitter

#### New Features

- `#251791` - Provided the support to use DOM element as pane content by configuring the selector to the content of `paneSettings` property.

## 17.3.27 (2019-11-12)

### Splitter

#### Bug Fixes

- `#253345` - The Console error thrown when navigating from splitter component to another page has been resolved.

- `#252410` - Resolved the issue with collapsing panes when set `collapsed` property as true in Splitter.

- `#252410` - Issue with `Expand` public method not working in the splitter has been resolved.

- `#252410` - Resolved the interaction issue with expand and collapse pane.

## 17.2.48-beta (2019-08-28)

### Splitter

#### Bug Fixes

- `#241183` - Issue with "show the expand and collapse arrow on hovering middle of split bar" has been resolved.

- `#242579` - Resolved the issue with "Split-bar rendering while change orientation dynamically"

- `#243003` - Resolved the issue with enabling expand and collapse arrow based on collapsible property.

- `#243007` - The issue "Collapsing and expanding splitter control does not return to original state" has been resolved.

- `#244847` - The issue "Split panes are not resized properly on window resizing" has been resolved.

## 17.1.51 (2019-06-11)

### Dashboard Layout

#### Bug Fixes

- #237417 - Click event of button is not triggering when it is placed inside the panel element of DashboardLayout.

## 17.1.49 (2019-05-29)

### Dashboard Layout

#### New Features

- #236095 - Support for refresh method has been provided, which allows to refresh the panels.

## 17.1.48 (2019-05-21)

### Dashboard Layout

#### Bug Fixes

- #144602 - Issue on panel resizing after adding a new panel dynamically has been fixed.

## 17.1.43 (2019-04-30)

### Dashboard Layout

#### Bug Fixes

- #234604 - Issue with draggable cursor appears on hovering over the panels when dragging is disabled has been fixed.

## 17.1.40 (2019-04-09)

### Dashboard Layout

#### Breaking Changes

- Renamed the folder within the package from `dashboardlayout` to `dashboard-layout`.

## 17.1.32-beta (2019-03-13)

### Splitter

#### Bug Fixes

- The issue with not able to set null value value for `cssClass` API has been fixed

#### New Features

- **Expand and Collapse**: This feature allows you configure and interact with the expand and collapse functionality of splitter.

## 16.4.55 (2019-02-27)

### Splitter

#### Bug Fixes

- The issue with dynamic update of `paneSettings` has been fixed.

## 16.4.54 (2019-02-19)

### Splitter

#### Bug Fixes

- Issue with dynamic update of pane content has been fixed

## 16.4.53 (2019-02-13)

### Card

#### Bug Fixes

- The issue with white background for the Card control has been fixed in Material theme.

## 17.1.1-beta (2019-01-29)

### DashboardLayout

The DashboardLayout is a grid structured layout control that helps create a dashboard with panels. Panels hold the UI components and allow resize, reorder, drag-n-drop, remove and add options. This allows users to easily place the components at the desired position within the grid layout.

- **Drag and Drop**: Allows drag and drop of panels at the desired location within the dashboard.
- **Resizing**: Support to resize the panels in any direction as per the requirement.
- **Floating**: Floats the panels upward when the dragging option is enabled.
- **Media Query**: Allows the panels to be stacked when the specified resolution is met.

## 16.4.47 (2019-01-16)

### Splitter

#### Bug Fixes

- The issue with dynamically updating the pane size has been fixed.

## 16.4.44 (2018-12-24)

### Splitter

#### New Features

- Provided option to configure the splitter and its pane properties such as size, min, max, resizable through data attributes (`data-`).

- Included the public methods for add and remove splitter panes.

## 16.4.40-beta (2018-12-10)

### Splitter

The Splitter is the layout user interface (UI) which contains multiple resizable panes and separator bar.

- **Resizable**: By default, all the panes configured with resizable.
- **Orientation**: The panes can be oriented horizontally and vertically.
- **Nested**: Integrate splitter controls inside split pane to create nested layout.
- **Separator**: Divide the pane with horizontal or vertical line with customizable dimension.

## 16.2.41 (2018-06-25)

### Avatar

Avatars are icons or figures representing a particular person, used in popular media formats like images, SVG, font icons, and letters.

- **Types** - Provided 2 types of Avatar.

- **Sizes** - Supports different sizes to adapt the various application scenario.

### Card

The Card is a small container in which user can show defined content in specific structure and it is a flexible and extensible. Card is a pure CSS component built with markup and style.

The available key features are

- **Header**: Header supports to include title, subtitle along with image.

- **Images and Title**: Support to include images with customizable caption positions in it.

- **Action Buttons**: Supports to add buttons within the card either in vertical or horizontal alignment.

- **Horizontal Card**: Allows to align card elements horizontally and also allows to stack the content vertically within horizontal alignment.