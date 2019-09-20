<!-- markdownlint-disable MD010 -->

<!-- markdownlint-disable MD030 -->

<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 17.1.48 (2019-05-21)

### TreeMap

#### Bug Fixes

- `#I235721` - The issue with color value in individual nodes of levels in treemap has been resolved.

## 17.1.44 (2019-05-07)

### TreeMap

#### Bug Fixes

- `#I234615` - The issue with value from the "fill" property is not applied when we have both the "fill" and "colorValuePath" APIs has been fixed.

## 17.1.42 (2019-04-23)

### TreeMap

#### Bug Fixes

- `#I233284` – The issue of breaking the treemap, if data contains the "_" character in its value has been fixed.

## 17.1.32-beta (2019-03-13)

### TreeMap

#### New Features

- The right-to-left (RTL) rendering support has been provided.
- Load on-demand option has been provided to load and render the child items dynamically.
- Responsive support has been provided to the TreeMap legend.
- The 'doubleClick', 'rightClick', and 'legendRendering' events have been provided in TreeMap.

## 16.4.40-beta (2018-12-10)

### TreeMap

#### New Features

- Support has been added for desaturation color mapping.
- Support has been added to hide specific legend items and bind legend text from data source.
- Support has been added for highlighting or selecting the legend items along with shapes.
- Support has been added to bind colors for the items from the data source.

## 16.2.41 (2018-06-25)

### TreeMap

The TreeMap is used to displayed the hierarchical or multi-level data to visualize the nested rectangles.

- **Layout Mode** - TreeMap supports different type of layouts like Squarified, SliceAndDiceHorizontal, SliceAndDiceVertical and SliceAndDiceAuto.
- **Legend** - TreeMap supports legend feature with different mode. Default and Interactive.
- **LabelTemplate** - Leaf item labels can be customized by the label template.
- **ColorMapping** - TreeMap supports the color mapping feature. It used to customize the leaf item fill colors based on range or values.
- **User-Interactions** - TreeMap supports the Drilldown, Tooltip, Highlight and Selection user interaction features.
- **Print and Export** - TreeMap supports printing and exporting as different file types.
