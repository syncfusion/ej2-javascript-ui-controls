import { LayoutViewer } from '../index';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HeaderFooters } from '../viewer/page';
/** 
 * Exports the document to Text format.
 */
export class TextExport {
    private getModuleName(): string {
        return 'TextExport';
    }
    private text: string = '';
    private curSectionIndex: number = 0;
    /* tslint:disable:no-any */
    private sections: any[];
    private document: any;
    private lastPara: any;
    private mSections: any;
    private inField: boolean = false;
    /**
     * @private
     */
    public save(viewer: LayoutViewer, fileName: string): void {
        this.serialize(viewer);
        let writer: StreamWriter = new StreamWriter();
        this.writeInternal(writer);
        writer.save(fileName + '.txt');
    }
    /**
     * @private
     */
    public saveAsBlob(viewer: LayoutViewer): Promise<Blob> {
        this.serialize(viewer);
        let streamWriter: StreamWriter = new StreamWriter();
        this.writeInternal(streamWriter);
        let blob: Blob = streamWriter.buffer;
        streamWriter.destroy();
        let promise: Promise<Blob>;
        return new Promise((resolve: Function, reject: Function) => {
            resolve(blob);
        });
    }
    private serialize(viewer: LayoutViewer): void {
        let document: any = viewer.owner.sfdtExportModule.write();
        this.setDocument(document);
    }
    private setDocument(document: any): void {
        this.document = document;
        this.mSections = document.sections;
    }
    private writeInternal(streamWriter: StreamWriter): void {
        let section: any = undefined;
        let sectionCount: number = this.document.sections.length - 1;
        let isLastSection: boolean = false;
        this.updateLastParagraph();
        for (let i: number = 0; i <= sectionCount; i++) {
            section = this.document.sections[i] as any;
            isLastSection = (i === sectionCount) ? true : false;
            this.writeBody(streamWriter, section.blocks);
            this.writeNewLine(streamWriter);
            this.writeSectionEnd(section, isLastSection);
        }
        for (let j: number = 0; j <= sectionCount; j++) {
            section = this.document.sections[j];
            this.writeHeadersFooters(streamWriter, section);
        }
    }
    /// <summary>
    /// Writes the specified document content to the text file.
    /// </summary>
    private writeBody(streamWriter: StreamWriter, body: any[]): void {
        let bodyItemsCount: number = body.length - 1;
        let bodyItem: any = undefined;
        for (let i: number = 0; i <= bodyItemsCount; i++) {
            bodyItem = body[i] as any;
            if (bodyItem.hasOwnProperty('inlines') as any) {
                let isLastPara: boolean = (bodyItem as any === this.lastPara) ? true : false;
                this.writeParagraph(streamWriter, bodyItem as any, isLastPara);
            } else {
                this.writeTable(streamWriter, bodyItem as any);
            }
        }
    }
    private writeParagraph(streamWriter: StreamWriter, paragraph: any, isLastPara: boolean): void {
        for (let i: number = 0; i < paragraph.inlines.length; i++) {
            let item: any = paragraph.inlines[i];
            if (item.hasOwnProperty('fieldType')) {
                this.inField = item.fieldType === 0;
            } else if (item.hasOwnProperty('text') && !this.inField) {
                this.writeText(streamWriter, item.text);
            }
        }
        if (!isLastPara) {
            this.writeNewLine(streamWriter);
        }
    }
    /// }
    /// <summary>
    /// Writes the specified table text content to the text file.
    /// </summary>
    private writeTable(streamWriter: StreamWriter, table: any): void {
        for (let i: number = 0; i < table.rows.length; i++) {
            let row: any = table.rows[i];
            for (let j: number = 0; j < row.cells.length; j++) {
                let cell: any = row.cells[j];
                this.writeBody(streamWriter, cell.blocks);
            }
        }
    }
    /// <summary>
    /// Writes the specified Header Footer text content to the text file.
    /// </summary>
    private writeHeadersFooters(streamWriter: StreamWriter, section: any): void {
        let headersFooters: HeaderFooters = section.headersFooters;
        if (isNullOrUndefined(headersFooters)) {
            return;
        }
        this.writeHeaderFooter(streamWriter, section.headersFooters.header);
        this.writeHeaderFooter(streamWriter, section.headersFooters.footer);
        this.writeHeaderFooter(streamWriter, section.headersFooters.evenFooter);
        this.writeHeaderFooter(streamWriter, section.headersFooters.evenHeader);
        this.writeHeaderFooter(streamWriter, section.headersFooters.firstPageHeader);
        this.writeHeaderFooter(streamWriter, section.headersFooters.firstPageFooter);
    }
    private writeHeaderFooter(streamWriter: StreamWriter, headerFooter: any): void {
        if (headerFooter && headerFooter.blocks) {
            this.writeBody(streamWriter, headerFooter.blocks);
        }
    }
    /// <summary>
    /// Writes the end of the section.
    /// </summary>
    private writeSectionEnd(section: any, lastSection: boolean): void {
        this.curSectionIndex++;
    }
    private writeNewLine(writer: StreamWriter): void {
        writer.writeLine('');
    }
    private writeText(writer: StreamWriter, text: string): void {
        writer.write(text);
    }
    private updateLastParagraph(): void {
        let cnt: number = this.document.sections.length;
        let sec: any;
        if (cnt > 0) {
            sec = this.document.sections[cnt - 1];
        }
        if (!isNullOrUndefined(sec)) {
            let paragraphs: any[] = [];
            for (let i: number = 0; i < sec.blocks.length; i++) {
                if (sec.blocks[i].hasOwnProperty('inlines') as any) {
                    paragraphs.push(sec.blocks[i] as any);
                }
            }
            let pCount: number = paragraphs.length;
            if (pCount > 0) {
                this.lastPara = paragraphs[pCount - 1];
            }
        }
    }
    /**
     * @private
     */
    public destroy(): void {
        this.document = undefined;
        this.lastPara = undefined;
        this.mSections = undefined;
        this.sections = undefined;
    }
}
