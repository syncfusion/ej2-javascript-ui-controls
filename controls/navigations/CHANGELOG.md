# Changelog

## [Unreleased]

## 25.2.4 (2024-05-14)

### ContextMenu

#### Bug Fixes

- `#I582079` - The issue with "context menu position issue occurs when using multilevel submenus" has been resolved.
- `#F187892` - The issue with "context menu overlapping when using a touch screen device" has been resolved.

## 25.2.3 (2024-05-08)

### ContextMenu

#### Bug Fixes

- `#I580119` - The issue with "context menu item text is too large causing it to override the next item" has been resolved.

## 25.1.42 (2024-04-30)

### Menu

#### Bug Fixes

- `#F583262` - The issue with "script error thrown in Menu component when setting target and hamburger properties" has been resolved.

### TreeView

#### Bug fixes

- `#I581340` - Fixed the console error that occurred while clicking the node after changing `isDevice` to true.

## 25.1.41 (2024-04-23)

### TreeView

#### Bug Fixes

- `#I572876` - The issue with "The checkbox state are not read by the screen reader in the TreeView component with edge browser" has been resolved.

### Carousel

#### Bug Fixes

- `#FB52446` - The issue with carousel slide changes during window resizing while the `loop` is set to false has been fixed.

## 25.1.40 (2024-04-16)

### Stepper

#### Bug Fixes

- `#I570244` - The issue with stepper component styles being overridden using CSS `important` has been resolved.

### Accordion

#### Bug Fixes

- An issue where the `expandedIndices` returns empty when the HTML sanitizer is enabled has been fixed.

## 25.1.38 (2024-04-02)

### Menu

#### Bug Fixes

- The issue with "focusing the first element by using tab key in Menu" has been resolved.

## 25.1.37 (2024-03-26)

### TreeView

#### Bug Fixes

- `#I570321` - The issue with the focus on first item in TreeView if it is disabled mode has been resolved.

### Toolbar

#### Bug Fixes

- `#I553624` - An issue with expanded toolbar items not align properly when change the mouse and touch modes has been fixed.

## 25.1.35 (2024-03-15)

### ContextMenu

#### Bug Fixes

- `#I565323` - The issue with "Context menu closed while scroll within the sub menu of context menu.

### Stepper

#### Bug fixes

- `#I564429` - The issue with stepper progress bar misalignment in firefox browser has been resolved.

### TreeView

#### Bug fixes

- `#I525899` - The issue with the React TreeView filtering operation has been resolved.

### Tab

#### Bug fixes

- `#I523384` - The issue with the active tab background color has been resolved.

## 23.2.5 (2023-11-23)

### Sidebar

#### Bug Fixes

- `#I521215` - An issue with the Sidebar animation which is not working for the initial rendering has been resolved.

## 23.2.4 (2023-11-20)

### Menu

#### Bug Fixes

- `#F519984` - The issue with "`hideItems` method not working properly in Menu" has been resolved.

## 23.1.44 (2023-11-07)

### TreeView

#### Bug fixes

- `#I511195` - An issue with the TreeView component's tooltip(title) not decoded properly like tree node text has been resolved.

## 23.1.43 (2023-10-31)

### TreeView

#### Bug fixes

- `#F184993` - An issue with the TreeView checkbox status was not updating properly after drag and drop  the node has been resolved.

### Toolbar

#### Bug Fixes

- `#I514442` - An issue with tab index attribute set wrongly for Toolbar templated items has been fixed.

## 23.1.41 (2023-10-17)

### Menu

#### Bug Fixes

- `#I503763` - The issue with "sub menu closes while click on the vertical scroll of sub menu" has been resolved.
- The issue with "menu component in ribbon while switching to `arabic` localization" has been resolved

## 23.1.40 (2023-10-10)

### Accordion

#### Bug Fixes

- `#I506740` - An issue with the HTML element within the content of an Accordion item has been fixed.

### TreeView

#### Bug fixes

- `#I506080` - The issue with the `ensureVisible` method for self-referential data source has been resolved.

## 23.1.39 (2023-10-04)

### ContextMenu

#### Bug Fixes

- The issue with "in mobile mode, script error occurred when context menu item is destroyed" has been resolved.

## 23.1.36 (2023-09-15)

### Menu

#### Bug Fixes

- `#F496214` - The issue with "Sub Menu can’t hide while using hideItems method of menu" has been resolved.

## 23.1.36 (2023-09-15)

### TreeView

#### Bug fixes

- `#I496955` - The expanded state not maintained while check the child node has been resolved.
- `#I488527` - The issue with when holding the mouse left click to select the TreeView nodes has been resolved.

## 22.2.11 (2023-08-29)

### Carousel

#### Bug Fixes

- `#F46021` - The issue where the current item position within the Carousel could shift off-center upon window resizing has been fixed.

### Breadcrumb

#### Bug Fixes

- `#I474929` - The issue with "CSP template not working in breadcrumb component" has been resolved.

## 22.2.7 (2023-08-02)

### Menu

#### Bug Fixes

- `#I483185` - The issue with "Script error throws on destroying menu when its sub menus are still open" has been resolved.

## 22.2.5 (2023-07-27)

### Carousel

#### Bug Fixes

- `#I480096` - An issue with the indicators are not updated while dynamically changing the data source of the Carousel has been fixed.

### Tab

#### Bug Fixes

- `#I45423` - The issue with where the Tab control was throwing a script error when opened in Internet Explorer 11 has been resolved.

### ContextMenu

#### Bug Fixes

- `#I483247` - The issue with "Context Menu not working in IE 11" has been resolved.
- `#I484122` - The issue with "Context menu closed while scroll within the sub menu of context menu.

## 22.1.39 (2023-07-18)

### Menu

#### Bug Fixes

- `#F158513` - The issue with "hideItems method not working properly in angular menu component" has been resolved.

## 22.1.38 (2023-07-11)

### Toolbar

#### Bug Fixes

- `#I477200` - An issue with toolbar items flickered while hovering in bootstrap theme has been fixed.

### Toolbar

#### Bug Fixes

- `#I477752` - An issue with alignment while mobile orientation change has been fixed.

## 22.1.36 (2023-06-28)

### Tab

#### Bug Fixes

- `#I469389` - Provided `preventFocus` parameter in `selected` event to prevent focus on Tab header focus on selection.

## 22.1.34 (2023-06-21)

### Carousel

#### New Features

- `#FB36950` - Provided support to change slides using swipe or drag gestures, improving the usability and accessibility of the component on phones and tablets.
- Provided indicator customization options, such as `default`, `dynamic`, `progress` and `fraction`.

## 21.2.9 (2023-06-06)

### Menu

#### Bug Fixes

- `#I466216` - The issue with "hideItems and enableItems method not working properly when we placed more than one menu component in single page" has been resolved.

### Tab

#### Bug Fixes

- `#I464872` - Resolved the issue where the Home or End key interaction was not working properly if the first and last tabs were hidden or disabled.

### Toolbar

#### Bug Fixes

- `#I461446`, `#I468087` - An issue with toolbar items reorder issue when resize in extended and popup overflow mode has been fixed.

## 21.2.8 (2023-05-30)

### ContextMenu

#### Bug Fixes

- `#I829933` - The issue with "hideItems method of context menu not working properly for sub menu item" has been resolved.

### TreeView

#### Bug fixes

- `#I457872` - Resolved the issue where customized theme styles were not correctly applied for active node text of TreeView component.

## 21.2.6 (2023-05-23)

### Accordion

#### Bug Fixes

- `#I461717` - An issue with the accordion old templates is not cleared after the property change has been fixed.

## 21.2.5 (2023-05-16)

### TreeView

#### Bug fixes

- `#I459316` - Now the nodeExpanding event triggers for addNodes method based on the value of preventExpand argument.
- `#I450146` - Provided the horizontal scroll support for the TreeView component in mobile mode.

### Tab

#### Bug Fixes

- `#I459687` - An issue with the "Drag and drop is not working in the tab after setting `args.cancel` to true in the `dragStart` event" has been fixed.

## 21.2.4 (2023-05-09)

### ContextMenu

#### New Features

- `#I458989` - Provided the new parameter target to `beforeOpen` event argument of context menu component.

#### Bug Fixes

- `#I461864` - The issue with "Error is not handled gracefully in context menu enableItems method" has been resolved.

### Tab

#### Bug Fixes

- `#I458102` - An issue where the tab header did not update with dynamic data when the tab directives were rendered as HTML elements has been fixed.
- `#I457021` - The issue where the `data-id` attribute was being removed from tab items upon property change has been fixed.

## 21.2.3 (2023-05-03)

### Toolbar

#### Bug Fixes

- `#I455137` - An issue with Horizontal scroll is not destroyed in RTL mode has been fixed.

### Menu

#### Bug Fixes

- `#I455183` - The issue with "Script error thrown while using `hideMenuItems` method in menu component" has been resolved.

## 21.1.39 (2023-04-11)

### Menu

#### Bug Fixes

- `#I445794` - The issue with "Context Menu keyboard navigation is not working in scrollable page" has been resolved.
- `#I446612` - The issue with "Attributes are not updated properly while directly appending the menu item" has been resolved.

### Tab

#### Bug Fixes

- `#I434078` - An issue with the "icon for the Tab popup mode in mobile mode" has been fixed.
- `#I451561` - An issue with the "When the same selected tab is re-selected, the tab selecting event is triggered again" has been fixed.

## 21.1.38 (2023-04-04)

### Menu

#### Bug Fixes

- `#F181258` - The issue with "Input element is not editable when we placed inside the menu template" has been resolved.

## 21.1.37 (2023-03-29)

### TreeView

#### Bug fixes

- `#I449274` - Resolved the nodeSelected event not working properly issue on iPad.

## 21.1.35 (2023-03-23)

### Tab

#### Bug Fixes

- `#I441253` - An issue with the `aria-disabled` role accessibility has been fixed.

### Toolbar

#### Breaking Changes

- We improved the Toolbar alignments with a flex design, which may cause slight changes to the alignment of Toolbar items.

## 20.4.53 (2023-03-07)

### Sidebar

#### Bug Fixes

- `#F180770` - While dynamically setting value for showBackdrop property results in creating duplicate DOM elements in Sidebar is resolved.

### ContextMenu

#### Bug Fixes

- `#I439558` - The issue with "When removing all context menu items that contain icons using removeItems method, it thrown null reference error" has been resolved.

### Breadcrumb

#### Bug Fixes

- `#I437629` - Issue with "Breadcrumb overflow mode menu creates a dark point for multiple click " has been resolved.

### TreeView

#### Bug Fixes

- `#I436646`, `#I435360` - Resolved issue, while drag and drop other elements over TreeView component, then "not-allowed" cursor appears.

## 20.4.52 (2023-02-28)

## 20.4.51 (2023-02-21)

### TreeView

#### Bug Fixes

- `#I428766` - Alignment issue in TreeView node without a sub-child in RTL mode has been resolved.
- `#I428002` - The accessibility related issues in the TreeView has been resolved.

## 20.4.49 (2023-02-07)

### Accordion

#### Bug Fixes

- `#I430833` - An issue with accordion active item styles override the grid pager has been fixed.

### Menu

#### Bug Fixes

- `#I425152` - The issue with "Menu item not render properly when we use ItemTemplate with custom menu items" has been resolved.

## 20.4.48 (2023-02-01)

### Tab

#### Bug Fixes

- `#I427978` - Fixed an issue with cyclic navigation using arrow keys, where focus would shift to the first element after reaching the last element, and vice versa. Also, accessibility has been enhanced using the aria-label attributes.

### Sidebar

#### Bug Fixes

- `#F179759` - Console error while using the showBackdrop property in the Sidebar component has been resolved.

### TreeView

#### Bug Fixes

- `#I428488` - Included the "action" and "nodeData" values in the dataSourceChanged event.
- `#I428766` - Alignment issue in TreeView node without a sub-child has been resolved.

## 20.4.44 (2023-01-18)

### ContextMenu

#### Bug Fixes

- `#I425173` - The issue with "Context menu Submenus not opening properly with multiple levels " has been resolved.

## 20.4.43 (2023-01-10)

### ContextMenu

#### Bug Fixes

- `#I424794` - The issue with "Script error thrown in context menu when navigate using the keyboard" has been resolved.

### TreeView

#### Bug Fixes

- `#I422672` - The expand icon not working properly in mobile mode issue has been fixed.

## 20.4.42 (2023-01-04)

### TreeView

#### Bug Fixes

- `#I424859` - The issue with the "TreeView isInteracted property returning false value with the NodeExpanded and NodeCollapsed event" has been fixed.

## 20.4.40 (2022-12-28)

### ContextMenu

#### Bug Fixes

- `#I425402` -  Accessibility issue in context menu has been fixed.

## 20.4.38 (2022-12-21)

### Toolbar

#### New Features

- `#I348957` - Provided option to specify `tabindex` attribute to control the tab key order of the toolbar elements.

### Tab

#### New Features

- `#I348957` - Provided option to specify `tabindex` attribute to control the tab key order of tab header elements.

#### Bug Fixes

- `#I422226` - An issue with while using underscore on tab id wrong content shown has been resolved.
- `#F179266` - Tab height does not change dynamically when `heightAdjustMode` has set as `Fill` mode has been resolved.

### TreeView

#### Bug Fixes

- `#I415237` - The TreeView performance issue in Vue3 framework has been resolved.

## 20.3.58 (2022-11-22)

### Carousel

#### Bug Fixes

- `#I419341` - The Blank carousel item displayed on `autoplay` when a single item alone is rendered has been resolved.

### TreeView

#### Bug Fixes

- `#I415849` - The issue with "Expand animation is not working for the dynamically added node on initial expanding in TreeView" has been resolved.

## 20.3.57 (2022-11-15)

- `#I417236` - The accessibility issue mentioned in the TreeView component has been resolved.

## 20.3.50 (2022-10-18)

### ContextMenu

#### Bug Fixes

- `#I413061` - The issue with "Keyboard navigation not working properly when we open context menu using open method" has been resolved.

## 20.3.49 (2022-10-11)

### Accordion

#### Bug Fixes

- `SF-397894` - An issue with incorrect aria attributes in accordion has been fixed.

## 20.3.47 (2022-10-11)

### Sidebar

#### Bug Fixes

- `#I397894` - The issue with "using tab index as `0`​ on the container of Sidebar component" has been resolved.

### ContextMenu

#### Bug Fixes

- `#I408315` - Script error thrown in `insertBefore` method While items not available in menu items has been fixed.

## 20.3.48 (2022-10-05)

### TreeView

#### Bug Fixes

- `#I318072` - The issue with "Checkbox is not added to dropped node, when drop target TreeView has enabled with checkboxes in the TreeView component" has been resolved.

### Accordion

#### Bug Fixes

- `#F177760` - An issue with adding/removing multiple CSS classes to tab items `cssClass` property has been fixed.

## 20.3.47 (2022-09-29)

### AppBar

The AppBar displays information and actions related to the current application screen. It is used to show branding, screen titles, navigation, and actions.

- **Modes** - `Regular`, `Prominent`, and `Dense` modes that define the AppBar height.
- **Content arrangement** - Spacer and separator options can be used to align the content based on the UI requirement with minimal effort.
- **Color** - `Primary`, `Light`, `Dark`, and `Inherit` options to customize the AppBar color.
- **Position** - AppBars can be placed at the top or bottom of the screen. It can also be sticky.

### Carousel

#### New Features

- Provided partial visible functionality to carousel which enables the active slide with partial previous/next slide.

### Tab

#### New Features

- `#I237390` - Provided support to disable the animation while switching the tab item.

## 20.2.49 (2022-09-13)

### ContextMenu

#### Bug Fixes

- `#I400719` - Script error thrown when we provided remove item is not available in the menu items has been fixed.

## 20.2.48 (2022-09-06)

### Menu

#### Bug Fixes

- `#I396977` - The issue with "`SetItem` method not working properly for customized menu item" has been resolved.

## 20.2.46 (2022-08-30)

### Menu

#### Bug Fixes

- `#I387276` - The issue with "Enable Scrolling not working properly when we dynamically set scroll to menu bar" has been resolved.

## 20.2.44 (2022-08-16)

### TreeView

#### Bug Fixes

- `#F176651` - The issue with "Checkbox state is not maintained properly for multilevel nodes in the TreeView component" has been resolved.

## 20.2.39 (2022-07-19)

### Tab

#### Bug fixes

- `#I388161` - An issue with "Removing the selected tab item" has been fixed.
- `#I390262` - An issue with "Tab item dropped in wrong position" has been fixed.

## 20.2.36 (2022-06-30)

### Carousel

#### New Features

- Provided option to play or pause the slides when hovering the mouse pointer over the Carousel element.

#### Breaking Changes

- Removed `animation` property from Carousel component, now you can set the animation effect directly to the `animationEffect` property.
- To apply custom animation effects, Needs to set `animationEffect` property to `custom` and specify the custom animation class in `cssClass` property.

**Previous**

```typescript

const carouselObj: Carousel = new Carousel({
  animation: { customEffect: "parallax" }
});

```

**Now**

```typescript

const carouselObj: Carousel = new Carousel({
  cssClass: 'parallax',
  animationEffect: 'custom'
});

```

### TreeView

#### Bug Fixes

- `#I383454` - The issue with "The TreeView checked nodes state not maintained for remote data when enabling the persistence" has been resolved.

## 20.1.61 (2022-06-21)

### Tab

#### Bug Fixes

- `#I384728` - An issue with "Tab `data-id` attribute does not work after the initial load" has been fixed.

## 20.1.60 (2022-06-14)

### Sidebar

#### Bug Fixes

- `#F175215` - The issue with "Sidebar showBackdrop property is not working properly while setting the target property" has been resolved.

## 20.1.58 (2022-05-31)

### Tab

#### Bug Fixes

- `#I377292` - Accessibility issues in tab has been fixed.

## 20.1.56 (2022-05-17)

### Menu

#### Bug Fixes

- `#I373045` - An issue with "Script error occurs while using keyboard navigation in menu" has been resolved.

### TreeView

#### Bug Fixes

- `#I371505` - The issue with "The TreeView checked node state doesn't update properly for nested levels when loadOnDemand is enabled" has been resolved.

### Tab

#### Bug Fixes

- `#F174831` - An issue with drag not works when adding multiple tab items has been fixed.

## 20.1.51 (2022-04-26)

### TreeView

#### Bug Fixes

- `#I371505` - The issue with "The TreeView checked node state doesn't update properly for nested levels when loadOnDemand is enabled" has been resolved.

### Tab

#### Bug Fixes

- `#F174269` - Tab throws script error while adding items with `headerTemplate` has been fixed.

## 20.1.48 (2022-04-12)

### Menu

#### Bug Fixes

- `#I371293` - Resolved the "Context menu not closed properly when the two separate context menu binded in the DOM" in menu component.
- `#I369007` - An issue with "Script error throws when we remove items with hamburger mode in mobile view" has been resolved.

### Toolbar

#### Bug Fixes

- `#I372768` - An issue with the toolbar scrollable buttons accessibility issue has been fixed.

## 20.1.47 (2022-04-04)

### Carousel

The Carousel component allows users to display images with content, links, etc., like a slide show. Typical uses of carousels include scrolling news headlines, featured articles on home pages, and image galleries.

- **Rendering** - The Carousel component can be rendered based on the items collection and data binding.
- **Animation** - Supports animation effects for moving previous/next item of Carousel.
- **Template Support** - The Carousel component items and buttons can also be rendered with custom templates.
- **Keyboard Support** - By default, the Carousel allows interaction with commands by using keyboard shortcuts.
- **Accessibility** - The Carousel provides built-in compliance with the `WAI-ARIA` specifications and it is achieved through attributes.

### Tab

#### Bug Fixes

- `SF-369202, #F173364` - An issue with another tab item content is rendered in newly added tab item content has been fixed.

## 19.4.55 (2022-03-08)

### Menu

#### Bug Fixes

- `#I368643` - Resolved theme related issue in menu component.

### Tab

#### Bug Fixes

- `SF-369303` - An issue with hiding tab item dynamically with `visible` property not working has been fixed.

## 19.4.53 (2022-02-22)

### Sidebar

#### Bug Fixes

- `#I363057` - The issue with "The change event is triggered twice for the first change in Sidebar component" has been resolved.

## 19.4.52 (2022-02-15)

### Toolbar

#### Bug Fixes

- `#SF-365188` - An issue with the toolbar item separator not being hidden in multi-row mode has been fixed.

## 19.4.50 (2022-02-08)

### Menu

#### Bug Fixes

- Issue with `setItem` method has been fixed.

## 19.4.47 (2022-01-25)

### Breadcrumb

#### Bug Fixes

- `#I360615` - Issue with When Breadcrumb is build, it throws style warning has been resolved.

### Tab

#### Bug Fixes

- `#SF-363121` - An issue with "script error occurred while adding a new tab item without content" has been fixed.

### Breadcrumb

#### Bug Fixes

- Issue with CSS validation has been fixed.

## 19.4.41 (2022-01-04)

### Menu

#### Bug Fixes

- Sub menu position alignment issue in menu has been resolved.

### Tab

#### Bug Fixes

- `#SF-359072` - An issue with active tab selection is not highlight when render inside the `dialog` has been fixed.

## 19.4.40 (2021-12-28)

### Context Menu

#### Bug Fixes

- `#I346314` - Issue with `stopPropagation` not works for context menu has been resolved.

## 19.4.38 (2021-12-17)

### Tab

#### New Features

- `#I302394` - Provided support to maintain the active item in either tab header area or inside the popup.
- `#F166169` - Provided support to identify the tab select event raised by user interaction or programmatic way.

### TreeView

#### New Features

- `#FB27518` - Provided support to wrap the TreeView node text when its text content exceeds the TreeView node width.

### Breadcrumb

#### New Features

- Provided new types of overflow mode and as follows:

  1. **Menu**: Shows the number of breadcrumb items that can be accommodated within the container space, and creates a sub menu with the remaining items.
  2. **Wrap**: Wraps the items on multiple lines when the Breadcrumb’s width exceeds the container space.
  3. **Scroll**: Shows an HTML scroll bar when the Breadcrumb’s width exceeds the container space.
  4. **None**: Shows all the items on a single line.

- Provided `cancel` support in `beforeItemRender` event.

#### Breaking Changes

- Provided `disabled` property in Breadcrumb and Breadcrumb's Item instead of using CSS class `e-disabled`.
- Removed `width` property from Breadcrumb component, you can set `width` in the style attribute of CSS to breadcrumb's element or its parent element.

## 19.3.57 (2021-12-07)

### Sidebar

#### Bug Fixes

- `#I347551` - The issue with "The sidebar main content margin value changes when using Sidebar type as Over and dock support" has been fixed.

## 19.3.56 (2021-12-02)

### TreeView

#### Bug Fixes

- `#I342745` - The performance issue that occurred when selecting a node that was rendered with a huge data source has been resolved.

## 19.3.54 (2021-11-17)

### Tab

#### Bug Fixes

- `#I347014` - An issue with dynamic tab item navigation if scheduler is present on a page has been fixed.
- `#I296232` - The issue with "Script error occurs while updating the tab header text" has been resolved.

## 19.3.46 (2021-10-19)

### Tab

#### Bug Fixes

- `#I344626` - An issue with the tab header and content items are not updated on state change has been fixed.

## 19.3.45 (2021-10-12)

### Breadcrumb

#### Bug Fixes

- Disabled item get tab focus when item's URL is specified issue has been resolved.

## 19.3.43 (2021-09-30)

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
