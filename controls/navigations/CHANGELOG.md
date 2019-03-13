# Changelog

## [Unreleased]

## 17.1.32-beta (2019-03-13)

### Sidebar

#### New Features

- `MediaQuery` property will now support both string and `MediaQueryList` object types.

#### Bug Fixes

- Multiple event bindings issue on calling show and hide methods when `closeOnDocumentClick` property is enabled has been fixed.

### TreeView

#### New Features

- Provided an option for auto checking parent tree nodes based on child tree nodes checked state and vice versa.
- Now it is possible to select or unselect the collapsed child nodes by selecting its parent node through checkbox selection, with Load-On-Demand mode enabled.

## 16.4.54 (2019-02-19)

### Tab

#### Breaking Changes

- The initial focus set on active tab item is removed from the component on initial load.

## 16.4.53 (2019-02-13)

### Accordion

#### Bug Fixes

- Resolved the issue with accessing Accordion item object in clicked event arguments.

## 16.4.52 (2019-02-05)

### Sidebar

#### Bug Fixes

- Tabindex support has been provided.

#### Breaking Changes

- Sidebar with type `Auto` will always expand on initial rendering, irrespective of `enableDock` and `isOpen` properties.

- When dynamically changing the type property of the Sidebar with invalid property value (For ex:`Pushs`), will reset the type of the Sidebar to its default type as `Auto`.

## 17.1.1-beta (2019-01-29)

### Menu

#### Bug Fixes

- Popup not opened properly when two menu rendered side by side issue fixed.

### TreeView

#### Bug Fixes

- The issue with, “When disabling the TreeView parent nodes, the child nodes also appear in a disabled state” has been fixed.

## 16.4.45 (2019-01-02)

### Toolbar

#### Bug Fixes

- While resizing, Toolbar items are not moving from popup to toolbar in `extended` overflow mode issue is fixed.

### Menu

#### Bug Fixes

- Getting custom properties from menu items in `beforeItemRender` event issue fixed.

### Sidebar

#### Bug Fixes

- Fixed the issue with rendering the Sidebar using `isOpen` property and type `Auto`.

## 16.4.44 (2018-12-24)

### Accordion

#### Bug Fixes

- Parent accordion collapsing issue is fixed when Tab renders within it.

## 16.4.40-beta (2018-12-10)

### Tab

#### New Features

- Tab vertical orientation support was provided.

### ContextMenu

#### Breaking Changes

- The `animationSettings` property type changed from `AnimationSettings` to `AnimationSettingsModel`

### Menu

#### New Features

- Provided scrollable option in Menu for rendering large menus and submenus in an adaptive way.

#### Breaking Changes

- Type changes done for the following property.

Property Name | Old Type | New Type
-----|-----|-----
`animationSettings` | AnimationSettings | AnimationSettingsModel
`fields` | FieldSettings | FieldSettingsModel

### TreeView

#### New Features

- Provided an option to disable child nodes when load-on-demand support is enabled.
- Provided an option to disable the load-on-demand support in TreeView control.

## 16.3.33 (2018-11-20)

### Sidebar

#### Bug Fixes

- Added the `event` and `isInteracted` event arguments in open and close events of Sidebar.

### TreeView

#### Bug Fixes

- In TreeView, scrolling is not working smoothly for iPad device issue is resolved

## 16.3.29 (2018-10-31)

### TreeView

#### New Features

- Provided an option to prevent the tree node from auto checking when checked state of the parent or child tree node is modified.
- Provided support to use hierarchical data as remote data source of the TreeView component by using offline mode of data manager plugin.

## 16.3.27 (2018-10-23)

### Menu

#### Bug Fixes

- Destroy method issue while using multiple menu is fixed.

## 16.3.25 (2018-10-15)

### Menu

#### Bug Fixes

- Issue with sub menu positioning fixed.

## 16.3.23 (2018-10-03)

### Sidebar

#### New Features

- Two-way binding support has been provided for `isOpen` property.

### Tab

#### Bug Fixes

- The issue with tab selection after remove other tabs has been fixed.

## 16.3.21 (2018-09-22)

### TreeView

#### Bug Fixes

- The `nodeData` argument in `nodeSelected` event showing wrong value issue has been fixed.

## 16.3.17 (2018-09-12)

### Menu

Menu is a graphical user interface that serves as navigation header for your application or site. Menu can be populated from a data source such as an array of JavaScript objects that can be either structured as hierarchical or self-referential data. The following key features are available in Menu component.

- **Rendering** - Supports to render based on the items collection (array of JavaScript objects) and HTML elements.

- **Separator** - Supports menu items grouping by using the Separator.

- **Icons and Navigations** - Supports items to have Icons and Navigation URL's.

- **Template and Multilevel Nesting** - Supports template and multilevel nesting in Menu.

- **Accessibility** - Provided with built-in accessibility support that helps to access all the Menu component features through the keyboard, screen readers, or other assistive technology devices.

### TreeView

#### New Features

- Provided an option to get updated data source of tree view after drag and drop, editing, deleting, and adding nodes in tree view.
- Support to get custom data from tree view.
- Support to maintain expanded nodes of tree view on page reloads.
- Provided an option to get all the checked nodes if the tree node is expanded or collapsed.
- Provided 'none' option in 'expandOn' property to prevent expand or collapse of tree node
- Provided an option to prevent the parent node from expanding, while adding a node to the tree view control.

## 16.2.49 (2018-08-21)

### Tab

#### Bug Fixes

- The issue with updating model on enable/disable tab has fixed in `enableTab` method.

### TreeView

#### Bug Fixes

- Issue with drag and drop of nodes from one tree view to another empty tree view has been fixed.

## 16.2.48 (2018-08-14)

### Tab

#### Breaking Changes

- Issue with triggering select events at initial load has been resolved

### Toolbar

#### Bug Fixes

- Resolved the tooltip issue on display special character in toolbar items.

## 16.2.47 (2018-08-07)

### Tab

#### Bug Fixes

- The issue with updating model on removing tab has fixed in `removeTab` method.
- Resolve the issue which occurs on updating item value with `hideTab` method.

### Sidebar

#### Bug Fixes

- Issue with Sidebar destroyed in Angular routing is fixed.

### TreeView

#### Bug Fixes

- Tree view checkbox not working properly in Firefox browser issue has been resolved.

## 16.2.46 (2018-07-30)

### Accordion

#### Bug Fixes

- Issue with Space and Enter key, which is not working in RTE while rendering inside the Accordion is fixed

### TreeView

#### New Features

- In tree view, provided an option to prevent dropping an element in the sibling position.

## 16.2.45 (2018-07-17)

### Tab

#### Bug Fixes

- Issue with content animation, when switching to other tabs before previous animation complete is fixed

## 16.2.44 (2018-07-10)

### Sidebar

#### Bug Fixes

- `target` property is not working on lower version of Firefox browser (below 48), issue has been fixed.

## 16.2.41 (2018-06-25)

### Sidebar

#### New Features

- Support for setting the open/close state of the Sidebar has been provided with `isOpen` property.

#### Breaking Changes

- Target property supports both the id and class selectors to locate the target element.
- `isOpen()` method is now removed and know about the Sidebar is whether open or close state by using `isOpen` property.

### Tab

#### Bug Fixes

- Content initiated twice when using ng-template in Tab item has been fixed.
- Solved issues on `removeItem` public method.

### Toolbar

#### New Features

- Provided support for `MultiRow` options on toolbar items.
- Inline alignment of toolbar items support is provided.

## 16.1.42 (2018-05-08)

### Accordion

#### Bug Fixes

- Issue with space key in text area, when placed inside Accordion is fixed.

### Tab

#### Breaking Changes

- Breaking issue with dynamic loading tab content template ID is fixed.

## 16.1.40 (2018-05-08)

### Tab

#### Bug Fixes

- Issue with event unbinding in tab content is fixed.

## 16.1.38 (2018-05-02)

### TreeView

#### Bug Fixes

- TreeView is not rendering properly when you return entire data (including child nodes) on initial request issue is fixed.

### Tab

#### Bug Fixes

- Issue with loading dynamic content using template ID is fixed.

## 16.1.37 (2018-04-24)

### TreeView

#### Bug Fixes

- Issue in triggering `nodeExpanded` event while expanding all the nodes is fixed.

## 16.1.35 (2018-04-17)

### TreeView

#### Bug Fixes

- Provided option to prevent expand/collapse node while double clicking the tree node.

## 16.1.34 (2018-04-10)

### TreeView

#### Bug Fixes

- Issue in TreeView while ‘cancel' the `nodeDragDrop` event is fixed.

- Issue in TreeView drag and drop function, while adding ‘e-droppable’ class in the target element is fixed.

## 16.1.32 (2018-03-29)

### TreeView

#### Bug Fixes

- Prevented the checkbox interactions while the corresponding node was in disabled state.

## 16.1.28 (2018-03-09)

### Toolbar

#### Bug Fixes

- Toolbar border hidden issue with grid in IE11 browser is fixed.

## 16.1.24 (2018-02-22)

### Common

#### Breaking Changes

- Changed the Angular component selector, component name prefix with `ejs` e.g: `ejs-tab`.

#### New Features

- High contrast theme support.

### Sidebar

The Sidebar is an expandable and collapsible component that typically acts as a side container to place primary or secondary content alongside the main content.

- **Target** - The Sidebar can be initialized in any HTML element other than the body element.

- **Types** – Supports Push, Over, Slide and Auto to expand or collapse the Sidebar.

- **Position** – Allows to position the Sidebar in Left or Right direction.

- **Auto close** - Allows to set the sidebar in an expanded or collapsed state only in certain resolutions.

- **Dock** - By default, supports display of short notifications about the content on docked mode.

- **Backdrop** – Specifies the whether to apply overlay options to main content when the Sidebar is in open state.

### Tab

#### Breaking Changes

- Locale key changed from close to `closeButtonTitle`.

### Toolbar

#### Breaking Changes

- Pascal casing change to `align` property values (`Left`, `Center`, `Right`).

## 15.4.30-preview (2018-02-14)

### TreeView

#### New Features

- Added “getNode” method in TreeView to get the node's data based on given node element or it's ID.

- Added “beginEdit” method in TreeView, to initiate the editing mode of the TreeView node through code.

#### Breaking Changes

- In TreeView, “replaceText” method name has been modified as “updateNode”.

## 15.4.27-preview (2018-01-30)

### Tab

#### Bug Fixes

- Separate item change for active content issue with Tab fixed.

## 15.4.26-preview (2018-01-23)

### ContextMenu

#### Bug Fixes

- Lengthy text and caret icon wraps next line issue fixed.

### Accordion

#### Bug Fixes

- Accordion content class styles overriding with the other component issue fixed.

### Tab

#### Bug Fixes

- Issue with changing separate items property has been fixed.

### Toolbar

#### New Features

- Provided support to display Toolbar items in popup always.

## 15.4.25-preview (2018-01-09)

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (dist/global/index.d.ts)

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling

### Toolbar

#### Bug Fixes

- Issue with changing separate items property has been fixed.

- The Toolbar Popup and scrollable creation issue in non visible element is fixed.

- Dynamic Items updating with toolbar alignment is fixed.

- Removed unwanted space available in the Toolbar Popup mode initial time.

## 15.4.22-preview (2017-12-14)

### ContextMenu

#### Bug Fixes

- Destroy method issue in angular is fixed.

## 15.4.21-preview (2017-12-08)

### Tab

#### Bug Fixes

- Tab header overlapping issue with grid is fixed.

## 15.4.20-preview (2017-12-01)

### Common

#### New Features

- Upgraded TypeScript version to 2.6.2

## 15.4.17-preview (2017-11-13)

### Accordion

Accordion is a vertically collapsible content panel which is displaying panels, one or multiple at a time within the available space.

- **Rendering** - Supports to render based on the items collection and HTML elements.

- **Expand Mode** - Supports to define single or multiple expand mode for Accordion panels.

- **Animation** - Supports animation effects for expanding/collapsing the panels.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the Accordion component features through the keyboard, screen readers, or other assistive technology devices.

### ContextMenu

ContextMenu is a graphical user interface that appears on the user right click/touch hold action.

- **Separator** - Supports menu items grouping by using the Separator.

- **Icons and Navigations** - Supports items to have Icons and Navigation URL's.

- **Template and Multilevel Nesting** - Supports template and multilevel nesting in ContextMenu.

- **Accessibility** - Provided with built-in accessibility support that helps to access all the ContextMenu component features through the keyboard, screen readers, or other assistive technology devices.

### Tab

Tab is a content panel to show multiple contents in specific space one at a time.

- **Rendering** - Supports to render based on the items collection and HTML elements.

- **Adaptive** - Supports responsive rendering with scrollable Tabs and popup menu.

- **Animation** - Supports animation effects for moving previous/next contents of the Tab.

- **Customization** - Provides customization support for header with icons and orientation.

- **Accessibility** - Provided with built-in accessibility support which helps to access all the Tab component features through the keyboard, screen readers, or other assistive technology devices.

### Toolbar

Displays a group of command buttons arranged horizontally.

- **Rendering** - Supports to render based on the items collection and HTML elements.

- **Customization** - Supports to add buttons , separator & input components.

- **Adaptive** - Supports responsive rendering with scrollable Toolbar and popup menu.

- **Accessibility**- Provided with built-in accessibility support which helps to access all the Toolbar component features through the keyboard, screen readers, or other assistive technology devices.

### TreeView

TreeView component is used to represent hierarchical data in a tree like structure with advanced functions to edit, drag and drop, select with CheckBox and more. TreeView can be populated from a data source such as an array of JavaScript objects or from DataManager. The following key features are available in TreeView component.

- **Data Binding** - Binds the TreeView component with an array of JavaScript objects or DataManager.

- **CheckBox** - Allows you to select more than one node in TreeView without affecting the UI appearance.

- **Drag and Drop** - Allows you to drag and drop any node in TreeView.

- **Multi Selection** - Allows you to select more than one node in TreeView.

- **Node Editing** - Allows you to change the text of a node in TreeView.

- **Sorting** - Allows display of the TreeView nodes in an ascending or a descending order.

- **Template** - Allows you to customize the nodes in TreeView.

- **Accessibility** - Provides built-in accessibility support that helps to access all the TreeView component features through the keyboard, on-screen readers, or other assistive technology devices.
