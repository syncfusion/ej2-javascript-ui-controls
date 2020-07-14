# Changelog

## [Unreleased]

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
