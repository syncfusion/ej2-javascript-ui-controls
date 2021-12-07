# Changelog

## [Unreleased]

### Splitter

#### Bug Fixes

- `#I341650` - The issue with "Resize event handler is not properly un-wired, when destroying the splitter component" has been resolved.

## 19.2.55 (2021-08-11)

### Dashboard Layout

#### Bug Fixes

- `#I306072` - The Floating issue in Dashboard Layout when the scroll bar is in the middle of the page has been resolved.

## 19.2.48 (2021-07-20)

### Splitter

#### Bug Fixes

- `#I334749` - Resolved the exception raised, when resizing the window with splitter rendered in the page.

## 19.1.63 (2021-05-13)

### Splitter

- Provided `enablePersistence` property to persists the component's state between page reloads.

- Provided `enableReversePanes` property to reorder the splitter panes.

## 19.1.58 (2021-04-27)

### Splitter

#### Bug Fixes

- `#F163365` - The issue with "When the first pane is collapsed, the size of the second pane is not properly set" has been resolved.

## 19.1.55 (2021-04-06)

### Splitter

#### Bug Fixes

- `#320479` - The issue with "`addPane` public method does not work when rendered with the nested splitter" has been resolved.

## 19.1.54 (2021-03-30)

### Dashboard Layout

#### Bug Fixes

- `#312164` - The issue with "Newly added dashboard panels hide while switch between mobile mode to normal mode" has been resolved.

- `#310199` - The issue "Unable to resize when rendering multiple panels" has been resolved.

### Splitter

#### Bug Fixes

- `#315820, #313937, #316711` - The issue with "Console error occurs on resizing when the splitter is rendered" has been resolved.

- `#F163365` - The issue with "When the first pane is collapsed, the size of the second pane is not properly set" has been resolved.

## 18.4.30 (2020-12-17)

### Dashboard Layout

#### Bug Fixes

- `F159402` - The issue with "The Syncfusion components are not rendered inside the Dashboard Layout while using the selector template" has been resolved.

- `F159797` - Now, the Dashboard Layout component is also available in the Theme studio.

## 18.3.53 (2020-12-08)

### Dashboard Layout

#### Bug Fixes

- `#303968` - The issue with "Script error occur in DashboardLayout, when updating its parent props using setState method in React platform" has been fixed.

## 18.3.48 (2020-11-11)

### Dashboard Layout

#### Bug Fixes

- `#F159413` - The issue with "Script error occurs when dynamically updating the panels using V-for" has been fixed.

## 18.3.44 (2020-10-27)

### Dashboard Layout

#### Bug Fixes

- `#292627` - The issue "Panels are overlapped with each other during window resize" has been fixed.

## 18.3.40 (2020-10-13)

### Dashboard Layout

#### Bug Fixes

- `#271335` - The support for rendering panels with their respective column size in the mobile view has been provided.

## 18.3.35 (2020-10-01)

### Dashboard Layout

#### Bug Fixes

- `#284795, #286988, #291408, #291630` - The issue with rendering panels when using angular template has been fixed.

- `#282904` - The issue with the empty space while setting allowFloating as true has been resolved.

- `#271335` - The support for rendering panels with their respective column size in the mobile view has been provided.

## 18.2.58 (2020-09-15)

### Splitter

#### Bug Fixes

- `#I288982` - The issue with "Resizing feature is not working properly when the splitter’s height is more than the window" has been resolved.

## 18.2.46 (2020-07-21)

### Dashboard Layout

#### Bug Fixes

- `#278405` - Issue with Dashboard element dimensions not updated properly based on the parent element dimensions has been resolved.

## 18.2.44 (2020-07-07)

### Dashboard Layout

#### Bug Fixes

- `#276817` - Panel content will now get persisted on page reload with persistence enabled.

## 18.1.52 (2020-05-13)

### Dashboard Layout

#### New Features

- `#269881` - Provided support to restrict the dragging functionality of an individual panel by adding `e-drag-restrict` cssClass to the panel.

### Splitter

#### Bug Fixes

- `#273127` - Resolved the issue "Splitter resizing does not work as expected in the internet explorer browser".

- `F153749` - Issue with "Splitter expand and collapse action doesn't work as expected after the pane resize" has been resolved.

## 18.1.48 (2020-05-05)

### Dashboard Layout

#### Bug Fixes

- `#275109` - Issue with floating the panels in inline rendering has been resolved.

## 18.1.46 (2020-04-28)

### Splitter

#### Bug Fixes

- `#272732` -The issue with Splitter pane size decreased by resize of window has been resolved.

## 18.1.45 (2020-04-21)

### Splitter

#### Bug Fixes

-`#272515`, `#F153399` - Resolved the issue with nested splitter resizing is not working properly.

- Resolved the alignment issue with expand and collapse icons in the internet explorer browser.

## 18.1.44 (2020-04-14)

### Splitter

#### Bug Fixes

- `#269482` - Resolved the expand and collapse icons hidden issue when panes are expanded or collapsed.

### Dashboard Layout

#### Bug Fixes

- `#271938` - The issue with `The Dashboard layout resize icon style overrides the RTE component image style` has been resolved.

## 17.4.51 (2020-02-25)

### Splitter

#### Bug Fixes

- `F11801` - Resolved the script errors thrown when performing keyboard action in single pane.

### Dashboard Layout

#### Bug Fixes

- `#263850` - The issue with the invalid cursor that is displayed in panel content or header, which is not in draggable element has been resolved.

## 17.4.50 (2020-02-18)

### Splitter

#### Bug Fixes

- `#263496` - Resolved the issue with the splitter paneSettings `collapsed` property that is not updated properly when the panes are expanded or collapsed.

### Dashboard Layout

#### New Features

- `#262900` - The `change` event now triggers when a panel is resized and then the adjacent panel position changes.

## 17.4.47 (2020-02-05)

### Splitter

#### Bug Fixes

- `#261892` - Issue with removePane public method does not update the value of the paneSettings property.

### Dashboard Layout

#### Bug Fixes

- `#262675` - Provided the support to prevent the XSS attacks using the `enableHtmlSanitizer` property.

## 17.4.46 (2020-01-30)

### Dashboard Layout

#### Bug Fixes

- `#F150686` - The issue "Panels overlapping when you drag from top to bottom" has been resolved.

### Splitter

#### Bug Fixes

- `#261757` - The issue, "cssClass not set into pane when you add the pane using the addPane method" has been resolved.

- `#261829` - Keyboard interaction issue with input components has been resolved.

## 17.4.44 (2021-01-21)

### Dashboard Layout

#### Bug Fixes

- Resolved the script error while destroying the dashboard layout component in IE11 browser.

### Splitter

#### Bug Fixes

- `#I261044` - Issue with expand and collapse icons button type has been resolved.

## 17.4.43 (2020-01-14)

### Splitter

#### Bug Fixes

- `#255853` - Resolved the issue "Splitter resizing does not work as expected if it has an iframe element".

- `#259892` - Resolved the issue "Splitter pane is not properly resized when it has percentage pane size".

- `#258254` - Resolved the issue with the public method `addPane` that does not work when rendered a single pane.

## 17.4.41 (2020-01-07)

### Dashboard Layout

#### Bug Fixes

- `#258121` - Resolved the CSS warnings in Firefox 71.0 version.

### Splitter

#### Bug Fixes

- `#254606` - Web accessibility issues resolved.

#### New Features

- Provided `Keyboard navigation support` for splitter. The available keyboard shortcuts are,

    - `Up Arrow` - will move separator towards up in vertical splitter.
    - `Down Arrow` - will move separator towards down in vertical splitter.
    - `Right Arrow` - will move separator towards right in horizontal splitter.
    - `Left Arrow` - will move separator towards left in horizontal splitter.
    - `Enter key` - will toggle nearest collapsible pane of focused separator.

## 17.4.40 (2019-12-24)

### Dashboard Layout

#### Bug Fixes

- Panels overlapping issue "while dragging the panels in bootstrap theme" has been resolved.

## 17.4.39 (2019-12-17)

### Splitter

#### New Features

- `#255003` - Provided the cssClass property to individual panes also to customize it in the Splitter.

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
