/**
 * @packageDocumentation
 * @syncfusion/ej2-xlsx - programmatic XLSX/OOXML class library for JavaScript and TypeScript.
 *
 * Parallel package root beside `src/xlsx/`. `generateRootFiles` resolves `./src/index`.
 * Public exports use paths relative to this file (`./xlsx/...`), matching
 * `src/xlsx/index.ts`.
 * Host-only chart handoff stays on `@syncfusion/ej2-xlsx/internal/charts`.
 *
 * Package identity, base `XlsxError` / `isXlsxError`, DXF authoring types, `FillEntry`,
 * `AddCommentOptions`, `validateProtectedRangeName`, `OpcPackage`, physical `Length` helpers
 * (`isLength`, unit constructors), cell formula wire types, `DataValidationImeMode`,
 * `ListSelectionType`, and `CellErrorCode` remain internal.
 */

export { Workbook } from './xlsx/workbook/workbook';
export { Worksheet } from './xlsx/workbook/worksheet';
export { SheetKind, SheetVisibility } from './xlsx/workbook/workbook-xml';
export { DefinedName, DefinedNames } from './xlsx/workbook/defined-names';
export { BuiltInDocumentProperties } from './xlsx/workbook/document-properties';
export {
  CfColorStop,
  CfIconCriterion,
  CfThresholdType,
  CfValuePoint,
  ColorScale,
  ConditionalFormat,
  ConditionalFormatOperator,
  ConditionalFormats,
  ConditionalFormatTimePeriod,
  ConditionalFormatType,
  DataBar,
  DataBarAxisPosition,
  DataBarDirection,
  IconSet,
  IconSetType,
} from './xlsx/worksheet/conditional-formatting';
export {
  DataValidation,
  DataValidationErrorStyle,
  DataValidationOperator,
  DataValidationType,
  DataValidations,
} from './xlsx/worksheet/data-validations';
export {
  CellHyperlink,
  Hyperlink,
  Hyperlinks,
  HyperlinkType,
} from './xlsx/worksheet/hyperlinks';
export { FreezePanes } from './xlsx/worksheet/freeze-panes';
export { ColumnProperties, Columns } from './xlsx/worksheet/columns';
export { RowProperties, Rows } from './xlsx/worksheet/rows';
export { SortBy, SortCondition, DataSorter } from './xlsx/worksheet/sort-state';
export { AutoFilter, FilterColumn } from './xlsx/worksheet/auto-filter';
export {
  PageHeaderFooter,
  PageMargins,
  PageOrientation,
  PageOrder,
  PageSetup,
} from './xlsx/worksheet/page-setup';
export { MergedCells, MergeRange } from './xlsx/worksheet/merged-cells';
export { Table, Tables, TableStyle } from './xlsx/worksheet/tables';
export {
  PivotAxis,
  PivotBuiltInStyle,
  PivotCache,
  PivotCaches,
  PivotAxisFields,
  PivotDataField,
  PivotDataFieldOptions,
  PivotDataFields,
  PivotField,
  PivotFieldSubtotal,
  PivotFields,
  PivotFunction,
  PivotLayout,
  PivotSortOrder,
  PivotTable,
  PivotTableAddOptions,
  PivotTableOptions,
  PivotTables,
} from './xlsx/pivot/pivot-types';
export {
  TextBox,
  TextBoxHorizontalAlignment,
  TextBoxVerticalAlignment,
} from './xlsx/worksheet/text-boxes';
export {
  AutoShapeType,
  ShapeLineStyle,
  ShapeFillType,
  ExcelGradientStyle,
} from './xlsx/worksheet/autoshapes';
export {
  Shape,
  ShapeLineFormat,
  ShapeFill,
  ShapeTextFrame,
  ShapesCollection,
} from './xlsx/worksheet/autoshapes';
export { ImageContentTypes } from './xlsx/worksheet/images';
export { Image, ImagePosition, ImageContentType } from './xlsx/worksheet/images';
export {
  ChartFillType,
  ChartType,
  DataLabelPosition,
  LegendPosition,
  TickMarkType,
} from './xlsx/worksheet/charts';
export {
  Chart,
  ChartAxis,
  ChartData,
  ChartDataLabels,
  ChartFill,
  ChartFrameFormat,
  ChartLegend,
  ChartLineFormat,
  ChartSerieFormat,
  ChartSeries,
  ChartTextArea,
  ChartView3D,
  DataLabelPositionValue,
  LegendPositionValue,
  TickMarkTypeValue,
} from './xlsx/worksheet/charts';
export {
  CheckBox,
  CheckState,
  ComboBox,
  ComboDropStyle,
  EditBox,
  EditValidation,
  FormButton,
  FormControlBase,
  FormControlStyle,
  FormControlFontStyle,
  FormControlHorizontalAlignment,
  FormControlUnderline,
  FormControlVerticalAlignment,
  FormLabel,
  GroupBox,
  ListBox,
  OptionButton,
  ScrollBar,
  SpinButton,
} from './xlsx/worksheet/form-controls';
export { ThreadedComment, ThreadedCommentReply } from './xlsx/worksheet/threaded-comments';
export { Comment, Comments } from './xlsx/worksheet/comments';
export { SheetProtectionOptions } from './xlsx/worksheet/sheet-protection';
export { WorkbookProtectionOptions } from './xlsx/workbook/workbook-protection';
export { PaperSize, PaperSizeId } from './xlsx/core/paper-size';
export {
  InvalidArgumentError,
  InvalidCommentError,
  InvalidPivotTableError,
  InvalidPasswordError,
  InvalidProtectionError,
  InvalidThreadedCommentError,
  UnsupportedEncryptionError,
} from './xlsx/core/errors';
export { BorderStyle } from './xlsx/styles/styles-xml';
export {
  Alignment,
  BorderEdge,
  Border,
  BorderStyleName,
  CellStyle,
  CellFormat,
  Color,
  Fill,
  FontSchemeValue,
  HorizontalAlignment,
  PatternType,
  Protection,
  UnderlineValue,
  VerticalAlignment,
  stripFormatLocalePrefix,
} from './xlsx/styles/styles-xml';
export { Cell } from './xlsx/cell/cell';
export { Font, RichTextString } from './xlsx/cell/rich-text';
export { CellError, CellValue } from './xlsx/cell/types';
export { isCellError, KNOWN_CELL_ERROR_CODES } from './xlsx/cell/types';

// Host-only chart APIs for internal consumption
export * from './xlsx/internal/charts';
