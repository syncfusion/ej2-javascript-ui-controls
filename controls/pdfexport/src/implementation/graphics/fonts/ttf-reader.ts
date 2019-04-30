/**
 * TtfReader.ts class for EJ2-PDF
 */
import { TtfTableInfo } from './ttf-table-info';
import { Dictionary } from './../../collections/dictionary';
import { TtfNameTable } from './ttf-name-table';
import { TtfNameRecord } from './ttf-name-record';
import { TtfHeadTable } from './ttf-head-table';
import { TtfMetrics } from './ttf-metrics';
import { TtfHorizontalHeaderTable } from './ttf-horizontal-header-table';
import { TtfOS2Table } from './ttf-OS2-Table';
import { TtfPostTable } from './ttf-post-table';
import { TtfLongHorMetric } from './ttf-long-hor-metric';
import { TtfCmapSubTable } from './ttf-cmap-sub-table';
import { TtfCmapTable } from './ttf-cmap-table';
import { TtfGlyphInfo } from './ttf-glyph-info';
import { TtfLocaTable } from './ttf-loca-table';
import { TtfAppleCmapSubTable } from './ttf-apple-cmap-sub-table';
import { TtfMicrosoftCmapSubTable } from './ttf-microsoft-cmap-sub-table';
import { TtfTrimmedCmapSubTable } from './ttf-trimmed-cmap-sub-table';
import { TtfGlyphHeader } from './ttf-glyph-header';
import { Rectangle } from './../../drawing/pdf-drawing';
import { StringTokenizer } from './string-tokenizer';
import { TtfCmapFormat, TtfCmapEncoding, TtfPlatformID } from './enum';
import { TtfMicrosoftEncodingID, TtfMacintoshEncodingID, TtfCompositeGlyphFlags } from './enum';
import { BigEndianWriter } from './../../input-output/big-endian-writer';
export class TtfReader {
    //Fields
    private fontData : Uint8Array;
    private readonly int32Size : number = 4;
    private offset : number;
    public tableDirectory : Dictionary<string, TtfTableInfo>;
    private isTtcFont : boolean = false;
    private isMacTtf : boolean = false;
    private lowestPosition : number;
    private metricsName : string = '';
    public metrics : TtfMetrics;
    private maxMacIndex : number;
    private isFontPresent : boolean;
    private isMacTTF : boolean = false;
    private missedGlyphs : number = 0;
    private tableNames : string[] = ['cvt ', 'fpgm', 'glyf', 'head', 'hhea', 'hmtx', 'loca', 'maxp', 'prep'];
    private entrySelectors : number[] = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4];
    /**
     * Width table.
     */
    private width : number[];
    /**
     * Indicates whether loca table is short.
     */
    public bIsLocaShort : boolean;
    /**
     * Glyphs for Macintosh or Symbol fonts.
     */
    private macintoshDictionary : Dictionary<number, TtfGlyphInfo>;
    /**
     * Glyphs for Microsoft or Symbol fonts.
     */
    private microsoftDictionary : Dictionary<number, TtfGlyphInfo>;
    /**
     * Glyphs for Macintosh or Symbol fonts (glyph index - key, glyph - value).
     */
    private internalMacintoshGlyphs : Dictionary<number, TtfGlyphInfo>;
    /**
     * Glyphs for Microsoft or Symbol fonts (glyph index - key, glyph - value).
     */
    private internalMicrosoftGlyphs : Dictionary<number, TtfGlyphInfo>;
    //Properties
    /**
     * Gets glyphs for Macintosh or Symbol fonts (char - key, glyph - value).
     */
    private get macintosh() : Dictionary<number, TtfGlyphInfo> {
        if (this.macintoshDictionary === null || this.macintoshDictionary === undefined) {
            this.macintoshDictionary = new Dictionary<number, TtfGlyphInfo>();
        }
        return this.macintoshDictionary;
    }
    /**
     * Gets glyphs for Microsoft or Symbol fonts (char - key, glyph - value).
     */
    private get microsoft() : Dictionary<number, TtfGlyphInfo> {
        if (this.microsoftDictionary === null || this.microsoftDictionary === undefined) {
            this.microsoftDictionary = new Dictionary<number, TtfGlyphInfo>();
        }
        return this.microsoftDictionary;
    }
    /**
     * Gets glyphs for Macintosh or Symbol fonts (glyph index - key, glyph - value).
     */
    private get macintoshGlyphs() : Dictionary<number, TtfGlyphInfo> {
        if (this.internalMacintoshGlyphs === null || this.internalMacintoshGlyphs === undefined) {
            this.internalMacintoshGlyphs = new Dictionary<number, TtfGlyphInfo>();
        }
        return this.internalMacintoshGlyphs;
    }
    /**
     * Gets glyphs for Microsoft Unicode fonts (glyph index - key, glyph - value).
     */
    private get microsoftGlyphs() : Dictionary<number, TtfGlyphInfo> {
        if (this.internalMicrosoftGlyphs === null || this.internalMicrosoftGlyphs === undefined) {
            this.internalMicrosoftGlyphs = new Dictionary<number, TtfGlyphInfo>();
        }
        return this.internalMicrosoftGlyphs;
    }
    //Constructors
    public constructor(fontData : Uint8Array) {
        this.fontData = fontData;
        this.initialize();
    }
    //Implementation
    private initialize() : void {
        if (this.metrics === undefined) {
            this.metrics = new TtfMetrics();
        }
        this.readFontDictionary();
        let nameTable : TtfNameTable = this.readNameTable();
        let headTable : TtfHeadTable = this.readHeadTable();
        this.initializeFontName(nameTable);
        this.metrics.macStyle = headTable.macStyle;
    }
    private readFontDictionary() : void {
        this.offset = 0;
        let version : number = this.checkPreambula();
        //this.offset += 4;
        let numTables : number = this.readInt16(this.offset);
        let searchRange : number = this.readInt16(this.offset);
        let entrySelector : number = this.readInt16(this.offset);
        let rangeShift : number = this.readInt16(this.offset);
        if (this.tableDirectory === undefined) {
            this.tableDirectory = new Dictionary<string, TtfTableInfo>();
        }
        for (let i : number = 0; i < numTables; ++i) {
            let table : TtfTableInfo = new TtfTableInfo();
            let tableKey : string = this.readString(this.int32Size);
            table.checksum = this.readInt32(this.offset);
            table.offset = this.readInt32(this.offset);
            table.length = this.readInt32(this.offset);
            this.tableDirectory.setValue(tableKey, table);
        }
        this.lowestPosition = this.offset;
        if (!this.isTtcFont) {
            this.fixOffsets();
        }
    }
    private fixOffsets() : void {
        let minOffset : number = Number.MAX_VALUE;
        // Search for a smallest offset and compare it with the lowest position found.
        let tableKeys : string[] = this.tableDirectory.keys();
        for (let i : number = 0; i < tableKeys.length; i++) {
            let value : TtfTableInfo = this.tableDirectory.getValue(tableKeys[i]);
            let offset : number = value.offset;
            if (minOffset > offset) {
                minOffset = offset;
                if (minOffset <= this.lowestPosition) {
                    break;
                }
            }
        }
        let shift : number = minOffset - this.lowestPosition;
        if (shift !== 0) {
            let table : Dictionary<string, TtfTableInfo> = new Dictionary<string, TtfTableInfo>();
            for (let i : number = 0; i < tableKeys.length; i++) {
                let value : TtfTableInfo = this.tableDirectory.getValue(tableKeys[i]);
                value.offset -= shift;
                table.setValue(tableKeys[i], value);
            }
            this.tableDirectory = table;
        }
    }
    private checkPreambula() : number {
        let version : number = this.readInt32(this.offset);
        this.isMacTtf = (version === 0x74727565) ? true : false;
        if (version !== 0x10000 && version !== 0x74727565 && version !== 0x4f54544f) {
            this.isTtcFont = true;
            this.offset = 0;
            let fontTag : string = this.readString(4);
            if (fontTag !== 'ttcf') {
                throw new Error('Can not read TTF font data');
            }
            //skip 4
            this.offset += 4;
            let ttcIdentificationNumber : number = this.readInt32(this.offset);
            if (ttcIdentificationNumber < 0) {
                throw new Error('Can not read TTF font data');
            }
            this.offset = this.readInt32(this.offset);
            version = this.readInt32(this.offset);
        }
        return version;
    }
    private readNameTable() : TtfNameTable {
        let tableInfo : TtfTableInfo = this.getTable('name');
        this.offset = tableInfo.offset;
        let table : TtfNameTable = new TtfNameTable();
        table.formatSelector = this.readUInt16(this.offset);
        table.recordsCount = this.readUInt16(this.offset);
        table.offset = this.readUInt16(this.offset);
        table.nameRecords = [];
        let recordSize : number = 12;
        let position : number = this.offset;
        for (let i : number = 0; i < table.recordsCount; i++) {
            this.offset = position;
            let record : TtfNameRecord = new TtfNameRecord();
            record.platformID = this.readUInt16(this.offset);
            record.encodingID = this.readUInt16(this.offset);
            record.languageID = this.readUInt16(this.offset);
            record.nameID = this.readUInt16(this.offset);
            record.length = this.readUInt16(this.offset);
            record.offset = this.readUInt16(this.offset);
            this.offset = tableInfo.offset + table.offset + record.offset;
            let unicode : boolean = (record.platformID === 0 || record.platformID === 3);
            record.name = this.readString(record.length, unicode);
            table.nameRecords[i] = record;
            position += recordSize;
        }
        return table;
    }
    private readHeadTable() : TtfHeadTable {
        let tableInfo : TtfTableInfo = this.getTable('head');
        this.offset = tableInfo.offset;
        let table : TtfHeadTable = new TtfHeadTable();
        table.version = this.readFixed(this.offset);
        table.fontRevision = this.readFixed(this.offset);
        table.checkSumAdjustment = this.readUInt32(this.offset);
        table.magicNumber = this.readUInt32(this.offset);
        table.flags = this.readUInt16(this.offset);
        table.unitsPerEm = this.readUInt16(this.offset);
        table.created = this.readInt64(this.offset);
        table.modified = this.readInt64(this.offset);
        table.xMin = this.readInt16(this.offset);
        table.yMin = this.readInt16(this.offset);
        table.xMax = this.readInt16(this.offset);
        table.yMax = this.readInt16(this.offset);
        table.macStyle = this.readUInt16(this.offset);
        table.lowestReadableSize = this.readUInt16(this.offset);
        table.fontDirectionHint = this.readInt16(this.offset);
        table.indexToLocalFormat = this.readInt16(this.offset);
        table.glyphDataFormat = this.readInt16(this.offset);
        return table;
    }
    private readHorizontalHeaderTable() : TtfHorizontalHeaderTable {
        let tableInfo : TtfTableInfo = this.getTable('hhea');
        this.offset = tableInfo.offset;
        let table : TtfHorizontalHeaderTable = new TtfHorizontalHeaderTable();
        table.version = this.readFixed(this.offset);
        table.ascender = this.readInt16(this.offset);
        table.descender = this.readInt16(this.offset);
        table.lineGap = this.readInt16(this.offset);
        table.advanceWidthMax = this.readUInt16(this.offset);
        table.minLeftSideBearing = this.readInt16(this.offset);
        table.minRightSideBearing = this.readInt16(this.offset);
        table.xMaxExtent = this.readInt16(this.offset);
        table.caretSlopeRise = this.readInt16(this.offset);
        table.caretSlopeRun = this.readInt16(this.offset);
        //skip 2 * 5
        this.offset += 10;
        table.metricDataFormat = this.readInt16(this.offset);
        table.numberOfHMetrics = this.readUInt16(this.offset);
        return table;
    }
    private readOS2Table() : TtfOS2Table {
        let tableInfo : TtfTableInfo = this.getTable('OS/2');
        this.offset = tableInfo.offset;
        let table : TtfOS2Table = new TtfOS2Table();
        table.version = this.readUInt16(this.offset);
        table.xAvgCharWidth = this.readInt16(this.offset);
        table.usWeightClass = this.readUInt16(this.offset);
        table.usWidthClass = this.readUInt16(this.offset);
        table.fsType = this.readInt16(this.offset);
        table.ySubscriptXSize = this.readInt16(this.offset);
        table.ySubscriptYSize = this.readInt16(this.offset);
        table.ySubscriptXOffset = this.readInt16(this.offset);
        table.ySubscriptYOffset = this.readInt16(this.offset);
        table.ySuperscriptXSize = this.readInt16(this.offset);
        table.ySuperscriptYSize = this.readInt16(this.offset);
        table.ySuperscriptXOffset = this.readInt16(this.offset);
        table.ySuperscriptYOffset = this.readInt16(this.offset);
        table.yStrikeoutSize = this.readInt16(this.offset);
        table.yStrikeoutPosition = this.readInt16(this.offset);
        table.sFamilyClass = this.readInt16(this.offset);
        table.panose = this.readBytes(10);
        table.ulUnicodeRange1 = this.readUInt32(this.offset);
        table.ulUnicodeRange2 = this.readUInt32(this.offset);
        table.ulUnicodeRange3 = this.readUInt32(this.offset);
        table.ulUnicodeRange4 = this.readUInt32(this.offset);
        table.vendorIdentifier = this.readBytes(4);
        table.fsSelection = this.readUInt16(this.offset);
        table.usFirstCharIndex = this.readUInt16(this.offset);
        table.usLastCharIndex = this.readUInt16(this.offset);
        table.sTypoAscender = this.readInt16(this.offset);
        table.sTypoDescender = this.readInt16(this.offset);
        table.sTypoLineGap = this.readInt16(this.offset);
        table.usWinAscent = this.readUInt16(this.offset);
        table.usWinDescent = this.readUInt16(this.offset);
        table.ulCodePageRange1 = this.readUInt32(this.offset);
        table.ulCodePageRange2 = this.readUInt32(this.offset);
        if (table.version > 1) {
            table.sxHeight = this.readInt16(this.offset);
            table.sCapHeight = this.readInt16(this.offset);
            table.usDefaultChar = this.readUInt16(this.offset);
            table.usBreakChar = this.readUInt16(this.offset);
            table.usMaxContext = this.readUInt16(this.offset);
        } else {
            table.sxHeight = 0;
            table.sCapHeight = 0;
            table.usDefaultChar = 0;
            table.usBreakChar = 0;
            table.usMaxContext = 0;
        }
        return table;
    }
    private readPostTable() : TtfPostTable {
        let tableInfo : TtfTableInfo = this.getTable('post');
        this.offset = tableInfo.offset;
        let table : TtfPostTable = new TtfPostTable();
        table.formatType = this.readFixed(this.offset);
        table.italicAngle = this.readFixed(this.offset);
        table.underlinePosition = this.readInt16(this.offset);
        table.underlineThickness = this.readInt16(this.offset);
        table.isFixedPitch = this.readUInt32(this.offset);
        table.minType42 = this.readUInt32(this.offset);
        table.maxType42 = this.readUInt32(this.offset);
        table.minType1 = this.readUInt32(this.offset);
        table.maxType1 = this.readUInt32(this.offset);
        return table;
    }
    /**
     * Reads Width of the glyphs.
     */
    private readWidthTable(glyphCount : number, unitsPerEm : number) : number[] {
        let tableInfo : TtfTableInfo = this.getTable('hmtx');
        this.offset = tableInfo.offset;
        let width : number[] = [];
        for (let i : number = 0; i < glyphCount; i++) {
            let glyph : TtfLongHorMetric = new TtfLongHorMetric();
            glyph.advanceWidth = this.readUInt16(this.offset);
            glyph.lsb = this.readInt16(this.offset);
            let glyphWidth : number = glyph.advanceWidth * 1000 / unitsPerEm;
            width.push(Math.floor(glyphWidth));
        }
        return width;
    }
    /**
     * Reads the cmap table.
     */
    private readCmapTable() : TtfCmapSubTable[] {
        let tableInfo : TtfTableInfo = this.getTable('cmap');
        this.offset = tableInfo.offset;
        let table : TtfCmapTable = new TtfCmapTable();
        table.version = this.readUInt16(this.offset);
        table.tablesCount = this.readUInt16(this.offset);
        let position : number = this.offset;
        let subTables : TtfCmapSubTable[] = [];
        for (let i : number = 0; i < table.tablesCount; i++) {
            this.offset = position;
            let subTable : TtfCmapSubTable = new TtfCmapSubTable();
            subTable.platformID = this.readUInt16(this.offset);
            subTable.encodingID = this.readUInt16(this.offset);
            subTable.offset = this.readUInt32(this.offset);
            position = this.offset;
            this.readCmapSubTable(subTable);
            subTables[i] = subTable;
        }
        return subTables;
    }
    /**
     * Reads the cmap sub table.
     */
    private readCmapSubTable(subTable : TtfCmapSubTable) : void {
        let tableInfo : TtfTableInfo = this.getTable('cmap');
        this.offset = tableInfo.offset + subTable.offset;
        let format : TtfCmapFormat = this.readUInt16(this.offset) as TtfCmapFormat;
        let encoding : TtfCmapEncoding = this.getCmapEncoding(subTable.platformID, subTable.encodingID);
        let platform : TtfPlatformID = (encoding === TtfCmapEncoding.Macintosh) ? TtfPlatformID.Macintosh : TtfPlatformID.Microsoft;
        if (encoding !== TtfCmapEncoding.Unknown) {
            switch (format) {
                case TtfCmapFormat.Apple:
                    this.readAppleCmapTable(subTable, encoding);
                    break;
                case TtfCmapFormat.Microsoft:
                    this.readMicrosoftCmapTable(subTable, encoding);
                    break;
                case TtfCmapFormat.Trimmed:
                    this.readTrimmedCmapTable(subTable, encoding);
                    break;
            }
        }
    }
    /**
     * Reads Symbol cmap table.
     */
    private readAppleCmapTable(subTable : TtfCmapSubTable, encoding : TtfCmapEncoding) : void {
        let tableInfo : TtfTableInfo = this.getTable('cmap');
        this.offset = tableInfo.offset + subTable.offset;
        let table : TtfAppleCmapSubTable = new TtfAppleCmapSubTable();
        table.format = this.readUInt16(this.offset);
        table.length = this.readUInt16(this.offset);
        table.version = this.readUInt16(this.offset);
        if (this.maxMacIndex === null || this.maxMacIndex === undefined) {
            this.maxMacIndex = 0;
        }
        for (let i : number = 0; i < 256; ++i) {
            let glyphInfo : TtfGlyphInfo = new TtfGlyphInfo();
            glyphInfo.index = this.readByte(this.offset) as number;
            glyphInfo.width = this.getWidth(glyphInfo.index);
            glyphInfo.charCode = i;
            this.macintosh.setValue(i, glyphInfo);
            this.addGlyph(glyphInfo, encoding);
            // NOTE: this code fixes char codes that extends 0x100. However, it might corrupt something.
            this.maxMacIndex = Math.max(i, this.maxMacIndex);
        }
    }
    /**
     * Reads Symbol cmap table.
     */
    private readMicrosoftCmapTable(subTable : TtfCmapSubTable, encoding : TtfCmapEncoding) : void {
        let tableInfo : TtfTableInfo = this.getTable('cmap');
        this.offset = tableInfo.offset + subTable.offset;
        let collection : Dictionary<number, TtfGlyphInfo> = (encoding === TtfCmapEncoding.Unicode) ? this.microsoft : this.macintosh;
        let table : TtfMicrosoftCmapSubTable = new TtfMicrosoftCmapSubTable();
        table.format = this.readUInt16(this.offset);
        table.length = this.readUInt16(this.offset);
        table.version = this.readUInt16(this.offset);
        table.segCountX2 = this.readUInt16(this.offset);
        table.searchRange = this.readUInt16(this.offset);
        table.entrySelector = this.readUInt16(this.offset);
        table.rangeShift = this.readUInt16(this.offset);
        let segCount : number = table.segCountX2 / 2;
        table.endCount = this.readUshortArray(segCount);
        table.reservedPad = this.readUInt16(this.offset);
        table.startCount = this.readUshortArray(segCount);
        table.idDelta = this.readUshortArray(segCount);
        table.idRangeOffset = this.readUshortArray(segCount);
        let length : number = (table.length / 2 - 8) - (segCount * 4);
        table.glyphID = this.readUshortArray(length);
        // Process glyphIdArray array.
        let codeOffset : number = 0;
        let index : number = 0;
        for (let j : number = 0; j < segCount; j++) {
            for (let k : number = table.startCount[j]; k <= table.endCount[j] && k !== 65535; k++) {
                if (table.idRangeOffset[j] === 0) {
                    codeOffset = (k + table.idDelta[j]) & 65535;
                } else {
                    index = j + table.idRangeOffset[j] / 2 - segCount + k - table.startCount[j];
                    if (index >= table.glyphID.length) {
                        continue;
                    }
                    codeOffset = (table.glyphID[index] + table.idDelta[j]) & 65535;
                }
                let glyph : TtfGlyphInfo = new TtfGlyphInfo();
                glyph.index = codeOffset;
                glyph.width = this.getWidth(glyph.index);
                let id : number = (encoding === TtfCmapEncoding.Symbol) ? ((k & 0xff00) === 0xf000 ? k & 0xff : k) : k;
                glyph.charCode = id;
                collection.setValue(id, glyph);
                this.addGlyph(glyph, encoding);
            }
        }
    }
    /**
     * Reads Trimed cmap table.
     */
    private readTrimmedCmapTable(subTable : TtfCmapSubTable, encoding : TtfCmapEncoding) : void {
        let tableInfo : TtfTableInfo = this.getTable('cmap');
        this.offset = tableInfo.offset + subTable.offset;
        let table : TtfTrimmedCmapSubTable = new TtfTrimmedCmapSubTable();
        table.format = this.readUInt16(this.offset);
        table.length = this.readUInt16(this.offset);
        table.version = this.readUInt16(this.offset);
        table.firstCode = this.readUInt16(this.offset);
        table.entryCount = this.readUInt16(this.offset);
        for (let i : number = 0; i < table.entryCount; ++i) {
            let glyphInfo : TtfGlyphInfo = new TtfGlyphInfo();
            glyphInfo.index = this.readUInt16(this.offset);
            glyphInfo.width = this.getWidth(glyphInfo.index);
            glyphInfo.charCode = i + table.firstCode;
            this.macintosh.setValue(i, glyphInfo);
            this.addGlyph(glyphInfo, encoding);
            // NOTE: this code fixes char codes that extends 0x100. However, it might corrupt something.
            this.maxMacIndex = Math.max(i, this.maxMacIndex);
        }
    }
    private initializeFontName(nameTable : TtfNameTable) : void {
        for (let i : number = 0; i < nameTable.recordsCount; i++) {
            let record : TtfNameRecord = nameTable.nameRecords[i];
            if (record.nameID === 1) {
                //font family
                this.metrics.fontFamily = record.name;
            } else if (record.nameID === 6) {
                //post script name
                this.metrics.postScriptName = record.name;
            }
            /* tslint:disable */
            if (this.metrics.fontFamily !== null && this.metrics.fontFamily !== undefined && this.metrics.postScriptName !== null && this.metrics.postScriptName !== undefined) {
                break;
            }
            /* tslint:disable */
        }
    }
    private getTable(name : string) : TtfTableInfo {
        // if (name === null) {
        //     throw new Error('Argument Null Exception : name');
        // }
        let table : TtfTableInfo = new TtfTableInfo();
        let obj : TtfTableInfo;
        if (this.tableDirectory.containsKey(name)) {
            obj = this.tableDirectory.getValue(name);
        }
        if (obj !== null && obj !== undefined) {
            table = obj as TtfTableInfo;
        }
        return table;
    }
    /**
     * Returns width of the glyph.
     */
    private getWidth(glyphCode : number) : number {
        glyphCode = (glyphCode < this.width.length) ? glyphCode : this.width.length - 1;
        return this.width[glyphCode];
    }
    /**
     * Gets CMAP encoding based on platform ID and encoding ID.
     */
    /* tslint:disable */
    private getCmapEncoding(platformID : number, encodingID : number) : TtfCmapEncoding {
        let format : TtfCmapEncoding = TtfCmapEncoding.Unknown;
        if (platformID == (TtfPlatformID.Microsoft as number) && encodingID == (TtfMicrosoftEncodingID.Undefined as number)) {
            // When building a symbol font for Windows,
            // the platform ID should be 3 and the encoding ID should be 0.
            format = TtfCmapEncoding.Symbol;
        } else if (platformID == (TtfPlatformID.Microsoft as number) && encodingID == (TtfMicrosoftEncodingID.Unicode as number)) {
            // When building a Unicode font for Windows,
            // the platform ID should be 3 and the encoding ID should be 1.
            format = TtfCmapEncoding.Unicode;
        } else if (platformID == (TtfPlatformID.Macintosh as number) && encodingID == (TtfMacintoshEncodingID.Roman as number)) {
            // When building a font that will be used on the Macintosh,
            // the platform ID should be 1 and the encoding ID should be 0.
            format = TtfCmapEncoding.Macintosh;
        }
        return format;
    }
    /* tslint:enable */
    /**
     * Adds glyph to the collection.
     */
    private addGlyph(glyph : TtfGlyphInfo, encoding : TtfCmapEncoding) : void {
        let collection : Dictionary<number, TtfGlyphInfo> = null;
        switch (encoding) {
            case TtfCmapEncoding.Unicode:
                collection = this.microsoftGlyphs;
                break;
            case TtfCmapEncoding.Macintosh:
            case TtfCmapEncoding.Symbol:
                collection = this.macintoshGlyphs;
                break;
        }
        collection.setValue(glyph.index, glyph);
    }
    /**
     * Initializes metrics.
     */
    /* tslint:disable */
    private initializeMetrics(nameTable : TtfNameTable, headTable : TtfHeadTable, horizontalHeadTable : TtfHorizontalHeaderTable, os2Table : TtfOS2Table, postTable : TtfPostTable, cmapTables : TtfCmapSubTable[]) : void {
        /* tslint:enable */
        // if (cmapTables === null) {
        //     throw new Error('ArgumentNullException : cmapTables');
        // }
        this.initializeFontName(nameTable);
        // Get font encoding.
        let bSymbol : boolean = false;
        for (let i : number = 0; i < cmapTables.length; i++) {
            let subTable : TtfCmapSubTable = cmapTables[i];
            let encoding : TtfCmapEncoding = this.getCmapEncoding(subTable.platformID, subTable.encodingID);
            if (encoding === TtfCmapEncoding.Symbol) {
                bSymbol = true;
                break;
            }
        }
        this.metrics.isSymbol = bSymbol;
        this.metrics.macStyle = headTable.macStyle;
        this.metrics.isFixedPitch = (postTable.isFixedPitch !== 0);
        this.metrics.italicAngle = postTable.italicAngle;
        let factor : number = 1000 / headTable.unitsPerEm;
        this.metrics.winAscent = os2Table.sTypoAscender * factor;
        this.metrics.macAscent = horizontalHeadTable.ascender * factor;
        //m_metrics.MacAscent = os2Table.UsWinAscent * factor;
        // NOTE: This is stange workaround. The value is good if os2Table.SCapHeight != 0, otherwise it should be properly computed.
        this.metrics.capHeight = (os2Table.sCapHeight !== 0) ? os2Table.sCapHeight : 0.7 * headTable.unitsPerEm * factor;
        this.metrics.winDescent = os2Table.sTypoDescender * factor;
        this.metrics.macDescent = horizontalHeadTable.descender * factor;
        //m_metrics.MacDescent = -os2Table.UsWinDescent * factor;
        this.metrics.leading = (os2Table.sTypoAscender - os2Table.sTypoDescender + os2Table.sTypoLineGap) * factor;
        this.metrics.lineGap = Math.ceil(horizontalHeadTable.lineGap * factor);
        let left : number = headTable.xMin * factor;
        let top : number = Math.ceil(this.metrics.macAscent + this.metrics.lineGap);
        let right : number = headTable.xMax * factor;
        let bottom : number = this.metrics.macDescent;
        this.metrics.fontBox = new Rectangle(left, top, right, bottom);
        // NOTE: Strange!
        this.metrics.stemV = 80;
        this.metrics.widthTable = this.updateWidth();
        this.metrics.contains = this.tableDirectory.containsKey('CFF');
        this.metrics.subScriptSizeFactor = headTable.unitsPerEm / os2Table.ySubscriptYSize;
        this.metrics.superscriptSizeFactor = headTable.unitsPerEm / os2Table.ySuperscriptYSize;
    }
    /**
     * Updates chars structure which is used in the case of ansi encoding (256 bytes).
     */
    private updateWidth() : number[] {
        let count : number = 256;
        let bytes : number[] = [];
        if (this.metrics.isSymbol) {
            for (let i : number = 0; i < count; i++) {
                let glyphInfo : TtfGlyphInfo = this.getGlyph(String.fromCharCode(i));
                bytes[i] = (glyphInfo.empty) ? 0 : glyphInfo.width;
            }
        } else {
            let byteToProcess : number[] = [];
            let unknown : string = '?';
            let space : string = String.fromCharCode(32);
            for (let i : number = 0; i < count; i++) {
                byteToProcess[0] = i;
                let text : string = this.getString(byteToProcess, 0, byteToProcess.length);
                let ch : string = (text.length > 0) ? text[0] : unknown;
                let glyphInfo : TtfGlyphInfo = this.getGlyph(ch);
                if (!glyphInfo.empty) {
                    bytes[i] = glyphInfo.width;
                } else {
                    glyphInfo = this.getGlyph(space);
                    bytes[i] = (glyphInfo.empty) ? 0 : glyphInfo.width;
                }
            }
        }
        return bytes;
    }
    /**
     * Returns default glyph.
     */
    private getDefaultGlyph() : TtfGlyphInfo {
        let glyph : TtfGlyphInfo = this.getGlyph(StringTokenizer.whiteSpace);
        return glyph;
    }
    /**
     * Reads unicode string from byte array.
     */
    private getString(byteToProcess : number[], start : number, length : number) : string {
        let result : string = '';
        for (let index : number = 0; index < length; index++) {
            result += String.fromCharCode(byteToProcess[index + start]);
        }
        return result;
    }
    /**
     * Reads loca table.
     */
    private readLocaTable(bShort : boolean) : TtfLocaTable {
        let tableInfo : TtfTableInfo = this.getTable('loca');
        this.offset = tableInfo.offset;
        let table : TtfLocaTable = new TtfLocaTable();
        let buffer : number[] = null;
        if (bShort) {
            let len : number = tableInfo.length / 2;
            buffer = [];
            for (let i : number = 0; i < len; i++) {
                buffer[i] = this.readUInt16(this.offset) * 2;
            }
        } else {
            let len : number = tableInfo.length / 4;
            buffer = [];
            for (let i : number = 0; i < len; i++) {
                buffer[i] = this.readUInt32(this.offset);
            }
        }
        table.offsets = buffer;
        return table;
    }
    /**
     * Updates hash table of used glyphs.
     */
    private updateGlyphChars(glyphChars : Dictionary<number, number>, locaTable : TtfLocaTable) : void {
        // if (glyphChars === null) {
        //     throw new Error('Argument Null Exception : glyphChars');
        // }
        // Add zero key.
        if (!glyphChars.containsKey(0)) {
            glyphChars.setValue(0, 0);
        }
        let clone : Dictionary<number, number> = new Dictionary<number, number>();
        let glyphCharKeys : number[] = glyphChars.keys();
        for (let i : number = 0; i < glyphCharKeys.length; i++) {
            clone.setValue(glyphCharKeys[i], glyphChars.getValue(glyphCharKeys[i]));
        }
        for (let i : number = 0; i < glyphCharKeys.length; i++) {
            let nextKey : number = glyphCharKeys[i];
            this.processCompositeGlyph(glyphChars, nextKey, locaTable);
        }
    }
    /**
     * Checks if glyph is composite or not.
     */
    private processCompositeGlyph(glyphChars : Dictionary<number, number>, glyph : number, locaTable : TtfLocaTable) : void {
        // if (glyphChars === null) {
        //     throw new Error('Argument Null Exception : glyphChars');
        // }
        // Is in range.
        if (glyph < locaTable.offsets.length - 1) {
            let glyphOffset : number = locaTable.offsets[glyph];
            if (glyphOffset !== locaTable.offsets[glyph + 1]) {
                let tableInfo : TtfTableInfo = this.getTable('glyf');
                this.offset = tableInfo.offset + glyphOffset;
                let glyphHeader : TtfGlyphHeader = new TtfGlyphHeader();
                glyphHeader.numberOfContours = this.readInt16(this.offset);
                glyphHeader.xMin = this.readInt16(this.offset);
                glyphHeader.yMin = this.readInt16(this.offset);
                glyphHeader.xMax = this.readInt16(this.offset);
                glyphHeader.yMax = this.readInt16(this.offset);
                // Glyph is composite.
                if (glyphHeader.numberOfContours < 0) {
                    let skipBytes : number = 0;
                    let entry : boolean = true;
                    while (entry) {
                        let flags : number = this.readUInt16(this.offset);
                        let glyphIndex : number = this.readUInt16(this.offset);
                        if (!glyphChars.containsKey(glyphIndex)) {
                            glyphChars.setValue(glyphIndex, 0);
                        }
                        if ((flags & TtfCompositeGlyphFlags.MoreComponents) === 0) {
                            break;
                        }
                        skipBytes = ((flags & TtfCompositeGlyphFlags.Arg1And2AreWords) !== 0) ? 4 : 2;
                        if ((flags & TtfCompositeGlyphFlags.WeHaveScale) !== 0) {
                            skipBytes += 2;
                        } else if ((flags & TtfCompositeGlyphFlags.WeHaveAnXyScale) !== 0) {
                            skipBytes += 4;
                        } else if ((flags & TtfCompositeGlyphFlags.WeHaveTwoByTwo) !== 0) {
                            skipBytes += 2 * 4;
                        }
                        this.offset += skipBytes;
                    }
                }
            }
        }
    }
    /**
     * Creates new glyph tables based on chars that are used for output.
     */
    /* tslint:disable */
    private generateGlyphTable(glyphChars : Dictionary<number, number>, locaTable : TtfLocaTable, newLocaTable : number[], newGlyphTable : number[]) : { glyphTableSize : number, newLocaTable : number[], newGlyphTable : number[] } {
        /* tslint:enable */
        // if (glyphChars === null) {
        //     throw new Error('Argument Null Exception : glyphChars');
        // }
        newLocaTable = [];
        // Sorting used glyphs keys.
        let activeGlyphs : number[] = glyphChars.keys();
        activeGlyphs.sort((a : number, b : number) => a - b);
        let glyphSize : number = 0;
        for (let i : number = 0; i < activeGlyphs.length; i++) {
            let glyphIndex : number = activeGlyphs[i];
            if (locaTable.offsets.length > 0) {
                glyphSize += locaTable.offsets[glyphIndex + 1] - locaTable.offsets[glyphIndex];
            }
        }
        let glyphSizeAligned : number = this.align(glyphSize);
        newGlyphTable = [];
        for (let i : number = 0; i < glyphSizeAligned; i++) {
            newGlyphTable.push(0);
        }
        let nextGlyphOffset : number = 0;
        let nextGlyphIndex : number = 0;
        let table : TtfTableInfo = this.getTable('glyf');
        // Creating NewLocaTable - that would hold offsets for filtered glyphs.
        for (let i : number = 0; i < locaTable.offsets.length; i++) {
            newLocaTable.push(nextGlyphOffset);
            if (nextGlyphIndex < activeGlyphs.length && activeGlyphs[nextGlyphIndex] === i) {
                ++nextGlyphIndex;
                newLocaTable[i] = nextGlyphOffset;
                let oldGlyphOffset : number = locaTable.offsets[i];
                let oldNextGlyphOffset : number = locaTable.offsets[i + 1] - oldGlyphOffset;
                if (oldNextGlyphOffset > 0) {
                    this.offset = table.offset + oldGlyphOffset;
                    let result : { buffer : number[], written : number } = this.read(newGlyphTable, nextGlyphOffset, oldNextGlyphOffset);
                    newGlyphTable = result.buffer;
                    nextGlyphOffset += oldNextGlyphOffset;
                }
            }
        }
        return { glyphTableSize : glyphSize, newLocaTable : newLocaTable, newGlyphTable : newGlyphTable };
    }
    /**
     * Updates new Loca table.
     */
    /* tslint:disable */
    private updateLocaTable(newLocaTable : number[], bLocaIsShort : boolean, newLocaTableOut : number[]) : { newLocaUpdated : number[], newLocaSize : number } {
        /* tslint:enable */
        if (newLocaTable === null) {
            throw new Error('Argument Null Exception : newLocaTable');
        }
        let size : number = (bLocaIsShort) ? newLocaTable.length * 2 : newLocaTable.length * 4;
        let count : number = this.align(size);
        //BigEndianWiter
        let writer : BigEndianWriter = new BigEndianWriter(count);
        for (let i : number = 0; i < newLocaTable.length; i++) {
            let value : number = newLocaTable[i];
            if (bLocaIsShort) {
                value /= 2;
                writer.writeShort(value);
            } else {
                writer.writeInt(value);
            }
        }
        return { newLocaUpdated : writer.data, newLocaSize : size };
    }
    /**
     * Aligns number to be divisible on 4.
     */
    private align(value : number) : number {
        return (value + 3) & (~3);
    }
    /**
     * Returns font program data.
     */
    /* tslint:disable */
    private getFontProgram(newLocaTableOut : number[], newGlyphTable : number[], glyphTableSize : number, locaTableSize : number) : number[] {
        /* tslint:enable */
        if (newLocaTableOut === null) {
            throw new Error('Argument Null Exception : newLocaTableOut');
        }
        if (newGlyphTable === null) {
            throw new Error('Argument Null Exception : newGlyphTable');
        }
        let tableNames : string[] = this.tableNames;
        let result : {fontProgramLength : number, numTables : number} = this.getFontProgramLength(newLocaTableOut, newGlyphTable, 0);
        let fontProgramLength : number = result.fontProgramLength;
        let numTables : number = result.numTables;
        let writer : BigEndianWriter = new BigEndianWriter(fontProgramLength);
        writer.writeInt(0x10000);
        writer.writeShort(numTables);
        let entrySelector : number = this.entrySelectors[numTables];
        writer.writeShort((1 << (entrySelector & 31)) * 16);
        writer.writeShort(entrySelector);
        writer.writeShort((numTables - (1 << (entrySelector & 31))) * 16);
        // Writing to destination buffer - checksums && sizes of used tables.
        this.writeCheckSums(writer, numTables, newLocaTableOut, newGlyphTable, glyphTableSize, locaTableSize);
        // // Writing to destination buffer - used glyphs.
        this.writeGlyphs(writer, newLocaTableOut, newGlyphTable);
        return writer.data;
    }
    /* tslint:disable */
    private getFontProgramLength(newLocaTableOut : number[], newGlyphTable : number[], numTables : number) : {fontProgramLength : number, numTables : number} {
        /* tslint:enable */
        if (newLocaTableOut === null) {
            throw new Error('Argument Null Exception : newLocaTableOut');
        }
        if (newGlyphTable === null) {
            throw new Error('Argument Null Exception : newGlyphTable');
        }
        // glyf and loca are used by default;
        numTables = 2;
        let tableNames : string[] = this.tableNames;
        let fontProgramLength : number = 0;
        for (let i : number = 0; i < tableNames.length; i++) {
            let tableName : string = tableNames[i];
            if (tableName !== 'glyf' && tableName !== 'loca') {
                let table : TtfTableInfo = this.getTable(tableName);
                if (!table.empty) {
                    ++numTables;
                    fontProgramLength += this.align(table.length);
                }
            }
        }
        fontProgramLength += newLocaTableOut.length;
        fontProgramLength += newGlyphTable.length;
        let usedTablesSize : number = numTables * 16 + (3 * 4);
        fontProgramLength += usedTablesSize;
        return { fontProgramLength : fontProgramLength, numTables : numTables};
    }
    /**
     * Writing to destination buffer - checksums and sizes of used tables.
     */
    /* tslint:disable */
    private writeCheckSums(writer : BigEndianWriter, numTables : number, newLocaTableOut : number[], newGlyphTable : number[], glyphTableSize : number, locaTableSize : number) : void {
        /* tslint:enable */
        if (writer === null) {
            throw new Error('Argument Null Exception : writer');
        }
        if (newLocaTableOut === null) {
            throw new Error('Argument Null Exception : newLocaTableOut');
        }
        if (newGlyphTable === null) {
            throw new Error('Argument Null Exception : newGlyphTable');
        }
        let tableNames : string[] = this.tableNames;
        let usedTablesSize : number = numTables * 16 + (3 * 4);
        let nextTableSize : number = 0;
        for (let i : number = 0; i < tableNames.length; i++) {
            let tableName : string = tableNames[i];
            let tableInfo : TtfTableInfo = this.getTable(tableName);
            if (tableInfo.empty) {
                continue;
            }
            writer.writeString(tableName);
            if (tableName === 'glyf') {
                let checksum : number = this.calculateCheckSum(newGlyphTable);
                writer.writeInt(checksum);
                nextTableSize = glyphTableSize;
            } else if (tableName === 'loca') {
                let checksum : number = this.calculateCheckSum(newLocaTableOut);
                writer.writeInt(checksum);
                nextTableSize = locaTableSize;
            } else {
                writer.writeInt(tableInfo.checksum);
                nextTableSize = tableInfo.length;
            }
            writer.writeUInt(usedTablesSize);
            writer.writeUInt(nextTableSize);
            usedTablesSize += this.align(nextTableSize);
        }
    }
    /**
     * Gets checksum from source buffer.
     */
    private calculateCheckSum(bytes : number[]) : number {
        if (bytes === null) {
            throw new Error('Argument Null Exception : bytes');
        }
        let pos : number = 0;
        let byte1 : number = 0;
        let byte2 : number = 0;
        let byte3 : number = 0;
        let byte4 : number = 0;

        for (let i : number = 0; i < (bytes.length + 1) / 4; i++) {
            byte4 += (bytes[pos++] & 255);
            byte3 += (bytes[pos++] & 255);
            byte2 += (bytes[pos++] & 255);
            byte1 += (bytes[pos++] & 255);
        }
        let result : number = byte1;
        result += (byte2 << 8);
        result += (byte3 << 16);
        result += (byte4 << 24);
        return result;
    }
    /**
     * Writing to destination buffer - used glyphs.
     */
    private writeGlyphs(writer : BigEndianWriter, newLocaTable : number[], newGlyphTable : number[]) : void {
        if (writer === null) {
            throw new Error('Argument Null Exception : writer');
        }
        if (newLocaTable === null) {
            throw new Error('Argument Null Exception : newLocaTableOut');
        }
        if (newGlyphTable === null) {
            throw new Error('Argument Null Exception : newGlyphTable');
        }
        let tableNames : string[] = this.tableNames;
        for (let i : number = 0; i < tableNames.length; i++) {
            let tableName : string = tableNames[i];
            let tableInfo : TtfTableInfo = this.getTable(tableName);
            if (tableInfo.empty) {
                continue;
            }
            if (tableName === 'glyf') {
                writer.writeBytes(newGlyphTable);
            } else if (tableName === 'loca') {
                writer.writeBytes(newLocaTable);
            } else {
                let count : number = this.align(tableInfo.length);
                let buff : number[] = [];
                for (let i : number = 0; i < count; i++) {
                    buff.push(0);
                }
                this.offset = tableInfo.offset;
                let result : {buffer : number[], written : number} = this.read(buff, 0, tableInfo.length);
                writer.writeBytes(result.buffer);
            }
        }
    }
    //public methods
    /**
     * Sets position value of font data.
     */
    public setOffset(offset : number) : void {
        this.offset = offset;
    }
    /**
     * Creates font Internals
     * @private
     */
    public createInternals() : void {
        this.metrics = new TtfMetrics();
        let nameTable : TtfNameTable = this.readNameTable();
        let headTable : TtfHeadTable = this.readHeadTable();
        this.bIsLocaShort = (headTable.indexToLocalFormat === 0);
        let horizontalHeadTable : TtfHorizontalHeaderTable = this.readHorizontalHeaderTable();
        let os2Table : TtfOS2Table = this.readOS2Table();
        let postTable : TtfPostTable = this.readPostTable();
        this.width = this.readWidthTable(horizontalHeadTable.numberOfHMetrics, headTable.unitsPerEm);
        let subTables : TtfCmapSubTable[] = this.readCmapTable();
        this.initializeMetrics(nameTable, headTable, horizontalHeadTable, os2Table, postTable, subTables);
    }
    /**
     * Gets glyph's info by char code.
     */
    public getGlyph(charCode : string ) : TtfGlyphInfo
    public getGlyph(charCode : number ) : TtfGlyphInfo
    public getGlyph(charCode ?: string | number) : TtfGlyphInfo {
        if (typeof charCode === 'number') {
            let obj1 : object = null;
            if (!this.metrics.isSymbol && this.microsoftGlyphs != null) {
                if (this.microsoftGlyphs.containsKey(charCode)) {
                    obj1 = this.microsoftGlyphs.getValue(charCode);
                }
            } else if (this.metrics.isSymbol && this.macintoshGlyphs != null) {
                if (this.macintoshGlyphs.containsKey(charCode)) {
                    obj1 = this.macintoshGlyphs.getValue(charCode);
                }
            }
            let glyph : TtfGlyphInfo = (obj1 != null) ? obj1 as TtfGlyphInfo : this.getDefaultGlyph();
            return glyph;
        } else {
        let obj : object = null;
        let code : number = charCode.charCodeAt(0);
        if (!this.metrics.isSymbol && this.microsoft !== null) {
            if (this.microsoft.containsKey(code)) {
                obj = this.microsoft.getValue(code);
                if (code !== StringTokenizer.whiteSpace.charCodeAt(0)) {
                    this.isFontPresent = true;
                }
            } else if (code !== StringTokenizer.whiteSpace.charCodeAt(0)) {
                this.isFontPresent = false;
            }
        } else if (this.metrics.isSymbol && this.macintosh !== null || this.isMacTTF) {
            // NOTE: this code fixes char codes that extends 0x100. However, it might corrupt something.
            if (this.maxMacIndex !== 0) {
                code %= this.maxMacIndex + 1;
            } else {
                code = ((code & 0xff00) === 0xf000 ? code & 0xff : code);
            }
            if (this.macintosh.containsKey(code)) {
                obj = this.macintosh.getValue(code);
                this.isFontPresent = true;
            }
        }
        // Fix for StackOverFlow exception in XPS to PDF converter
        if (charCode === StringTokenizer.whiteSpace && obj === null) {
            obj = new TtfGlyphInfo();
        }
        let glyph : TtfGlyphInfo = (obj !== null) ? obj as TtfGlyphInfo : this.getDefaultGlyph();
        return glyph;
    }
}
    /**
     * Gets hash table with chars indexed by glyph index.
     */
    public getGlyphChars(chars : Dictionary<string, string>) : Dictionary<number, number> {
        if (chars === null || chars === undefined) {
            throw new Error('Argument Null Exception : chars');
        }
        let dictionary : Dictionary<number, number> = new Dictionary<number, number>();
        let charKeys : string[] = chars.keys();
        for (let i : number = 0; i < charKeys.length; i++) {
            let ch : string = charKeys[i];
            let glyph : TtfGlyphInfo = this.getGlyph(ch);
            if (!glyph.empty) {
                dictionary.setValue(glyph.index, ch.charCodeAt(0));
            }
        }
        return dictionary;
    }
    /**
     * Gets all glyphs.
     */
    public getAllGlyphs() : TtfGlyphInfo[] {
        let allGlyphInfo : TtfGlyphInfo[] = [];
        let info : TtfGlyphInfo = new TtfGlyphInfo();
        let index : number = 0;
        for (let i : number = 0; i < this.width.length; i++) {
            let width : number = this.width[i];
            info.index = index;
            info.width = width;
            allGlyphInfo.push(info);
            index++;
        }
        return allGlyphInfo;
    }
    /**
     * Reads a font's program.
     * @private
     */
    public readFontProgram(chars : Dictionary<string, string>) : number[] {
        let glyphChars : Dictionary<number, number> = this.getGlyphChars(chars);
        let locaTable : TtfLocaTable = this.readLocaTable(this.bIsLocaShort);
        if (glyphChars.size() < chars.size()) {
            this.missedGlyphs = chars.size() - glyphChars.size();
        }
        this.updateGlyphChars(glyphChars, locaTable);
        /* tslint:disable */
        let result1 : { glyphTableSize : number, newLocaTable : number[], newGlyphTable : number[] } = this.generateGlyphTable(glyphChars, locaTable, null, null);
        /* tslint:enable */
        let glyphTableSize : number = result1.glyphTableSize;
        let newLocaTable : number[] = result1.newLocaTable;
        let newGlyphTable : number[] = result1.newGlyphTable;
        let result2 : { newLocaUpdated : number[], newLocaSize : number } = this.updateLocaTable(newLocaTable, this.bIsLocaShort, null);
        let newLocaSize : number = result2.newLocaSize;
        let newLocaUpdated : number[] = result2.newLocaUpdated;
        let fontProgram : number[] = this.getFontProgram(newLocaUpdated, newGlyphTable, glyphTableSize, newLocaSize);
        return fontProgram;
    }
    /**
     * Reconverts string to be in proper format saved into PDF file.
     */
    public convertString(text : string) : string {
        if (text === null) {
            throw new Error('Argument Null Exception : text');
        }
        let glyph : string = '';
        let i : number = 0;
        for (let k : number = 0; k < text.length; k++) {
            let ch : string = text[k];
            let glyphInfo : TtfGlyphInfo = this.getGlyph(ch);
            if (!glyphInfo.empty) {
                glyph += String.fromCharCode(glyphInfo.index);
                i++;
            }
        }
        return glyph;
    }
    /**
     * Gets char width.
     */
    public getCharWidth(code : string) : number {
        let glyphInfo : TtfGlyphInfo = this.getGlyph(code);
        glyphInfo = (!glyphInfo.empty) ? glyphInfo : this.getDefaultGlyph();
        let codeWidth : number = (!glyphInfo.empty) ? glyphInfo.width : 0;
        return codeWidth;
    }
    //Stream reader
    private readString(length : number) : string
    private readString(length : number, isUnicode : boolean) : string
    private readString(length : number, isUnicode ?: boolean) : string {
        if (isUnicode === undefined) {
            return this.readString(length, false);
        } else {
            //let buffer : number[] = this.readBytes(length);
            let result : string = '';
            if (isUnicode) {
                for (let i : number = 0; i < length; i++) {
                    if (i % 2 !== 0) {
                        result += String.fromCharCode(this.fontData[this.offset]);
                    }
                    this.offset += 1;
                }
            } else {
                for (let i : number = 0; i < length; i++) {
                    result += String.fromCharCode(this.fontData[this.offset]);
                    this.offset += 1;
                }
            }
            return result;
        }
    }
    private readFixed(offset : number) : number {
        let integer : number = this.readInt16(offset);
        let sFraction : number = this.readInt16(offset + 2);
        let fraction : number = sFraction / 16384;
        return integer + fraction;
    }
    private readInt32(offset : number) : number {
        let i1 : number = this.fontData[offset + 3];
        let i2 : number = this.fontData[offset + 2];
        let i3 : number = this.fontData[offset + 1];
        let i4 : number = this.fontData[offset];
        this.offset += 4;
        return i1 + (i2 << 8) + (i3 << 16) + (i4 << 24);
    }
    private readUInt32(offset : number) : number {
        let i1 : number = this.fontData[offset + 3];
        let i2 : number = this.fontData[offset + 2];
        let i3 : number = this.fontData[offset + 1];
        let i4 : number = this.fontData[offset];
        this.offset += 4;
        return (i1 | i2 << 8 | i3 << 16 | i4 << 24);
    }
    // private readInt16(offset : number) : number {
    //     let result : number = (this.fontData[offset] << 8) + this.fontData[offset + 1];
    //     this.offset += 2;
    //     return result;
    // }
    private readInt16(offset : number) : number {
        let result : number = (this.fontData[offset] << 8) + this.fontData[offset + 1];
        result = result & (1 << 15) ? result - 0x10000 : result;
        this.offset += 2;
        return result;
    }
    private readInt64(offset : number) : number {
        let low : number = this.readInt32(offset + 4);
        let n : number = this.readInt32(offset) * 4294967296.0 + low;
        if (low < 0) {
            n += 4294967296;
        }
        return n;
    }
    private readUInt16(offset : number) : number {
        let result : number = (this.fontData[offset] << 8) | this.fontData[offset + 1];
        this.offset += 2;
        return result;
    }
    /**
     * Reads ushort array.
     */
    private readUshortArray(length : number) : number[] {
        let buffer : number[] = [];
        for (let i : number = 0; i < length; i++) {
            buffer[i] = this.readUInt16(this.offset);
        }
        return buffer;
    }
    private readBytes(length : number) : number[] {
        let result : number[] = [];
        for (let i : number = 0; i < length; i++) {
            result.push(this.fontData[this.offset]);
            this.offset += 1;
        }
        return result;
    }
    private readByte(offset : number) : number {
        let result : number = this.fontData[offset];
        this.offset += 1;
        return result;
    }
    /**
     * Reads bytes to array in BigEndian order.
     * @private
     */
    public read(buffer : number[], index : number, count : number) : { buffer : number[], written : number } {
        if (buffer === null) {
            throw new Error('Argument Null Exception : buffer');
        }
        let written : number = 0;
        let read : number = 0;
        do {
            for (let i : number = 0; (i < count - written) && (this.offset + i < this.fontData.length); i++) {
                buffer[index + i] = this.fontData[this.offset + i];
            }
            read = count - written;
            this.offset += read;
            written += read;
        } while (written < count);
        return { buffer : buffer, written : written };
    }
}