# Changelog

## [Unreleased]

### Kanban

#### Bug Fixes

`#I492818` - Now, fast scrolling from top to bottom of the column continuously works properly.

`#I495751` - Now, dragging a card to the first position in the Kanban works properly without flickering.

## 22.1.34 (2023-06-21)

### Kanban

#### New Features

- **Virtual Scrolling**: This feature allows users to load data on demand when scrolling through columns for a smoother experience with large datasets.

## 21.1.39 (2023-04-11)

### Kanban

#### Bug Fixes

`#F181441` - Resolved a issue, where a console error was thrown when dragging into the column header on the Kanban.

## 21.1.37 (2023-03-29)

### Kanban

#### Bug Fixes

- `#I432638` - Now, when using the kanban `sortSettings` and dropping the cards randomly is sorted properly.

## 20.4.54 (2023-03-14)

### Kanban

#### Bug Fixes

- `#I432638` - Now, when using the kanban `sortSettings` the cards are dropped and sorted properly.

## 20.4.44 (2023-01-18)

### Kanban

#### Bug Fixes

- `#I426567` - Now, drag and drop between the cards will work fine with out any flickering.

## 20.4.38 (2022-12-21)

### Kanban

#### Bug Fixes

- `#FB37690` - Now, the dragged card is positioned properly when the swimlane is frozen with a fixed height for kanban.

## 20.2.44 (2022-08-16)

### Kanban

#### Bug Fixes

- `#F176236` - Now, the drag and drop functionality will work fine in the Internet Explorer V11.

## 20.2.43 (2022-08-08)

### Kanban

#### Bug Fixes

- `I392686` - Now, the drag and drop between the cards will work fine when `showAddButton` is enabled with the Kanban columns.

- `I393080` - Now, the column border of the dragged clone cells will render properly.

- `I393078` - Now, the drag and drop between the cards will work fine with out any flickering.

- `#F176345` - Now, the Sort Comparer Function's API link will work properly.

## 20.2.38 (2022-07-12)

### Kanban

#### Bug Fixes

- `#I385821` - Now, the server-side modified data is returned to the client side while performing the `CRUD` operation.

- `#I390524`, `#F175935` - Now, when dropping the card into an empty column will render it.

## 20.1.60 (2022-06-14)

### Kanban

#### Bug Fixes

- `#I379177`,`#I379023` - Now, the `GetTargetDetailsAsync` method doesn't display 'null' on an empty Kanban board.

## 20.1.58 (2022-05-31)

### Kanban

#### New Features

- `#I373922` - Now, we have improved the performance with the Kanban drag and drop action when large data is being loaded.

## 20.1.52 (2022-05-04)

### Kanban

#### Bug Fixes

- `#I375869` - Now, opening and closing the dialog by rapidly double-clicking on the card doesn't throw any console error.

## 19.4.38 (2021-12-17)

### Kanban

#### Bug Fixes

- `#FB29010` - The issue with "`showItemCount` in swimlane row is not resetting to zero if no cards are present" has been resolved.
- `#F169010` - The issue with "The Kanban board refreshed before fetching data from the server" has been solved.

## 19.3.44 (2021-10-05)

### Kanban

#### Bug Fixes

- `#F169009` - The issue with "Script error thrown when enabling the `enablePersistence` property with remote data" has been resolved.

## 19.3.43 (2021-09-30)

### Kanban

#### New Features

- `#I299672` - Provided support to bind the `ObservableCollection` data to the Kanban board.

## 19.2.60 (2021-09-07)

### Kanban

#### Bug Fixes

- `#I340470` -  The issue with "Kanban `dataBound` event is not receiving `server-side` updated data" has been fixed.

## 19.2.56 (2021-08-17)

### Kanban

#### Bug Fixes

- `#I331403` -  The issue with "Kanban is not rendering properly when the data does not have the `keyField` mapping key" has been fixed.

## 19.2.47 (2021-07-13)

### Kanban

#### Bug Fixes

- `#F166554` - The problem with the selection that is not maintained in the card after performing CRUD operation has been fixed.

## 19.2.46 (2021-07-06)

### Kanban

#### New Features

- `#293618` - Provided support for swimlane frozen rows while scrolling the Kanban content.

### Kanban

#### Bug Fixes

- `#I332574` - The issue with "Column headers of the kanban is not updated, with the drag and drop actions" has been resolved.

## 19.1.67 (2021-06-08)

### Kanban

#### Bug Fixes

- `#F165595` - The issue with "Card data changed even when the editing cancel in the `dialog(card editing)`" has been resolved.

## 19.1.66 (2021-06-01)

### Kanban

#### Bug Fixes

- `#F165617`, `#F165618` - The issue with "Kanban edit dialog element not removed when `args.cancel` is set to true on `dialogOpen` event" has been resolved.
- `#I328517` - The issue with the "Swimlane template did not render properly when loaded on mobile device" has been resolved.
- `#I326559` - The issue with "Descending order of cards in the column is not maintained when adding a new card" has been resolved.

## 19.1.65 (2021-05-25)

### Kanban

#### Bug Fixes

- `#I287435` - The issue with "number type `keyField` arguments not supported on `showColumn`, `hideColumn`, `updateCard` and `getColumnData` public method" has been resolved.

## 19.1.63 (2021-05-13)

### Kanban

#### New Features

- `#287435, #295725` - Support provided for map the `keyField` in the `column` as number type.

#### Bug Fixes

- `#I324923` - The issue with "Kanban content colour not changed, when using the material-dark theme" has been resolved.
- `#F160742` - The issue with "Script error thrown when drag and drop operation performed when swimlane `keyField` as non-existing field" has been resolved.
- `#322742` - The issue with "Unable to drag and drop the card when `WebApiAdaptor` used on Kanban" has been resolved.

## 19.1.59 (2021-05-04)

### Kanban

#### Bug Fixes

- `#278650` - The issue with "Unable to drag and drop the cards on iPad device" has been fixed.

## 19.1.57 (2021-04-20)

### Kanban

#### Bug Fixes

- `#321297` - The issue with "Kanban custom dialog drop down list does not properly return integer type value" has been fixed.

## 19.1.54 (2021-03-30)

### Kanban

#### Bug Fixes

-`#I326941` - The issue with "'Unassigned' text in the swimlane kanban doesn't have localization" has been resolved.

### Kanban

#### New Features

- `F160742` - Support to drag and drop the card from kanban to an external source and vice versa has been provided.

#### Bug Fixes

- `#317594` - An issue with "script error thrown when dynamically add new card with new swimlane key" issue has been fixed.

## 18.4.46 (2021-03-02)

### Kanban

#### Bug Fixes

- `#I311076` - An issue with templates is cleared when refresh the header using the public method has been fixed.
- `#I315242` - An issue with drag and drop is not working properly when add columns dynamically has been fixed.
- `#I315596` - An issue with drag and drop is not working properly when `dataSource` change dynamically has been fixed.

## 18.4.44 (2021-02-23)

### Kanban

#### Bug Fixes

- `#315107` - The issue with "cards are hidden when multiple cards are dragged and dropped to their original position" has been fixed.
- `#F161605` - An issue with drag and drop the cards when kanban placed inside card has been fixed.
- An issue with "Unable to refresh the header count when drag the card and drop to another column" has been resolved.

## 18.4.41 (2021-02-02)

### Kanban

#### Bug Fixes

- `#F161568` - An issue when scrollbar is disappears the column became misaligned issue has been resolved.
- `#I311076` - Provided a public method as `renderHeader` to refresh the header template.
- `#309763` - The issue with "Unable to drag and drop the cards within the column when setting the `sortBy` property as `Index`" has been resolved.
- `#F161669` - The issue with "Duplicate card rendering while searching the text after drag and drop operation is performed" has been fixed.
- `#287431` - An issue with the card has rendered at column last position when using `updateCard` method has been fixed.

## 18.4.33 (2021-01-05)

### Kanban

#### Bug Fixes

- `#308798` - The issue with "Script error thrown when drag and drop the cards in swimlane layout with responsive mode" has been resolved.

## 18.4.30 (2020-12-17)

### Kanban

#### New Features

- Provided workflow support that determines transitions of card from one column to another in Kanban.
- Provided support to prevent dragging and dropping the cards on particular column.
- Provided auto scroll support when drag and drop the cards between columns.
- Provided custom sorting option for swimlane rows based on user choice.

#### Breaking Changes

- In `sortSettings` the default value of `sortBy` property has changed to `Index` from `DataSourceOrder`.

## 18.3.53 (2020-12-08)

### Kanban

#### Bug Fixes

- `#159897` - An issue with Dialog template not working has been fixed.

## 18.3.52 (2020-12-01)

### Kanban

#### Bug Fixes

- `#300968, #302271` - An issue with the `dragStart` event maintained previous changed value in argument has been fixed.

## 18.3.50 (2020-11-17)

### Kanban

#### Bug Fixes

- `#301633` - The issue with "Script error thrown when using `deleteCard` public method" has been resolved.
- `#301761` - The issue with "Changed card not maintained their modified state properly when drop the card to another columns after using `updateCard` public method" has been resolved.
- `#300558` - An issue with the all card data are disappeared after card drag and drop has been fixed.

## 18.3.40 (2020-10-13)

### Kanban

#### New Features

- `#288864` - We had improved the performance while loading a huge number of cards and now dragging cards only be refreshed instead of whole cards.

## 18.3.35 (2020-10-01)

### Kanban

#### Bug Fixes

- `#287430` - The issue with "Mismatch in the events argument type information" has been resolved.

## 18.2.57 (2020-09-08)

### Kanban

#### Bug Fixes

- `#289221` - The issue with "Two empty placeholders appear on the content cell when dropping the cards to its original position" has been resolved.
- `#289831` - The issue with "Cards are jumped to the last position of the column when the dialog template values are not changed" has been resolved.

## 18.2.54 (2020-08-18)

### Kanban

#### Bug Fixes

- `#287430` - The issue with "Mismatch in the public methods type information" has been resolved.

## 18.2.47 (2020-07-28)

### Kanban

#### Bug Fixes

- `#284048` - Provided unassigned Swimlane group support on the Kanban board.

## 18.2.44 (2020-07-07)

### Kanban

#### New Features

- **Sorting Order**: Arrange the cards in ascending or descending order based on the `sortBy` property.
- **Card Layout**: Improved the card layout by providing the default colours, labels, and custom classes.
- **Dialog Customization**: Users can customize the particular property in the editing or adding dialog by using the `model` property.
- **Toggle Column Count**: Provided cards count on the collapsed column.

#### Breaking Changes

- Removed the `priority` under the `cardSettings` property and included these functionalities to the sorting order feature by setting the `sortBy` as `Index` under the `sortSettings` property.
- Replaced the `sortBy` with `sortDirection` under the `swimlaneSettings` property.

| **Previous API** | **Current API** |
| ---- | ---- |
| cardSettings.priority | sortSettings.sortBy as `Index` |
| swimlaneSettings.sortBy | swimlaneSettings.sortDirection |

## 18.1.56 (2020-06-09)

### Kanban

#### Bug Fixes

- `#279543` - An issue with script error thrown when click the `showAddButton` icon and specify the `priority` property has been fixed.

## 18.1.55 (2020-06-02)

### Kanban

#### Bug Fixes

- `#278225` - An issue with kanban styles not loaded properly when `refresh` method called issue has been fixed.

## 18.1.48 (2020-05-05)

### Kanban

#### Bug Fixes

- `#274830` - An issue with Rendered empty column when empty data passed to Kanban board has been fixed.

## 18.1.46 (2020-04-28)

### Kanban

#### Bug Fixes

- `#274505` - An issue with server post triggered without showing Spinner has been fixed.
- `#274710` - An issue with dropped clone not created at first position when drag the cards has been fixed.

## 18.1.42 (2020-04-01)

### Kanban

#### New Features

- **Priority Support**: The features enable to render the cards based on the priority value. So, user can easily drag and drop the cards to particular place.
- **Dialog Editing**: The dialog editing support is used to perform CRUD actions such as add new card, edit or delete existing cards.

## 17.4.46 (2020-01-30)

### Kanban

The Kanban component is an efficient way to visually depict work at various stages of a process using cards, columns, and swimlane.

- **Data binding**: Seamless data binding with various local and remote data sources.
- **Swimlane**: The horizontal categorization of cards in the kanban, which brings transparency to the workflow. The swimlane rows can be expanded and collapsed.
- **Key mapping**: Map one or multiple keys to single columns.
- **Toggle Columns**: The columns can be expanded and collapsed.
- **WIP Validation**: Set a minimum and maximum number of cards in a column.
- **Drag and Drop**: Cards can be easily dragged and dropped from one column to another. You can also drag them from one swim lane to another.
- **Stacked headers**: Additional column headers can be added in a stacked manner.
- **Tooltip**: Display the card information with a default tooltip and templated tooltip.
- **Selection**: Select a single or multiple cards.
- **Templates**: The key elements such as cards, column headers, swimlanes and tooltip come with template support for embedding any kind of HTML element and CSS style.
- **Responsive rendering**: Adapts with optimal user interfaces to mobile and desktop form-factors.
- **Localization**: All the static text content can be localized to any desired language.
- **RTL**: Display the control contents from right to left.
