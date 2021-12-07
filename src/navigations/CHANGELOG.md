# Changelog

## [Unreleased]

### Tab

#### Bug Fixes

- `#I341589` - An issue with the tab content not updated properly on the initial load has been fixed.

### Breadcrumb

Breadcrumb is a graphical user interface that helps to identify or highlight the current location within a hierarchical structure of websites. The aim is to make the user aware of their current position in a hierarchy of website links.

- **Overflow Mode** - Used to limit the number of breadcrumb items to be displayed.
- **Icons** - Icons can be specified in Breadcrumb items.
- **Template** - Supports template for item and separator.
- **Bind To Location** - Supports items to be rendered based on the URL or current location.
- **Accessibility** - Provided with built-in accessibility support that helps to access all the Breadcrumb component features through the keyboard, screen readers, or other assistive technology devices.

### Sidebar

#### Bug Fixes

- The issue with "The Sidebar background color is not correct in high-contrast theme" has been resolved.

## 19.2.62 (2021-09-14)

### Sidebar

#### Bug Fixes

- `#I341648` - The issue with "The resize event is not unwired after destroying the Sidebar component" has been resolved.

## 19.2.59 (2021-08-31)

### Tab

#### Bug Fixes

- `#I339402` - An issue with the tab `visible` property is not working on the initial load has been fixed.

## 19.2.56 (2021-08-17)

### Sidebar

#### Bug Fixes

- `#FB27112` - The issue with "The Sidebar flickering at initial loading" has been resolved.

### Tab

#### Bug Fixes

- `#F167809` - Tab content item class white space issue is fixed.

## 19.2.55 (2021-08-11)

### TreeView

#### Bug Fixes

- `#I337237` - Resolved the performance issue that occurred when removing more than 500 nodes from the TreeView using multiple selection.

### Tab

#### Bug Fixes

- `#I335995` - An issue with the touch event not triggering on tab content swipe has been fixed.

## 19.2.51 (2021-08-03)

### Tab

#### Bug Fixes

- `#F167176` - An issue with Tab item drag has been fixed.

## 19.2.48 (2021-07-20)

### Toolbar

#### Bug Fixes

- `#I335318` - An issue with Toolbar arrow icons when enabled RTL mode has been fixed.

## 19.2.46 (2021-07-06)

### Context Menu

#### Bug Fixes

- Role Attribute issue in context menu has been fixed.

## 19.1.69 (2021-06-15)

### Tab

#### Bug Fixes

- `#I330332` - An issue with the tab `aria-selected` attribute not properly updated has been fixed.

## 19.1.67 (2021-06-08)

### Toolbar

#### Bug Fixes

- `#F165830` - An issue with Toolbar template when state of component changed in functional based components has been fixed.

## 19.1.66 (2021-06-01)

### Menu

#### Bug Fixes

- `#I326704` - Provided an option to close the menu.
- `#I316367` - The issue with Menu Scroll bar using template in angular has been resolved.
- `#I328143` - The issue with Hamburger mode when changing items dynamically has been resolved.

### TreeView

#### Bug Fixes

- `#I328435` - Added the `!default` flag to the dark theme definition files.
- `#I326667` - The issue with "The getNode method returns invalid hasChildren attribute value while disabling the loadOnDemand support" has been resolved.
- `#FB24632` - Resolved the issue with "Unable to drop a node as child node while dropping it into the template node text" in the TreeView component.

## 19.1.63 (2021-05-13)

### Accordion

#### Bug Fixes

- `#I324822` - Provided the accessibility support for current state of accordion items `expanded/collapsed` when using screen reader.

### TreeView

#### Bug Fixes

- `#I320504` - The issue with "In IE Browser, the template TreeView throws an error when changing the data source using `useState`" has been resolved.

### Menu

#### New Features

- `#315809` - Delay support on hovering the menu.

## 19.1.59 (2021-05-04)

### Menu

#### Bug Fixes

- The issue with "Script error occurs while calling the refresh method in angular" has been resolved.

## 19.1.58 (2021-04-27)

### TreeView

#### Bug Fixes

- `#I320271` - The issue with "While performing drag and drop action between two TreeView components, the `dataSourceChanged` event is not triggered for the source TreeView" has been resolved.
- `#F158127` - The issue with "The TreeView `getAllCheckedNodes` method returns invalid data while setting invalid IDs to the `CheckedNodes` property" has been resolved.

## 19.1.57 (2021-04-20)

### Menu

#### Bug Fixes

- `#I316367` - Menu Scroll bar not working when window resized issue fixed.

## 19.1.54 (2021-03-30)

### Accordion

#### Breaking Changes

- The following properties type was changed.

| Property | Previous Type | Current Type                   |
|----------|---------------|--------------------------------|
| Disabled | `anonymous`      | `boolean` |
| Expanded | `anonymous`      | `boolean` |
| Visible | `anonymous`      | `boolean` |

## 18.4.47 (2021-03-09)

### TreeView

#### Bug Fixes

- `#310875` - The issue with "The `isChecked` attribute is not working when using the `sortOrder` property in TreeView" has been resolved.
- `#282214` - Now the `isChecked` attribute value is updated properly in the `NodeChecked` event arguments in the TreeView component.

## 18.4.44 (2021-02-23)

### Tab

#### Bug Fixes

- `#311688` - An issue with getting console error in tab navigation has been fixed.

## 18.4.42 (2021-02-09)

### Sidebar

#### Bug Fixes

- `#309065` - The issue with "The Sidebar destroy method throws error when continuously called two times" has been resolved.

### Tab

#### Bug Fixes

- `#299892` - An issue with the Tab destroy method throws error has been resolved.

## 18.4.41 (2021-02-02)

### Menu

#### Bug Fixes

- `291781` - The issue with caret icon alignment is fixed.

## 18.4.39 (2021-01-28)

### Toolbar

#### Bug Fixes

- `#303821` - An issue with toolbar content is not aligned properly in IOS devices has been fixed.

### TreeView

#### Bug Fixes

- `#302025` - The issue with "The TreeView template node content disappears while calling the `refreshNode` method" has been resolved.
- `#300093` - Now, the TreeView template node custom events will be triggered after using the `refreshNode` method.

## 18.4.35 (2021-01-19)

### TreeView

#### Bug Fixes

- `#307712` - The issue in getting the invalid `isChecked` attribute value in the `getTreeData` method for the dynamically added nodes has been resolved.

## 18.4.34 (2021-01-12)

### Accordion

#### Bug Fixes

- `#309133` - Accordion item is automatically closed when the `onChange` is raised in input element has been fixed.

### Tab

#### Bug Fixes

- `#301347` - An issue with `refreshActiveTab` public method has been fixed.

## 18.4.33 (2021-01-05)

### Context Menu

#### Bug Fixes

- `F160329` - The issue with template item focus in ContextMenu is fixed.

### TreeView

#### Bug Fixes

- `#307778` - Now, the Expanded attribute value will be updated properly in the `nodeCollapsed` event.

### Tab

#### Bug Fixes

- `#306302` -  The original event parameter is exposed in tab selecting event.
- `#306228` - An issue with closing the tab item clear the content of all the tab items has been fixed.
- `F159991` -  An issue with Contents of the tab content are displayed incorrectly has been fixed.

## 18.4.31 (2020-12-22)

### Menu

#### Bug Fixes

- An issue with menu closing has been fixed.

## 18.3.50 (2020-11-17)

### Tab

#### New Features

- `#298781, #159033, #301025, #299403, #301347` - Provided `refreshActiveTab` public method to refresh the active tab item.

## 18.3.47 (2020-11-05)

### TreeView

#### New Features

- `#295977` - Provided an option to identify the dragged node's dropping position which is relative to the dropped node.
- `#F158142` - Now, the TreeView template node interaction is enabled.

## 18.3.42 (2020-10-20)

### TreeView

#### Bug Fixes

- `#286629` - The issue with "when quickly clicking on the different nodes then it is interpreted as double click" has been resolved.

## 18.3.40 (2020-10-13)

### Tab

#### Bug Fixes

- `#I292579` - An issue with when we set the `heightAujustMode` as Fill it makes container height too high has been resolved.

## 18.3.35 (2020-10-01)

### TreeView

#### Bug Fixes

- Standardized the spacing between two TreeView nodes in the Bootstrap4 theme.

## 18.2.54 (2020-08-18)

### TreeView

#### Bug Fixes

- `#286992` - The issue with rendering the TreeView with hierarchical data source using the offline property has been resolved

## 18.2.47 (2020-07-28)

### Tab

#### Bug Fixes

- `#279134` - An issue with cross side scripting validation has been fixed.

## 18.2.44 (2020-07-07)

### Menu

#### Bug Fixes

- An issue with menu selection has been fixed.
- An issue with hamburger mode has been fixed.

### Context Menu

#### Bug Fixes

- An issue with sub menu after preventing first sub menu has been fixed.

### Accordion

#### Bug Fixes

- `#275090` - An issue with Ripple effect when destroy and rendered nested accordions has been fixed.
- `#273054` - An issue with cross side scripting validation has been fixed.
- `#275509` - An issue with `addItem` public method when passing multiple items has been fixed.

### Tab

#### Bug Fixes

- `#273054` - An issue with cross side scripting validation has been fixed.

### Toolbar

#### Bug Fixes

- `#275422` - An issue with toolbar scrolling is not working properly after perform window resize has been fixed.

### TreeView

#### Bug Fixes

- `#276986` - Now, the previous state will be restored in the TreeView when the CRUD operation is failed at the server side.

### Sidebar

#### Bug Fixes

- `#272991` - The issue with "Unable to use the same target for more than one Sidebar component" has been resolved.

## 18.1.54 (2020-05-26)

### Menu

#### Bug Fixes

- Provided 'getItemIndex' public method to get the index of the menu item.

### TreeView

#### Bug Fixes

- `#269540` -The issue with `The getAllCheckedNodes method which is not returning the proper checkedNodes values in the TreeView component` has been fixed.

#### New Features

- `#274084` - Provided an option to set the drag area in TreeView component.

## 18.1.45 (2020-04-21)

### Menu

#### Bug Fixes

- Menu selection issue has been resolved.

## 18.1.43 (2020-04-07)

### ContextMenu

#### Bug Fixes

- `F152308` - Context menu popup position misaligned while using `beforeOpen` event has been resolved.

### Menu

#### Bug Fixes

- Menu not working properly when collapsing the sub menu in hamburger mode has been resolved.

## 18.1.36-beta (2020-03-19)

### TreeView

#### New Features

- `#253508` - Now, the `actionFailure` event triggers when failure occurs while performing the CRUD operations in TreeView remote data.

- `#227878` - Provided an option to disable the TreeView component.

- `#255907, #F146305` - Provided an option to enable the entire TreeView node as navigable.

#### Breaking Changes

- Using the remote data and performing CRUD operation in TreeView requires the controller part to handle the CRUD operation at server-side. But, it doesn’t require controller part while using the offline remote data.

- `#227540` - Reverted the support for rendering TreeView data in single server request while disabling the loadOnDemand. But, this support can be achieved by specifying the offline as `true` in remote data.

### Tab

#### Bug Fixes

- `#266275` - An issue with tab navigation is not working after removed the first tab has been fixed.

### Accordion

#### Bug Fixes

- `#263853` - An issue with height is not properly set to the accordion item when perform expand or collapse has been fixed.

## 17.4.50 (2020-02-18)

### TreeView

#### Breaking Changes

- `#263334` - Standardized the right-click interaction in TreeView component. Now, the TreeView node will not be selected when you right-click it.

## 17.4.49 (2020-02-11)

### TreeView

#### Bug Fixes

- `#262276` - Resolved the performance issue occurred when check or uncheck the parent node in TreeView component.

### Menu

#### Bug Fixes

- An issue when setting id as number in menu Item is fixed.

## 17.4.46 (2020-01-30)

### Tab

#### Bug Fixes

- `#260479` - An issue with selected event is triggered unnecessarily after the refresh tab has been fixed.

## 17.4.44 (2021-01-21)

### Menu

#### Bug Fixes

- Issue with closing sub menu is fixed.

## 17.4.43 (2020-01-14)

### TreeView

#### Bug Fixes

- `#258993` - Now, expand and collapse is working properly after enabling the ripple effect.
- `#258121` - Resolved the CSS warnings in Firefox 71.0 version.

## 17.4.39 (2019-12-17)

### TreeView

#### New Features

- `#249238` - Provided the support for refreshing a specific node in tree view.
- `#253508` - Now, the `actionFailure` event triggers while fetching data from the invalid path.
- `#247333` - Support has been provided to get the disabled nodes in the tree view.

### Tab

#### Breaking Changes

- An issue with duplicate Tab item id while rendering more than one Tab in same page has been fixed.

#### Bug Fixes

- An issue with bootstrap CSS file generation has been fixed.

### Accordion

#### Bug Fixes

- An issue with bootstrap CSS file generation has been fixed.

### Toolbar

#### Bug Fixes

- `#248406` - An issue with destroying sub control rendered inside toolbar is fixed.

## 17.3.27 (2019-11-12)

### Tab

#### Bug Fixes

- `#253216` - An issue with destroying Tab component in IE11 has been fixed.

### TreeView

#### Bug Fixes

- #242926 - Now the drop indicator has been shown correctly while hovering the expand and collapse icon.

## 17.3.17 (2019-10-15)

### Tab

#### Bug Fixes

- `#250013` - An issue with nested tab rendering while `headerPlacement` is set as `Bottom` has been fixed.

## 17.3.16 (2019-10-09)

### Toolbar

#### Bug Fixes

- `#246126` - An issue with toolbar is not working properly in overflow as popup mode when we used input elements in it has been fixed.

## 17.3.14 (2019-10-03)

### Accordion

#### Bug Fixes

- #245474 - Improper rendering of other components inside the accordion content issue has been fixed.

- Material dark theme issue has been resolved.

- Accessing multiple cssClass property issue with accordion has been fixed.

### Tab

#### New Features

- Provided scroll step customization support for tab header.

### TreeView

#### Bug Fixes

- #246937 - The unchecking checkbox performance issue has been resolved.

## 17.3.9-beta (2019-09-20)

### Tab

#### New Features

- Provided template support for tab header.

### Accordion

#### New Features

- Provided item template support for accorion.

### TreeView

#### Bug Fixes

- #242926 - Now the drop indicator has been shown correctly while enabling the checkbox.

## 17.2.49 (2019-09-04)

### Menu

#### Bug Fixes

- Issue with modifying item in 'beforeOpen' event creates extra Item in Context Menu is fixed.

## 17.2.48-beta (2019-08-28)

### Toolbar

#### New Features

- `enableItems` public method will now support number type.

### Accordion

#### Breaking Changes

- The `expanded` event type changed from `ExpandEventArgs` to `ExpandedEventArgs`.

## 17.2.41 (2019-08-14)

### TreeView

#### Bug Fixes

- Issue with custom icon size changed while double clicking the tree node has been fixed.

## 17.2.40 (2019-08-06)

### TreeView

#### Bug Fixes

- #242925 - Issue with checked and unchecked the checkbox using keyboard interaction even disable the checkbox has been fixed.

## 17.2.39 (2019-07-30)

### TreeView

#### Bug Fixes

- #242589 - Issue with getting checked nodes value using `checkedNodes` property has been fixed.

## 17.2.34 (2019-07-11)

### Accordion

#### Bug Fixes

- #239739 - An issue with addItem public method for accordion which was rendered using HTML elements has been fixed

## 17.2.28-beta (2019-06-27)

### Menu

#### Bug Fixes

- #237136 - Issue with Parent Menu click in mobile mode.

- #236458 - Issue with Menu Item hovering while a page contains multiple menus.

### Sidebar

#### Breaking Changes

- Change event will trigger only after the expand or collapse transition of the Sidebar.

## 17.1.49 (2019-05-29)

### TreeView

#### Bug Fixes

- #234147 - Issue with getting checked nodes value using `getAllCheckedNodes` method has been fixed.

## 17.1.48 (2019-05-21)

### Sidebar

#### Bug Fixes

- #236219 - On initial rendering, right positioned sidebar opens and closes irrespective of type and isOpen properties has been fixed.

### Tab

#### Bug Fixes

- #235397 - The cancel parameter is exposed in tab selecting event.

- #235274 - Incorrect selected content had been getting in tab selected event issue has been fixed.

## 17.1.47 (2019-05-14)

### Menu

#### New Features

- #230456 - Provided hamburger menu support for adaptive view.

### TreeView

#### New Features

- #227540 - Provided the support for rendering treeview data in single server request while disabling the loadOnDemand

## 17.1.43 (2019-04-30)

### Toolbar

#### Bug Fixes

- #231019 - An issue with RTL mode of Toolbar scroller has not working in Firefox browser has been resolved.

### TreeView

#### Bug Fixes

- #234147 - Issue with maintaining checked states while giving `id` and `parentID` value as string type in data source has been fixed.

## 17.1.41 (2019-04-16)

### Accordion

#### Bug Fixes

- Content value getting changed while updating header dynamically issue has been fixed.

### TreeView

#### Bug Fixes

- #231497 - Now the selected node background color is removed before collapsing the parent node with out removing 'e-active' class.

## 17.1.40 (2019-04-09)

### TreeView

#### Bug Fixes

- Now the selected node background color is removed before collapsing the parent node.

### Tab

#### Bug Fixes

- Support to restrict add and remove functionalities of Tab has been provided.

## 17.1.38 (2019-03-29)

### Menu

#### Bug Fixes

- Support provided for dynamically updating the self referential data.

### Accordion

#### Bug Fixes

- An issue with the expand action of Accordion when set to single mode, with the items being rendered using content template is fixed now.

## 17.1.32-beta (2019-03-13)

### ContextMenu

#### Bug Fixes

- Submenu items styles are not proper in ContextMenu issue is fixed.

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
