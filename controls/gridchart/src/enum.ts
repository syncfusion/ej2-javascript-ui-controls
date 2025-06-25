/**
 * Defines the supported chart export types.
 * ```props
 * * Print :- Printing the chart.
 * * JPEG :- Exporting the chart as a JPEG image.
 * * PNG :- Exporting the chart as a PNG image.
 * * SVG :- Exporting the chart as an SVG image.
 * * PDF :- Exporting the chart as a PDF document.
 * * XLSX :- Exporting the chart data to an Excel file.
 * * CSV :- Exporting the chart data to a CSV file.
 * ```
 */
export type ChartExportItem =
    'Print' |
    'JPEG' |
    'PNG' |
    'SVG' |
    'PDF' |
    'XLSX' |
    'CSV';

export type TitleSection = 'Title' | 'Subtitle';

export type Axes = 'Category' | 'Value';
