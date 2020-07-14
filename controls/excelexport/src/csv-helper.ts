import { ValueFormatter } from './value-formatter';
/**
 * CsvHelper class
 * @private
 */
export class CsvHelper {
    private isMicrosoftBrowser: boolean;
    private buffer: Blob;
    private csvStr: string;
    private formatter: ValueFormatter;
    private globalStyles: Map<string, string>;
    private isServerRendered: boolean;
    private separator: string;
    /* tslint:disable:no-any */
    constructor(json: any, separator: string) {
        this.csvStr = '';
        if (separator === null || separator === undefined) {
            this.separator = ',';
        } else {
            this.separator = separator;
        }
        this.formatter = new ValueFormatter();
        this.isMicrosoftBrowser = !(!navigator.msSaveBlob);
        if (json.isServerRendered !== null && json.isServerRendered !== undefined) {
           this.isServerRendered = json.isServerRendered;
        }

        if (json.styles !== null && json.styles !== undefined) {
            this.globalStyles = new Map<string, string>();
            for (let i: number = 0; i < json.styles.length; i++) {
                if (json.styles[i].name !== undefined && json.styles[i].numberFormat !== undefined) {
                    this.globalStyles.set(json.styles[i].name, json.styles[i].numberFormat);
                }
            }
        }

        // Parses Worksheets data to DOM.        
        if (json.worksheets !== null && json.worksheets !== undefined) {
            this.parseWorksheet(json.worksheets[0]);
        }

        //this.csvStr = 'a1,a2,a3\nb1,b2,b3';
    }

    private parseWorksheet(json: any): void {
        //Rows
        if (json.rows !== null && json.rows !== undefined) {
            this.parseRows(json.rows);
        }
    }
    /* tslint:disable:no-any */
    private parseRows(rows: any): void {
        let count: number = 1;
        for (let row of rows) {
            //Row index
            if (row.index !== null && row.index !== undefined) {
                while (count < row.index) {
                    this.csvStr += '\n';
                    count++;
                }
                this.parseRow(row);
            } else {
                throw Error('Row index is missing.');
            }

        }
    }
    /* tslint:disable:no-any */
    private parseRow(row: any): void {
        if (row.cells !== null && row.cells !== undefined) {
            let count: number = 1;
            for (let cell of row.cells) {
                //cell index
                if (cell.index !== null && cell.index !== undefined) {
                    while (count < cell.index) {
                        this.csvStr += this.separator;
                        count++;
                    }
                    this.parseCell(cell);
                } else {
                    throw Error('Cell index is missing.');
                }

            }
        }
    }
    /* tslint:disable:no-any */
    private parseCell(cell: any): void {
        let csv: string = this.csvStr;
        if (cell.value !== undefined) {
            if (cell.value instanceof Date) {
                if (cell.style !== undefined && cell.style.numberFormat !== undefined) {
                    /* tslint:disable-next-line:max-line-length */
                    try {
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', skeleton: cell.style.numberFormat }, this.isServerRendered));
                    } catch (error) {
                    /* tslint:disable-next-line:max-line-length */
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', format: cell.style.numberFormat }, this.isServerRendered));
                    }
                } else if (cell.style !== undefined && cell.style.name !== undefined && this.globalStyles.has(cell.style.name)) {
                    /* tslint:disable-next-line:max-line-length */
                    try {
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', skeleton: this.globalStyles.get(cell.style.name) }, this.isServerRendered));
                    } catch (error) {
                    /* tslint:disable-next-line:max-line-length */
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { type: 'dateTime', format: this.globalStyles.get(cell.style.name) }, this.isServerRendered));
                    }
                } else {
                    csv += cell.value;
                }
            } else if (typeof (cell.value) === 'boolean') {
                csv += cell.value ? 'TRUE' : 'FALSE';
            } else if (typeof (cell.value) === 'number') {
                if (cell.style !== undefined && cell.style.numberFormat !== undefined) {
                    /* tslint:disable-next-line:max-line-length */
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { format: cell.style.numberFormat }, this.isServerRendered));
                } else if (cell.style !== undefined && cell.style.name !== undefined && this.globalStyles.has(cell.style.name)) {
                    /* tslint:disable-next-line:max-line-length */
                    csv += this.parseCellValue(this.formatter.displayText(cell.value, { format: this.globalStyles.get(cell.style.name) }, this.isServerRendered));
                } else {
                    csv += cell.value;
                }
            } else {
                csv += this.parseCellValue(cell.value);
            }
        }
        this.csvStr = csv;
    }
    private parseCellValue(value: String): any {
        let val: string = '';

        let length: number = value.length;

        for (let start: number = 0; start < length ; start++) {
            if (value[start] === '\"') {
                val += value[start].replace('\"', '\"\"');
            } else {
                val += value[start];
            }
        }
        value = val;
        if (value.indexOf(this.separator) !== -1 || value.indexOf('\n') !== -1) {
            return value = '\"' + value + '\"';
        } else {
            return value;
        }
    }
    /**
     * Saves the file with specified name and sends the file to client browser
     * @param  {string} fileName- file name to save.
     * @param  {Blob} buffer- the content to write in file     
     */
    public save(fileName: string): void {
        this.buffer = new Blob(['\ufeff' + this.csvStr], { type: 'text/csv;charset=UTF-8' });
        if (this.isMicrosoftBrowser) {
            navigator.msSaveBlob(this.buffer, fileName);
        } else {
            let dataUrl: string = window.URL.createObjectURL(this.buffer);
            let dwlLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
            dwlLink.download = fileName;
            dwlLink.href = dataUrl;
            let event: MouseEvent = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            dwlLink.dispatchEvent(event);
            setTimeout((): void => {
                window.URL.revokeObjectURL(dataUrl);
            });
        }
    }

    public saveAsBlob(): Blob {
        return new Blob(['\ufeff' + this.csvStr], { type: 'text/csv;charset=UTF-8' });
    }
}