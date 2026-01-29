# Syncfusion JavaScript / TypeScript UI Components

[![npm](https://img.shields.io/npm/v/@syncfusion/ej2?logo=npm)](https://www.npmjs.com/search?q=%40syncfusion%2Fej2)
[![Downloads](https://img.shields.io/npm/dm/@syncfusion/ej2)](https://www.npmjs.com/search?q=%40syncfusion%2Fej2)
[![GitHub stars](https://img.shields.io/github/stars/syncfusion/ej2?style=social)](https://github.com/syncfusion/ej2)
[![GitHub forks](https://img.shields.io/github/forks/syncfusion/ej2?style=social)](https://github.com/syncfusion/ej2)

**145+ enterprise-grade, high-performance JavaScript UI components** with first-class TypeScript support. Built for use in plain JavaScript or TypeScript projects and compatible across frameworks (React, Angular, Vue) — lightweight, modular, responsive, and touch-friendly.

**Quick Links**  
[Live Demos](https://ej2.syncfusion.com/demos/) • [Documentation](https://ej2.syncfusion.com/documentation/) • [API Reference](https://ej2.syncfusion.com/documentation/api/) • [Free 30-Day Trial](https://www.syncfusion.com/downloads/javascript) • [Community License](https://www.syncfusion.com/products/communitylicense)

## Why choose Syncfusion JavaScript (TypeScript)?

- **Vanilla JS + TypeScript** – Use components without a framework or with any framework; TypeScript definitions included for strong typing
- **Modular packages** – Import only required packages for smaller bundles
- **Performance** – Virtualization, optimized rendering, and lazy loading
- **Theming & Accessibility** – Modern themes and WCAG-compliant accessibility
- **AI-Ready** – AI AssistView and other AI-enabled controls
- **Stable Releases** – Regular updates and comprehensive changelogs

## Installation

Install the base package and any specific control packages you need. The examples use npm in PowerShell (Windows).

```powershell
npm install @syncfusion/ej2 @syncfusion/ej2-grids @syncfusion/ej2-charts; # install any specific packages you need
```

For TypeScript projects, ensure tsconfig.json has "esModuleInterop": true and include types if needed.

## Component Categories (145+)

Explore components with links to framework-agnostic documentation and demos.

| Category                  | Component                  | Features                                                                                          | Documentation                                                                 | Demo Link                                                                                           |
|---------------------------|----------------------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| **AI / Smart**            | AI AssistView              | **AI-driven assistance**, **contextual suggestions**, **real-time interaction**, **integrates with editors** | [Link](https://ej2.syncfusion.com/documentation/ai-assistview/getting-started/)           | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/ai-assistview/default/)                   |
|                           | Smart TextArea             | **Intelligent editing**, **auto-complete suggestions**, **context-aware corrections**, **AI-powered** | [Link](https://ej2.syncfusion.com/documentation/smart-textarea/getting-started/)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/smart-textarea/default/)                  |
|                           | Smart Paste Button         | **Intelligent paste handling**, **content formatting**, **smart insertion**, **AI-enhanced**     | [Link](https://ej2.syncfusion.com/documentation/smart-paste-button/getting-started/)      | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/smart-paste/default/)                     |
| **Grids**                 | Data Grid                  | **Virtual scrolling**, **Excel-like editing/sorting/filtering**, **large dataset support**, **export to Excel/PDF**, **grouping & aggregation** | [Link](https://ej2.syncfusion.com/documentation/grid/getting-started/)                    | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/grid/overview/)                           |
|                           | Pivot Table                | **Drag-and-drop summarization**, **calculated fields**, **chart integration**, **virtual scrolling**, **Excel export** | [Link](https://ej2.syncfusion.com/documentation/pivotview/getting-started/)               | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/pivotview/default/)                       |
|                           | Tree Grid                  | **Hierarchical data display**, **expand/collapse**, **row templates**, **editing & drag-and-drop**, **virtualization** | [Link](https://ej2.syncfusion.com/documentation/treegrid/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/treegrid/overview/)                       |
| **Charts & Data Viz**     | Charts                     | **50+ chart types**, **zooming & panning**, **interactive legends**, **real-time updates**, **animation** | [Link](https://ej2.syncfusion.com/documentation/chart/getting-started/)                   | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/chart/line/)                              |
|                           | 3D Charts                  | **3D visualization**, **rotation & perspective**, **multiple series**, **high customization**   | [Link](https://ej2.syncfusion.com/documentation/3d-chart/getting-started)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/three-dimension-chart/)                        |
|                           | Stock Chart                | **Financial time-series**, **technical indicators**, **range navigator**, **candle/OHLC**       | [Link](https://ej2.syncfusion.com/documentation/stock-chart/getting-started/)             | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/stock-chart/default/)                     |
|                           | Circular Gauge             | **Analog gauges**, **ranges & needles**, **annotations**, **directional indicators**            | [Link](https://ej2.syncfusion.com/documentation/circular-gauge/getting-started/)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/circular-gauge/default/)                  |
|                           | Linear Gauge               | **Progress/measurement bars**, **ranges**, **pointers**, **custom shapes**                      | [Link](https://ej2.syncfusion.com/documentation/linear-gauge/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/linear-gauge/default/)                    |
|                           | Maps                       | **Geo-spatial plotting**, **markers & shapes**, **drill-down**, **bubble visualization**        | [Link](https://ej2.syncfusion.com/documentation/maps/getting-started/)                    | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/maps/default.html)                            |
|                           | Diagram                    | **Flowcharts & org charts**, **drag-and-drop**, **connectors**, **undo/redo**, **AI-enhanced**  | [Link](https://ej2.syncfusion.com/documentation/diagram/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/diagram/default-functionality)                         |
|                           | HeatMap                    | **Density visualization**, **gradient colors**, **row/column labels**, **tooltip**              | [Link](https://ej2.syncfusion.com/documentation/heatmap-chart/getting-started/)           | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/heatmap-chart/default-functionalities)                         |
|                           | TreeMap                    | **Hierarchical rectangles**, **drill-down**, **color mapping**, **legend**                      | [Link](https://ej2.syncfusion.com/documentation/treemap/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/treemap/default/)                         |
|                           | Bullet Chart               | **Compact performance metering**, **ranges & targets**, **comparisons**                         | [Link](https://ej2.syncfusion.com/documentation/bullet-chart/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/bullet-chart/default/)                    |
|                           | Kanban                     | **Drag-and-drop boards**, **swimlanes**, **card customization**, **drag multiple cards**        | [Link](https://ej2.syncfusion.com/documentation/kanban/getting-started/)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/kanban/overview)                       |
|                           | Sparkline                  | **Inline trend charts**, **compact size**, **multiple types**                                   | [Link](https://ej2.syncfusion.com/documentation/sparkline/getting-started/)               | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/sparkline/default/)                       |
|                           | Barcode                    | **1D/2D barcode generation**, **multiple formats**, **scanning support**                        | [Link](https://ej2.syncfusion.com/documentation/barcode/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/barcode/default/)                         |
|                           | Smith Chart                | **RF engineering data**, **impedance/admittance**, **markers**                                  | [Link](https://ej2.syncfusion.com/documentation/smithchart/getting-started/)              | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/smith-chart/default)                      |
|                           | Range Selector             | **Time-range navigation**, **chart integration**, **zoom support**                              | [Link](https://ej2.syncfusion.com/documentation/range-navigator/getting-started)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/range-navigator/default)                  |
| **Scheduling**            | Scheduler                  | **Multiple views (day/week/month)**, **drag-and-drop events**, **multiple event selection**, **resource grouping** | [Link](https://ej2.syncfusion.com/documentation/schedule/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/schedule/overview)                       |
|                           | Gantt Chart                | **Project timelines**, **task dependencies**, **progress tracking**, **critical path**          | [Link](https://ej2.syncfusion.com/documentation/gantt/getting-started/)                   | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/gantt/overview)                |
|                           | Calendar                   | **Multiple views**, **event rendering**, **multi-date selection**                               | [Link](https://ej2.syncfusion.com/documentation/calendar/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/calendar/default/)                        |
|                           | DatePicker                 | **Inline/dropdown mode**, **validation**, **custom formats**                                    | [Link](https://ej2.syncfusion.com/documentation/datepicker/getting-started/)              | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/datepicker/default/)                      |
|                           | DateRangePicker            | **Start/end selection**, **preset ranges**, **calendar preview**                                | [Link](https://ej2.syncfusion.com/documentation/daterangepicker/getting-started/)         | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/daterangepicker/default/)                 |
|                           | DateTimePicker             | **Combined date & time**, **format customization**, **strict mode**                             | [Link](https://ej2.syncfusion.com/documentation/datetimepicker/getting-started/)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/datetimepicker/default/)                  |
|                           | TimePicker                 | **24/12-hour format**, **interval selection**, **spin buttons**                                 | [Link](https://ej2.syncfusion.com/documentation/timepicker/getting-started/)              | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/timepicker/default)                      |
| **Dropdowns**             | AutoComplete               | **Suggestion dropdown**, **filtering**, **multi-select**, **remote data**                       | [Link](https://ej2.syncfusion.com/documentation/auto-complete/getting-started)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/auto-complete/default)                    |
|                           | ComboBox                   | **Hybrid textbox + dropdown**, **search & filtering**, **grouping**                             | [Link](https://ej2.syncfusion.com/documentation/combo-box/getting-started)               | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/combo-box/default)                     |
|                           | MultiSelect Dropdown       | **Tag/chip selection**, **checkbox mode**, **remote binding**                                   | [Link](https://ej2.syncfusion.com/documentation/multi-select/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/multi-select/default/)                    |
|                           | Dropdown List              | **Simple selection**, **grouping**, **virtual scrolling**                                       | [Link](https://ej2.syncfusion.com/documentation/drop-down-list/getting-started/)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/drop-down-list/default)                    |
|                           | ListBox                    | **Multi-selection**, **drag-and-drop reordering**, **checkbox support**                         | [Link](https://ej2.syncfusion.com/documentation/list-box/getting-started)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/listbox/default/)                         |
|                           | DropDown Tree              | **Hierarchical selection**, **checkboxes**, **multi-select**                                    | [Link](https://ej2.syncfusion.com/documentation/drop-down-tree/getting-started/)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/drop-down-tree/default)                    |
|                           | MultiColumn ComboBox       | **Multiple value columns**, **custom templates**, **search**                                    | [Link](https://ej2.syncfusion.com/documentation/multicolumn-combobox/getting-started)  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/multicolumn-combobox/default/)            |
|                           | Mention                    | **@tagging autocomplete**, **suggestions**, **custom templates**                               | [Link](https://ej2.syncfusion.com/documentation/mention/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/mention/default/)                         |
| **Inputs**                | TextBox                    | **Validation & masking**, **floating label**, **icons**                                         | [Link](https://ej2.syncfusion.com/documentation/textbox/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/textboxes/default)                         |
|                           | TextArea                   | **Auto-resize**, **character counter**, **resize handles**                                      | [Link](https://ej2.syncfusion.com/documentation/textarea/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/textarea/default)                        |
|                           | Numeric TextBox            | **Spin buttons**, **formatting**, **strict mode**                                               | [Link](https://ej2.syncfusion.com/documentation/numerictextbox/getting-started/)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/numerictextbox/default/)                  |
|                           | Masked TextBox             | **Input format enforcement** (phone/SSN/etc.), **prompt char**                                  | [Link](https://ej2.syncfusion.com/documentation/maskedtextbox/getting-started/)           | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/maskedtextbox/default/)                   |
|                           | CheckBox                   | **Tri-state**, **label position**, **indeterminate state**                                      | [Link](https://ej2.syncfusion.com/documentation/check-box/getting-started/)               | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/checkbox)                        |
|                           | RadioButton                | **Group selection**, **label customization**, **checked state**                                 | [Link](https://ej2.syncfusion.com/documentation/radio-button/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/radio-button)                     |
|                           | Color Picker               | **Palette/sliders**, **gradient support**, **opacity**                                          | [Link](https://ej2.syncfusion.com/documentation/color-picker/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/color-picker/default/)                    |
|                           | File Upload                | **Drag-and-drop**, **progress tracking**, **multiple files**, **validation**                    | [Link](https://ej2.syncfusion.com/documentation/uploader/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/uploader/default/)                        |
|                           | Range Slider               | **Dual-thumb**, **step & limits**, **tooltip**                                                  | [Link](https://ej2.syncfusion.com/documentation/range-slider/getting-started)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/slider/default/)                          |
|                           | Switch                     | **On/off toggle**, **custom labels**, **animation**                                             | [Link](https://ej2.syncfusion.com/documentation/switch/getting-started/)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/switch)                          |
|                           | Signature                  | **Touch/mouse capture**, **save as image**, **clear/undo**                                      | [Link](https://ej2.syncfusion.com/documentation/signature/getting-started/)               | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/signature/default/)                       |
|                           | Rating                     | **Star/custom shapes**, **partial rating**, **precision**                                       | [Link](https://ej2.syncfusion.com/documentation/rating/getting-started/)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/rating/default/)                          |
|                           | OTP Input                  | **Auto-focus & masking**, **paste support**, **resend timer**                                   | [Link](https://ej2.syncfusion.com/documentation/otp-input/getting-started/)               | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/otp-input/default/)                       |
| **Buttons**               | Button                     | **Variants & icons**, **loading state**, **disabled**                                           | [Link](https://ej2.syncfusion.com/documentation/button/getting-started/)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/default/)                          |
|                           | ButtonGroup                | **Grouped buttons**, **toggle/selection**, **vertical mode**                                    | [Link](https://ej2.syncfusion.com/documentation/button-group/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/button-group)                     |
|                           | SplitButton                | **Primary + dropdown**, **split actions**, **icons**                                            | [Link](https://ej2.syncfusion.com/documentation/split-button/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/split-button)                     |
|                           | Dropdown Menu              | **Menu items**, **icons & separators**, **submenus**                                            | [Link](https://https://ej2.syncfusion.com/documentation/drop-down-button/getting-started)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/dropdown-button)                    |
|                           | Progress Button            | **Loading indicator**, **spinner integration**, **progress percentage**                         | [Link](https://ej2.syncfusion.com/documentation/progress-button/getting-started/)         | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/button/progress-button)                 |
|                           | Chips                      | **Tags/filters**, **deletable**, **custom templates**                                           | [Link](https://ej2.syncfusion.com/documentation/chips/getting-started/)                   | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/chips/default/)                           |
|                           | FAB (Floating Action Button) | **Prominent action**, **motion effects**, **extended modes**                                 | [Link](https://ej2.syncfusion.com/documentation/floating-action-button/getting-started/) | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/floating-action-button/default/)          |
|                           | Speed Dial                 | **Multiple actions**, **directional expansion**, **FAB extension**                              | [Link](https://ej2.syncfusion.com/documentation/speed-dial/getting-started/)              | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/speed-dial/default)                       |
| **Navigation & Layout**   | Accordion                  | **Collapsible sections**, **multiple expand**, **templates**                                    | [Link](https://ej2.syncfusion.com/documentation/accordion/getting-started/)               | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/accordion/default/)                       |
|                           | Tabs                       | **Tabbed content**, **scrollable**, **closeable tabs**                                          | [Link](https://ej2.syncfusion.com/documentation/tab/getting-started/)                     | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/tab/default/)                             |
|                           | TreeView                   | **Hierarchical navigation**, **drag-and-drop**, **checkboxes**                                  | [Link](https://ej2.syncfusion.com/documentation/treeview/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/treeview/default/)                        |
|                           | Toolbar                    | **Button collection**, **overflow popup**, **responsive**                                       | [Link](https://ej2.syncfusion.com/documentation/toolbar/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/toolbar/default/)                         |
|                           | Sidebar                    | **Side panel**, **collapsible**, **positioning**                                                | [Link](https://ej2.syncfusion.com/documentation/sidebar/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/sidebar/default/)                         |
|                           | Menu Bar                   | **Navigation menu**, **submenus**, **keyboard support**                                         | [Link](https://ej2.syncfusion.com/documentation/menu/getting-started)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/menu/default)                         |
|                           | Context Menu               | **Right-click actions**, **custom items**, **submenus**                                         | [Link](https://ej2.syncfusion.com/documentation/context-menu/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/context-menu/default)                     |
|                           | Carousel                   | **Sliding panels**, **auto-play**, **indicators**                                               | [Link](https://ej2.syncfusion.com/documentation/carousel/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/carousel/default/)                        |
|                           | AppBar                     | **Top/bottom bar**, **actions & content**, **responsive**                                       | [Link](https://ej2.syncfusion.com/documentation/appbar/getting-started/)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/appbar/default/)                          |
|                           | Breadcrumb                 | **Path navigation**, **overflow menu**, **custom separators**                                   | [Link](https://ej2.syncfusion.com/documentation/breadcrumb/getting-started/)              | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/breadcrumb/default/)                      |
|                           | Ribbon                     | **Tabbed toolbar**, **grouped commands**, **contextual tabs**                                   | [Link](https://ej2.syncfusion.com/documentation/ribbon/getting-started/)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/ribbon/default/)                          |
|                           | Stepper                    | **Multi-step process**, **validation**, **linear/non-linear**                                   | [Link](https://ej2.syncfusion.com/documentation/stepper/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/stepper/default/)                         |
|                           | Pager                      | **Pagination controls**, **page size selector**, **numeric/symbolic**                           | [Link](https://ej2.syncfusion.com/documentation/pager/getting-started/)                   | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/pager/default/)                           |
|                           | File Manager               | **File browsing**, **upload/rename/delete**, **drag-and-drop**                                  | [Link](https://ej2.syncfusion.com/documentation/file-manager/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/file-manager/default/)                    |
|                           | Dialog                     | **Modal/popover**, **custom content**, **buttons & actions**                                    | [Link](https://ej2.syncfusion.com/documentation/dialog/getting-started/)                  | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/dialog/default/)                          |
|                           | Card                       | **Content container**, **headers/footers**, **actions**                                         | [Link](https://ej2.syncfusion.com/documentation/card/getting-started/)                    | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/card/default/)                            |
|                           | Splitter                   | **Resizable panels**, **horizontal/vertical**, **nested**                                       | [Link](https://ej2.syncfusion.com/documentation/splitter/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/splitter/default/)                        |
|                           | ListView                   | **Scrollable list**, **templates**, **selection & grouping**                                    | [Link](https://ej2.syncfusion.com/documentation/listview/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/listview/default/)                        |
|                           | Tooltip                    | **Hover/contextual hints**, **positioning**, **custom content**                                 | [Link](https://ej2.syncfusion.com/documentation/tooltip/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/tooltip/default/)                         |
|                           | Dashboard Layout           | **Drag-and-drop widgets**, **resizing**, **responsive**                                         | [Link](https://ej2.syncfusion.com/documentation/dashboard-layout/getting-started/)        | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/dashboard-layout/default/)                |
| **Forms & Editors**       | Query Builder              | **Visual query construction**, **conditions & operators**, **rule templates**                   | [Link](https://ej2.syncfusion.com/documentation/query-builder/getting-started/)           | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/querybuilder/default/)                    |
|                            | Rich Text Editor           | **WYSIWYG formatting**, **tables & media**, **AI-powered**, **markdown support**                | [Link](https://ej2.syncfusion.com/documentation/rich-text-editor/getting-started/)        | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/rich-text-editor/tools)                |
|                           | In-place Editor            | **Inline/pop-up editing**, **grid integration**, **custom UI**                                  | [Link](https://ej2.syncfusion.com/documentation/inplace-editor/getting-started/)          | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/inplace-editor/default/)                  |
|                           | Image Editor               | **Crop/rotate/filters**, **annotations**, **redaction**                                         | [Link](https://ej2.syncfusion.com/documentation/image-editor/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/image-editor/default/)                    |
|                           | Block Editor               | **Block-based content**, **modular editing**, **preview mode**                                  | [Link](https://ej2.syncfusion.com/documentation/block-editor/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/block-editor/default/)                    |
| **Notifications**         | Toast                      | **Temporary notifications**, **auto-dismiss**, **progress & actions**                           | [Link](https://ej2.syncfusion.com/documentation/toast/getting-started/)                   | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/toast/default/)                           |
|                           | Progress Bar               | **Determinate/indeterminate**, **segmented**, **circular mode**                                 | [Link](https://ej2.syncfusion.com/documentation/progress-bar/getting-started/)            | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/progress-bar/default/)                    |
|                           | Spinner                    | **Loading indicator**, **size variants**, **overlay support**                                   | [Link](https://ej2.syncfusion.com/documentation/spinner/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/spinner/default/)                         |
|                           | Badge                      | **Count/status indicator**, **positioning**, **dot/overlap**                                    | [Link](https://ej2.syncfusion.com/documentation/badge/getting-started/)                   | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/badge/default/)                           |
|                           | Skeleton                   | **Loading placeholder**, **shimmer effect**, **custom shapes**                                  | [Link](https://ej2.syncfusion.com/documentation/skeleton/getting-started/)                | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/skeleton/default/)                        |
|                           | Message                    | **Inline alerts/status**, **severity levels**, **dismissible**                                  | [Link](https://ej2.syncfusion.com/documentation/message/getting-started/)                 | [Demo](https://ej2.syncfusion.com/demos/#/tailwind3/message/default/)                         |

**Full list of 145+ components** → [Documentation](https://ej2.syncfusion.com/documentation/introduction)

## Getting started (Basic TypeScript example)

Install packages:

```powershell
npm install @syncfusion/ej2 --save; npm install --save-dev typescript
```

Create index.html and bundle with your preferred bundler (Webpack/Rollup/Vite). Example minimal ES module usage:

index.html
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Syncfusion EJ2 - TypeScript Example</title>
    <link rel="stylesheet" href="https://cdn.syncfusion.com/ej2/material.css" />
  </head>
  <body>
    <div id="grid"></div>
    <script type="module" src="./dist/main.js"></script>
  </body>
</html>
```

src/main.ts
```ts
import { Grid, Page } from '@syncfusion/ej2-grids';
import '@syncfusion/ej2-base/styles/material.css';

Grid.Inject(Page);

const data = [ { OrderID: 10248, CustomerName: 'Paul' }, { OrderID: 10249, CustomerName: 'Karin' } ];

const grid = new Grid({
  dataSource: data,
  allowPaging: true,
  columns: [
    { field: 'OrderID', headerText: 'Order ID', width: 120 },
    { field: 'CustomerName', headerText: 'Customer Name', width: 150 }
  ]
});

grid.appendTo('#grid');
```

Bundle with a modern bundler or ts-node for quick testing.

## Resources

- **Live Demos** – https://ej2.syncfusion.com/demos/  
- **Documentation** – https://ej2.syncfusion.com/documentation/  
- **API Reference** – https://ej2.syncfusion.com/documentation/api/  
- **Theme Studio** – https://ej2.syncfusion.com/themestudio/  
- **Release Notes** – https://ej2.syncfusion.com/documentation/release-notes/  
- **Support** – https://support.syncfusion.com/support/tickets/create

## License

This is a **commercial product** subject to the Syncfusion End User License Agreement (EULA).

**Free Community License** is available for qualifying users/organizations:  
- Annual gross revenue < $1 million USD  
- 5 or fewer total developers  
- 10 or fewer total employees  

Community license allows free use under these conditions.

Purchase options and pricing: https://www.syncfusion.com/sales/products  
30-day free trial: https://www.syncfusion.com/downloads/javascript  
Community License details & FAQ: https://www.syncfusion.com/products/communitylicense  
Full EULA: https://www.syncfusion.com/eula/es/

© 2026 Syncfusion, Inc. All Rights Reserved.
