import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { XmlWriter } from '@syncfusion/ej2-file-utils';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ImageFormatInfo, HelperMethods } from '../index';
import { Dictionary, TabJustification, TabLeader } from '../../index';
import { WTabStop } from '../index';
import { ProtectionType, CompatibilityMode } from '../../base';
import { DocumentHelper } from '../viewer';
import { Revision } from '../track-changes/track-changes';

/**
 * Exports the document to Word format.
 */
export class WordExport {
    private getModuleName(): string {
        return 'WordExport';
    }

    //Part path
    private customXMLItemsPath: string = 'customXml/item';
    private customXMLItemsPropspath: string = 'customXml/itemProps';
    private itemPropsPath: string = 'itemProps';
    private documentPath: string = 'word/document.xml';
    private stylePath: string = 'word/styles.xml';
    private chartPath: string = 'word/charts';
    private numberingPath: string = 'word/numbering.xml';
    private settingsPath: string = 'word/settings.xml';
    private headerPath: string = 'word/header';
    private footerPath: string = 'word/footer';
    //private commentsPath: string = 'word/comments.xml';
    private imagePath: string = 'word/media/image';
    private footnotesPath: string = 'word/footnotes.xml';
    private endnotesPath: string = 'word/endnotes.xml';
    private appPath: string = 'docProps/app.xml';
    private corePath: string = 'docProps/core.xml';
    // private CustomPath: string = 'docProps/custom.xml';
    // private FontTablePath: string = 'word/fontTable.xml';
    private contentTypesPath: string = '[Content_Types].xml';
    // private ChartsPath: string = 'word/charts/';
    private defaultEmbeddingPath: string = 'word/embeddings/';
    private commentsPath: string = 'word/comments.xml';
    private commentsExtendedPath: string = 'word/commentsExtended.xml';
    // private EmbeddingPath:string = 'word\embeddings\';
    // private DrawingPath:string = 'word\drawings\';
    // private ThemePath: string = 'word/theme/theme1.xml';
    // private FontsPath:string = 'word\fonts\';
    // private DiagramPath:string = "word/diagrams/';
    // private ControlPath:string = "word/activeX/';
    // private VbaProject: string = 'vbaProject.bin';
    // private VbaData: string = 'vbaData.xml';
    // private VbaProjectPath: string = 'word/vbaProject.bin';
    // private VbaDataPath: string = 'word/vbaData.xml';
    // private CustomXMLPath:string = 'customXml\';

    //Relationship path
    private generalRelationPath: string = '_rels/.rels';
    private wordRelationPath: string = 'word/_rels/document.xml.rels';
    private customXMLRelPath: string = 'customXml/_rels/item';
    private excelRelationPath: string = 'xl/_rels/workbook.xml.rels';
    // private FontRelationPath: string = 'word/_rels/fontTable.xml.rels';
    // private CommentsRelationPath: string = 'word/_rels/comments.xml.rels';
    private footnotesRelationPath: string = 'word/_rels/footnotes.xml.rels';
    private endnotesRelationPath: string = 'word/_rels/endnotes.xml.rels';
    // private NumberingRelationPath: string = 'word/_rels/numbering.xml.rels';
    private headerRelationPath: string = 'word/_rels/header';
    private footerRelationPath: string = 'word/_rels/footer';
    // private SettingsRelationpath: string = 'word/_rels/settings.xml.rels';
    // private VbaProjectRelsPath: string = 'word/_rels/vbaProject.bin.rels';

    //Content type of the parts
    private xmlContentType: string = 'application/xml';
    private fontContentType: string = 'application/vnd.openxmlformats-officedocument.obfuscatedFont';
    private documentContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml';
    // private TemplateContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml';
    // private CommentsContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml';
    private settingsContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml';
    private commentsContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml';
    private commentsExContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml';
    private endnoteContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml';
    // private FontTableContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml';
    private footerContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml';
    private footnoteContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml';
    // private GlossaryDocumentContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml';
    private headerContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml';
    private numberingContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml';
    private stylesContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml';
    private webSettingsContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml';
    private appContentType: string = 'application/vnd.openxmlformats-officedocument.extended-properties+xml';
    private coreContentType: string = 'application/vnd.openxmlformats-package.core-properties+xml';
    private customContentType: string = 'application/vnd.openxmlformats-officedocument.custom-properties+xml';
    private customXmlContentType: string = 'application/vnd.openxmlformats-officedocument.customXmlProperties+xml';
    private relationContentType: string = 'application/vnd.openxmlformats-package.relationships+xml';
    // private DiagramColor: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml';
    // private DiagramData: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml';
    // private DiagramLayout: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml';
    // private DiagramStyle: string = 'application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml';
    private chartsContentType: string = 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml';
    // private ThemeContentType: string = 'application/vnd.openxmlformats-officedocument.theme+xml';
    // private ChartDrawingContentType: string = 'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml';
    // private ActiveXContentType: string = 'application/vnd.ms-office.activeX+xml';
    // private ActiveXBinContentType: string = 'application/vnd.ms-office.activeX';
    private tableStyleContentType: string = 'application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml';
    // private ChartStyleContentType: string = 'application/vnd.ms-office.chartstyle+xml';
    private chartColorStyleContentType: string = 'application/vnd.ms-office.chartcolorstyle+xml';
    // private VbaProjectContentType: string = 'application/vnd.ms-office.vbaProject';
    // private VbaDataContentType: string = 'application/vnd.ms-word.vbaData+xml';
    // private MacroDocumentContentType: string = 'application/vnd.ms-word.document.macroEnabled.main+xml';
    // private MacroTemplateContentType: string = 'application/vnd.ms-word.template.macroEnabledTemplate.main+xml';
    // private OleObjectContentType: string = 'application/vnd.openxmlformats-officedocument.oleObject';

    // Relationship types of document parts
    // private AltChunkRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk';
    private commentsRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments';
    private commentsExRelType: string = 'http://schemas.microsoft.com/office/2011/relationships/commentsExtended';
    private settingsRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings';
    private endnoteRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes';
    // private FontTableRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable';
    private footerRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer';
    private footnoteRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes';
    private headerRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header';
    private documentRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
    private numberingRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering';
    private stylesRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles';
    // private OleObjectRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject';
    private chartRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart';
    // private ThemeRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme';
    private fontRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/font';
    private tableStyleRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles';
    private coreRelType: string = 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties';
    private appRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties';
    private customRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties';
    private imageRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image';
    private hyperlinkRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink';
    private controlRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/control';
    private packageRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/package';
    // private VbaProjectRelType: string = 'http://schemas.microsoft.com/office/2006/relationships/vbaProject';
    // private VbaDataRelType: string = 'http://schemas.microsoft.com/office/2006/relationships/wordVbaData';
    private customXmlRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml';
    private customUIRelType: string = 'http://schemas.microsoft.com/office/2006/relationships/ui/extensibility';
    private attachedTemplateRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/attachedTemplate';
    private chartColorStyleRelType: string = 'http://schemas.microsoft.com/office/2011/relationships/chartColorStyle';
    // private ChartStyleRelType: string = 'http://schemas.microsoft.com/office/2011/relationships/chartStyle';
    // private ChartUserShapesRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartUserShapes';
    // private ChartContentType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/package';
    // Namespaces
    // private PKG_namespace: string = 'http://schemas.microsoft.com/office/2006/xmlPackage';
    private wNamespace: string = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    private wpNamespace: string = 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing';
    private pictureNamespace: string = 'http://schemas.openxmlformats.org/drawingml/2006/picture';
    private aNamespace: string = 'http://schemas.openxmlformats.org/drawingml/2006/main';
    private a14Namespace: string = 'http://schemas.microsoft.com/office/drawing/2010/main';
    // private SVG_namespace: string = 'http://schemas.microsoft.com/office/drawing/2016/SVG/main';
    private rNamespace: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    private rpNamespace: string = 'http://schemas.openxmlformats.org/package/2006/relationships';
    private vNamespace: string = 'urn:schemas-microsoft-com:vml';
    private oNamespace: string = 'urn:schemas-microsoft-com:office:office';
    private xmlNamespace: string = 'http://www.w3.org/XML/1998/namespace';
    private w10Namespace: string = 'urn:schemas-microsoft-com:office:word';
    private cpNamespace: string = 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties';
    private dcNamespace: string = 'http://purl.org/dc/elements/1.1/';
    // private DCTERMS_namespace: string = 'http://purl.org/dc/terms/';
    // private XSI_namespace: string = 'http://www.w3.org/2001/XMLSchema-instance';
    private docPropsNamespace: string = 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';
    private veNamespace: string = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
    private mNamespace: string = 'http://schemas.openxmlformats.org/officeDocument/2006/math';
    private wneNamespace: string = 'http://schemas.microsoft.com/office/word/2006/wordml';
    // private DCMI_namespace: string = 'http://purl.org/dc/dcmitype/';
    private customPropsNamespace: string = 'http://schemas.openxmlformats.org/officeDocument/2006/custom-properties';
    private vtNamespace: string = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';
    private chartNamespace: string = 'http://schemas.openxmlformats.org/drawingml/2006/chart';
    private slNamespace: string = 'http://schemas.openxmlformats.org/schemaLibrary/2006/main';
    //2003WML namespace
    // private amlNamespace: string = 'http://schemas.microsoft.com/aml/2001/core';
    private dtNamespace: string = 'uuid:C2F41010-65B3-11d1-A29F-00AA00C14882';
    private wmlNamespace: string = 'http://schemas.microsoft.com/office/word/2003/wordml';
    //2010 namespaces
    private w14Namespace: string = 'http://schemas.microsoft.com/office/word/2010/wordml';
    private wpCanvasNamespace: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas';
    private wpDrawingNamespace: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing';
    private wpGroupNamespace: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingGroup';
    private wpInkNamespace: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingInk';
    private wpShapeNamespace: string = 'http://schemas.microsoft.com/office/word/2010/wordprocessingShape';
    //2013 namespaces
    private w15Namespace: string = 'http://schemas.microsoft.com/office/word/2012/wordml';
    private diagramNamespace: string = 'http://schemas.openxmlformats.org/drawingml/2006/diagram';
    //Encryption namespaces
    private eNamespace: string = 'http://schemas.microsoft.com/office/2006/encryption';
    private pNamespace: string = 'http://schemas.microsoft.com/office/2006/keyEncryptor/password';
    private certNamespace: string = 'http://schemas.microsoft.com/office/2006/keyEncryptor/certificate';
    private cxNamespace: string = 'http://schemas.microsoft.com/office/drawing/2014/chartex';
    // chart
    private c15Namespace: string = 'http://schemas.microsoft.com/office/drawing/2015/06/chart';
    private c7Namespace: string = 'http://schemas.microsoft.com/office/drawing/2007/8/2/chart';
    private csNamespace: string = 'http://schemas.microsoft.com/office/drawing/2012/chartStyle';
    // worksheet
    private spreadSheetNamespace: string = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    private spreadSheet9: string = 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main';

    // Dls xml tags
    private cRelationshipsTag: string = 'Relationships';
    private cRelationshipTag: string = 'Relationship';
    private cIdTag: string = 'Id';
    private cTypeTag: string = 'Type';
    private cTargetTag: string = 'Target';
    private cUserShapesTag: string = 'userShapes';
    private cExternalData: string = 'externalData';
    private twipsInOnePoint: number = 20;
    private twentiethOfPoint: number = 20;
    private borderMultiplier: number = 8;
    private percentageFactor: number = 50;
    private emusPerPoint: number = 12700;
    // private const TOC_SYMBOL:string = (char)0x01;
    // private const FOOTNOTE_SYMBOL:string = (char)0x02;
    // private const PAGENUMBER_SYMBOL:string = (char)0xB;

    // private DEF_FIT_TEXT_TO_SHAPE: string = 'mso-fit-shape-to-text:t';

    // Document tags
    private cConditionalTableStyleTag: string = 'tblStylePr';
    private cTableFormatTag: string = 'tblPr';
    private cTowFormatTag: string = 'trPr';
    private cCellFormatTag: string = 'tcPr';
    private cParagraphFormatTag: string = 'pPr';
    private cCharacterFormatTag: string = 'rPr';

    private packageType: string = 'http://schemas.microsoft.com/office/2006/xmlPackage';
    private relsPartPath: string = '/_rels/.rels';
    private documentRelsPartPath: string = '/word/_rels/document.xml.rels';
    private webSettingsPath: string = '/word/webSettings.xml';
    private wordMLDocumentPath: string = '/word/document.xml';
    private wordMLStylePath: string = '/word/styles.xml';
    private wordMLNumberingPath: string = '/word/numbering.xml';
    private wordMLSettingsPath: string = '/word/settings.xml';
    private wordMLHeaderPath: string = '/word/header';
    private wordMLFooterPath: string = '/word/footer';
    private wordMLCommentsPath: string = '/word/comments.xml';
    private wordMLImagePath: string = '/word/media/image';
    private wordMLFootnotesPath: string = '/word/footnotes.xml';
    private wordMLEndnotesPath: string = '/word/endnotes.xml';
    private wordMLAppPath: string = '/docProps/app.xml';
    private wordMLCorePath: string = '/docProps/core.xml';
    private wordMLCustomPath: string = '/docProps/custom.xml';
    private wordMLFontTablePath: string = '/word/fontTable.xml';
    private wordMLChartsPath: string = '/word/charts/';
    private wordMLDefaultEmbeddingPath: string = '/word/embeddings/';
    private wordMLEmbeddingPath: string = '/word/embeddings/';
    private wordMLDrawingPath: string = '/word/drawings/';
    private wordMLThemePath: string = '/word/theme/theme1.xml';
    private wordMLFontsPath: string = '/word/fonts/';
    private wordMLDiagramPath: string = '/word/diagrams/';
    private wordMLControlPath: string = '/word/activeX/';
    private wordMLVbaProject: string = '/vbaProject.bin';
    private wordMLVbaData: string = '/vbaData.xml';
    private wordMLVbaProjectPath: string = '/word/vbaProject.bin';
    private wordMLVbaDataPath: string = '/word/vbaData.xml';
    // private WordMLCustomXMLPath: string = '/customXml/';
    private wordMLWebSettingsPath: string = '/word/webSettings.xml';
    private wordMLCustomItemProp1Path: string = '/customXml/itemProps1.xml';
    // private WordMLCustomXMLRelPath: string = '/customXml/_rels/item1.xml.rels';
    private wordMLFootnoteRelPath: string = '/word/_rels/footnotes.xml.rels';
    private wordMLEndnoteRelPath: string = '/word/_rels/endnotes.xml.rels';
    private wordMLSettingsRelPath: string = '/word/_rels/settings.xml.rels';
    private wordMLNumberingRelPath: string = '/word/_rels/numbering.xml.rels';
    private wordMLFontTableRelPath: string = '/word/_rels/fontTable.xml.rels';
    private wordMLCustomXmlPropsRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps';
    private wordMLControlRelType: string = 'http://schemas.microsoft.com/office/2006/relationships/activeXControlBinary';
    private wordMLDiagramContentType: string = 'application/vnd.ms-office.drawingml.diagramDrawing+xml';
    private dsNamespace: string = 'http://schemas.openxmlformats.org/officeDocument/2006/customXml';
    private excelFiles: Dictionary<string, ZipArchive> = undefined;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // Owner Nodes
    private section: any;
    private lastSection: boolean = false;
    private blockOwner: any;
    private paragraph: any;
    private table: any;
    private row: any;
    private headerFooter: any;
    private endNoteFootnote: any;
    private document: any;
    private mSections: any;
    private mLists: any;
    private mAbstractLists: any;
    private mStyles: any;
    private defCharacterFormat: any;
    private defParagraphFormat: any;
    private defaultTabWidthValue: number;
    private dontUseHtmlParagraphAutoSpacing: boolean;
    private mRelationShipID: number = 0;
    private cRelationShipId: number = 0;
    private eRelationShipId: number = 0;
    private efRelationShipId: number = 0;
    private mDocPrID: number = 1;
    private chartCount: number = 0;
    private seriesCount: number = 0;
    private chartStringCount: number = 0;
    private chart: any;
    private mDifferentFirstPage: boolean = false;
    private mHeaderFooterColl: Dictionary<any, Dictionary<string, any>>;
    private mFootEndnotesColl: Dictionary<any, Dictionary<string, any>>;
    private mVerticalMerge: Dictionary<number, number>;
    private mGridSpans: Dictionary<number, number>;
    private mDocumentImages: Dictionary<string, any>;
    private mCustomXML: Dictionary<string, any>;
    private mDocumentCharts: Dictionary<string, any>;
    private mExternalLinkImages: Dictionary<string, string>;
    private mHeaderFooterImages: Dictionary<string, Dictionary<string, any>>;
    private mArchive: ZipArchive;
    private mArchiveExcel: ZipArchive;
    private mBookmarks: string[] = undefined;
    private formatting: boolean;
    private enforcement: boolean;
    private hashValue: string;
    private saltValue: string;
    private protectionType: ProtectionType;
    private fileName: string;
    private spanCellFormat: any;
    private mComments: any[] = [];
    private revisions: any[] = [];
    private customXMLProps: any[] = [];
    private paraID: number = 0;
    private commentParaID: number = 0;
    private commentParaIDInfo: any = {};
    private replyCommentIdCollection: Dictionary<number, string>;
    private isInsideComment: boolean = false;
    private commentId: any = {};
    private currentCommentId: number = 0;
    private jsonObject: any;
    private trackChangesId: number = 0;
    private prevRevisionIds: any[] = [];
    private isRevisionContinuous: boolean = false;
    private formFieldShading: boolean;
    private trackChanges: boolean;
    private compatibilityMode: CompatibilityMode;
    // Gets the bookmark name
    private get bookmarks(): string[] {
        if (isNullOrUndefined(this.mBookmarks)) {
            this.mBookmarks = [];
        }
        return this.mBookmarks;
    }
    // Gets the collection of images present in the document body
    private get documentImages(): Dictionary<string, any> {
        if (this.mDocumentImages === undefined) {
            this.mDocumentImages = new Dictionary<string, any>();
        }
        return this.mDocumentImages;
    }
    // Gets the collection of images present in the document body
    private get externalImages(): Dictionary<string, string> {
        if (this.mExternalLinkImages === undefined) {
            this.mExternalLinkImages = new Dictionary<string, string>();
        }
        return this.mExternalLinkImages;
    }
    // Gets the collections of images present in the HeaderFooters
    private get headerFooterImages(): Dictionary<string, Dictionary<string, any>> {
        if (this.mHeaderFooterImages === undefined) {
            this.mHeaderFooterImages = new Dictionary<string, Dictionary<string, any>>();
        }
        return this.mHeaderFooterImages;
    }
    // Gets the collection of charts present in the document body
    private get documentCharts(): Dictionary<string, any> {
        if (this.mDocumentCharts === undefined) {
            this.mDocumentCharts = new Dictionary<string, any>();
        }
        return this.mDocumentCharts;
    }
    /// Gets the HeaderFooter Collection
    private get headersFooters(): Dictionary<any, Dictionary<string, any>> {
        if (this.mHeaderFooterColl === undefined) {
            this.mHeaderFooterColl = new Dictionary<any, Dictionary<string, any>>();
        }
        return this.mHeaderFooterColl;
    }
    /// Gets the Endnote and Footnote Collection
    private get endnotesFootnotes(): Dictionary<any, Dictionary<string, any>> {
        if (this.mFootEndnotesColl === undefined) {
            this.mFootEndnotesColl = new Dictionary<any, Dictionary<string, any>>();
        }
        return this.mFootEndnotesColl;
    }
    /**
     * @private
     * @param {DocumentHelper} documentHelper - Document helper
     * @param {string} fileName - file name
     * @returns {void}
     */
    public save(documentHelper: DocumentHelper, fileName: string): void {
        this.fileName = fileName;
        this.serialize(documentHelper);
        const excelFiles: Promise<Blob>[] = this.serializeExcelFiles();
        if (excelFiles && excelFiles.length > 0) {
            Promise.all(excelFiles).then(() => {
                this.saveInternal(fileName);
            });
        } else {
            this.saveInternal(fileName);
        }
        this.close();
    }

    private saveInternal(fileName: string): void {
        this.mArchive.save(fileName + '.docx').then((mArchive: ZipArchive): void => {
            mArchive.destroy();
        });
    }
    /**
     * @private
     * @param {DocumentHelper} documentHelper - Document helper
     * @returns {Promise<Blob>} - Return Promise
     */
    public saveAsBlob(documentHelper: DocumentHelper): Promise<Blob> {
        this.serialize(documentHelper);
        const excelFiles: Promise<Blob>[] = this.serializeExcelFiles();
        /* eslint-disable */
        return new Promise((resolve: (value: Blob | PromiseLike<Blob>) => void, reject: (value: Blob | PromiseLike<Blob>) => void) => {
            if (excelFiles.length > 0) {
                Promise.all(excelFiles).then(() => {
                    this.mArchive.saveAsBlob().then((blob: Blob) => {
                        this.mArchive.destroy();
                        blob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                        resolve(blob);
                    });
                });
            } else {
                this.mArchive.saveAsBlob().then((blob: Blob) => {
                    this.mArchive.destroy();
                    blob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                    resolve(blob);
                });
            }
        });
        /* eslint-enable */
    }
    private serializeExcelFiles(): Promise<Blob>[] {
        const excelFiles: Dictionary<string, ZipArchive> = this.excelFiles;
        const files: Promise<Blob>[] = [];
        if (excelFiles && excelFiles.length > 0) {
            for (let i: number = 0; i < excelFiles.length; i++) {
                const fileName: string = excelFiles.keys[i];
                const excelFile: ZipArchive = excelFiles.get(fileName);
                const excelPromise: Promise<Blob> = excelFile.saveAsBlob();
                files.push(excelPromise);
                excelPromise.then((blob: Blob) => {
                    const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(blob, fileName);
                    this.mArchive.addItem(zipArchiveItem);
                });
            }
            this.excelFiles.clear();
        }
        return files;
    }
    /**
     * @private
     * @returns {void}
     */
    public saveExcel(): void {
        const xlsxPath: string = this.defaultEmbeddingPath + 'Microsoft_Excel_Worksheet' + this.chartCount + '.xlsx';
        this.excelFiles.add(xlsxPath, this.mArchiveExcel);
        this.mArchiveExcel = undefined;
    }
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.clearDocument();
        this.mRelationShipID = undefined;
        this.mDocPrID = undefined;
        this.mDifferentFirstPage = undefined;
        this.fileName = undefined;
        if (this.mArchive) {
            this.mArchive.destroy();
            this.mArchive = undefined;
        }
        if (this.mArchiveExcel) {
            this.mArchiveExcel.destroy();
            this.mArchiveExcel = undefined;
        }
    }
    // Saves the word document in the stream
    private serialize(documentHelper: DocumentHelper): void {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const document: any = documentHelper.owner.sfdtExportModule.write();
        this.setDocument(document);
        this.mComments = documentHelper.comments;
        this.mCustomXML = documentHelper.customXmlData;
        this.revisions = documentHelper.owner.revisions.changes;
        this.mArchive = new ZipArchive();
        this.mArchive.compressionLevel = 'Normal';
        this.commentParaIDInfo = {};
        this.commentParaID = 0;
        this.currentCommentId = 0;
        this.commentId = {};
        this.mVerticalMerge = new Dictionary<number, number>();
        this.mGridSpans = new Dictionary<number, number>();
        let contenttype: string;
        //document.xml
        this.serializeDocument();
        //Styles.xml
        this.serializeStyles();
        //numbering.xml
        this.serializeNumberings();
        //comments.xml
        this.serializeComments();
        //commentsExtended.xml
        this.serializeCommentsExtended();
        //theme.xml
        // if (m_document.DocHasThemes && !isNullOrUndefined(m_document.Themes))
        //     SerializeThemes();
        // else
        // this.serializeDefaultThemes();
        //settings.xml
        this.serializeSettings();
        //core.xml
        this.serializeCoreProperties();
        //app.xml
        this.serializeAppProperties();
        //fontTable.xml
        this.serializeFontTable(contenttype);
        //custom.xml
        // if (!isNullOrUndefined(this.wordDocument.CustomDocumentProperties) && m_document.CustomDocumentProperties.length > 0) {
        //     SerializeCustomProperties();
        // }
        //Settings Relations
        this.serializeSettingsRelation();

        //Numbering relation if the document has picture bullet
        // if (PictureBullets.length > 0) {
        //     SerializeNumberingsRelation();
        // }
        this.serializeHeaderFooters();
        this.serializeFootnotes();
        this.serializeEndnotes();
        //document relations
        this.serializeDocumentRelations();
        // Add controls to archieve.
        // if (ControlsPathNames.length > 0) {
        //     AddControlsToZip(m_document.DocxPackage);
        // }
        // if (!isNullOrUndefined(m_document.CustomUIPartContainer))
        //     AddPartContainerToArchive(m_document.CustomUIPartContainer);
        // if (!isNullOrUndefined(m_document.CustomXMLContainer))
        //     AddPartContainerToArchive(m_document.CustomXMLContainer);
        //general relations
        this.serializeGeneralRelations();

        //[ContentTypes].xml
        this.serializeContentTypes(contenttype);

        // Clears the internal fields maintained for serializing.
        this.clearDocument();
    }
    // Sets the document
    private setDocument(document: any): void {
        this.document = document;
        this.mSections = document.sections;
        this.mLists = document.lists;
        this.mAbstractLists = document.abstractLists;
        this.defCharacterFormat = document.characterFormat;
        this.defParagraphFormat = document.paragraphFormat;
        this.defaultTabWidthValue = document.defaultTabWidth;
        this.dontUseHtmlParagraphAutoSpacing = document.dontUseHTMLParagraphAutoSpacing;
        this.mStyles = document.styles;
        this.formatting = document.formatting;
        this.enforcement = document.enforcement;
        this.hashValue = document.hashValue;
        this.saltValue = document.saltValue;
        this.protectionType = document.protectionType;
        this.formFieldShading = document.formFieldShading;
        this.trackChanges = document.trackChanges;
        this.compatibilityMode = document.compatibilityMode;
    }
    // Clears the document
    private clearDocument(): void {
        // Owner Nodes
        this.section = undefined;
        this.lastSection = undefined;
        this.blockOwner = undefined;
        this.paragraph = undefined;
        this.table = undefined;
        this.row = undefined;
        this.headerFooter = undefined;

        this.commentParaIDInfo = {};
        this.commentParaID = 0;
        this.currentCommentId = 0;
        this.commentId = {};
        this.document = undefined;
        this.mSections = undefined;
        this.mLists = undefined;
        this.mAbstractLists = undefined;
        this.defCharacterFormat = undefined;
        this.defParagraphFormat = undefined;
        this.defaultTabWidthValue = undefined;
        this.trackChanges = undefined;
        this.customXMLProps = [];
        this.mRelationShipID = 0;
        this.eRelationShipId = 0;
        this.cRelationShipId = 0;
        this.efRelationShipId = 0;
        this.mDocPrID = 1;
        this.chartCount = 0;
        this.mDifferentFirstPage = false;
        if (this.mHeaderFooterColl) {
            this.mHeaderFooterColl.destroy();
            this.mHeaderFooterColl = undefined;
        }
        if (this.mVerticalMerge) {
            this.mVerticalMerge.destroy();
            this.mVerticalMerge = undefined;
        }
        if (this.mGridSpans) {
            this.mGridSpans.destroy();
            this.mGridSpans = undefined;
        }
        if (this.mDocumentImages) {
            this.mDocumentImages.destroy();
            this.mDocumentImages = undefined;
        }
        if (this.mExternalLinkImages) {
            this.mExternalLinkImages.destroy();
            this.mExternalLinkImages = undefined;
        }
        if (this.mHeaderFooterImages) {
            this.mHeaderFooterImages.destroy();
            this.mHeaderFooterImages = undefined;
        }
        if (this.mDocumentCharts) {
            this.mDocumentCharts.destroy();
            this.mDocumentCharts = undefined;
        }
        if (this.mFootEndnotesColl) {
            this.mFootEndnotesColl.destroy();
            this.mFootEndnotesColl = undefined;
        }
    }
    // Serializes the document elements (document.xml)
    private serializeDocument(): void {
        const writer: XmlWriter = new XmlWriter();

        writer.writeStartElement('w', 'document', this.wNamespace);
        this.writeCommonAttributeStrings(writer);
        this.serializeDocumentBody(writer);

        writer.writeEndElement(); //end of document tag
        const archiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.documentPath);
        this.mArchive.addItem(archiveItem);
    }
    private writeCommonAttributeStrings(writer: XmlWriter): void {
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        this.writeCustom(writer);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        this.writeDup(writer);
        writer.writeAttributeString('xmlns', 'wne', undefined, this.wneNamespace);
        writer.writeAttributeString('xmlns', 'wps', undefined, this.wpShapeNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15 wp14');
    }
    private writeDup(writer: XmlWriter): void {
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('xmlns', 'wpg', undefined, this.wpGroupNamespace);
        writer.writeAttributeString('xmlns', 'wpi', undefined, this.wpInkNamespace);
    }
    private writeCustom(writer: XmlWriter): void {
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
    }
    // Serializes the document body
    private serializeDocumentBody(writer: XmlWriter): void {
        writer.writeStartElement(undefined, 'body', this.wNamespace);
        const count: number = this.document.sections.length;
        for (let i: number = 0; i < count; i++) {
            this.section = this.document.sections[i];
            this.lastSection = i === count - 1;
            this.serializeSection(writer, this.section, i === count - 1);
            this.section = undefined;
        }
        writer.writeEndElement();
    }
    // Serializes the Section.
    private serializeSection(writer: XmlWriter, section: any, last: boolean): void {
        this.blockOwner = section;
        this.serializeBodyItems(writer, section.blocks, last);
        if (last) {
            this.serializeSectionProperties(writer, section);
        }
        this.blockOwner = undefined;
    }
    // Serialize the comments (comments.xml)
    private serializeComments(): void {
        if (this.mComments.length === 0 || (this.mComments.length === 1 && this.mComments[0].text === '')) {
            return;
        }
        const writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('w', 'comments', this.wNamespace);
        this.serializeCommentCommonAttribute(writer);
        this.serializeCommentInternal(writer, this.mComments);
        writer.writeEndElement();
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.commentsPath);
        this.mArchive.addItem(zipArchiveItem);
    }
    private serializeCommentCommonAttribute(writer: XmlWriter): void {
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        writer.writeAttributeString('xmlns', 'cx', undefined, this.cxNamespace);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');
    }
    private serializeCommentInternal(writer: XmlWriter, comments: any[]): void {
        for (let i: number = 0; i < comments.length; i++) {
            const comment: any = comments[i];
            writer.writeStartElement('w', 'comment', this.wNamespace);
            writer.writeAttributeString('w', 'id', this.wNamespace, this.commentId[comment.commentId].toString());
            if (comment.author && comment.author !== ' ') {
                writer.writeAttributeString('w', 'author', this.wNamespace, comment.author);
            }
            if (comment.date) {
                writer.writeAttributeString('w', 'date', this.wNamespace, comment.date);
            }
            if (comment.initial && comment.initial !== '') {
                writer.writeAttributeString('w', 'initials', this.wNamespace, comment.initial);
            }
            const blocks: any[] = this.retrieveCommentText(comment.text);
            for (let k: number = 0; k < blocks.length; k++) {
                this.isInsideComment = true;
                this.commentParaID++;
                this.serializeBodyItem(writer, blocks[k], true);
                this.isInsideComment = false;
            }
            if (blocks.length === 0) {
                this.isInsideComment = true;
                this.commentParaID++;
            }
            this.commentParaIDInfo[comment.commentId] = this.commentParaID;
            //}
            this.isInsideComment = false;
            //}
            writer.writeEndElement();
            if (comment.replyComments.length > 0) {
                this.serializeCommentInternal(writer, comment.replyComments);
            }
        }

    }
    private retrieveCommentText(text: string): any[] {
        const blocks: any = [];
        let multiText: string[] = text.split('\n');
        multiText = multiText.filter((x: string) => x !== '');
        const block: any = {};
        if (multiText.length === 0) {
            block.inlines = [{ text: '' }];
            blocks.push(block);
        } else {
            while (multiText.length > 0) {
                block.inlines = [{ text: multiText[0] }];
                blocks.push(block);
                multiText.splice(0, 1);
            }
        }
        return blocks;
    }
    // Serialize the comments (commentsExtended.xml)
    private serializeCommentsExtended(): void {
        if (this.mComments.length === 0 || (this.mComments.length === 1 && this.mComments[0].text === '')) {
            return;
        }
        const writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('w15', 'commentsEx', this.wNamespace);
        this.serializeCommentCommonAttribute(writer);
        this.serializeCommentsExInternal(writer, this.mComments, false);
        writer.writeEndElement();
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.commentsExtendedPath);
        this.mArchive.addItem(zipArchiveItem);
    }
    private serializeCommentsExInternal(writer: XmlWriter, comments: any[], isReply: boolean): void {
        for (let i: number = 0; i < comments.length; i++) {
            const comment: any = comments[i];
            writer.writeStartElement('w15', 'commentEx', this.wNamespace);
            //if (comment.blocks.length > 0) {
            const syncParaID: number = this.commentParaIDInfo[comment.commentId];
            if (isReply) {
                const paraID: number = this.commentParaIDInfo[comment.ownerComment.commentId];
                writer.writeAttributeString('w15', 'paraIdParent', this.wNamespace, paraID.toString());
            }
            writer.writeAttributeString('w15', 'paraId', this.wNamespace, syncParaID.toString());
            //}
            const val: number = comment.done ? 1 : 0;
            writer.writeAttributeString('w15', 'done', this.wNamespace, val.toString());
            writer.writeEndElement();
            if (comment.replyComments.length > 0) {
                this.serializeCommentsExInternal(writer, comment.replyComments, true);
            }
        }
    }
    // Serialize the section properties.
    private serializeSectionProperties(writer: XmlWriter, section: any): void {
        writer.writeStartElement('w', 'sectPr', this.wNamespace);
        if (section.headersFooters) {
            this.serializeHFReference(writer, section.headersFooters);
        }
        // if (IsNeedToSerializeSectionFootNoteProperties(section))
        //     SerializeFootnoteProperties(section);
        // if (IsNeedToSerializeSectionEndNoteProperties(section))
        //     SerializeEndnoteProperties(section);
        this.serializeSectionType(writer, 'nextPage');
        this.serializePageSetup(writer, section.sectionFormat);
        this.serializeColumns(writer);
        this.serializeFootNotesPr(writer, section.sectionFormat);
        this.serializeEndNotesPr(writer, section.sectionFormat);
        // this.serializeSectionProtection(section);

        // if (section.PageSetup.VerticalAlignment !== PageAlignment.Top) {
        //     writer.writeStartElement('vAlign', this.wNamespace);

        //     switch (section.PageSetup.VerticalAlignment) {
        //         case PageAlignment.Top:
        //             writer.WriteAttributeString('val', this.wNamespace, 'top');
        //             break;
        //         case PageAlignment.Middle:
        //             writer.WriteAttributeString('val', this.wNamespace, 'center');
        //             break;
        //         case PageAlignment.Justified:
        //             writer.WriteAttributeString('val', this.wNamespace, 'both');
        //             break;
        //         case PageAlignment.Bottom:
        //             writer.WriteAttributeString('val', this.wNamespace, 'bottom');
        //             break;
        //     }

        //     writer.WriteEndElement();
        // }

        if (section.sectionFormat !== undefined && section.sectionFormat.differentFirstPage) {
            writer.writeStartElement(undefined, 'titlePg', this.wNamespace);
            writer.writeEndElement();
        }

        // SerializeTextDirection(section);

        if (!isNullOrUndefined(section.sectionFormat) && section.sectionFormat.bidi) {
            writer.writeStartElement(undefined, 'bidi', this.wNamespace);
            writer.writeEndElement();
        }
        //rtlGutter
        // SerializeDocGrid(section);
        //printerSettings
        writer.writeEndElement(); //end of sectPr tag

    }
    private serializeFootNotesPr(writer: XmlWriter, section: any): void {
        if (section.footNoteNumberFormat || section.restartIndexForFootnotes) {
            writer.writeStartElement(undefined, 'footnotePr', this.wNamespace);

            writer.writeStartElement(undefined, 'pos', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, 'pageBottom');
            writer.writeEndElement();

            if (section.footNoteNumberFormat !== undefined) {
                writer.writeStartElement(undefined, 'numFmt', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberFormat(section.footNoteNumberFormat));
                writer.writeEndElement();
            }
            if (section.restartIndexForFootnotes !== undefined) {
                writer.writeStartElement(undefined, 'numRestart', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberRestart(section.restartIndexForFootnotes));
                writer.writeEndElement();
            }
            if (section.initialFootNoteNumber !== undefined) {
                writer.writeStartElement(undefined, 'numStart', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, (section.initialFootNoteNumber).toString());
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
    }

    private getFootNoteNumberFormat(numberFormat: string): string {
        let patternType: string;
        switch (numberFormat) {
        case 'UpperCaseRoman':
            patternType = 'upperRoman';
            break;
        case 'LowerCaseRoman':
            patternType = 'lowerRoman';
            break;
        case 'UpperCaseLetter':
            patternType = 'upperLetter';
            break;
        case 'LowerCaseLetter':
            patternType = 'lowerLetter';
            break;
        default:
            patternType = 'decimal';
            break;
        }
        return patternType;
    }


    private getFootNoteNumberRestart(numberRestart: string): string {
        switch (numberRestart) {
        case 'RestartForEachSection ':
            return 'eachSect';
        case 'RestartForEachPage':
            return 'eachPage';
        default:
            return 'continuous';
        }
    }

    // Serialize the Footnote Properties
    private serializeEndNotesPr(writer: XmlWriter, section: any): void {
        if (section.endnoteNumberFormat || section.restartIndexForEndnotes) {
            writer.writeStartElement(undefined, 'endnotePr', this.wNamespace);

            writer.writeStartElement(undefined, 'pos', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, 'docEnd');
            writer.writeEndElement();

            if (section.endnoteNumberFormat !== undefined) {
                writer.writeStartElement(undefined, 'numFmt', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberFormat(section.endnoteNumberFormat));
                writer.writeEndElement();
            }
            if (section.restartIndexForEndnotes !== undefined) {
                writer.writeStartElement(undefined, 'numRestart', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getFootNoteNumberRestart(section.restartIndexForEndnotes));
                writer.writeEndElement();
            }
            if (section.initialEndNoteNumber !== undefined) {
                writer.writeStartElement(undefined, 'numStart', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, (section.initialEndNoteNumber).toString());
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
    }

    // Serialize the column properties of section.
    private serializeColumns(writer: XmlWriter): void {
        writer.writeStartElement(undefined, 'cols', this.wNamespace);
        writer.writeAttributeString(undefined, 'equalWidth', this.wNamespace, '1');
        writer.writeAttributeString(undefined, 'space', this.wNamespace, '0');
        writer.writeEndElement();
        // ColumnCollection columns = section.Columns;

        // writer.WriteStartElement('cols', this.wNamespace);

        // if (columns.length > 0)
        // {
        //     writer.WriteAttributeString('num', this.wNamespace, columns.length.ToString());
        // }

        // if (section.PageSetup.DrawLinesBetweenCols)
        //     writer.WriteAttributeString('sep', this.wNamespace, '1');

        // if (columns.OwnerSection.PageSetup.EqualColumnWidth)
        // {
        //     writer.WriteAttributeString('equalWidth', this.wNamespace, '1');
        //     //When the column count is negative, MS word just reset the column's count to zero
        //     //To avoid index out of exception, checked the columns count
        //     writer.WriteAttributeString('space', this.wNamespace, ToString(columns.length > 0 ? columns[0].Space * this.TwentiethOfPoint : 0));
        // }
        // else if (columns.length > 0)
        // {
        //     writer.WriteAttributeString('equalWidth', this.wNamespace, '0');

        //     foreach (Column column in columns)
        //     {
        //         writer.WriteStartElement('col', this.wNamespace);
        //         writer.WriteAttributeString('w', this.wNamespace, ToString(column.Width * this.TwentiethOfPoint));
        //         writer.WriteAttributeString('space', this.wNamespace, ToString(column.Space * this.TwentiethOfPoint));
        //         writer.WriteEndElement();
        //     }
        // }

        // writer.WriteEndElement();
    }
    // Serialize the page setup properties.
    private serializePageSetup(writer: XmlWriter, pageSetup: any): void {
        if (pageSetup !== undefined) {
            this.serializePageSize(writer, pageSetup);
            this.serializePageMargins(writer, pageSetup);
        }
        // // StartElement paperSrc (if any)
        // if (pageSetup.FirstPageTray > 0 || pageSetup.OtherPagesTray > 0) {
        //     writer.WriteStartElement('paperSrc', this.wNamespace);
        //     if (pageSetup.FirstPageTray > 0) {
        //         writer.WriteAttributeString('first', this.wNamespace, pageSetup.FirstPageTray.ToString());
        //     }
        //     if (pageSetup.OtherPagesTray > 0) {
        //         writer.WriteAttributeString('other', this.wNamespace, pageSetup.OtherPagesTray.ToString());
        //     }
        //     writer.WriteEndElement();
        // }
        if (pageSetup.restartPageNumbering) {
            writer.writeStartElement(undefined, 'pgNumType', this.wNamespace);
            writer.writeAttributeString(undefined, 'start', this.wNamespace, pageSetup.pageStartingNumber.toString());
            writer.writeEndElement();
        }
        writer.writeStartElement(undefined, 'pgBorders', this.wNamespace);
        // //zOrder
        // if (pageSetup.PageBordersApplyType === PageBordersApplyType.FirstPage)
        //     writer.WriteAttributeString('display', this.wNamespace, 'firstPage');
        // else if (pageSetup.PageBordersApplyType === PageBordersApplyType.AllExceptFirstPage)
        //     writer.WriteAttributeString('display', this.wNamespace, 'notFirstPage');
        // if (pageSetup.PageBorderOffsetFrom === PageBorderOffsetFrom.PageEdge) {
        //     writer.WriteAttributeString('offsetFrom', this.wNamespace, 'page');
        // }
        // //Serializing zOrder of the front page border
        // if (!pageSetup.IsFrontPageBorder) {
        //     writer.WriteAttributeString('zOrder', this.wNamespace, 'back');
        // }
        // SerializePageBorders(pageSetup.Borders);
        writer.writeEndElement();

        // this.serializeLineNumberType(writer, pageSetup);
        //this.serializePageNumberType(writer, pageSetup);

    }
    // serialize the page size
    private serializePageSize(writer: XmlWriter, pageSetup: any): void {
        writer.writeStartElement(undefined, 'pgSz', this.wNamespace);
        writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(pageSetup.pageWidth * this.twentiethOfPoint).toString());
        writer.writeAttributeString(undefined, 'h', this.wNamespace, this.roundToTwoDecimal(pageSetup.pageHeight * this.twentiethOfPoint).toString());

        // if (pageSetup.Orientation === PageOrientation.Landscape)
        // {
        //     writer.WriteAttributeString('orient', this.wNamespace, 'landscape');
        // }

        writer.writeEndElement();
    }
    // Serialize the border.
    private serializePageMargins(writer: XmlWriter, pageSetup: any): void {
        writer.writeStartElement(undefined, 'pgMar', this.wNamespace);
        let marginValue: number = Math.round(pageSetup.topMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'top', this.wNamespace, marginValue.toString());
        marginValue = Math.round(pageSetup.rightMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'right', this.wNamespace, marginValue.toString());
        marginValue = Math.round(pageSetup.bottomMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'bottom', this.wNamespace, marginValue.toString());
        marginValue = Math.round(pageSetup.leftMargin * this.twentiethOfPoint);
        writer.writeAttributeString(undefined, 'left', this.wNamespace, marginValue.toString());
        writer.writeAttributeString(undefined, 'header', this.wNamespace, this.roundToTwoDecimal(pageSetup.headerDistance * this.twentiethOfPoint).toString());
        writer.writeAttributeString(undefined, 'footer', this.wNamespace, this.roundToTwoDecimal(pageSetup.footerDistance * this.twentiethOfPoint).toString());

        writer.writeAttributeString(undefined, 'gutter', this.wNamespace, '0');

        writer.writeEndElement();
    }
    // Serialize the section type.
    private serializeSectionType(writer: XmlWriter, sectionBreakCode: string): void {
        writer.writeStartElement('w', 'type', this.wNamespace);
        writer.writeAttributeString('w', 'val', this.wNamespace, sectionBreakCode); //GetSectionBreakCode(sectionBreakCode));
        writer.writeEndElement();
    }
    // Serialize the heeader/footer reference.
    private serializeHFReference(writer: XmlWriter, headersFooters: any): void {

        let hfId: string = '';
        if (headersFooters !== undefined) {
            this.mDifferentFirstPage = this.section.sectionFormat.differentOddAndEvenPages;
            let hf: any = headersFooters.firstPageHeader;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'headerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'first');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'FirstPageHeader', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.firstPageFooter;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'footerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'first');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'FirstPageFooter', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.evenHeader;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'headerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'even');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'EvenHeader', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.evenFooter;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'footerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'even');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'EvenFooter', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.header;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'headerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'default');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'OddHeader', hfId);
                writer.writeEndElement();
            }
            hf = headersFooters.footer;
            if (hf && hf.blocks && hf.blocks.length > 0) {
                writer.writeStartElement(undefined, 'footerReference', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'default');
                hfId = this.getNextRelationShipID();
                writer.writeAttributeString(undefined, 'id', this.rNamespace, hfId);
                this.addHeaderFooter(hf, 'OddFooter', hfId);
                writer.writeEndElement();
            }
        }
    }
    // Adds the header footer details to the collection.
    private addHeaderFooter(hf: any, hfType: any, id: string): void {
        const hfColl: Dictionary<string, any> = new Dictionary<string, any>();
        this.headersFooters.add(hfType, hfColl);
        this.headersFooters.get(hfType).add(id, hf);
    }
    // Serializes the bodyItems
    private serializeBodyItems(writer: XmlWriter, blockCollection: any, isLastSection: boolean): void {
        for (let i: number = 0; i < blockCollection.length; i++) {
            this.serializeBodyItem(writer, blockCollection[i], isLastSection);
        }
    }
    // serialize the content Control
    /* eslint-disable-next-line max-len */
    private serializeContentControl(writer: XmlWriter, contentControlItem: any, item: any, isLastSection?: boolean, inlines?: boolean): void {
        if (isNullOrUndefined(contentControlItem)) {
            throw new Error('contentCOntrol should not be undefined');
        }
        writer.writeStartElement('w', 'sdt', this.wNamespace);
        writer.writeStartElement(undefined, 'sdtPr', this.wNamespace);
        if (!isNullOrUndefined(contentControlItem)) {
            this.serializeContentProperties(writer, contentControlItem, item, isLastSection, inlines);
        }
    }
    // serialize Content Control Properties
    /* eslint-disable-next-line max-len */
    private serializeContentProperties(writer: XmlWriter, contentProperties: any, items: any, isLastSection: boolean, inlines?: boolean): void {
        const repeatSdt: any = undefined;
        if (!isNullOrUndefined(contentProperties.title)) {
            writer.writeStartElement(undefined, 'alias', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, contentProperties.title);
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'tag', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, contentProperties.tag);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.characterFormat)) {
            this.serializeCharacterFormat(writer, items.contentControlProperties.characterFormat);
        }
        // if (items.hasOwnProperty('blocks') && contentProperties.type !== 'CheckBox') {
        //     this.serializeContentParagraph(writer, items);
        // }
        if (contentProperties.lockContents || contentProperties.lockContentControl) {
            writer.writeStartElement(undefined, 'lock', this.wNamespace);
            if (contentProperties.lockContentControl && contentProperties.lockContents) {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'sdtContentLocked');
            } else if (contentProperties.lockContentControl) {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'sdtLocked');
            } else if (contentProperties.lockContents) {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'contentLocked');
            }
            writer.writeEndElement();
        }
        if (contentProperties.hasPlaceHolderText && isNullOrUndefined(repeatSdt)) {
            writer.writeStartElement('w', 'placeholder', undefined);
            writer.writeAttributeString('w', 'docPart', this.wNamespace, undefined);
            writer.writeEndElement();
            writer.writeStartElement('w', 'showingPlcHdr', undefined);
            writer.writeEndElement();
        }
        if (contentProperties.isTemporary) {
            writer.writeStartElement('w', 'temporary', undefined);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.appearance)) {
            writer.writeStartElement('w15', 'appearance', undefined);
            writer.writeAttributeString('w15', 'val', undefined, contentProperties.appearance.toLowerCase());
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.color)) {
            writer.writeStartElement('w15', 'color', undefined);
            writer.writeAttributeString('w', 'val', undefined, this.getColor(contentProperties.color));
            writer.writeEndElement();
        }
        if (contentProperties.multiline) {
            writer.writeStartElement(undefined, 'text', this.wNamespace);
            writer.writeAttributeString('w', 'multiLine', this.wNamespace, '1');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.xmlMapping)) {
            if (contentProperties.xmlMapping.isMapped) {
                writer.writeStartElement('w', 'dataBinding', this.wNamespace);
                writer.writeAttributeString('w', 'xpath', undefined, contentProperties.xmlMapping.xPath);
                writer.writeAttributeString('w', 'storeItemID', undefined, contentProperties.xmlMapping.storeItemId);
                writer.writeEndElement();
            }
        }
        if (contentProperties.picture) {
            writer.writeStartElement('w', 'picture', this.wNamespace);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.uncheckedState || contentProperties.checkedState)) {
            writer.writeStartElement('w14', 'checkbox', undefined);
            if (contentProperties.isChecked) {
                writer.writeStartElement('w14', 'checked', undefined);
                writer.writeAttributeString('w14', 'val', undefined, '1');
                writer.writeEndElement();
            } else {
                writer.writeStartElement('w14', 'checked', undefined);
                writer.writeAttributeString('w14', 'val', undefined, '0');
                writer.writeEndElement();
            }
            writer.writeStartElement('w14', 'uncheckedState', undefined);
            writer.writeAttributeString('w14', 'val', undefined, this.toUnicode(contentProperties.uncheckedState.value));
            writer.writeAttributeString('w14', 'font', undefined, (contentProperties.uncheckedState.font));
            writer.writeEndElement();
            writer.writeStartElement('w14', 'checkedState', undefined);
            writer.writeAttributeString('w14', 'val', undefined, this.toUnicode(contentProperties.checkedState.value));
            writer.writeAttributeString('w14', 'font', undefined, contentProperties.checkedState.font);
            writer.writeEndElement();
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.contentControlListItems) && contentProperties.type === 'DropDownList') {
            const dropDownLists: any = contentProperties.contentControlListItems;
            writer.writeStartElement(undefined, 'dropDownList', this.wNamespace);
            this.serializeContentControlList(writer, dropDownLists);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(contentProperties.contentControlListItems) && contentProperties.type === 'ComboBox') {
            const comboList: any = contentProperties.contentControlListItems;
            writer.writeStartElement(undefined, 'comboBox', this.wNamespace);
            this.serializeContentControlList(writer, comboList);
            writer.writeEndElement();
        }
        this.serializeContentControlDate(writer, contentProperties);
        if (!isNullOrUndefined(contentProperties.type)) {
            if (contentProperties.type === 'Picture') {
                writer.writeStartElement(undefined, 'picture', this.wNamespace);
                writer.writeEndElement();
            }
        }
        writer.writeEndElement();
        writer.writeStartElement('w', 'sdtContent', this.wNamespace);
        if (inlines) {
            return;
        }
        /* eslint-disable */
        if (items.hasOwnProperty('blocks') && (isNullOrUndefined(items.cellFormat))) {
            for (let i: number = 0; i < items.blocks.length; i++) {
                const block: any = items.blocks[i];
                if (block.hasOwnProperty('inlines')) {
                    this.paragraph = block;
                    this.serializeParagraph(writer, block, isLastSection);
                    this.paragraph = undefined;
                } else if (block.hasOwnProperty('rowFormat')) {
                    const mVerticalMerge: Dictionary<number, number> = new Dictionary<number, number>();
                    this.serializeRow(writer, block, mVerticalMerge);
                } else if (block.hasOwnProperty('contentControlProperties')) {
                    this.serializeContentControl(writer, block.contentControlProperties, block, isLastSection);
                } else {
                    const table: any = block;
                    this.serializeTable(writer, table);
                }
            }
        } else if (items.hasOwnProperty('rowFormat')) {
            if (items.cells.length > 0) {
                const mVerticalMerge: Dictionary<number, number> = new Dictionary<number, number>();
                this.serializeRow(writer, items, mVerticalMerge);
            }
        } else if (items.hasOwnProperty('cellFormat')) {
            const mVerticalMerge: Dictionary<number, number> = new Dictionary<number, number>();
            this.serializeCell(writer, items, mVerticalMerge);
        }
        writer.writeEndElement();
        writer.writeEndElement();
    }
    private toUnicode(code: string): any {
        const charCode: number = code.charCodeAt(0);
        return charCode.toString(16);
    }
    //serialize dropdown and list property
    private serializeContentControlList(writer: XmlWriter, lists: any): void {
        for (let i: number = 0; i < lists.length; i++) {
            writer.writeStartElement(undefined, 'listItem', this.wNamespace);
            if (!isNullOrUndefined(lists[i].displayText)) {
                writer.writeAttributeString('w', 'displayText', this.wNamespace, lists[i].displayText);
            }
            writer.writeAttributeString('w', 'value', this.wNamespace, lists[i].value);
            writer.writeEndElement();
        }
    }
    //Serialize character formatfor content control
    private serializeContentParagraph(writer: XmlWriter, items: any): any {
        for (let i: number = 0; i < items.blocks.length; i++) {
            const blocks: any = items.blocks[i];
            if (blocks.hasOwnProperty('inlines')) {
                for (let j: number = 0; j < blocks.inlines.length; j++) {
                    const inlines: any = blocks.inlines[j];
                    if (!isNullOrUndefined(inlines.characterFormat)) {
                        this.serializeCharacterFormat(writer, inlines.characterFormat);
                    }
                }
            }
        }
    }
    // serialize content control date property
    private serializeContentControlDate(writer: XmlWriter, contentProperties: any): any {
        if (contentProperties.type === 'Date') {
            writer.writeStartElement('w', 'date', this.wNamespace);
            if (!isNullOrUndefined(contentProperties.dateDisplayFormat)) {
                writer.writeStartElement('w', 'calender', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateCalendarType);
                writer.writeEndElement();
            }
            if (!isNullOrUndefined(contentProperties.dateDisplayLocale)) {
                writer.writeStartElement('w', 'lid', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateDisplayLocale);
                writer.writeEndElement();
            }
            if (!isNullOrUndefined(contentProperties.dateStorageFormat)) {
                writer.writeStartElement('w', 'storeMappedDataAs', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateStorageFormat);
                writer.writeEndElement();
            }
            if (!isNullOrUndefined(contentProperties.dateCalendarType)) {
                writer.writeStartElement('w', 'dateFormat', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, contentProperties.dateDisplayFormat);
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
    }
    // Serialize the TextBody item
    private serializeBodyItem(writer: XmlWriter, item: any, isLastSection: boolean): void {
        if (isNullOrUndefined(item)) {
            throw new Error('BodyItem should not be undefined');
        }
        if (item.hasOwnProperty('contentControlProperties')) {
            this.serializeContentControl(writer, item.contentControlProperties, item, isLastSection);
        } else if (item.hasOwnProperty('inlines')) {
            this.paragraph = item;
            this.serializeParagraph(writer, item, isLastSection);
            this.paragraph = undefined;
        } else {
            const table: any = item;
            for (let i: number = 0; i < table.rows.length; i++) {
                if (table.rows[i].cells.length > 0) {
                    this.serializeTable(writer, table);
                    break;
                }
            }
        }
        const sec: any = this.blockOwner;

        //Need to write the Section Properties if the Paragraph is last item in the section
        if (!isLastSection && sec.hasOwnProperty('sectionFormat')
            && sec.blocks.indexOf(item) === sec.blocks.length - 1) {
            writer.writeStartElement('w', 'p', this.wNamespace);
            writer.writeStartElement(undefined, 'pPr', this.wNamespace);

            this.serializeSectionProperties(writer, sec);
            writer.writeEndElement();
            writer.writeEndElement();
        }

    }
    // Serialize the paragraph
    private serializeParagraph(writer: XmlWriter, paragraph: any, isLastSection: boolean): void {
        if (isNullOrUndefined(paragraph)) {
            throw new Error('Paragraph should not be undefined');
        }

        // if (paragraph.ParagraphFormat.PageBreakAfter && !IsPageBreakNeedToBeSkipped(paragraph as Entity))
        //     paragraph.InsertBreak(BreakType.PageBreak);
        // if (paragraph.ParagraphFormat.ColumnBreakAfter && !IsPageBreakNeedToBeSkipped(paragraph as Entity))
        //     paragraph.InsertBreak(BreakType.ColumnBreak);
        //Splits the paragraph based on the newline character
        // paragraph.SplitTextRange();

        writer.writeStartElement('w', 'p', this.wNamespace);
        if (this.isInsideComment) {
            writer.writeAttributeString('w14', 'paraId', undefined, this.commentParaID.toString());
        }
        writer.writeStartElement(undefined, 'pPr', this.wNamespace);
        if (!isNullOrUndefined(paragraph.paragraphFormat)) {
            this.serializeParagraphFormat(writer, paragraph.paragraphFormat, paragraph);
        }
        if (!isNullOrUndefined(paragraph.characterFormat)) {
            this.serializeCharacterFormat(writer, paragraph.characterFormat);
        }
        writer.writeEndElement(); //end of pPr

        // Serialize watermark if paragraph is the first item of Header document.
        // EnsureWatermark(paragraph);
        this.prevRevisionIds = [];
        this.serializeParagraphItems(writer, paragraph.inlines);
        writer.writeEndElement(); //end of paragraph tag.

    }
    //Serialize Revision start
    private serializeRevisionStart(writer: XmlWriter, item: any, previousNode: any): void {
        if (item.hasOwnProperty('revisionIds')) {
            if (!isNullOrUndefined(previousNode) && previousNode.hasOwnProperty('fieldType') && previousNode.fieldType === 0) {
                return;
            }
            if (item.hasOwnProperty('fieldType') && item.fieldType === 1) {
                return;
            }
            if (!isNullOrUndefined(previousNode) && previousNode.hasOwnProperty('bookmarkType') && (previousNode.bookmarkType === 0 && !(previousNode.name.indexOf('_Toc') >= 0))) {
                return;
            }

            const ids: string[] = item.revisionIds;

            for (let i: number = 0; i < ids.length; i++) {
                const revision: Revision = this.retrieveRevision(ids[i]);
                if (revision.revisionType === 'Insertion') {
                    this.serializeTrackChanges(writer, 'ins', revision.author, revision.date);
                }
                if (revision.revisionType === 'Deletion') {
                    this.serializeTrackChanges(writer, 'del', revision.author, revision.date);
                }
            }
        }
    }
    //Serialize track changes
    private serializeTrackChanges(writer: XmlWriter, type: any, author: any, date: any): void {
        writer.writeStartElement('w', type, this.wNamespace);
        writer.writeAttributeString('w', 'id', this.wNamespace, (this.trackChangesId++).toString());
        writer.writeAttributeString('w', 'author', this.wNamespace, author);
        writer.writeAttributeString('w', 'date', this.wNamespace, date);
    }

    private retrieveRevision(id: any): Revision {
        const matchedRevisions: any = [];
        for (let i: number = 0; i < this.revisions.length; i++) {
            if (this.revisions[i].revisionID === id) {
                return this.revisions[i];
            }
        }
        return undefined;
    }
    // Serialize the paragraph items
    private serializeParagraphItems(writer: XmlWriter, paraItems: any): void {
        let inlines: boolean;
        let previousNode: any = undefined;
        let isContinueOverride: boolean = false;
        for (let i: number = 0; i < paraItems.length; i++) {
            const item: any = paraItems[i];
            if (item.hasOwnProperty('contentControlProperties')) {
                inlines = true;
                this.serializeContentControl(writer, item.contentControlProperties, item, undefined, inlines);
                this.serializeParagraphItems(writer, item.inlines);
            }
            if (item.hasOwnProperty('inlines')) {
                this.serializeParagraphItems(writer, item);
            }
            this.serializeRevisionStart(writer, item, previousNode);
            let isBdo: boolean = false;
            if (item.characterFormat) {
                isBdo = !isNullOrUndefined(item.characterFormat.bdo) && item.characterFormat.bdo !== 'None';
                if (isBdo && !isContinueOverride) {
                    this.serializeBiDirectionalOverride(writer, item.characterFormat);
                    isContinueOverride = true;
                }
            }
            if (isContinueOverride && !isBdo) {
                writer.writeEndElement();
                isContinueOverride = false;
            }
            if (item.hasOwnProperty('fieldType')) {
                this.serializeFieldCharacter(writer, item);
            } else if (item.hasOwnProperty('imageString')) {
                this.serializePicture(writer, item);
            } else if (item.hasOwnProperty('shapeId')) {
                const currentParargaph: any = this.paragraph;
                this.serializeShape(writer, item);
                this.paragraph = currentParargaph;
            } else if (item.hasOwnProperty('bookmarkType')) {
                this.serializeBookMark(writer, item);
            } else if (item.hasOwnProperty('editRangeId')) {
                this.serializeEditRange(writer, item);
            } else if (item.hasOwnProperty('chartType')) {
                this.chart = item;
                this.serializeChart(writer, item);
                // chart.xml
                this.serializeChartStructure();
            } else if (item.hasOwnProperty('commentCharacterType')) {
                this.serializeComment(writer, item);
            } else if (item.hasOwnProperty('footnoteType')) {
                this.serializeEFReference(writer, item);
            } else {
                this.serializeTextRange(writer, item, previousNode);
            }
            //Serialize revision end
            this.serializeRevisionEnd(writer, item, previousNode);
            previousNode = item;
            if (inlines) {
                writer.writeEndElement();
                writer.writeEndElement();
                inlines = false;
            }
        }
        if (isContinueOverride) {
            writer.writeEndElement();
        }
    }
    private serializeEFReference(writer: XmlWriter, item: any): void {
        let efId: string = '';
        const ef: any = item.blocks;
        if (item.footnoteType === 'Footnote') {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, item.characterFormat);
            writer.writeStartElement(undefined, 'footnoteReference', this.wNamespace);
            efId = this.getEFNextRelationShipID();
            writer.writeAttributeString(undefined, 'id', this.wNamespace, efId);
            this.addFootnotesEndnotes(ef, 'footnote', efId);
            writer.writeEndElement();
            writer.writeEndElement();
        } else {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, item.characterFormat);
            writer.writeStartElement(undefined, 'endnoteReference', this.wNamespace);
            efId = this.getEFNextRelationShipID();
            writer.writeAttributeString(undefined, 'id', this.wNamespace, efId);
            this.addFootnotesEndnotes(ef, 'endnote', efId);
            writer.writeEndElement();
            writer.writeEndElement();
        }
    }
    private addFootnotesEndnotes(ef: any, efType: any, id: string): void {
        const efColl: Dictionary<string, any> = new Dictionary<string, any>();
        this.endnotesFootnotes.add(efType, efColl);
        this.endnotesFootnotes.get(efType).add(id, ef);
    }
    private serializeEndnotesFootnote(writer: XmlWriter, efType: any): void {
        if (this.endnotesFootnotes.length === 0) {
            return;
        }
        let endnoteFootnotePath: string;
        let endnoteFootnoteRelsPath: string;
        if (!this.endnotesFootnotes.containsKey(efType)) {
            return;
        }
        const efColl: Dictionary<string, any> = this.endnotesFootnotes.get(efType);
        let ef: any = undefined;
        for (let i: number = 0; i < efColl.keys.length; i++) {
            const id: string = efColl.keys[i];
            ef = efColl.get(id);
            if (efType === 'endnote') {
                endnoteFootnotePath = this.endnotesPath;
                endnoteFootnoteRelsPath = this.endnotesRelationPath;
                this.serializeInlineEndnotes(writer, ef, id);
            } else {
                endnoteFootnotePath = this.footnotesPath;
                endnoteFootnoteRelsPath = this.footnotesRelationPath;
                this.serializeInlineFootnotes(writer, ef, id);
            }
        }
    }
    private serializeInlineEndnotes(writer: XmlWriter, endNote: any, id: string): void {
        this.endNoteFootnote = endNote;
        const owner: any = this.blockOwner;
        this.blockOwner = endNote;
        writer.writeStartElement('w', 'endnote', this.wNamespace);
        writer.writeAttributeString(undefined, 'id', this.wNamespace, id);
        this.serializeBodyItems(writer, endNote, true);
        writer.writeEndElement();
        this.blockOwner = owner;
        this.endNoteFootnote = undefined;
    }

    private serializeInlineFootnotes(writer: XmlWriter, footNote: any, id: string): void {
        this.endNoteFootnote = footNote;
        const owner: any = this.blockOwner;
        this.blockOwner = footNote;
        writer.writeStartElement('w', 'footnote', this.wNamespace);
        writer.writeAttributeString(undefined, 'id', this.wNamespace, id);
        this.serializeBodyItems(writer, footNote, true);
        writer.writeEndElement();
        this.blockOwner = owner;
        this.endNoteFootnote = undefined;
    }
    // private footnoteXMLItem(fileIndex: number): any {
    //     let writer = new XmlWriter;
    //     writer.writeStartElement(undefined, 'Sources', this.wNamespace)
    //     writer.writeAttributeString('xmlns', 'b', undefined, 'http://schemas.openxmlformats.org/officeDocument/2006/bibliography')
    //     writer.writeAttributeString(undefined,'xmlns',  undefined, 'http://schemas.openxmlformats.org/officeDocument/2006/bibliography')
    //     writer.writeAttributeString(undefined,'SelectedStyle', undefined,"\APASixthEditionOfficeOnline.xsl")
    //     writer.writeAttributeString(undefined,'StyleName',  undefined,"APA")
    //     writer.writeAttributeString(undefined,'Version',  undefined,"6")
    //     writer.writeEndElement();
    //     let itemPath: string = this.customXMLItemsPath + fileIndex + '.xml';
    //     let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, itemPath);
    //     this.mArchive.addItem(zipArchiveItem);
    //     return itemPath;
    // }
    // private footnoteXMLItemProps(itemID: string, fileIndex: number): any {
    //     let writer: XmlWriter = new XmlWriter();
    //     let customitemPropsPath: string = this.customXMLItemsPropspath + fileIndex + '.xml';
    //     let itemPropsPath: string = this.itemPropsPath + fileIndex + '.xml';
    //     writer.writeStartElement('ds', 'datastoreItem', this.wNamespace);
    //     writer.writeAttributeString('ds', 'itemID', undefined, itemID);
    //     writer.writeAttributeString('xmlns', 'ds', undefined, this.dsNamespace);
    //     writer.writeStartElement('ds','schemaRefs', this.wNamespace);
    //     writer.writeStartElement('ds', 'schemaRef', this.wNamespace);
    //     writer.writeAttributeString('ds','uri', undefined,'http://schemas.openxmlformats.org/officeDocument/2006/bibliography' )
    //     writer.writeEndElement();
    //     writer.writeEndElement();
    //     writer.writeEndElement();
    //     this.customXMLProps.push(customitemPropsPath);
    //     let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, customitemPropsPath);
    //     this.mArchive.addItem(zipArchiveItem);
    //     return itemPropsPath;
    // }

    //Serialize the Footnote Endnotes Common Atributes
    private writeEFCommonAttributes(writer: XmlWriter): void {
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        writer.writeAttributeString('xmlns', 'cx', undefined, this.cxNamespace);
        writer.writeAttributeString('xmlns', 'aink', undefined, 'http://schemas.microsoft.com/office/drawing/2016/ink');
        writer.writeAttributeString('xmlns', 'am3d', undefined, 'http://schemas.microsoft.com/office/drawing/2017/,odel3d');
        this.writeCustom(writer);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        this.writeDup(writer);
        writer.writeAttributeString('xmlns', 'wne', undefined, this.wneNamespace);
        writer.writeAttributeString('xmlns', 'wps', undefined, this.wpShapeNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');
    }
    private serializeFootnotes(): any {
        if (isNullOrUndefined(this.document.footnotes)) {
            return;
        } else {
            const writer: XmlWriter = new XmlWriter();
            writer.writeStartElement('w', 'footnotes', this.wNamespace);
            this.writeEFCommonAttributes(writer);
            writer.writeStartElement('w', 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'separator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            this.serializeBodyItems(writer, this.document.footnotes.separator, true);
            writer.writeEndElement();
            writer.writeStartElement('w', 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationSeparator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            this.serializeBodyItems(writer, this.document.footnotes.continuationSeparator, true);
            writer.writeEndElement();
            if (this.document.footnotes.continuationNotice) {
                writer.writeStartElement('w', 'endnote', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationNotice');
                writer.writeAttributeString(undefined, 'id', this.wNamespace, '1');
                this.serializeBodyItems(writer, this.document.footnotes.continuationNotice, true);
                writer.writeEndElement();
            }
            this.serializeEndnotesFootnote(writer, 'footnote');
            writer.writeEndElement();
            const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.footnotesPath);
            this.mArchive.addItem(zipArchiveItem);
        }
    }
    private serializeEndnotes(): any {
        if (isNullOrUndefined(this.document.endnotes)) {
            return;
        } else {
            const writer: XmlWriter = new XmlWriter();
            writer.writeStartElement('w', 'endnotes', this.wNamespace);
            this.writeEFCommonAttributes(writer);
            writer.writeStartElement('w', 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'separator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            this.serializeBodyItems(writer, this.document.endnotes.separator, true);
            writer.writeEndElement();
            writer.writeStartElement('w', 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationSeparator');
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            this.serializeBodyItems(writer, this.document.endnotes.continuationSeparator, true);
            writer.writeEndElement();
            if (this.document.endnotes.continuationNotice) {
                writer.writeStartElement('w', 'endnote', this.wNamespace);
                writer.writeAttributeString(undefined, 'type', this.wNamespace, 'continuationNotice');
                writer.writeAttributeString(undefined, 'id', this.wNamespace, '1');
                this.serializeBodyItems(writer, this.document.endnotes.continuationNotice, true);
                writer.writeEndElement();
            }
            this.serializeEndnotesFootnote(writer, 'endnote');
            writer.writeEndElement();
            const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.endnotesPath);
            this.mArchive.addItem(zipArchiveItem);
        }
    }
    //Serialize Revision end
    private serializeRevisionEnd(writer: XmlWriter, item: any, previousNode: any): void {
        if (item.hasOwnProperty('revisionIds')) {
            //skip revision end for field begin as we combine to end with field code text
            if (item.hasOwnProperty('fieldType') && item.fieldType === 0) {
                return;
            }
            //skip revision end for field result text as we need to only on field end.
            if (!isNullOrUndefined(previousNode) && previousNode.hasOwnProperty('fieldType') && (previousNode.fieldType === 2 || (previousNode.fieldType === 0 && item.text.indexOf('TOC') >= 0))) {
                return;
            }
            for (let i: number = 0; i < item.revisionIds.length; i++) {
                const revision: Revision = this.retrieveRevision(item.revisionIds[i]);
                if (revision.revisionType === 'Insertion' || revision.revisionType === 'Deletion') {
                    writer.writeEndElement();
                }
            }
        }
    }
    // Serialize the comment
    private serializeComment(writer: XmlWriter, comment: any): void {
        if (!(this.mComments.length === 1 && this.mComments[0].text === '')) {
            if (comment.commentCharacterType === 0) {
                writer.writeStartElement('w', 'commentRangeStart', this.wNamespace);
            } else if (comment.commentCharacterType === 1) {
                writer.writeStartElement('w', 'commentRangeEnd', this.wNamespace);
            }
            let commentId: number = this.commentId[comment.commentId];
            if (isNullOrUndefined(commentId)) {
                commentId = this.commentId[comment.commentId] = this.currentCommentId++;
            }
            writer.writeAttributeString('w', 'id', this.wNamespace, commentId.toString());
            writer.writeEndElement();
            if (comment.commentCharacterType === 1) {
                this.serializeCommentItems(writer, commentId);
            }
        }
    }
    private serializeCommentItems(writer: XmlWriter, commentId: any): void {
        writer.writeStartElement('w', 'r', this.wNamespace);
        writer.writeStartElement('w', 'commentReference', this.wNamespace);
        writer.writeAttributeString('w', 'id', this.wNamespace, commentId.toString());
        writer.writeEndElement();
        writer.writeEndElement();
    }

    private serializeBiDirectionalOverride(writer: any, characterFormat: any): void {
        writer.writeStartElement(undefined, 'bdo', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, characterFormat.bdo.toLowerCase());
    }
    // Serialize Document Protection
    //<w:permStart w:id="627587516" w:edGrp="everyone" />
    private serializeEditRange(writer: XmlWriter, editElement: any): void {
        if (editElement.hasOwnProperty('editableRangeStart')) {
            writer.writeStartElement('w', 'permEnd', this.wNamespace);
        } else {
            writer.writeStartElement('w', 'permStart', this.wNamespace);
            if (editElement.user && editElement.user !== '') {
                writer.writeAttributeString('w', 'ed', this.wNamespace, editElement.user);
            }
            if (editElement.group && editElement.group !== '') {
                writer.writeAttributeString('w', 'edGrp', this.wNamespace, editElement.group.toLowerCase());
            }
            if (editElement.columnFirst && editElement.columnFirst !== -1) {
                writer.writeAttributeString('w', 'colFirst', this.wNamespace, editElement.columnFirst.toString());
            }
            if (editElement.columnLast && editElement.columnLast !== -1) {
                writer.writeAttributeString('w', 'colLast', this.wNamespace, editElement.columnLast.toString());
            }
        }
        writer.writeAttributeString('w', 'id', this.wNamespace, editElement.editRangeId);
        writer.writeEndElement();
    }
    // Serialize the book mark
    private serializeBookMark(writer: XmlWriter, bookmark: any): void {
        const bookmarkId: number = this.getBookmarkId(bookmark.name);
        const bookmarkName: string = bookmark.name;
        if (bookmark.bookmarkType === 0) {
            writer.writeStartElement('w', 'bookmarkStart', this.wNamespace);
            writer.writeAttributeString('w', 'name', this.wNamespace, bookmarkName);
        } else if (bookmark.bookmarkType === 1) {
            writer.writeStartElement('w', 'bookmarkEnd', this.wNamespace);
        }
        writer.writeAttributeString('w', 'id', this.wNamespace, bookmarkId.toString());
        writer.writeEndElement();
    }
    private getBookmarkId(name: string): number {
        let index: number = this.bookmarks.indexOf(name);
        if (index < 0) {
            index = this.bookmarks.length;
            this.bookmarks.push(name);
        }
        return index;
    }
    // Serialize the picture.
    private serializePicture(writer: XmlWriter, image: any): void {
        if (image.width >= 0 && image.height >= 0) {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, image.characterFormat);
            this.serializeDrawing(writer, image);
            writer.writeEndElement(); //end of run element
        }
    }
    private serializeShape(writer: XmlWriter, item: any): void {
        if (item.width >= 0 && item.height >= 0) {
            writer.writeStartElement(undefined, 'r', this.wNamespace);
            this.serializeCharacterFormat(writer, item.characterFormat);
            this.serializeDrawing(writer, item);
            writer.writeEndElement(); //end of run element
        }
    }
    // Serialize the drawing element.
    private serializeDrawing(writer: XmlWriter, draw: any): void {
        writer.writeStartElement(undefined, 'drawing', this.wNamespace);
        if (draw.hasOwnProperty('chartType')) {
            this.serializeInlineCharts(writer, draw);
        } else {
            if (draw.textWrappingStyle === 'Inline') {
                this.serializeInlinePictureAndShape(writer, draw);
            } else {
                this.serializeWrappingPictureAndShape(writer, draw);
            }
        }
        writer.writeEndElement();
    }
    // Serialize the Other Wrapping picture & Shape.
    private serializeWrappingPictureAndShape(writer: XmlWriter, picture: any): void {
        writer.writeStartElement('wp', 'anchor', this.wpNamespace);
        this.serializePictureAndShapeDistance(writer, picture);
        writer.writeAttributeString(undefined, 'simplePos', undefined, '0');
        writer.writeAttributeString(undefined, 'relativeHeight', undefined, picture.zOrderPosition ? picture.zOrderPosition.toString() : '0');
        let behindText: boolean = (picture.textWrappingStyle && picture.textWrappingStyle === 'Behind');
        writer.writeAttributeString(undefined, 'behindDoc', undefined, behindText ? '1' : '0');
        const lockAnchor: string = (picture.LockAnchor) ? '1' : '0';
        writer.writeAttributeString(undefined, 'locked', undefined, lockAnchor);
        const layoutcell: string = (picture.layoutInCell) ? '1' : '0';
        writer.writeAttributeString(undefined, 'layoutInCell', undefined, layoutcell);
        const allowOverlap: string = (picture.allowOverlap) ? '1' : '0';
        writer.writeAttributeString(undefined, 'allowOverlap', undefined, allowOverlap);
        writer.writeStartElement('wp', 'simplePos', this.wpNamespace);
        writer.writeAttributeString(undefined, 'x', undefined, '0');
        writer.writeAttributeString(undefined, 'y', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('wp', 'positionH', this.wpNamespace);
        writer.writeAttributeString(undefined, 'relativeFrom', undefined, HelperMethods.formatText("firstlower", picture.horizontalOrigin.toString()));
        if (picture.horizontalAlignment === 'None') {
            writer.writeStartElement('wp', 'posOffset', this.wpNamespace);
            const horPos: number = Math.round(picture.horizontalPosition * this.emusPerPoint);
            writer.writeString(horPos.toString());
            writer.writeEndElement(); //end of posOffset
        } else {
            writer.writeStartElement('wp', 'align', this.wpNamespace);
            const horAlig: string = picture.horizontalAlignment.toString().toLowerCase();
            writer.writeString(horAlig);
            writer.writeEndElement(); //end of align
        }
        writer.writeEndElement(); //end of postionH
        writer.writeStartElement('wp', 'positionV', this.wpNamespace);
        writer.writeAttributeString(undefined, 'relativeFrom', undefined, HelperMethods.formatText("firstlower", picture.verticalOrigin.toString()));
        if (picture.verticalAlignment === 'None') {
            writer.writeStartElement('wp', 'posOffset', this.wpNamespace);
            const vertPos: number = Math.round(picture.verticalPosition * this.emusPerPoint);
            writer.writeString(vertPos.toString());
            writer.writeEndElement(); // end of posOffset
        } else {
            writer.writeStartElement('wp', 'align', this.wpNamespace);
            const verAlig: string = picture.verticalAlignment.toString().toLowerCase();
            writer.writeString(verAlig);
            writer.writeEndElement(); //end of align
        }
        writer.writeEndElement(); //end of postionV

        writer.writeStartElement(undefined, 'extent', this.wpNamespace);
        const cx: number = Math.round(picture.width * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        const cy: number = Math.round(picture.height * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement();

        if (!isNullOrUndefined(picture.imageString)) {
            // this.serializePicProperties(writer, draw);
            this.serializeShapeWrapStyle(writer, picture);
            this.serializeDrawingGraphics(writer, picture);
        } else {
            this.serializeShapeDrawingGraphics(writer, picture);
        }

        writer.writeEndElement(); // end of anchor
    }
    // Serialize the inline picture & Shape.
    private serializeInlinePictureAndShape(writer: XmlWriter, draw: any): void {
        writer.writeStartElement(undefined, 'inline', this.wpNamespace);
        this.writeDefaultDistAttribute(writer);
        writer.writeStartElement(undefined, 'extent', this.wpNamespace);
        const cx: number = Math.round(draw.width * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        const cy: number = Math.round(draw.height * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement();
        // double borderWidth = (double)picture.PictureShape.PictureDescriptor.BorderLeft.LineWidth / DLSConstants.BorderLineFactor;
        // if (borderWidth > 0 && picture.DocxProps.length === 0) {
        //     long leftTop = 0, rightBottom = 0;
        //     picture.PictureShape.GetEffectExtent(borderWidth, ref leftTop, ref rightBottom);
        //     m_writer.WriteStartElement('effectExtent', WP_namespace);
        //     m_writer.WriteAttributeString('l', leftTop.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteAttributeString('t', leftTop.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteAttributeString('r', rightBottom.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteAttributeString('b', rightBottom.ToString(CultureInfo.InvariantCulture));
        //     m_writer.WriteEndElement();
        // }
        //this.serializePicProperties(writer, image);

        if (!isNullOrUndefined(draw.imageString)) {
            this.serializeShapeWrapStyle(writer, draw);
            this.serializeDrawingGraphics(writer, draw);
        } else {
            this.serializeShapeDrawingGraphics(writer, draw);
        }
        writer.writeEndElement();
    }
    private serializePictureAndShapeDistance(writer: XmlWriter, draw: any): void {
        let top: string = draw.distanceTop ? Math.round(draw.distanceTop * this.emusPerPoint).toString() : '0';
        writer.writeAttributeString(undefined, 'distT', undefined, top);
        let bottom: string = draw.distanceBottom ? Math.round(draw.distanceBottom * this.emusPerPoint).toString() : '0';
        writer.writeAttributeString(undefined, 'distB', undefined, bottom);
        let left: string = draw.distanceLeft ? Math.round(draw.distanceLeft * this.emusPerPoint).toString() : '114300';
        writer.writeAttributeString(undefined, 'distL', undefined, left);
        let right: string = draw.distanceRight ? Math.round(draw.distanceRight * this.emusPerPoint).toString() : '114300';
        writer.writeAttributeString(undefined, 'distR', undefined, right);
    }
    private writeDefaultDistAttribute(writer: XmlWriter): void {
        writer.writeAttributeString(undefined, 'distT', undefined, '0');
        writer.writeAttributeString(undefined, 'distB', undefined, '0');
        writer.writeAttributeString(undefined, 'distL', undefined, '0');
        writer.writeAttributeString(undefined, 'distR', undefined, '0');
    }
    // serialize inline chart
    private serializeInlineCharts(writer: XmlWriter, item: any): void {
        writer.writeStartElement(undefined, 'inline', this.wpNamespace);
        this.writeDefaultDistAttribute(writer);
        writer.writeStartElement(undefined, 'extent', this.wpNamespace);
        const cx: number = Math.round(item.width * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        const cy: number = Math.round(item.height * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement(); // end of wp:extend
        writer.writeStartElement(undefined, 'effectExtent', this.wpNamespace);
        writer.writeAttributeString(undefined, 'l', undefined, '0');
        writer.writeAttributeString(undefined, 't', undefined, '0');
        writer.writeAttributeString(undefined, 'r', undefined, '0');
        writer.writeAttributeString(undefined, 'b', undefined, '0');
        writer.writeEndElement(); // end of wp: effectExtent
        this.serializeDrawingGraphicsChart(writer, item);
        writer.writeEndElement(); // end of inline
    }
    // Serialize the graphics element for chart.
    private serializeDrawingGraphicsChart(writer: XmlWriter, chart: any): void {
        let id: string = '';

        id = this.updatechartId(chart);
        // Processing chart
        writer.writeStartElement('wp', 'docPr', this.wpNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, (this.mDocPrID++).toString());
        writer.writeAttributeString(undefined, 'name', undefined, this.getNextChartName());
        writer.writeEndElement(); // end of wp docPr
        writer.writeStartElement('wp', 'cNvGraphicFramePr', this.wpNamespace);
        writer.writeEndElement(); // end of cNvGraphicFramePr

        writer.writeStartElement('a', 'graphic', this.aNamespace);
        writer.writeStartElement('a', 'graphicData', this.aNamespace);
        writer.writeAttributeString(undefined, 'uri', undefined, this.chartNamespace);

        writer.writeStartElement('c', 'chart', this.chartNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('r', 'id', undefined, id);
        writer.writeEndElement(); // end of chart


        writer.writeEndElement(); // end of graphic data
        writer.writeEndElement(); // end of graphic
    }
    private getNextChartName(): string {
        return 'Chart' + (++this.chartCount);
    }
    // serialize chart
    private serializeChart(writer: XmlWriter, chart: any): void {
        writer.writeStartElement('w', 'r', this.wNamespace);
        this.serializeCharacterFormat(writer, chart.characterFormat);
        this.serializeDrawing(writer, chart);
        writer.writeEndElement();
    }
    private serializeChartStructure(): void {
        this.serializeChartXML();
        this.serializeChartColors();
        this.serializeChartExcelData();
        this.serializeChartRelations();
        this.chart = undefined;
        this.saveExcel();
    }
    // serialize Chart.xml
    private serializeChartXML(): void {
        let chartPath: string = '';
        const writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('c', 'chartSpace', this.chartNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'c16r2', undefined, this.c15Namespace);

        this.serializeChartData(writer, this.chart);
        writer.writeStartElement('c', 'externalData', this.chartNamespace);
        writer.writeAttributeString('r', 'id', undefined, 'rId1');
        writer.writeStartElement('c', 'autoUpdate', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of autoUpdate
        writer.writeEndElement(); // end of externalData
        writer.writeEndElement(); // end of chartSpace
        chartPath = this.chartPath + '/chart' + this.chartCount + '.xml';
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, chartPath);
        this.mArchive.addItem(zipArchiveItem);
    }
    // serialize chart colors.xml
    private serializeChartColors(): void {
        const writer: XmlWriter = new XmlWriter();
        let colorPath: string = '';
        writer.writeStartElement('cs', 'colorStyle', this.csNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeAttributeString(undefined, 'meth', undefined, 'cycle');
        writer.writeAttributeString(undefined, 'id', undefined, '10');

        this.serializeChartColor(writer);
        colorPath = this.chartPath + '/colors' + this.chartCount + '.xml';

        writer.writeEndElement(); // end of cs:colorStyle chart color

        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, colorPath);
        this.mArchive.addItem(zipArchiveItem);
        colorPath = '';
    }
    private serializeChartColor(writer: XmlWriter): void {
        for (let i: number = 1; i <= 6; i++) {
            writer.writeStartElement('a', 'schemeClr', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'accent' + i);
            writer.writeEndElement(); // end of a:schemeClr
        }
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '60000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '80000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '20000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '80000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '60000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '40000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '50000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '70000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '30000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '70000');
        writer.writeEndElement(); // end of lumMod
        writer.writeEndElement(); // end of cs:variation
        writer.writeStartElement('cs', 'variation', this.csNamespace);
        writer.writeStartElement('a', 'lumMod', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '50000');
        writer.writeEndElement(); // end of lumMod
        writer.writeStartElement('a', 'lumOff', this.aNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '50000');
        writer.writeEndElement(); // end of lumoff
        writer.writeEndElement(); // end of cs:variation
    }
    // serialize chart Excel Data
    private serializeChartExcelData(): void {
        if (isNullOrUndefined(this.excelFiles)) {
            this.excelFiles = new Dictionary<string, ZipArchive>();
        }
        this.mArchiveExcel = new ZipArchive();
        this.mArchiveExcel.compressionLevel = 'Normal';
        const type: string = this.chart.chartType;
        const isScatterType: boolean = (type === 'Scatter_Markers' || type === 'Bubble');
        this.serializeWorkBook();
        this.serializeSharedString(isScatterType);
        this.serializeExcelContentTypes();
        this.serializeExcelData(isScatterType);
        this.serializeExcelStyles();
        this.serializeExcelRelation();
        this.serializeExcelGeneralRelations();
        this.chartStringCount = 0;
    }

    private serializeWorkBook(): void {
        const writer: XmlWriter = new XmlWriter();
        const workbookPath: string = 'xl/workbook.xml';
        this.resetExcelRelationShipId();
        writer.writeStartElement(undefined, 'workbook', undefined);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        writer.writeStartElement(undefined, 'sheets', undefined);
        writer.writeStartElement(undefined, 'sheet', undefined);
        writer.writeAttributeString(undefined, 'name', undefined, 'Sheet1');
        writer.writeAttributeString(undefined, 'sheetId', undefined, '1');
        writer.writeAttributeString('r', 'id', undefined, this.getNextExcelRelationShipID());
        writer.writeEndElement(); // end of sheet
        writer.writeEndElement(); // end of sheets
        writer.writeEndElement(); // end of workbook

        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, workbookPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    }

    private serializeExcelStyles(): void {
        const writer: XmlWriter = new XmlWriter();
        const stylePath: string = 'xl/styles.xml';
        writer.writeStartElement(undefined, 'styleSheet', undefined);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'x14ac');
        writer.writeAttributeString('xmlns', 'x14ac', undefined, 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac');
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        writer.writeEndElement(); // end of styleSheet
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, stylePath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    }

    private serializeExcelData(isScatterType: boolean): void {
        // excel data
        let sheetPath: string = '';
        const writer: XmlWriter = new XmlWriter();
        writer.writeStartElement(undefined, 'worksheet', undefined);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'x14', undefined, this.spreadSheet9);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        this.serializeExcelSheet(writer, isScatterType);

        writer.writeEndElement(); // end of worksheet
        sheetPath = 'xl/worksheets' + '/sheet1.xml';
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, sheetPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    }
    private serializeSharedString(isScatterType: boolean): void {
        const chart: any = this.chart;
        const writer: XmlWriter = new XmlWriter();
        let sharedStringPath: string = '';
        const chartSharedString: string[] = [];
        const type: string = this.chart.chartType;
        const seriesLength: number = chart.chartSeries.length;
        for (let column: number = 0; column < seriesLength; column++) {
            const series: any = chart.chartSeries[column];
            const seriesName: string = series.seriesName;
            const isString: RegExpMatchArray = seriesName.match(/[a-z]/i);
            if (isScatterType && column === 0) {
                chartSharedString.push('X-Values');
            }
            if (isString) {
                chartSharedString.push(series.seriesName);
                this.chartStringCount++;
            }
        }
        if (type === 'Bubble') {
            chartSharedString.push('Size');
        }
        for (let row: number = 0; row < chart.chartCategory.length; row++) {
            const category: any = chart.chartCategory[row];
            const format: string = chart.chartPrimaryCategoryAxis.numberFormat;
            const categoryName: string = category.categoryXName;
            const isString: RegExpMatchArray = categoryName.match(/[a-z]/i);
            if (isString || format === 'm/d/yyyy') {
                chartSharedString.push(category.categoryXName);
                this.chartStringCount++;
            }
        }
        const uniqueCount: number = this.chartStringCount + 1;
        writer.writeStartElement(undefined, 'sst', undefined);
        writer.writeAttributeString('xmlns', undefined, undefined, this.spreadSheetNamespace);
        writer.writeAttributeString(undefined, 'count', undefined, uniqueCount.toString());
        writer.writeAttributeString(undefined, 'uniqueCount', undefined, uniqueCount.toString());
        for (let i: number = 0; i <= chartSharedString.length; i++) {
            writer.writeStartElement(undefined, 'si', undefined);
            writer.writeStartElement(undefined, 't', undefined);
            if (i !== chartSharedString.length) {
                writer.writeString(chartSharedString[i]);
            } else if (!isScatterType) {
                writer.writeAttributeString('xml', 'space', this.xmlNamespace, 'preserve');
                writer.writeString(' ');
            }
            writer.writeEndElement(); // end of t
            writer.writeEndElement(); // end of si
        }
        writer.writeEndElement(); // end of sst
        sharedStringPath = 'xl/sharedStrings' + '.xml';
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, sharedStringPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    }
    // excel sheet data
    private serializeExcelSheet(writer: XmlWriter, isScatterType: boolean): void {
        const chart: any = this.chart;
        let type: string = 's';
        const isBubbleType: boolean = (chart.chartType === 'Bubble');
        let bubbleLength: number;
        const categoryLength: number = chart.chartCategory.length + 1;
        const format: string = chart.chartPrimaryCategoryAxis.numberFormat;
        let seriesLength: number = chart.chartSeries.length + 1;
        if (isBubbleType) {
            bubbleLength = seriesLength;
            seriesLength = seriesLength + 1;
        }
        let category: any = undefined;
        let series: any = undefined;
        let count: number = 0;
        writer.writeStartElement(undefined, 'sheetData', undefined);
        for (let row: number = 0; row < categoryLength; row++) {
            writer.writeStartElement(undefined, 'row', undefined);
            writer.writeAttributeString(undefined, 'r', undefined, (row + 1).toString());
            for (let column: number = 0; column < seriesLength; column++) {
                const alphaNumeric: string = String.fromCharCode('A'.charCodeAt(0) + column) + (row + 1).toString();
                writer.writeStartElement(undefined, 'c', undefined);
                writer.writeAttributeString(undefined, 'r', undefined, alphaNumeric);
                if (row !== 0 && column === 0) {
                    category = chart.chartCategory[row - 1];
                    const categoryName: string = category.categoryXName;
                    const isString: RegExpMatchArray = categoryName.match(/[a-z]/i);
                    if (isNullOrUndefined(isString) && format === 'm/d/yyyy') {
                        type = 's';
                    } else if ((!isString && !isNullOrUndefined(isString)) || isScatterType) {
                        type = 'n';
                    } else {
                        type = 's';
                    }
                } else if (row === 0 && column !== 0 && column !== (bubbleLength)) {
                    series = chart.chartSeries[column - 1];
                    const seriesName: string = series.seriesName;
                    const isString: RegExpMatchArray = seriesName.match(/[a-z]/i);
                    if (!isString) {
                        type = 'n';
                    } else {
                        type = 's';
                    }
                } else if (row === 0 && isBubbleType && column === (bubbleLength)) {
                    type = 's';
                } else if (row === 0 && column === 0) {
                    type = 's';
                } else {
                    type = 'n';
                }
                writer.writeAttributeString(undefined, 't', undefined, type);
                writer.writeStartElement(undefined, 'v', undefined);
                if (row === 0 && column === 0 && !isScatterType) {
                    writer.writeString(this.chartStringCount.toString());
                } else if (type === 's') {
                    writer.writeString(count.toString());
                    count++;
                } else if (row !== 0 && type !== 's' && column === 0 && column !== (bubbleLength)) {
                    writer.writeString(category.categoryXName);
                } else if (column !== 0 && type !== 's' && row === 0 && column !== (bubbleLength)) {
                    writer.writeString(series.seriesName);
                } else if (column !== 0 && column !== (bubbleLength)) {
                    const data: any = category.chartData[column - 1];
                    const yValue: any = data.yValue;
                    writer.writeString(yValue.toString());
                } else if (isBubbleType && column === (bubbleLength)) {
                    const data: any = category.chartData[column - 2];
                    const size: any = data.size;
                    writer.writeString(size.toString());
                }
                writer.writeEndElement(); // end of v[value]
                writer.writeEndElement(); // end of c[column]
                type = '';
            }
            writer.writeEndElement(); // end of row
        }
        writer.writeEndElement(); // end of sheetData
    }
    // excel content types
    private serializeExcelContentTypes(): void {
        const writer: XmlWriter = new XmlWriter();
        writer.writeStartElement(undefined, 'Types', 'http://schemas.openxmlformats.org/package/2006/content-types');
        this.serializeDefaultContentType(writer, 'xml', this.xmlContentType);
        this.serializeDefaultContentType(writer, 'rels', this.relationContentType);
        this.serializeOverrideContentType(writer, 'xl/styles.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml');
        this.serializeOverrideContentType(writer, 'xl/workbook.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
        // this.serializeOverrideContentType(writer, '/docProps/app.xml', 'application/vnd.openxmlformats-officedocument.extended-properties+xml');
        // this.serializeOverrideContentType(writer, '/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml');
        this.serializeOverrideContentType(writer, 'xl/sharedStrings.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml');
        this.serializeOverrideContentType(writer, 'xl/worksheets/sheet1.xml', 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml');
        writer.writeEndElement(); // end of types tag

        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.contentTypesPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    }

    private serializeExcelRelation(): void {
        const writer: XmlWriter = new XmlWriter();
        this.resetExcelRelationShipId();
        const worksheetType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet';
        const sharedStringType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings';
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), worksheetType, 'worksheets/sheet1.xml');
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), this.stylesRelType, 'styles.xml');
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), sharedStringType, 'sharedStrings.xml');
        writer.writeEndElement(); // end of relationships
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.excelRelationPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    }

    private serializeExcelGeneralRelations(): void {
        const writer: XmlWriter = new XmlWriter();
        this.resetExcelRelationShipId();
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextExcelRelationShipID(), this.documentRelType, 'xl/workbook.xml');
        writer.writeEndElement(); // end of relationships
        const zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.generalRelationPath);
        this.mArchiveExcel.addItem(zipArchiveItem);
    }

    // get the next Excel relationship ID
    private getNextExcelRelationShipID(): string {
        return 'rId' + (++this.eRelationShipId);
    }

    // get the next Chart relationship ID
    private getNextChartRelationShipID(): string {
        return 'rId' + (++this.cRelationShipId);
    }

    //  chart data
    private serializeChartData(writer: XmlWriter, chart: any): void {
        writer.writeStartElement('c', 'date1904', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('c', 'lang', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'en-US');
        writer.writeEndElement();
        writer.writeStartElement('c', 'roundedCorners', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement();

        writer.writeStartElement('mc', 'AlternateContent', this.veNamespace);
        writer.writeStartElement('mc', 'Choice', this.veNamespace);
        writer.writeAttributeString('xmlns', 'c14', undefined, this.c7Namespace);
        writer.writeAttributeString(undefined, 'Requires', undefined, 'c14');
        writer.writeStartElement('c14', 'style', undefined);
        writer.writeAttributeString(undefined, 'val', undefined, '102');
        writer.writeEndElement(); // c14 style end
        writer.writeEndElement(); // mc:choice ened
        writer.writeStartElement('mc', 'Fallback', this.veNamespace);
        writer.writeStartElement('c', 'style', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '2');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement(); // end tag of mc alternate content

        writer.writeStartElement('c', 'chart', this.chartNamespace);
        if (!isNullOrUndefined(this.chart.chartTitle)) {
            writer.writeStartElement('c', 'title', this.chartNamespace);
            this.serializeTextProperties(writer, this.chart.chartTitleArea, this.chart.chartTitle);
            writer.writeEndElement(); // end tag of title
        }
        // serialize plot area
        this.serializeChartPlotArea(writer, chart);
        writer.writeEndElement(); // end tag of chart

        this.serializeShapeProperties(writer, 'D9D9D9', true);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeAttributeString('xmlns', 'c', undefined, this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeEndElement(); // end tag of bodyPr
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeEndElement(); // end of a:lstStyle
        writer.writeStartElement('a', 'p', this.aNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeStartElement('a', 'pPr', this.aNamespace);
        writer.writeStartElement('a', 'defRPr', this.aNamespace);
        writer.writeEndElement(); // end tag of defRPr
        writer.writeEndElement(); // end tag of pPr
        writer.writeStartElement('a', 'endParaRPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'lang', undefined, 'en-US');
        writer.writeEndElement(); // end of a:endParaRPr
        writer.writeEndElement(); // end tag of p
        writer.writeEndElement(); // end tag of txPr
    }
    //  chart plot area
    /* eslint-disable */
    private serializeChartPlotArea(writer: XmlWriter, chart: any): void {
        writer.writeStartElement('c', 'autoTitleDeleted', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of autoTitleDeleted
        writer.writeStartElement('c', 'plotArea', this.chartNamespace);
        writer.writeStartElement('c', 'layout', this.chartNamespace);
        writer.writeEndElement();
        // chart Type
        let serializationChartType: string = this.chartType(chart);
        let isPieTypeSerialization: boolean = (serializationChartType === 'pieChart' || serializationChartType === 'doughnutChart');
        let isScatterType: boolean = (serializationChartType === 'scatterChart' || serializationChartType === 'bubbleChart');
        writer.writeStartElement('c', serializationChartType, this.chartNamespace);
        if (serializationChartType === 'barChart') {
            let barDiv: string = '';
            if (chart.chartType === 'Column_Clustered' || chart.chartType === 'Column_Stacked'
                || chart.chartType === 'Column_Stacked_100') {
                barDiv = 'col';
            } else {
                barDiv = 'bar';
            }
            writer.writeStartElement('c', 'barDir', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, barDiv);
            writer.writeEndElement(); // end of barDir
        }
        if (!isPieTypeSerialization && !isScatterType) {
            let grouping: string = this.chartGrouping(chart.chartType);
            writer.writeStartElement('c', 'grouping', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, grouping);
            writer.writeEndElement(); // end of grouping
        }
        if (serializationChartType === 'scatterChart') {
            writer.writeStartElement('c', 'scatterStyle', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'marker');
            writer.writeEndElement(); // end of scatterStyle
        }
        writer.writeStartElement('c', 'varyColors', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c:varyColors
        let valueSheet: string = '';
        for (let i: number = 0; i < chart.chartSeries.length; i++) {
            let series: any = chart.chartSeries[i];
            this.seriesCount = i;
            writer.writeStartElement('c', 'ser', this.chartNamespace);
            writer.writeStartElement('c', 'idx', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, i.toString());
            writer.writeEndElement(); // end of c:idx
            writer.writeStartElement('c', 'order', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, i.toString());
            writer.writeEndElement(); // end of c:order
            writer.writeStartElement('c', 'tx', this.chartNamespace);
            writer.writeStartElement('c', 'strRef', this.chartNamespace);
            writer.writeStartElement('c', 'f', this.chartNamespace);
            let alphaNumeric: string = String.fromCharCode('B'.charCodeAt(0) + i);
            valueSheet = 'Sheet1!$' + alphaNumeric;
            writer.writeString(valueSheet + '$1');
            valueSheet = valueSheet + '$2:$' + alphaNumeric + '$';
            writer.writeEndElement(); // end of c:f
            writer.writeStartElement('c', 'strCache', this.chartNamespace);
            writer.writeStartElement('c', 'ptCount', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '1');
            writer.writeEndElement(); // end of ptCount
            writer.writeStartElement('c', 'pt', this.chartNamespace);
            writer.writeAttributeString(undefined, 'idx', undefined, '0');
            writer.writeStartElement('c', 'v', this.chartNamespace);
            writer.writeString(series.seriesName);
            writer.writeEndElement(); // end of c:v
            writer.writeEndElement(); // end of pt
            writer.writeEndElement(); // end of strCache
            writer.writeEndElement(); // end of strRef
            writer.writeEndElement(); // end of tx
            if (chart.chartType === 'Pie' || chart.chartType === 'Doughnut') {
                this.parseChartDataPoint(writer, series);
                writer.writeStartElement('c', 'explosion', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, '0');
                writer.writeEndElement(); // end of explosion
            } else if (!isScatterType) {
                this.parseChartSeriesColor(writer, series.dataPoints, serializationChartType);
            }
            if (serializationChartType === 'scatterChart') {
                let fillColor: string = series.dataPoints[0].fill.foreColor;
                writer.writeStartElement('c', 'marker', this.chartNamespace);
                writer.writeStartElement('c', 'symbol', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, 'circle');
                writer.writeEndElement(); // end of a: symbol
                writer.writeStartElement('c', 'size', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, '5');
                writer.writeEndElement(); // end of a: size
                this.serializeShapeProperties(writer, fillColor, false);
                writer.writeEndElement(); // end of a: marker
            }
            if (series.dataLabel) {
                this.parseChartDataLabels(writer, series.dataLabel);
            }
            if (series.trendLines) {
                this.parseChartTrendLines(writer, series);
            }
            if (series.errorBar) {
                this.serializeChartErrorBar(writer, series);
            }
            if (serializationChartType === 'scatterChart') {
                this.serializeDefaultShapeProperties(writer);
            } else if (serializationChartType === 'bubbleChart') {
                this.serializeShapeProperties(writer, series.dataPoints[i].fill.foreColor, false);
            }
            let categoryType: string = 'cat';
            let categoryRef: string = 'strRef';
            let cacheType: string = 'strCache';
            if (serializationChartType === 'scatterChart') {
                categoryType = 'xVal';
                categoryRef = 'numRef';
                cacheType = 'numCache';
            }
            writer.writeStartElement('c', categoryType, this.chartNamespace);
            writer.writeStartElement('c', categoryRef, this.chartNamespace);
            this.serializeChartCategory(writer, chart, cacheType); // serialize chart yvalue
            writer.writeEndElement(); // end of categoryRef
            writer.writeEndElement(); // end of cat
            this.serializeChartValue(writer, valueSheet, serializationChartType);
            writer.writeEndElement(); // end of c:ser
        }

        writer.writeStartElement('c', 'dLbls', this.chartNamespace);
        if (isPieTypeSerialization) {
            writer.writeStartElement('c', 'dLblPos', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'bestFit');
            writer.writeEndElement(); // end of dLblPos
        }
        writer.writeStartElement('c', 'showLegendKey', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showLegendKey
        writer.writeStartElement('c', 'showVal', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showVal
        writer.writeStartElement('c', 'showCatName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showCatName
        writer.writeStartElement('c', 'showSerName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showSerName
        writer.writeStartElement('c', 'showPercent', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showPercent
        writer.writeStartElement('c', 'showBubbleSize', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: showBubbleSize
        writer.writeStartElement('c', 'showLeaderLines', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '1');
        writer.writeEndElement(); // end of c: showLeaderLines
        writer.writeEndElement(); // end of c: dLbls
        if (isPieTypeSerialization) {
            let series: any = this.chart.chartSeries[0];
            let sliceAngle: number = 0;
            let holeSize: number = 0;
            if (series.hasOwnProperty('firstSliceAngle')) {
                sliceAngle = series.firstSliceAngle;
            }
            writer.writeStartElement('c', 'firstSliceAng', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, sliceAngle.toString());
            writer.writeEndElement(); // end of c: firstSliceAng
            if (chart.chartType === 'Doughnut') {
                holeSize = series.holeSize;
                writer.writeStartElement('c', 'holeSize', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, holeSize.toString());
                writer.writeEndElement(); // end of c: holeSize
            }
        }
        if (serializationChartType !== 'lineChart' && !isScatterType) {
            writer.writeStartElement('c', 'gapWidth', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, this.chart.gapWidth.toString());
            writer.writeEndElement(); // end of gapWidth
            writer.writeStartElement('c', 'overlap', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, this.chart.overlap.toString());
            writer.writeEndElement(); // end of overlap
        } else if (serializationChartType !== 'bubbleChart') {
            writer.writeStartElement('c', 'smooth', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of smooth
        }
        if (serializationChartType === 'bubbleChart') {
            writer.writeStartElement('c', 'sizeRepresents', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'area');
            writer.writeEndElement(); // end of smooth
        }
        let type: string = this.chart.chartType;
        if (!isPieTypeSerialization) {
            writer.writeStartElement('c', 'axId', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '335265000');
            writer.writeEndElement(); // end of axId
            writer.writeStartElement('c', 'axId', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '335263360');
            writer.writeEndElement(); // end of axId
        }
        writer.writeEndElement(); // end of chart type
        let isStackedPercentage: boolean = (type === 'Column_Stacked_100' || type === 'Area_Stacked_100' ||
            type === 'Bar_Stacked_100' || type === 'Line_Stacked_100' || type === 'Line_Markers_Stacked_100');
        let format: string = this.chart.chartPrimaryCategoryAxis.categoryType;
        if (!isPieTypeSerialization) {
            this.serializeCategoryAxis(writer, format, isStackedPercentage);
            this.serializeValueAxis(writer, format, isStackedPercentage);
        }
        if (this.chart.hasOwnProperty('chartDataTable')) {
            let dataTable: any = this.chart.chartDataTable;
            let showHorzBorder: number = 0;
            let showVertBorder: number = 0;
            let showOutline: number = 0;
            let showKeys: number = 0;
            if (dataTable.showSeriesKeys) {
                showKeys = 1;
            }
            if (dataTable.hasHorzBorder) {
                showHorzBorder = 1;
            }
            if (dataTable.hasVertBorder) {
                showVertBorder = 1;
            }
            if (dataTable.hasBorders) {
                showOutline = 1;
            }
            writer.writeStartElement('c', 'dTable', this.chartNamespace);
            writer.writeStartElement('c', 'showHorzBorder', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showHorzBorder.toString());
            writer.writeEndElement(); // end of showHorzBorder
            writer.writeStartElement('c', 'showVertBorder', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showVertBorder.toString());
            writer.writeEndElement(); // end of showVertBorder
            writer.writeStartElement('c', 'showOutline', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showOutline.toString());
            writer.writeEndElement(); // end of showOutline
            writer.writeStartElement('c', 'showKeys', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, showKeys.toString());
            writer.writeEndElement(); // end of showKeys
            writer.writeEndElement(); // end of dTable
        }

        this.serializeDefaultShapeProperties(writer);


        writer.writeEndElement(); // end of plot area

        // legend
        if (!isNullOrUndefined(this.chart.chartLegend.position)) {
            this.serializeChartLegend(writer);
        }

        writer.writeStartElement('c', 'plotVisOnly', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '1');
        writer.writeEndElement(); // end of c: plotVisOnly
        writer.writeStartElement('c', 'dispBlanksAs', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'gap');
        writer.writeEndElement(); // end of c: dispBlanksAs
    }
    private serializeChartLegend(writer: XmlWriter): void {
        let legendPosition: string = this.chartLegendPosition(this.chart.chartLegend);
        let title: any = this.chart.chartLegend.chartTitleArea;
        let fill: any = title.dataFormat.fill.foreColor;
        writer.writeStartElement('c', 'legend', this.chartNamespace);
        writer.writeStartElement('c', 'legendPos', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, legendPosition);
        writer.writeEndElement();
        writer.writeStartElement('c', 'overlay', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement();
        this.serializeDefaultShapeProperties(writer);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement();
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement();
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, title.fontSize, fill, title.fontName);
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
    }
    private serializeChartErrorBar(writer: XmlWriter, series: any): void {
        let errorBar: any = series.errorBar;
        let errorBarValueType: string = this.errorBarValueType(errorBar.type);
        let endStyle: number = 0;
        if (errorBar.endStyle !== 'Cap') {
            endStyle = 1;
        }
        writer.writeStartElement('c', 'errBars', this.chartNamespace);
        writer.writeStartElement('c', 'errBarType', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, errorBar.direction.toLowerCase());
        writer.writeEndElement(); // end of c: errBarType
        writer.writeStartElement('c', 'errValType', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, errorBarValueType);
        writer.writeEndElement(); // end of c: errValType
        writer.writeStartElement('c', 'noEndCap', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, endStyle.toString());
        writer.writeEndElement(); // end of c: noEndCap
        writer.writeStartElement('c', 'val', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, errorBar.numberValue.toString());
        writer.writeEndElement(); // end of c: val
        this.serializeShapeProperties(writer, '595959', true);

        writer.writeEndElement(); // end of c: errBars
    }
    private errorBarValueType(type: string): string {
        let valueType: string = '';
        switch (type) {
            case 'StandardError':
                valueType = 'stdErr';
                break;
            case 'StandardDeviation':
                valueType = 'stdDev';
                break;
            case 'Percentage':
                valueType = 'percentage';
                break;
            case 'Fixed':
                valueType = 'fixedVal';
                break;
            default:
                valueType = 'stdErr';
                break;
        }
        return valueType;
    }
    private serializeCategoryAxis(writer: XmlWriter, format: string, isStackedPercentage: boolean): void {
        // serialize category axis
        let axisType: string = 'catAx';
        let formatCode: string = this.chart.chartPrimaryCategoryAxis.numberFormat;
        let type: string = this.chart.chartType;
        let isScatterType: boolean = (type === 'Scatter_Markers' || type === 'Bubble');
        if (format === 'Time') {
            axisType = 'dateAx';
        }
        if (isScatterType) {
            axisType = 'valAx';
        }
        writer.writeStartElement('c', axisType, this.chartNamespace);
        writer.writeStartElement('c', 'axId', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '335265000');
        writer.writeEndElement(); // end of axId
        this.serializeAxis(writer, '335263360', this.chart.chartPrimaryCategoryAxis, formatCode, isStackedPercentage);
        if (!isScatterType) {
            writer.writeStartElement('c', 'auto', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '1');
            writer.writeEndElement(); // end of auto
            writer.writeStartElement('c', 'lblAlgn', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'ctr');
            writer.writeEndElement(); // end of lblAlgn
            writer.writeStartElement('c', 'lblOffset', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '100');
            writer.writeEndElement(); // end of lblOffset
        }
        if (format === 'Time') {
            writer.writeStartElement('c', 'baseTimeUnit', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'days');
            writer.writeEndElement(); // end of baseTimeUnit
        } else if (this.chart.chartType !== 'Bubble') {
            writer.writeStartElement('c', 'noMultiLvlLbl', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of noMultiLvlLbl
        }
        writer.writeEndElement(); // end of catAx
    }
    private serializeValueAxis(writer: XmlWriter, format: string, isStackedPercentage: boolean): void {
        // serialize category axis
        let valueAxis: any = this.chart.chartPrimaryValueAxis;
        let crossBetween: string = 'between';
        if (format === 'Time') {
            crossBetween = 'midCat';
        }
        writer.writeStartElement('c', 'valAx', this.chartNamespace);
        writer.writeStartElement('c', 'axId', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '335263360');
        writer.writeEndElement(); // end of axId
        this.serializeAxis(writer, '335265000', valueAxis, 'General', isStackedPercentage);
        writer.writeStartElement('c', 'crossBetween', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, crossBetween);
        writer.writeEndElement(); // end of crossBetween
        if (valueAxis.majorUnit !== 0 && !isStackedPercentage) {
            writer.writeStartElement('c', 'majorUnit', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, valueAxis.majorUnit.toString());
            writer.writeEndElement(); // end of majorUnit
        }
        writer.writeEndElement(); // end of valAx
    }
    private serializeAxis(writer: XmlWriter, axisID: string, axis: any, formatCode: string, isStackedPercentage: boolean): void {
        let majorTickMark: string = 'none';
        let minorTickMark: string = 'none';
        let tickLabelPosition: string = 'nextTo';
        writer.writeStartElement('c', 'scaling', this.chartNamespace);
        writer.writeStartElement('c', 'orientation', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'minMax');
        writer.writeEndElement(); // end of orientation
        if (axis.maximumValue !== 0 && !isStackedPercentage) {
            writer.writeStartElement('c', 'max', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, axis.maximumValue.toString());
            writer.writeEndElement(); // end of max
            writer.writeStartElement('c', 'min', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, axis.minimumValue.toString());
            writer.writeEndElement(); // end of min
        }
        writer.writeEndElement(); // end of scaling
        writer.writeStartElement('c', 'delete', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of delete
        writer.writeStartElement('c', 'axPos', this.chartNamespace);
        if (axisID === '335265000') {
            writer.writeAttributeString(undefined, 'val', undefined, 'l');
        } else {
            writer.writeAttributeString(undefined, 'val', undefined, 'b');
        }
        writer.writeEndElement(); // end of axPos
        if (axis.hasMajorGridLines) {
            writer.writeStartElement('c', 'majorGridlines', this.chartNamespace);
            this.serializeShapeProperties(writer, 'D9D9D9', true);
            writer.writeEndElement(); // end of majorGridlines
        }
        if (axis.hasMinorGridLines) {
            writer.writeStartElement('c', 'minorGridlines', this.chartNamespace);
            this.serializeShapeProperties(writer, 'F2F2F2', true);
            writer.writeEndElement(); // end of minorGridlines
        }
        if (axis.chartTitle) {
            writer.writeStartElement('c', 'title', this.chartNamespace);
            this.serializeTextProperties(writer, axis.chartTitleArea, axis.chartTitle);
            writer.writeEndElement(); // end tag of title
        }
        writer.writeStartElement('c', 'numFmt', this.chartNamespace);
        writer.writeAttributeString(undefined, 'formatCode', undefined, formatCode);
        writer.writeAttributeString(undefined, 'sourceLinked', undefined, '1');
        writer.writeEndElement(); // end of numFmt
        writer.writeStartElement('c', 'majorTickMark', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, majorTickMark);
        writer.writeEndElement(); // end of majorTickMark
        writer.writeStartElement('c', 'minorTickMark', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, minorTickMark);
        writer.writeEndElement(); // end of minorTickMark
        writer.writeStartElement('c', 'tickLblPos', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, tickLabelPosition);
        writer.writeEndElement(); // end of tickLblPos
        if (this.chart.chartType === 'Bubble') {
            this.serializeShapeProperties(writer, 'BFBFBF', true);
        } else {
            this.serializeDefaultShapeProperties(writer);
        }
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement(); // end of bodyPr
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, axis.fontSize, '595959', axis.fontName);
        writer.writeEndElement(); // end of a: p
        writer.writeEndElement(); // end of c: txPr
        writer.writeStartElement('c', 'crossAx', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, axisID);
        writer.writeEndElement(); // end of crossAx
        writer.writeStartElement('c', 'crosses', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, 'autoZero');
        writer.writeEndElement(); // end of crosses
    }
    private parseChartTrendLines(writer: XmlWriter, series: any): void {
        for (let i: number = 0; i < series.trendLines.length; i++) {
            let data: any = series.trendLines[i];
            let type: string = this.chartTrendLineType(data.type);
            let dispRSqr: number = 0;
            let dispEq: number = 0;
            if (data.isDisplayEquation) {
                dispEq = 1;
            } else if (data.isDisplayRSquared) {
                dispRSqr = 1;
            }
            let solidFill: any = series.dataPoints[i];
            writer.writeStartElement('c', 'trendline', this.chartNamespace);
            writer.writeStartElement('c', 'spPr', this.chartNamespace);
            writer.writeStartElement('a', 'ln', this.aNamespace);
            writer.writeAttributeString(undefined, 'w', undefined, '19050');
            this.serializeChartSolidFill(writer, solidFill.fill.foreColor, false);
            writer.writeStartElement('a', 'prstDash', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'sysDot');
            writer.writeEndElement(); // end of a: prstDash
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement(); // end of a: round
            writer.writeEndElement(); // end of a: ln
            writer.writeEndElement(); // end of c: spPr
            writer.writeStartElement('c', 'trendlineType', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, type);
            writer.writeEndElement(); // end of c: trendlineType
            writer.writeStartElement('c', 'forward', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, data.forward.toString());
            writer.writeEndElement(); // end of c: forward
            writer.writeStartElement('c', 'backward', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, data.backward.toString());
            writer.writeEndElement(); // end of c: backward
            if (data.intercept !== 'NaN') {
                writer.writeStartElement('c', 'intercept', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, data.intercept.toString());
                writer.writeEndElement(); // end of c: intercept
            }
            writer.writeStartElement('c', 'dispRSqr', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, dispRSqr.toString());
            writer.writeEndElement(); // end of c: dispRSqr
            writer.writeStartElement('c', 'dispEq', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, dispEq.toString());
            writer.writeEndElement(); // end of c: dispEq
            writer.writeEndElement(); // end of c: trendline
        }
    }
    private chartTrendLineType(type: string): string {
        let trendlineType: string = '';
        switch (type) {
            case 'Linear':
                trendlineType = 'linear';
                break;
            case 'Exponential':
                trendlineType = 'exp';
                break;
        }
        return trendlineType;
    }
    private parseChartDataLabels(writer: XmlWriter, dataLabels: any): void {
        let position: string = '';
        let dataLabelPosition: string = dataLabels.position;
        let isLegendKey: number = 0;
        let isBubbleSize: number = 0;
        let isCategoryName: number = 0;
        let isSeriesName: number = 0;
        let isValue: number = 0;
        let isPercentage: number = 0;
        let isLeaderLines: number = 0;
        switch (dataLabelPosition) {
            case 'Center':
                position = 'ctr';
                break;
            case 'Left':
                position = 'l';
                break;
            case 'Right':
                position = 'r';
                break;
            case 'Outside':
                position = 'outEnd';
                break;
            case 'BestFit':
                position = 'bestFit';
                break;
            case 'Bottom':
            case 'OutsideBase':
                position = 'inBase';
                break;
            case 'Inside':
                position = 'inEnd';
                break;
            case 'Above':
                position = 't';
                break;
            case 'Below':
                position = 'b';
                break;
            default:
                position = 'Automatic';
                break;
        }
        writer.writeStartElement('c', 'dLbls', this.chartNamespace);
        this.serializeDefaultShapeProperties(writer);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement(); //end of a:bodyPr.
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement(); //end of a:lstStyle.
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, dataLabels.fontSize, dataLabels.fontColor, dataLabels.fontName);
        writer.writeEndElement(); //end of a:p.
        writer.writeEndElement(); //end of c:txPr.
        if (dataLabels.isLegendKey) {
            isLegendKey = 1;
        } else if (dataLabels.isBubbleSize) {
            isBubbleSize = 1;
        } else if (dataLabels.isCategoryName) {
            isCategoryName = 1;
        } else if (dataLabels.isSeriesName) {
            isSeriesName = 1;
        } else if (dataLabels.isValue) {
            isValue = 1;
        } else if (dataLabels.isPercentage) {
            isPercentage = 1;
        } else if (dataLabels.isLeaderLines) {
            isLeaderLines = 1;
        }
        if (position !== 'Automatic') {
            writer.writeStartElement('c', 'dLblPos', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, position);
            writer.writeEndElement(); // end of dLblPos
        }
        writer.writeStartElement('c', 'showLegendKey', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isLegendKey.toString());
        writer.writeEndElement(); // end of showLegendKey
        writer.writeStartElement('c', 'showVal', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isValue.toString());
        writer.writeEndElement(); // end of showVal
        writer.writeStartElement('c', 'showCatName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isCategoryName.toString());
        writer.writeEndElement(); // end of showCatName
        writer.writeStartElement('c', 'showSerName', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isSeriesName.toString());
        writer.writeEndElement(); // end of showSerName
        writer.writeStartElement('c', 'showPercent', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isPercentage.toString());
        writer.writeEndElement(); // end of showPercent
        writer.writeStartElement('c', 'showBubbleSize', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isBubbleSize.toString());
        writer.writeEndElement(); // end of showBubbleSize
        writer.writeStartElement('c', 'showLeaderLines', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, isLeaderLines.toString());
        writer.writeEndElement(); // end of showBubbleSize
        writer.writeEndElement(); // end of dLbls
    }
    private serializeShapeProperties(writer: XmlWriter, color: string, isLine: boolean): void {
        let chartType: string = this.chart.chartType;
        let isScatterType: boolean = (chartType === 'Scatter_Markers' || chartType === 'Bubble');
        // serialize shape
        writer.writeStartElement('c', 'spPr', this.chartNamespace);
        if (!isScatterType || isLine) {
            writer.writeStartElement('a', 'ln', this.aNamespace);
            writer.writeAttributeString(undefined, 'w', undefined, '9525');
            this.serializeChartSolidFill(writer, color, false);
            writer.writeStartElement('a', 'prstDash', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, 'solid');
            writer.writeEndElement(); // end of prstDash
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement(); // end tag of round
            writer.writeEndElement(); // end tag of ln
        } else if (chartType === 'Scatter_Markers') {
            this.serializeChartSolidFill(writer, color, false);
            this.serializeDefaultLineProperties(writer);
        } else if (chartType === 'Bubble') {
            this.serializeChartSolidFill(writer, color, true);
            this.serializeDefaultLineProperties(writer);
        }
        writer.writeStartElement('a', 'effectLst', this.aNamespace);
        writer.writeEndElement(); // end of a: effectLst
        writer.writeEndElement(); // end tag of spPr
    }
    private serializeDefaultShapeProperties(writer: XmlWriter): void {
        writer.writeStartElement('c', 'spPr', this.chartNamespace);
        writer.writeStartElement('a', 'noFill', this.aNamespace);
        writer.writeEndElement(); // end of a: noFill
        this.serializeDefaultLineProperties(writer);
        writer.writeStartElement('a', 'effectLst', this.aNamespace);
        writer.writeEndElement(); // end of a: effectLst
        writer.writeEndElement(); // end of c: spPr
    }
    private serializeDefaultLineProperties(writer: XmlWriter): void {
        writer.writeStartElement('a', 'ln', this.aNamespace);
        writer.writeStartElement('a', 'noFill', this.aNamespace);
        writer.writeEndElement(); // end of a: noFill
        writer.writeStartElement('a', 'round', this.aNamespace);
        writer.writeEndElement(); // end of a: round
        writer.writeEndElement(); // end of a: ln
    }
    private serializeTextProperties(writer: XmlWriter, title: any, chartTitleName: string): void {
        let fill: string = title.dataFormat.fill.foreColor;
        let fontSize: number = title.fontSize * 100;
        writer.writeStartElement('c', 'tx', this.chartNamespace);
        writer.writeStartElement('c', 'rich', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'rot', undefined, '0');
        writer.writeAttributeString(undefined, 'vert', undefined, 'horz');
        writer.writeEndElement(); // end of a: bodyPr
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement(); // end of a:lstStyle
        writer.writeStartElement('a', 'p', this.aNamespace);
        this.serializeChartTitleFont(writer, title.fontSize, fill, title.fontName);
        writer.writeStartElement('a', 'r', this.aNamespace);
        writer.writeStartElement('a', 'rPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'lang', undefined, 'en-US');
        writer.writeAttributeString(undefined, 'b', undefined, '0');
        writer.writeAttributeString(undefined, 'sz', undefined, fontSize.toString());
        writer.writeAttributeString(undefined, 'baseline', undefined, '0');
        this.serializeChartSolidFill(writer, fill, false);
        this.serializeFont(writer, title.fontName);
        writer.writeEndElement(); // end of a: rPr
        writer.writeStartElement('a', 't', this.aNamespace);
        writer.writeString(chartTitleName);
        writer.writeEndElement(); // end of a:t
        writer.writeEndElement(); // end of a: r
        writer.writeEndElement(); // end of a: p
        writer.writeEndElement(); // end of c: rich
        writer.writeEndElement(); // end of c: tx
        writer.writeStartElement('c', 'layout', this.chartNamespace);
        // writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: layout
        writer.writeStartElement('c', 'overlay', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, '0');
        writer.writeEndElement(); // end of c: overlay
        this.serializeDefaultShapeProperties(writer);
        writer.writeStartElement('c', 'txPr', this.chartNamespace);
        writer.writeStartElement('a', 'bodyPr', this.aNamespace);
        writer.writeEndElement(); // end of a: bodyPr
        writer.writeStartElement('a', 'lstStyle', this.aNamespace);
        writer.writeEndElement(); // end of a: lstStyle
        writer.writeStartElement('a', 'p', this.aNamespace);
        writer.writeEndElement(); // end of a: p
        this.serializeChartTitleFont(writer, title.fontSize, fill, title.fontName);
        writer.writeEndElement(); // end of c: txPr
    }
    private serializeChartTitleFont(writer: XmlWriter, fontSize: number, fill: string, fontName: string): void {
        let fontSizeCalc: number = fontSize * 100;
        writer.writeStartElement('a', 'pPr', this.aNamespace);
        writer.writeStartElement('a', 'defRPr', this.aNamespace);
        writer.writeAttributeString(undefined, 'lang', undefined, 'en-US');
        writer.writeAttributeString(undefined, 'b', undefined, '0');
        writer.writeAttributeString(undefined, 'sz', undefined, fontSizeCalc.toString());
        writer.writeAttributeString(undefined, 'baseline', undefined, '0');
        this.serializeChartSolidFill(writer, fill, false);
        this.serializeFont(writer, fontName);
        writer.writeEndElement(); // end of defRPr
        writer.writeEndElement(); // end of a: pPr
    }
    private serializeChartSolidFill(writer: XmlWriter, fill: string, isSeriesFill: boolean): void {
        writer.writeStartElement('a', 'solidFill', this.aNamespace);
        writer.writeStartElement('a', 'srgbClr', this.aNamespace);
        if (fill !== '000000') {
            writer.writeAttributeString(undefined, 'val', undefined, fill);
        } else {
            writer.writeAttributeString(undefined, 'val', undefined, '595959');
        }
        if (this.chart.chartType === 'Bubble' && isSeriesFill) {
            writer.writeStartElement('a', 'alpha', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '75000');
            writer.writeEndElement(); // end of alpha
        }
        writer.writeEndElement(); // end of srgbClr
        writer.writeEndElement(); // end of solidFill
    }
    private serializeFont(writer: XmlWriter, fontName: string): void {
        writer.writeStartElement('a', 'latin', this.aNamespace);
        writer.writeAttributeString(undefined, 'typeface', undefined, fontName);
        writer.writeEndElement(); // end of a:latin
        writer.writeStartElement('a', 'ea', this.aNamespace);
        writer.writeAttributeString(undefined, 'typeface', undefined, fontName);
        writer.writeEndElement(); // end of a:ea
        writer.writeStartElement('a', 'cs', this.aNamespace);
        writer.writeAttributeString(undefined, 'typeface', undefined, fontName);
        writer.writeEndElement(); // end of a:cs
    }
    private parseChartSeriesColor(writer: XmlWriter, dataPoints: any, chartType: string): void {
        for (let i: number = 0; i < dataPoints.length; i++) {
            let data: any = dataPoints[i];
            writer.writeStartElement('c', 'spPr', this.chartNamespace);
            if (chartType === 'lineChart') {
                writer.writeStartElement('a', 'ln', this.aNamespace);
                writer.writeAttributeString(undefined, 'w', undefined, '28575');
                writer.writeAttributeString(undefined, 'cap', undefined, 'rnd');
            }
            if (chartType !== 'lineChart') {
                this.serializeChartSolidFill(writer, data.fill.foreColor, true);
            } else {
                this.serializeChartSolidFill(writer, data.line.color, true);
            }
            if (chartType !== 'lineChart') {
                writer.writeStartElement('a', 'ln', this.aNamespace);
                writer.writeStartElement('a', 'noFill', this.aNamespace);
                writer.writeEndElement(); // end of a: noFill
            }
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement(); // end of a: round
            writer.writeEndElement(); // end of a: ln
            writer.writeStartElement('a', 'effectLst', this.aNamespace);
            writer.writeEndElement(); // end of a: effectLst
            writer.writeEndElement(); // end of c: spPr
            if (chartType === 'lineChart') {
                let symbolType: string = 'none';
                let size: number = 0;
                if (this.chart.chartSeries[i].hasOwnProperty('seriesFormat')) {
                    symbolType = this.chart.chartSeries[i].seriesFormat.markerStyle;
                    size = this.chart.chartSeries[i].seriesFormat.markerSize;
                }
                writer.writeStartElement('c', 'marker', this.chartNamespace);
                writer.writeStartElement('c', 'symbol', this.chartNamespace);
                writer.writeAttributeString(undefined, 'val', undefined, symbolType.toLowerCase());
                writer.writeEndElement(); // end of a: symbol
                if (this.chart.chartSeries[i].hasOwnProperty('seriesFormat')) {
                    writer.writeStartElement('c', 'size', this.chartNamespace);
                    writer.writeAttributeString(undefined, 'val', undefined, size.toString());
                    writer.writeEndElement(); // end of a: size
                }
                writer.writeEndElement(); // end of a: marker
            }
        }
    }
    private parseChartDataPoint(writer: XmlWriter, series: any): void {
        // data point
        let dataPoints: any = series.dataPoints;
        let points: any[] = [];
        for (let j: number = 0; j < dataPoints.length; j++) {
            points.push(dataPoints[j]);
            writer.writeStartElement('c', 'dPt', this.chartNamespace);
            writer.writeStartElement('c', 'idx', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, j.toString());
            writer.writeEndElement(); // end of c:idx
            writer.writeStartElement('c', 'bubble3D', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of c:bubble3D
            this.parseChartSeriesColor(writer, points, this.chart.chartType);
            writer.writeEndElement(); // end of c:dPt
            points = [];
        }
    }
    // chart data value
    private serializeChartCategory(writer: XmlWriter, chart: any, cacheType: string): void {
        let chartCategory: any = chart.chartCategory;
        let chartCategoryCount: number = chartCategory.length;
        writer.writeStartElement('c', 'f', this.chartNamespace);
        writer.writeString('Sheet1!$A$2:$A$' + (chartCategoryCount + 1).toString());
        writer.writeEndElement(); // end of f
        writer.writeStartElement('c', cacheType, this.chartNamespace);
        if (cacheType === 'numCache') {
            writer.writeStartElement('c', 'formatCode', this.chartNamespace);
            writer.writeString('General');
            writer.writeEndElement(); // end of formatCode
        }
        writer.writeStartElement('c', 'ptCount', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, chartCategoryCount.toString());
        writer.writeEndElement(); // end of ptCount
        for (let i: number = 0; i < chartCategory.length; i++) {
            let category: any = chartCategory[i];
            writer.writeStartElement('c', 'pt', this.chartNamespace);
            writer.writeAttributeString(undefined, 'idx', undefined, i.toString());
            writer.writeStartElement('c', 'v', this.chartNamespace);
            if (category.categoryXName !== '') {
                writer.writeString(category.categoryXName);
            }
            writer.writeEndElement(); // end of v
            writer.writeEndElement(); // end of pt
        }
        writer.writeEndElement(); // end of cacheType
    }
    // chart value
    private serializeChartValue(writer: XmlWriter, valueSheet: string, chartType: string): void {
        let isScatterType: boolean = (chartType === 'scatterChart' || chartType === 'bubbleChart');
        let valueType: string = 'val';
        if (isScatterType) {
            valueType = 'yVal';
        }
        this.serializeChartYValue(writer, valueType, valueSheet);
        if (chartType === 'bubbleChart') {
            valueType = 'bubbleSize';
            valueSheet = 'Sheet1!$C$2:$C$';
            this.serializeChartYValue(writer, valueType, valueSheet);
        }
        if (chartType === 'lineChart' || chartType === 'scatterChart') {
            writer.writeStartElement('c', 'smooth', this.chartNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, '0');
            writer.writeEndElement(); // end of smooth
        }
    }
    private serializeChartYValue(writer: XmlWriter, valueType: string, valueSheet: string): void {
        let chart: any = this.chart;
        let chartCategory: any = chart.chartCategory;
        let chartCategoryCount: number = chartCategory.length;
        writer.writeStartElement('c', valueType, this.chartNamespace);
        writer.writeStartElement('c', 'numRef', this.chartNamespace);
        writer.writeStartElement('c', 'f', this.chartNamespace);
        writer.writeString(valueSheet + (chartCategoryCount + 1).toString());
        writer.writeEndElement(); // end of f
        writer.writeStartElement('c', 'numCache', this.chartNamespace);
        writer.writeStartElement('c', 'formatCode', this.chartNamespace);
        writer.writeString('General');
        writer.writeEndElement(); // end of formatCode
        writer.writeStartElement('c', 'ptCount', this.chartNamespace);
        writer.writeAttributeString(undefined, 'val', undefined, chartCategoryCount.toString());
        writer.writeEndElement(); // end of ptCount
        for (let j: number = 0; j < chartCategoryCount; j++) {
            let category: any = chartCategory[j];
            for (let k: number = 0; k < category.chartData.length; k++) {
                if (k === this.seriesCount) {
                    let chartData: any = category.chartData[this.seriesCount];
                    writer.writeStartElement('c', 'pt', this.chartNamespace);
                    writer.writeAttributeString(undefined, 'idx', undefined, j.toString());
                    writer.writeStartElement('c', 'v', this.chartNamespace);
                    if (valueType !== 'bubbleSize') {
                        writer.writeString(chartData.yValue.toString());
                    } else {
                        writer.writeString(chartData.size.toString());
                    }
                    writer.writeEndElement(); // end of v
                    writer.writeEndElement(); // end of pt
                }
            }
        }
        writer.writeEndElement(); // end of numCache
        writer.writeEndElement(); // end of numRef
        writer.writeEndElement(); // end of val
    }
    // chart type
    private chartType(chart: any): string {
        let chartType: string = chart.chartType;
        switch (chartType) {
            case 'Pie':
                chartType = 'pieChart';
                break;
            case 'Doughnut':
                chartType = 'doughnutChart';
                break;
            case 'Scatter_Markers':
                chartType = 'scatterChart';
                break;
            case 'Bubble':
                chartType = 'bubbleChart';
                break;
        }
        if (chartType === 'Area' || chartType === 'Area_Stacked' || chartType === 'Area_Stacked_100') {
            chartType = 'areaChart';
        }
        if (chartType === 'Bar_Stacked_100' || chartType === 'Bar_Stacked' || chartType === 'Bar_Clustered' ||
            chartType === 'Column_Clustered' || chartType === 'Column_Stacked' || chartType === 'Column_Stacked_100') {
            chartType = 'barChart';
        }
        if (chartType === 'Line' || chartType === 'Line_Markers' || chartType === 'Line_Markers_Stacked' || chartType === 'Line_Stacked'
            || chartType === 'Line_Markers_Stacked_100' || chartType === 'Line_Stacked_100') {
            chartType = 'lineChart';
        }
        return chartType;
    }
    // chart group
    private chartGrouping(type: string): string {
        let grouping: string = 'standard';
        if (type === 'Bar_Stacked' || type === 'Column_Stacked' || type === 'Area_Stacked'
            || type === 'Line_Stacked' || type === 'Line_Markers_Stacked') {
            grouping = 'stacked';
        } else if (type === 'Bar_Stacked_100' || type === 'Column_Stacked_100' ||
            type === 'Area_Stacked_100' || type === 'Line_Stacked_100' ||
            type === 'Line_Markers_Stacked_100') {
            grouping = 'percentStacked';
        } else if (type === 'Bar_Clustered' || type === 'Column_Clustered') {
            grouping = 'clustered';
        }
        return grouping;
    }
    // chart legend position
    private chartLegendPosition(chart: any): string {
        let legendPosition: string = chart.position;
        switch (legendPosition) {
            case 'Top':
                legendPosition = 't';
                break;
            case 'Bottom':
                legendPosition = 'b';
                break;
            case 'Left':
                legendPosition = 'l';
                break;
            case 'Right':
                legendPosition = 'r';
                break;
            case 'Corner':
                legendPosition = 'tr';
                break;
            default:
                legendPosition = 'b';
                break;
        }
        return legendPosition;
    }
    // update the chard id
    private updatechartId(chart: any): string {
        let id: string = '';
        if (id === '') {
            id = this.addChartRelation(this.documentCharts, chart);
        }
        return id;
    }
    // adds the chart relation.
    private addChartRelation(chartCollection: Dictionary<string, any>, chart: any): string {
        let relationId: string = '';
        relationId = this.getNextRelationShipID();
        chartCollection.add(relationId, chart);
        return relationId;
    }
    private startsWith(sourceString: string, startString: string): boolean {
        return startString.length > 0 && sourceString.substring(0, startString.length) === startString;
    }
    private serializeShapeDrawingGraphics(writer: XmlWriter, shape: any): void {
        let val: string = shape.autoShapeType;
        let id: number = shape.shapeId;
        this.serializeShapeWrapStyle(writer, shape);
        writer.writeStartElement('wp', 'docPr', this.wpNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, (this.mDocPrID++).toString());
        writer.writeAttributeString(undefined, 'name', undefined, shape.name);
        writer.writeAttributeString(undefined, 'title', undefined, shape.title);
        writer.writeEndElement();
        writer.writeStartElement('a', 'graphic', this.aNamespace);
        writer.writeStartElement('a', 'graphicData', this.aNamespace);
        writer.writeAttributeString(undefined, 'uri', undefined, this.wpShapeNamespace);
        writer.writeStartElement('wps', 'wsp', this.wpShapeNamespace);
        writer.writeStartElement('wps', 'cNvCnPr', this.wpShapeNamespace);
        writer.writeStartElement('a', 'cxnSpLocks', this.aNamespace);
        writer.writeAttributeString(undefined, 'noChangeShapeType', undefined, '1');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('wps', 'spPr', this.wpShapeNamespace);
        writer.writeAttributeString(undefined, 'bwMode', undefined, 'auto');
        writer.writeStartElement('a', 'xfrm', this.aNamespace);
        writer.writeStartElement('a', 'off', this.aNamespace);
        writer.writeAttributeString(undefined, 'x', undefined, '0');
        writer.writeAttributeString(undefined, 'y', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('a', 'ext', this.aNamespace);
        let cx: number = Math.round((shape.width * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        let cy: number = Math.round((shape.height * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('a', 'prstGeom', this.aNamespace);
        if (val === 'StraightConnector') {
            writer.writeAttributeString(undefined, 'prst', undefined, 'straightConnector1');
        } else if (val === 'RoundedRectangle') {
            writer.writeAttributeString(undefined, 'prst', undefined, 'roundRect');
        } else {
            writer.writeAttributeString(undefined, 'prst', undefined, 'rect');
        }
        writer.writeStartElement('a', 'avLst', this.aNamespace);
        writer.writeEndElement();
        writer.writeEndElement();
        if (shape.fillFormat && shape.fillFormat.color && shape.fillFormat.fill) {
            writer.writeStartElement('a', 'solidFill', this.aNamespace);
            writer.writeStartElement('a', 'srgbClr', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, this.getColor(shape.fillFormat.color));
            writer.writeEndElement();
            writer.writeEndElement();
        } else {
            writer.writeStartElement('a', 'noFill', this.aNamespace);
            writer.writeEndElement();
        }
        let lineWeight: number = shape.lineFormat.weight ? shape.lineFormat.weight * this.emusPerPoint: this.emusPerPoint;
        writer.writeStartElement('a', 'ln', this.aNamespace);
        writer.writeAttributeString(undefined, 'w', undefined, lineWeight.toString());
        if ((!isNullOrUndefined(shape.lineFormat.lineFormatType) && shape.lineFormat.lineFormatType !== 'None')
            || shape.lineFormat.line) {
            writer.writeStartElement('a', 'solidFill', this.aNamespace);
            writer.writeStartElement('a', 'srgbClr', this.aNamespace);
            writer.writeAttributeString(undefined, 'val', undefined, this.getColor(shape.lineFormat.color));
            writer.writeEndElement();
            writer.writeEndElement();
            writer.writeStartElement('a', 'round', this.aNamespace);
            writer.writeEndElement();
            writer.writeStartElement('a', 'headEnd', this.aNamespace);
            writer.writeEndElement();
            writer.writeStartElement('a', 'tailEnd', this.aNamespace);
            writer.writeEndElement();
        } else {
            writer.writeStartElement('a', 'noFill', this.aNamespace);
            writer.writeEndElement();
        }
        writer.writeEndElement();
        writer.writeEndElement();
        if (val === 'Rectangle' || val === 'RoundedRectangle') {
            writer.writeStartElement('wps', 'txbx', this.wpShapeNamespace);
            writer.writeStartElement(undefined, 'txbxContent', this.wNamespace);
            this.serializeBodyItems(writer, shape.textFrame.blocks, true);
            writer.writeEndElement();
            writer.writeEndElement();
        }
        writer.writeStartElement('wps', 'bodyPr', this.wpShapeNamespace);
        if (!isNullOrUndefined(shape.textFrame)) {
            let margin: string;
            if (shape.textFrame.leftMargin >= 0) {
                margin = Math.round(shape.textFrame.leftMargin * this.emusPerPoint).toString();
                writer.writeAttributeString(undefined, 'lIns', undefined, margin);
            }
            if (shape.textFrame.topMargin >= 0) {
                margin = Math.round(shape.textFrame.topMargin * this.emusPerPoint).toString();
                writer.writeAttributeString(undefined, 'tIns', undefined, margin);
            }
            if (shape.textFrame.rightMargin >= 0) {
                margin = Math.round(shape.textFrame.rightMargin * this.emusPerPoint).toString();
                writer.writeAttributeString(undefined, 'rIns', undefined, margin);
            }
            if (shape.textFrame.bottomMargin >= 0) {
                margin = Math.round(shape.textFrame.bottomMargin * this.emusPerPoint).toString();
                writer.writeAttributeString(undefined, 'bIns', undefined, margin);
            }
            writer.writeAttributeString(undefined, 'anchor', undefined, 't');
            writer.writeAttributeString(undefined, 'anchorCtr', undefined, '0');


        }
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();


    }
    private serializeShapeWrapStyle(writer: XmlWriter, shape: any): void {
        if (shape.textWrappingStyle !== 'Inline') {
            let textWrappingStyle: string = 'wrapNone';
            if (shape.textWrappingStyle && shape.textWrappingStyle !== 'InFrontOfText' && shape.textWrappingStyle !== 'Behind') {
                textWrappingStyle = 'wrap' + shape.textWrappingStyle;
                if (shape.textWrappingStyle === 'Tight') {
                    textWrappingStyle = 'wrap' + 'Square';
                }
            }
            writer.writeStartElement('wp', textWrappingStyle, this.wpNamespace);
            if (shape.textWrappingStyle && shape.textWrappingStyle !== 'InFrontOfText' && shape.textWrappingStyle !== 'Behind' &&
                shape.textWrappingType) {
                let wrapType: string = shape.textWrappingType === 'Both' ? 'bothSides' : (shape.textWrappingType as string).toLowerCase();
                writer.writeAttributeString(undefined, 'wrapText', undefined, wrapType);
            }
            writer.writeEndElement();
        }
    }
    // Serialize the graphics element for pictures.
    private serializeDrawingGraphics(writer: XmlWriter, picture: any): void {
        let id: string = '';
        if (picture.isMetaFile && !isNullOrUndefined(picture.metaFileImageString)) {
            picture.imageString = picture.metaFileImageString;
        }
        id = this.updateShapeId(picture);
        // picture.ShapeId = this.getNextDocPrID();
        // Processing picture
        writer.writeStartElement('wp', 'docPr', this.wpNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, (this.mDocPrID++).toString());
        if (!isNullOrUndefined(picture.alternativeText)) {
            writer.writeAttributeString(undefined, 'descr', undefined, picture.alternativeText);
        }
        writer.writeAttributeString(undefined, 'name', undefined, !isNullOrUndefined(picture.name) ? picture.name : '');
        if (!isNullOrUndefined(picture.title))
            writer.writeAttributeString(undefined, 'title', undefined, picture.title);
        // else
        // writer.writeAttributeString(undefined, 'title', undefined, '');
        // if (!picture.Visible)
        //     m_writer.WriteAttributeString('hidden', '1');
        // SerializePictureHyperlink(picture);
        writer.writeEndElement();
        writer.writeStartElement('a', 'graphic', this.aNamespace);
        writer.writeStartElement('a', 'graphicData', this.aNamespace);
        writer.writeAttributeString(undefined, 'uri', undefined, this.pictureNamespace);
        writer.writeStartElement('pic', 'pic', this.pictureNamespace);
        writer.writeStartElement('pic', 'nvPicPr', this.pictureNamespace);
        writer.writeStartElement('pic', 'cNvPr', this.pictureNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, '0');
        writer.writeAttributeString(undefined, 'name', undefined, '');
        writer.writeAttributeString(undefined, 'descr', undefined, '');
        writer.writeEndElement();
        writer.writeStartElement('pic', 'cNvPicPr', this.pictureNamespace);
        writer.writeStartElement('a', 'picLocks', this.aNamespace);
        writer.writeAttributeString(undefined, 'noChangeAspect', undefined, '1');
        writer.writeAttributeString(undefined, 'noChangeArrowheads', undefined, '1');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('pic', 'blipFill', this.pictureNamespace);
        writer.writeStartElement('a', 'blip', this.aNamespace);
        if (this.startsWith(picture.imageString, 'data:image')) {
            writer.writeAttributeString('r', 'embed', this.rNamespace, id);
        } else {
            if (this.documentImages.containsKey(id)) {
                //Remove the image document images collection for this particular key
                //If the picture image data has href means MS Word contains the image in media folder as well as 
                //it is having external relationship id
                // if (!this.startsWith(picture.imageString, 'data:image')) {
                this.documentImages.remove(id);
                this.externalImages.add(id, picture.imageString);
                writer.writeAttributeString(undefined, 'link', this.rNamespace, id);
            }
        }

        //End Element Blip
        writer.writeEndElement();
        if (picture.iscrop) {
            writer.writeStartElement('a', 'srcRect', this.aNamespace);
            let l: number = Math.round(picture.left * 1000);
            writer.writeAttributeString(undefined, 'l', undefined, l.toString());
            let t: number = Math.round(picture.top * 1000);
            writer.writeAttributeString(undefined, 't', undefined, t.toString());
            let r: number = Math.round(picture.right * 1000);
            writer.writeAttributeString(undefined, 'r', undefined, r.toString());
            let b: number = Math.round(picture.bottom * 1000);
            writer.writeAttributeString(undefined, 'b', undefined, b.toString());
            writer.writeEndElement();
        }
        writer.writeStartElement('a', 'stretch', this.aNamespace);
        writer.writeStartElement('a', 'fillRect', this.aNamespace);
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('pic', 'spPr', this.pictureNamespace);
        writer.writeAttributeString(undefined, 'bwMode', undefined, 'auto');
        writer.writeStartElement('a', 'xfrm', this.aNamespace);
        // if (picture.Rotation !== 0)
        //     m_writer.WriteAttributeString('rot', picture.Rotation.ToString());
        writer.writeStartElement('a', 'off', this.aNamespace);
        writer.writeAttributeString(undefined, 'x', undefined, '0');
        writer.writeAttributeString(undefined, 'y', undefined, '0');
        writer.writeEndElement();
        writer.writeStartElement('a', 'ext', this.aNamespace);
        let cx: number = Math.round((picture.width * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        let cy: number = Math.round((picture.height * this.emusPerPoint));
        writer.writeAttributeString(undefined, 'cy', undefined, cy.toString());
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeStartElement('a', 'prstGeom', this.aNamespace);
        writer.writeAttributeString(undefined, 'prst', undefined, 'rect');
        writer.writeStartElement('a', 'avLst', this.aNamespace);
        writer.writeEndElement();
        writer.writeEndElement();
        //When the picture border has been added next to effect list
        //if not, Picture border has not been preserved
        // if (picture.HasBorder)
        // {
        //     if (picture.TextWrappingStyle === TextWrappingStyle.Inline && picture.IsShape)
        //         SerializeInlineShapeLine(picture.PictureShape);
        //     else
        //         SerializeShapeLine(picture.PictureShape);
        // }
        // if (picture.DocxProps.length > 0)
        //     SerializeDocxProps(picture.DocxProps, 'effectLst');
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
        writer.writeEndElement();
    }
    /// Update the shape id.
    private updateShapeId(picture: any): string {
        let id: string = '';

        let tOwner: any = this.paragraph;

        // Adding picture byte data to the corresponding picture collection 
        // depending on its owner subdocument
        if (this.headerFooter) {
            id = this.updateHFImageRels(this.headerFooter, picture);
        } else {
            if (id === '') {
                if (tOwner.hasOwnProperty('sectionFormat') || tOwner.hasOwnProperty('inlines')) {
                    id = this.addImageRelation(this.documentImages, picture);

                    // if (owner is WFootnote)
                    // {
                    //     if ((owner as WFootnote).FootnoteType === FootnoteType.Footnote)
                    //         id = AddImageRelation(FootnoteImages, picture.ImageRecord);
                    //     else
                    //         id = AddImageRelation(EndnoteImages, picture.ImageRecord);
                    // }

                    // if (owner is WComment)
                    //     id = AddImageRelation(CommentImages, picture.ImageRecord);
                }
            }
        }
        return id;
    }
    // Adds the image relation.
    private addImageRelation(imageCollection: Dictionary<string, any>, image: any): string {
        let relationId: string = '';
        // if (imageCollection.ContainsValue(imageRecord)) {
        //     foreach(string key in imageCollection.keys)
        //     {
        //         if (imageRecord === imageCollection[key]) {
        //             relationId = key;
        //             break;
        //         }
        //     }
        // }
        // else {
        relationId = this.getNextRelationShipID();
        imageCollection.add(relationId, image);
        // }
        return relationId;
    }
    // Update the HeaderFooter image relations.
    private updateHFImageRels(hf: any, image: any): string {
        let id: string = '';
        // UpdateImages(image);

        let headerId: string = '';
        let types: any[] = this.headersFooters.keys;
        for (let i: number = 0; i < types.length; i++) {
            let hfColl: Dictionary<string, any> = this.headersFooters.get(types[i]);
            let hfKeys: string[] = hfColl.keys;
            for (let j: number = 0; j < hfKeys.length; j++) {
                if (hfColl.get(hfKeys[j]) === hf) {
                    headerId = hfKeys[j];
                    let headerImages: Dictionary<string, any>;
                    if (this.headerFooterImages.containsKey(headerId)) {
                        headerImages = this.headerFooterImages.get(headerId);
                        id = this.addImageRelation(headerImages, image);
                    } else {
                        headerImages = new Dictionary<string, any>();
                        id = this.addImageRelation(headerImages, image);
                        this.headerFooterImages.add(headerId, headerImages);
                    }
                }
            }
        }
        return id;
    }
    // Serialize the table
    private serializeTable(writer: XmlWriter, table: any): void {
        if (table.rows.length <= 0) {
            return;
        }
        let owner: any = this.table;
        this.table = table;
        writer.writeStartElement(undefined, 'tbl', this.wNamespace);
        let tableFormat: any = table.rows[0].rowFormat;
        this.serializeTableFormat(writer, tableFormat, table);
        this.serializeTableGrid(writer, table);
        let mVerticalMerge: Dictionary<number, number> = new Dictionary<number, number>();
        let mHorizontalMerge: Dictionary<number, number> = new Dictionary<number, number>();
        let cellFormats: Dictionary<number, any> = new Dictionary<number, any>();
        let rows: any = table.rows;
        if (rows.length > 0) {
            for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
                let row: any = rows[rowIndex];
                if (row.cells.length > 0) {
                    if (row.hasOwnProperty('contentControlProperties')) {
                        this.serializeContentControl(writer, row.contentControlProperties, row);
                        continue;
                    }
                    let owner: any = this.row;
                    this.row = row;
                    writer.writeStartElement(undefined, 'tr', this.wNamespace);
                    this.serializeRowFormat(writer, row);
                    let cells: any = row.cells;
                    let cellLength: number = cells.length;
                    let prevColIndex: number = 0;
                    for (let i: number = 0; i < cellLength; i++) {
                        let cell: any = cells[i];
                        let columnIndex: number = cell.columnIndex;
                        if (cell.hasOwnProperty('contentControlProperties')) {
                            this.serializeContentControl(writer, cell.contentControlProperties, cell);
                            continue;
                        }
                        let cellFormat: any = cell.cellFormat;
                        if ((columnIndex - prevColIndex) > 0) {
                            let checkIndex: number = i === 0 ? 0 : (prevColIndex + 1);
                            for (let k: number = checkIndex; k < columnIndex; k++) {
                                if (mVerticalMerge.containsKey(k)) {
                                    let format: any = this.getMergeCellFormat(cellFormat, cellFormats.get(k), k < cell.columnIndex);
                                    this.serializeTableCell(writer, cell, format, false);
                                    mVerticalMerge.set(k, mVerticalMerge.get(k) - 1);
                                    if (mVerticalMerge.get(k) === 1) {
                                        mVerticalMerge.remove(k);
                                        cellFormats.remove(k);
                                        if (mHorizontalMerge.containsKey(k)) {
                                            mHorizontalMerge.remove(k);
                                        }
                                    }
                                    if (mHorizontalMerge.containsKey(k)) {
                                        prevColIndex += mHorizontalMerge.get(k) - 1;
                                        k += mHorizontalMerge.get(k);
                                    }
                                }
                            }
                        }
                        prevColIndex = columnIndex;
                        if (cellFormat.rowSpan > 1) {
                            mVerticalMerge.add(columnIndex, cellFormat.rowSpan);
                            cellFormats.add(columnIndex, cellFormat);
                        }
                        this.serializeTableCell(writer, cell, cellFormat, true);
                        if (cellFormat.columnSpan > 1 && cellFormat.rowSpan > 1) {
                            mHorizontalMerge.add(columnIndex, cellFormat.columnSpan);
                        }
                        for (let j: number = columnIndex + 1; ; j++) {
                            if (mVerticalMerge.containsKey(j)) {
                                let mergeFormat: any = this.getMergeCellFormat(cellFormat, cellFormats.get(j), j < cell.columnIndex);
                                this.serializeTableCell(writer, cell, mergeFormat, false);
                                mVerticalMerge.set(j, mVerticalMerge.get(j) - 1);
                                prevColIndex++;
                                if (mVerticalMerge.get(j) === 1) {
                                    mVerticalMerge.remove(j);
                                    cellFormats.remove(j);
                                    if (mHorizontalMerge.containsKey(j)) {
                                        mHorizontalMerge.remove(j);
                                    }
                                }
                                if (mHorizontalMerge.containsKey(j)) {
                                    prevColIndex += mHorizontalMerge.get(j) - 1;
                                    j += mHorizontalMerge.get(j);
                                }
                            } else if (!(i === (cellLength - 1) && j < table.columnCount)) {
                                break;
                            }
                        }
                    }
                    writer.writeEndElement(); //end od table row 'tr'
                    this.row = owner;
                }
            }
        }
        writer.writeEndElement();
        this.table = owner;
    }
    private getMergeCellFormat(cellFormat: any, mergedCellFormat: any, before: boolean): any {
        let format: any = mergedCellFormat;
        if (before) {
            format.borders.right = cellFormat.borders.left;
        } else {
            format.borders.left = cellFormat.borders.right;
        }
        return format;
    }
    private serializeTableCell(xmlWriter: XmlWriter, cell: any, cellFormat: any, mergeStart?: boolean): void {
        let owner: any = this.blockOwner;
        this.blockOwner = cell;
        xmlWriter.writeStartElement(undefined, 'tc', this.wNamespace);
        xmlWriter.writeStartElement(undefined, 'tcPr', this.wNamespace);
        this.serializeCellWidth(xmlWriter, cellFormat);
        this.serializeCellMargins(xmlWriter, cellFormat);
        xmlWriter.writeStartElement(undefined, 'tcBorders', this.wNamespace);
        this.serializeBorders(xmlWriter, cellFormat.borders, 8);
        xmlWriter.writeEndElement(); // end of tcBorders
        this.serializeShading(xmlWriter, cell.cellFormat.shading);
        this.serializeTableCellDirection(xmlWriter, cellFormat);
        this.serializeCellVerticalAlign(xmlWriter, cellFormat.verticalAlignment);
        if (cellFormat.columnSpan > 1) {
            let num: number = cellFormat.columnSpan;
            xmlWriter.writeStartElement(undefined, 'gridSpan', this.wNamespace);
            xmlWriter.writeAttributeString('w', 'val', this.wNamespace, num.toString());
            xmlWriter.writeEndElement();
        }
        if (cellFormat.rowSpan > 1) {
            xmlWriter.writeStartElement(undefined, 'vMerge', this.wNamespace);
            xmlWriter.writeAttributeString('w', 'val', this.wNamespace, mergeStart ? 'restart' : 'continue');
            xmlWriter.writeEndElement(); // end of vMerge
        }
        xmlWriter.writeEndElement(); // end of tcPr
        if (cell && cell.blocks.length > 0) {
            let itemIndex: number = 0;
            let item: any = undefined;
            while (itemIndex < cell.blocks.length) {
                item = cell.blocks[itemIndex];
                this.serializeBodyItem(xmlWriter, item, false);
                itemIndex += 1;
            }
        } else {
            xmlWriter.writeStartElement(undefined, 'p', this.wNamespace);
            xmlWriter.writeStartElement(undefined, 'pPr', this.wNamespace);
            xmlWriter.writeStartElement(undefined, 'pStyle', this.wNamespace);
            xmlWriter.writeAttributeString('w', 'val', this.wNamespace, 'Normal');
            xmlWriter.writeEndElement(); //end of pStyle
            xmlWriter.writeEndElement(); //end of pPr
            xmlWriter.writeEndElement(); //end of P
        }
        xmlWriter.writeEndElement(); //end of table cell 'tc' 
        this.blockOwner = owner;
    }
    // Serialize the table grid
    private serializeTableGrid(writer: XmlWriter, table: any): void {
        writer.writeStartElement(undefined, 'tblGrid', this.wNamespace);

        if (table.grid.length !== 0) {
            this.serializeGridColumns(writer, table.grid);
        }

        writer.writeEndElement();
    }
    // Serialize the table rows
    private serializeTableRows(writer: XmlWriter, rows: any): void {
        let mVerticalMerge: Dictionary<number, number> = new Dictionary<number, number>();
        if (rows.length > 0) {
            for (let i: number = 0; i < rows.length; i++) {
                let row: any = rows[i];
                if (row.cells.length > 0) {
                    if (row.hasOwnProperty('contentControlProperties')) {
                        this.serializeContentControl(writer, row.contentControlProperties, row);
                        continue;
                    }
                    this.serializeRow(writer, row, mVerticalMerge);
                }
            }
        }
    }
    // Serialize the table row
    private serializeRow(writer: XmlWriter, row: any, mVerticalMerge: Dictionary<number, number>): void {
        let owner: any = this.row;
        this.row = row;
        writer.writeStartElement(undefined, 'tr', this.wNamespace);
        this.serializeRowFormat(writer, row);

        this.serializeCells(writer, row.cells, mVerticalMerge);

        writer.writeEndElement(); //end od table row 'tr'
        this.row = owner;
    }
    // Serialize the row format
    private serializeRowFormat(writer: XmlWriter, row: any): void {
        this.serializeRowMargins(writer, row.rowFormat);
        writer.writeStartElement(undefined, 'trPr', this.wNamespace);

        //Serialize Row Height
        if (row.rowFormat.height > 0) {
            writer.writeStartElement(undefined, 'trHeight', this.wNamespace);
            if (row.rowFormat.heightType === 'Exactly') {
                writer.writeAttributeString('w', 'hRule', this.wNamespace, 'exact');
            } else if (row.rowFormat.heightType === 'AtLeast') {
                writer.writeAttributeString('w', 'hRule', this.wNamespace, 'atLeast');
            }
            let height: string = this.roundToTwoDecimal(row.rowFormat.height * this.twentiethOfPoint).toString();
            writer.writeAttributeString('w', 'val', this.wNamespace, height);
            writer.writeEndElement();
        }
        let rowFormat: any = row.rowFormat;
        // //Serialize 'gridBefore' element
        let gridBefore: number = rowFormat.gridBefore;
        if (gridBefore > 0) {
            writer.writeStartElement(undefined, 'gridBefore', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, gridBefore.toString());
            writer.writeEndElement();
        }
        // //Serialize 'gridAfter' element
        let gridAfter: number = rowFormat.gridAfter;
        if (gridAfter > 0) {
            writer.writeStartElement(undefined, 'gridAfter', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, gridAfter.toString());
            writer.writeEndElement();
        }
        // //Serialize 'wBefore' element 
        if (gridBefore > 0) {
            writer.writeStartElement(undefined, 'wBefore', this.wNamespace);
            switch (rowFormat.gridBeforeWidthType) {
                case 'Percent':
                    let width: string = this.roundToTwoDecimal(rowFormat.gridBeforeWidth * this.percentageFactor).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, width);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'pct');
                    break;
                case 'Point':
                    let pointWidth: string = this.roundToTwoDecimal(rowFormat.gridBeforeWidth * this.twipsInOnePoint).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, pointWidth);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'dxa');
                    break;
            }
            writer.writeEndElement();
        }
        //Serialize 'wAfter' element
        if (gridAfter > 0) {
            writer.writeStartElement(undefined, 'wAfter', this.wNamespace);
            switch (rowFormat.gridAfterWidthType) {
                case 'Percent':
                    let width: string = this.roundToTwoDecimal(rowFormat.gridAfterWidth * this.percentageFactor).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, width);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'pct');
                    break;
                case 'Point':
                    let pointWidth: string = this.roundToTwoDecimal(rowFormat.gridAfterWidth * this.twipsInOnePoint).toString();
                    writer.writeAttributeString('w', 'val', this.wNamespace, pointWidth);
                    writer.writeAttributeString('w', 'type', this.wNamespace, 'dxa');
                    break;
            }
            writer.writeEndElement();
        }
        //Serialize 'cantSplit' element 
        if (!rowFormat.allowBreakAcrossPages) {
            writer.writeStartElement(undefined, 'cantSplit', this.wNamespace);
            writer.writeEndElement();
        }
        // //Serialize 'tblHeader' element 
        if (rowFormat.isHeader) {
            writer.writeStartElement(undefined, 'tblHeader', this.wNamespace);
            writer.writeEndElement();
        }
        //serialize revision
        if (!isNullOrUndefined(rowFormat.revisionIds) && rowFormat.revisionIds.length > 0) {
            this.serializeRevisionStart(writer, rowFormat, undefined);
            this.serializeRevisionEnd(writer, rowFormat, undefined);
        }
        writer.writeEndElement();
    }
    // serialize the table cells
    private serializeCells(writer: XmlWriter, cells: any, mVerticalMerge: Dictionary<number, number>): void {
        for (let i: number = 0; i < cells.length; i++) {
            if (cells[i].hasOwnProperty('contentControlProperties')) {
                this.serializeContentControl(writer, cells[i].contentControlProperties, cells[i]);
                continue;
            }
            this.serializeCell(writer, cells[i], mVerticalMerge);
        }
    }
    // Serialize the table cell
    private serializeCell(writer: XmlWriter, cell: any, mVerticalMerge: Dictionary<number, number>): void {
        let owner: any = this.blockOwner;
        this.blockOwner = cell;
        writer.writeStartElement(undefined, 'tc', this.wNamespace);
        mVerticalMerge = this.serializeCellFormat(writer, cell.cellFormat, true, true, mVerticalMerge);
        if (cell.blocks.length > 0) {
            let itemIndex: number = 0;
            let item: any = undefined;
            while (itemIndex < cell.blocks.length) {
                item = cell.blocks[itemIndex];
                this.serializeBodyItem(writer, item, false);
                itemIndex += 1;
            }
        } else {
            writer.writeStartElement(undefined, 'p', this.wNamespace);
            writer.writeStartElement(undefined, 'pPr', this.wNamespace);
            writer.writeStartElement(undefined, 'pStyle', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'Normal');
            writer.writeEndElement(); //end of pStyle

            writer.writeEndElement(); //end of pPr
            writer.writeEndElement(); //end of P
        }
        writer.writeEndElement(); //end of table cell 'tc' 
        let increment: number = 1;
        // let count: number = 0;
        if (mVerticalMerge.containsKey((cell.columnIndex + cell.cellFormat.columnSpan - 1) + increment) && this.row.cells.length === 1) {
            let length: number = mVerticalMerge.keys[mVerticalMerge.keys.length - 1];
            while (increment <= length) {
                increment = this.createCellForMerge(writer, cell, mVerticalMerge, increment);
                increment++;
            }
        } else {
            this.createCellForMerge(writer, cell, mVerticalMerge, increment);
        }
        this.blockOwner = owner;
    }
    private createCellForMerge(writer: XmlWriter, cell: any, mVerticalMerge: Dictionary<number, number>, increment: number): number {
        while (mVerticalMerge.containsKey((cell.columnIndex + cell.cellFormat.columnSpan - 1) + increment)
            && (((this.row.cells.indexOf(cell) === this.row.cells.length - 1) || this.row.cells.indexOf(cell) === cell.columnIndex))
            && cell.nextNode === undefined) {
            let collKey: number = (cell.columnIndex + cell.cellFormat.columnSpan - 1) + increment;
            writer.writeStartElement(undefined, 'tc', this.wNamespace);
            let endProperties: boolean = true;
            if (!isNullOrUndefined(this.spanCellFormat)) {
                endProperties = false;
                mVerticalMerge = this.serializeCellFormat(writer, this.spanCellFormat, false, endProperties, mVerticalMerge);
            } else {
                writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
                endProperties = false;
            }
            this.serializeColumnSpan(collKey, writer);
            writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'continue');
            writer.writeEndElement();
            if (isNullOrUndefined(this.spanCellFormat)) {
                writer.writeStartElement(undefined, 'tcBorders', this.wNamespace);
                this.serializeBorders(writer, cell.cellFormat.borders, 8);
                writer.writeEndElement();
            }
            if (!endProperties) {
                writer.writeEndElement();
            }
            mVerticalMerge = this.checkMergeCell(collKey, mVerticalMerge);
            writer.writeStartElement('w', 'p', this.wNamespace);
            writer.writeEndElement(); //end of P
            writer.writeEndElement(); //end of table cell 'tc'  
            increment++;
            //count++;
        }
        return increment;
    }
    // Serialize the cell formatting
    private serializeCellFormat(writer: XmlWriter, cellFormat: any, ensureMerge: boolean, endProperties: boolean, mVerticalMerge: Dictionary<number, number>): Dictionary<number, number> {

        let cell: any = this.blockOwner;
        //Get the table fomat
        let tf: any = this.table.tableFormat;
        //Get the row format
        let rf: any = this.row.rowFormat;
        writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
        //w:cnfStyle -   Table Cell Conditional Formatting
        // SerializeCnfStyleElement(cell);
        //w:tcW -    Preferred Table Cell Width
        this.serializeCellWidth(writer, cellFormat);
        // serialize cell margins
        this.serializeCellMargins(writer, cellFormat);
        if (ensureMerge) {
            //w:hMerge -    Horizontally Merged Cell and w:vMerge -    Vertically Merged Cell
            mVerticalMerge = this.serializeCellMerge(writer, cellFormat, mVerticalMerge);
            //w:gridSpan -   Grid Columns Spanned by Current Table Cell
            this.serializeGridSpan(writer, cell);
        }
        //w:tcBorders -    Table Cell Borders
        writer.writeStartElement(undefined, 'tcBorders', this.wNamespace);
        this.serializeBorders(writer, cellFormat.borders, 8);
        writer.writeEndElement();
        //w:shd -  Table Cell Shading
        this.serializeShading(writer, cell.cellFormat.shading);
        // //w:noWrap -   Don't Wrap Cell Content
        // if (cellFormat.HasValue(CellFormat.TextWrapKey)) {
        //     m_writer.WriteStartElement('noWrap', W_namespace);
        //     if (cellFormat.TextWrap)
        //         m_writer.WriteAttributeString('w', 'val', W_namespace, 'false');
        //     m_writer.WriteEndElement();
        // }
        // //w:tcMar -  Single Table Cell Margins
        // if (!cellFormat.SamePaddingsAsTable) {
        //     m_writer.WriteStartElement('tcMar', W_namespace);
        //     SerializePaddings(cellFormat.Paddings);
        //     m_writer.WriteEndElement();
        // }
        //w:textDirection -   Table Cell Text Flow Direction
        this.serializeTableCellDirection(writer, cellFormat);
        // //w:tcFitText -  Fit Text Within Cell
        // if (cellFormat.FitText) {
        //     m_writer.WriteStartElement('tcFitText', W_namespace);
        //     m_writer.WriteEndElement();
        // }
        // //w:hideMark 
        // if (cellFormat.HideMark) {
        //     m_writer.WriteStartElement('hideMark', W_namespace);
        //     m_writer.WriteEndElement();
        // }
        //w:vAlign -  Table Cell Vertical Alignment
        // if (cellFormat.HasValue(CellFormat.VrAlignmentKey))
        this.serializeCellVerticalAlign(writer, cellFormat.verticalAlignment);
        // //w:hideMark -   Ignore End Of Cell Marker In Row Height Calculation
        // SerializeDocxProps(tempDocxProps, 'hideMark');
        // //w:cellIns -    Table Cell Insertion
        // SerializeDocxProps(tempDocxProps, 'cellIns');
        // //w:cellDel -    Table Cell Deletion
        // SerializeDocxProps(tempDocxProps, 'cellDel');
        // //w:cellMerge -   Vertically Merged/Split Table Cells
        // SerializeDocxProps(tempDocxProps, 'cellMerge');
        // if (cellFormat.OldPropertiesHash.length > 0 && !m_isAlternativeCellFormat) {
        //     m_isAlternativeCellFormat = true;
        //     SerializeTrackChangeProps('tcPrChange', cellFormat.FormatChangeAuthorName, cellFormat.FormatChangeDateTime);
        //     Dictionary < int, object > oldPropertyHash = new Dictionary<int, object>(cellFormat.OldPropertiesHash);
        //     Dictionary < int, object > propertyHash = new Dictionary<int, object>(cellFormat.PropertiesHash);
        //     cellFormat.PropertiesHash.Clear();
        //     cellFormat.OldPropertiesHash.Clear();
        //     foreach(KeyValuePair < int, object > keyValue in oldPropertyHash)
        //     cellFormat.PropertiesHash[keyValue.Key] = keyValue.Value;
        //     SerializeCellFormat(cellFormat);
        //     cellFormat.PropertiesHash.Clear();
        //     foreach(KeyValuePair < int, object > keyValue in propertyHash)
        //     cellFormat.PropertiesHash[keyValue.Key] = keyValue.Value;
        //     foreach(KeyValuePair < int, object > keyValue in oldPropertyHash)
        //     cellFormat.OldPropertiesHash[keyValue.Key] = keyValue.Value;
        //     m_writer.WriteEndElement();
        //     m_isAlternativeCellFormat = false;
        // }
        if (endProperties) {
            writer.writeEndElement();
        }
        return mVerticalMerge;
    }
    // Serialize the cell width
    private serializeCellWidth(writer: XmlWriter, cf: any): void {
        writer.writeStartElement(undefined, 'tcW', this.wNamespace);
        if (cf.preferredWidthType === 'Percent') {
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'pct');
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(cf.preferredWidth * this.percentageFactor).toString());
        } else if (cf.preferredWidthType === 'Auto') {
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'auto');
            writer.writeAttributeString(undefined, 'w', this.wNamespace, '0');
        } else {
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(cf.preferredWidth * this.twipsInOnePoint).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
        }

        writer.writeEndElement();
    }
    // Serialize cell merge
    private serializeCellMerge(writer: XmlWriter, cellFormat: any, mVerticalMerge: Dictionary<number, number>): Dictionary<number, number> {
        let cell: any = this.blockOwner;
        let isserialized: boolean = false;
        let collKey: number;
        let currentIndex: number = cell.columnIndex;
        let cellIndex: number = this.row.cells.indexOf(cell);
        let prevIndex: number = cellIndex > 0 ? this.row.cells[cellIndex - 1].columnIndex : cell.columnIndex;
        if (cell.columnIndex === cellIndex) {
            collKey = cell.columnIndex;
            isserialized = true;
        } else {
            isserialized = false;
        }
        if (!isserialized) {
            if (cellIndex === 0) {
                currentIndex = cell.columnIndex;
                prevIndex = -1;
            }
            for (let i: number = prevIndex; i < currentIndex; i++) {
                collKey = prevIndex + 1;
                prevIndex += 1;
                if (collKey === 0 && mVerticalMerge.containsKey(collKey)) {
                    mVerticalMerge = this.createMerge(writer, collKey, cell, mVerticalMerge);
                }
            }
        }
        if (cellFormat.rowSpan > 1) {
            writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
            this.spanCellFormat = cellFormat;
            mVerticalMerge.add(collKey, cellFormat.rowSpan - 1);
            if (cellFormat.columnSpan > 1) {
                this.mGridSpans.add(collKey, cellFormat.columnSpan);
            }
            writer.writeAttributeString('w', 'val', this.wNamespace, 'restart');
            writer.writeEndElement();
        } else if (mVerticalMerge.containsKey(collKey) && isserialized) {
            mVerticalMerge = this.createMerge(writer, collKey, cell, mVerticalMerge);
        }
        return mVerticalMerge;
    }
    private createMerge(writer: XmlWriter, collKey: number, cell: any, mVerticalMerge: Dictionary<number, number>): Dictionary<number, number> {
        this.serializeColumnSpan(collKey, writer);
        writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
        writer.writeAttributeString('w', 'val', this.wNamespace, 'continue');
        writer.writeEndElement();
        writer.writeStartElement(undefined, 'tcBorders', this.wNamespace);
        this.serializeBorders(writer, cell.cellFormat.borders, 8);
        writer.writeEndElement();
        writer.writeEndElement(); //end tcPr
        writer.writeStartElement('w', 'p', this.wNamespace);
        writer.writeEndElement();
        writer.writeEndElement(); //end tc
        writer.writeStartElement(undefined, 'tc', this.wNamespace);
        writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
        this.serializeCellWidth(writer, cell.cellFormat);
        mVerticalMerge = this.checkMergeCell(collKey, mVerticalMerge);
        return mVerticalMerge;
    }
    private serializeColumnSpan(collKey: number, writer: XmlWriter): void {
        if (this.mGridSpans.keys.length > 0 && this.mGridSpans.containsKey(collKey)) {
            writer.writeStartElement(undefined, 'gridSpan', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.mGridSpans.get(collKey).toString());
            writer.writeEndElement();
        }
    }
    private checkMergeCell(collKey: number, mVerticalMerge: Dictionary<number, number>): Dictionary<number, number> {
        if ((mVerticalMerge.get(collKey) - 1) === 0) {
            mVerticalMerge.remove(collKey);
            this.spanCellFormat = undefined;
            if (this.mGridSpans.keys.length > 0 && this.mGridSpans.containsKey(collKey)) {
                this.mGridSpans.remove(collKey);
            }
        } else {
            mVerticalMerge.set(collKey, mVerticalMerge.get(collKey) - 1);
        }
        return mVerticalMerge;
    }
    // Serialize the grid span element of cell.
    private serializeGridSpan(writer: XmlWriter, cell: any): void {
        // int gridSpan = cell.cellFormat.GridSpan;
        if (cell.cellFormat.columnSpan > 1) {
            let num: number = cell.cellFormat.columnSpan;
            writer.writeStartElement(undefined, 'gridSpan', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, num.toString());
            writer.writeEndElement();
        }
    }
    // Serialize the table cell direction
    private serializeTableCellDirection(writer: XmlWriter, cellFormat: any): void {
        // if (cellFormat..textDirection !== TextDirection.Horizontal)
        // {
        //     m_writer.WriteStartElement('textDirection', W_namespace);

        //     switch (cellFormat.TextDirection)
        //     {
        //         case TextDirection.Horizontal:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'lrTb');
        //             break;
        //         case TextDirection.VerticalBottomToTop:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'btLr');
        //             break;
        //         case TextDirection.VerticalTopToBottom:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'tbRl');
        //             break;
        //         case TextDirection.HorizontalFarEast:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'lrTbV');
        //             break;
        //         case TextDirection.Vertical:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'tbLrV');
        //             break;
        //         case TextDirection.VerticalFarEast:
        //             m_writer.WriteAttributeString('w', 'val', W_namespace, 'tbRlV');
        //             break;
        //     }

        //     m_writer.WriteEndElement();
        // }
    }
    // Serialize the cell vertical alignment
    private serializeCellVerticalAlign(writer: XmlWriter, alignment: any): void {
        writer.writeStartElement(undefined, 'vAlign', this.wNamespace);
        switch (alignment) {
            case 'Center':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'center');
                break;
            case 'Bottom':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'bottom');
                break;
            default:
                writer.writeAttributeString('w', 'val', this.wNamespace, 'top');
                break;
        }
        writer.writeEndElement();
    }
    // Serialize the table grid columns.
    private serializeGridColumns(writer: XmlWriter, grid: number[]): void {
        for (let i: number = 0, count: number = grid.length; i < count; i++) {
            let gridValue: number = Math.round(grid[i] * 20);
            writer.writeStartElement(undefined, 'gridCol', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, gridValue.toString());
            writer.writeEndElement();
        }
    }
    // Serialize the row formattings.
    // Table parameter is passed for serializing table format and undefined for serializing row format.
    private serializeTableFormat(writer: XmlWriter, format: any, table: any): void {
        // if (!isNullOrUndefined(table))
        // {
        //     List<Stream> tempDocxProps = new List<Stream>();
        //     for (int i = 0, cnt = table.DocxTableFormat.NodeArray.length; i < cnt; i++)
        //         tempDocxProps.Add(table.DocxTableFormat.NodeArray[i]);
        writer.writeStartElement(undefined, 'tblPr', this.wNamespace);
        //     SerializeTableStlye(format);
        //     if (format.WrapTextAround &&!((table.OwnerTextBody.Owner is WTextBox) || 
        //(table.OwnerTextBody.Owner is WComment) || (table.OwnerTextBody.Owner is WFootnote)))
        //     {
        //         SerializeTablePositioning(format.Positioning);
        //         if (!format.Positioning.AllowOverlap)
        //         {
        //             m_writer.WriteStartElement('tblOverlap', W_namespace);
        //             m_writer.WriteAttributeString('val', W_namespace, 'never');
        //             m_writer.WriteEndElement();
        //         }
        //     }
        //     SerializeDocxProps(tempDocxProps, 'tblStyleRowBandSize');
        //     SerializeDocxProps(tempDocxProps, 'tblStyleColBandSize');  
        this.serializeTablePositioning(writer, table);
        this.serializeTableWidth(writer, table);
        this.serializeTableAlignment(writer, table.tableFormat);
        this.serializeCellSpacing(writer, table.tableFormat);
        this.serializeTableIndentation(writer, table.tableFormat);
        this.serializeTableMargins(writer, table.tableFormat);
        this.serializeTableBorders(writer, table.tableFormat);
        this.serializeShading(writer, table.tableFormat.shading);
        if (table.tableFormat.bidi) {
            writer.writeStartElement(undefined, 'bidiVisual', this.wNamespace);
            writer.writeEndElement();
        }
        this.serializeTblLayout(writer, table.tableFormat);
        // this.serializeTableCellMargin(writer, table.tableFormat);
        //     SerializeTableLook(table);
        //         if (!isNullOrUndefined(table.Title))
        //             SerializeTableTitle(table);
        //         if (!isNullOrUndefined(table.Description))
        //             SerializeTableDescription(table);

        // }
        // else
        // {
        //     SerializeCellSpacing(format);
        //     SerializeTableIndentation(format);
        //     SerializeTableBorders(format);
        //     SerializeTableShading(format);
        //     SerializeTblLayout(format);
        //     SerializeTableCellMargin(format);
        // }
        // if (!isNullOrUndefined(format.OwnerBase) && format.OwnerBase is WTable
        //   && format.OldPropertiesHash.length > 0 && !m_isAlternativeTableFormat)
        // {
        //     m_isAlternativeTableFormat = true;
        //     SerializeTrackChangeProps('tblPrChange', format.FormatChangeAuthorName, format.FormatChangeDateTime);
        //     SerializeTableTrackChanges(format, format.OwnerBase as WTable);
        //     m_writer.WriteEndElement();
        //     m_isAlternativeTableFormat = false;
        // }

        // if (!isNullOrUndefined(format.OwnerRow) && format.OldPropertiesHash.length > 0)
        // {
        //     SerializeTrackChangeProps('tblPrExChange', format.FormatChangeAuthorName, format.FormatChangeDateTime);
        //     SerializeTableTrackChanges(format, undefined);
        //     m_writer.WriteEndElement();
        // }

        // SerializeTblTrackChanges(format);
        if (!isNullOrUndefined(table)) {
            writer.writeEndElement(); //end of tblPr
        }
    }
    // Serialize the table position
    private serializeTablePositioning(writer: XmlWriter, table: any): void {
        if (table.wrapTextAround) {
            writer.writeStartElement('w', 'tblpPr', this.wNamespace);
            if (table.positioning.distanceLeft > 0) {
                let left: string = Math.round(table.positioning.distanceLeft * this.twipsInOnePoint).toString();
                writer.writeAttributeString('w', 'leftFromText', this.wNamespace, left);
            }
            if (table.positioning.distanceRight > 0) {
                let right: string = Math.round(table.positioning.distanceRight * this.twipsInOnePoint).toString();
                writer.writeAttributeString('w', 'rightFromText', this.wNamespace, right);
            }
            if (table.positioning.distanceTop > 0) {
                let top: string = Math.round(table.positioning.distanceTop * this.twipsInOnePoint).toString();
                writer.writeAttributeString('w', 'topFromText', this.wNamespace, top);
            }
            if (table.positioning.distanceBottom > 0) {
                let bottom: string = Math.round(table.positioning.distanceBottom * this.twipsInOnePoint).toString();
                writer.writeAttributeString('w', 'bottomFromText', this.wNamespace, bottom);
            }
            if (table.positioning.verticalOrigin) {
                let verticalOrigin: string = table.positioning.verticalOrigin === 'Paragraph' ? 'text' : table.positioning.verticalOrigin.toLowerCase();
                writer.writeAttributeString('w', 'vertAnchor', this.wNamespace, verticalOrigin);
            }
            if (table.positioning.horizontalOrigin && table.positioning.horizontalOrigin !== 'Column') {
                writer.writeAttributeString('w', 'horzAnchor', this.wNamespace, table.positioning.horizontalOrigin.toLowerCase());
            }
            if (table.positioning.horizontalAlignment && table.positioning.horizontalAlignment !== 'Left') {
                let horizontalAlignment: string = table.positioning.horizontalAlignment.toLowerCase();
                writer.writeAttributeString('w', 'tblpXSpec', this.wNamespace, horizontalAlignment);
            }
            if (table.positioning.verticalAlignment) {
                let verticalAlignment: string = table.positioning.verticalAlignment.toLowerCase();
                writer.writeAttributeString('w', 'tblpYSpec', this.wNamespace, verticalAlignment);
            }
            if (((!isNullOrUndefined(table.positioning.horizontalAlignment) && table.positioning.horizontalAlignment === 'Left')
                || !table.positioning.horizontalAlignment)
                && table.positioning.horizontalPosition > 0) {
                let horizontalPosition: string = Math.round(table.positioning.horizontalPosition * this.twipsInOnePoint).toString();
                writer.writeAttributeString('w', 'tblpX', this.wNamespace, horizontalPosition);
            }
            if (!table.positioning.verticalAlignment && table.positioning.verticalPosition > 0) {
                let verticalPosition: string = Math.round(table.positioning.verticalPosition * this.twipsInOnePoint).toString();
                writer.writeAttributeString('w', 'tblpY', this.wNamespace, verticalPosition);
            }
            writer.writeEndElement();

            if (!table.positioning.allowOverlap) {
                writer.writeStartElement('w', 'tblOverlap', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, 'never');
                writer.writeEndElement();
            }
        }
    }
    // serialize the table margin
    private serializeTableMargins(writer: XmlWriter, format: any): void {
        this.serializeMargins(writer, format, 'tblCellMar');
    }
    // serialize the row margin
    private serializeRowMargins(writer: XmlWriter, format: any): void {
        writer.writeStartElement(undefined, 'tblPrEx', this.wNamespace);
        this.serializeMargins(writer, format, 'tblCellMar');
        writer.writeEndElement();
    }
    // serialize the cell margins
    private serializeCellMargins(writer: XmlWriter, format: any): void {
        this.serializeMargins(writer, format, 'tcMar');
    }
    // serialize the table margins, row margins, cell margins
    private serializeMargins(writer: XmlWriter, format: any, tag: string): void {
        writer.writeStartElement(undefined, tag, this.wNamespace);
        if (!isNullOrUndefined(format.topMargin)) {
            let topMargin: number = Math.round(format.topMargin * 20);
            writer.writeStartElement(undefined, 'top', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, topMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(format.leftMargin)) {
            let leftMargin: number = Math.round(format.leftMargin * 20);
            writer.writeStartElement(undefined, 'left', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, leftMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(format.bottomMargin)) {
            let bottomMargin: number = Math.round(format.bottomMargin * 20);
            writer.writeStartElement(undefined, 'bottom', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, bottomMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(format.rightMargin)) {
            let rightMargin: number = Math.round(format.rightMargin * 20);
            writer.writeStartElement(undefined, 'right', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, rightMargin.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
        writer.writeEndElement();
    }
    // Serialize the table borders
    private serializeShading(writer: XmlWriter, format: any): void {
        // if (format.textureStyle !== 'TextureNone') {
        writer.writeStartElement(undefined, 'shd', this.wNamespace);
        if (format.backgroundColor && format.backgroundColor !== 'empty') {
            writer.writeAttributeString(undefined, 'fill', this.wNamespace, this.getColor(format.backgroundColor));
        } else {
            writer.writeAttributeString(undefined, 'fill', this.wNamespace, 'auto');
        }
        if (format.foregroundColor === 'empty' || isNullOrUndefined(format.foregroundColor)) {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, 'auto');
        } else {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, this.getColor(format.foregroundColor));
        }
        if (!isNullOrUndefined(format.textureStyle)) {
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getTextureStyle(format.textureStyle));
        }
        writer.writeEndElement();
        // }
    }
    private getTextureStyle(textureStyle: any): string {
        switch (textureStyle) {
            case 'Texture5Percent':
            case 'Texture2Pt5Percent':
            case 'Texture7Pt5Percent':
                return 'pct5';
            case 'Texture10Percent':
                return 'pct10';
            case 'Texture12Pt5Percent':
                return 'pct12';
            case 'Texture15Percent':
            case 'Texture17Pt5Percent':
                return 'pct15';
            case 'Texture20Percent':
            case 'Texture22Pt5Percent':
                return 'pct20';
            case 'Texture25Percent':
            case 'Texture27Pt5Percent':
                return 'pct25';
            case 'Texture30Percent':
            case 'Texture32Pt5Percent':
                return 'pct30';
            case 'Texture35Percent':
                return 'pct35';
            case 'Texture37Pt5Percent':
                return 'pct37';
            case 'Texture40Percent':
            case 'Texture42Pt5Percent':
                return 'pct40';
            case 'Texture45Percent':
            case 'Texture47Pt5Percent':
                return 'pct45';
            case 'Texture50Percent':
            case 'Texture52Pt5Percent':
                return 'pct50';
            case 'Texture55Percent':
            case 'Texture57Pt5Percent':
                return 'pct55';
            case 'Texture60Percent':
                return 'pct60';
            case 'Texture62Pt5Percent':
                return 'pct62';
            case 'Texture65Percent':
            case 'Texture67Pt5Percent':
                return 'pct65';
            case 'Texture70Percent':
            case 'Texture72Pt5Percent':
                return 'pct70';
            case 'Texture75Percent':
            case 'Texture77Pt5Percent':
                return 'pct75';
            case 'Texture80Percent':
            case 'Texture82Pt5Percent':
                return 'pct80';
            case 'Texture85Percent':
                return 'pct85';
            case 'Texture87Pt5Percent':
                return 'pct87';
            case 'Texture90Percent':
            case 'Texture92Pt5Percent':
                return 'pct90';
            case 'Texture95Percent':
            case 'Texture97Pt5Percent':
                return 'pct95';
            case 'TextureCross':
                return 'thinHorzCross';
            case 'TextureDarkCross':
                return 'horzCross';
            case 'TextureDarkDiagonalCross':
                return 'diagCross';
            case 'TextureDarkDiagonalDown':
                return 'reverseDiagStripe';
            case 'TextureDarkDiagonalUp':
                return 'diagStripe';
            case 'TextureDarkHorizontal':
                return 'horzStripe';
            case 'TextureDarkVertical':
                return 'vertStripe';
            case 'TextureDiagonalCross':
                return 'thinDiagCross';
            case 'TextureDiagonalDown':
                return 'thinReverseDiagStripe';
            case 'TextureDiagonalUp':
                return 'thinDiagStripe';
            case 'TextureHorizontal':
                return 'thinHorzStripe';
            case 'TextureSolid':
                return 'solid';
            case 'TextureVertical':
                return 'thinVertStripe';
            default:
                return 'clear';
        }
    }
    // Serialize the table borders
    private serializeTableBorders(writer: XmlWriter, format: any): void {
        let borders: any = format.borders;
        // if (IsNoneBorder(borders))
        //     return;
        writer.writeStartElement(undefined, 'tblBorders', this.wNamespace);
        this.serializeBorders(writer, format.borders, 8);
        writer.writeEndElement();
    }
    // Serialize the borders.
    private serializeBorders(writer: XmlWriter, borders: any, multipler: number): void {
        this.serializeBorder(writer, borders.top, 'top', multipler);
        this.serializeBorder(writer, borders.left, 'left', multipler);
        this.serializeBorder(writer, borders.bottom, 'bottom', multipler);
        this.serializeBorder(writer, borders.right, 'right', multipler);

        this.serializeBorder(writer, borders.horizontal, 'insideH', multipler);
        this.serializeBorder(writer, borders.vertical, 'insideV', multipler);
        this.serializeBorder(writer, borders.diagonalDown, 'tl2br', multipler);
        this.serializeBorder(writer, borders.diagonalUp, 'tr2bl', multipler);
    }
    // Serialize the table layout element
    private serializeTblLayout(writer: XmlWriter, format: any): void {
        if (!format.allowAutoFit) {
            writer.writeStartElement(undefined, 'tblLayout', this.wNamespace);
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'fixed');
            writer.writeEndElement();
        }
    }
    // Serializes the Border
    private serializeBorder(writer: XmlWriter, border: any, tagName: string, multiplier: number): void {
        let borderStyle: any = border.lineStyle;
        let sz: number = ((border.lineWidth ? border.lineWidth : 0) * multiplier);
        let space: number = border.space ? border.space : 0;

        if (borderStyle === 'Cleared') {
            writer.writeStartElement(undefined, tagName, this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'nil');
            writer.writeEndElement();
            return;
        } else if (((borderStyle === 'None' || isNullOrUndefined(borderStyle)) && !border.hasNoneStyle) || sz <= 0) {
            return;
        }
        writer.writeStartElement(undefined, tagName, this.wNamespace);
        writer.writeAttributeString('w', 'val', this.wNamespace, this.getBorderStyle(borderStyle));

        // if (border.color === '#000000')
        // {
        //     writer.writeAttributeString(undefined, 'color', this.wNamespace, 'auto');
        // }
        // else
        // {
        if (border.color) {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, this.getColor(border.color));
        }
        // }
        writer.writeAttributeString(undefined, 'sz', this.wNamespace, this.roundToTwoDecimal(sz).toString());
        writer.writeAttributeString(undefined, 'space', this.wNamespace, space.toString());
        if (border.shadow) {
            writer.writeAttributeString(undefined, 'shadow', this.wNamespace, 'on');
        }


        writer.writeEndElement();
    }
    // Get the border style as string
    private getBorderStyle(borderStyle: any): string {
        switch (borderStyle) {
            case 'Cleared':
                return 'cleared';
            case 'DashSmallGap':
                return 'dashSmallGap';
            case 'Triple':
                return 'triple';
            case 'Dot':
                return 'dotted';
            case 'DashDot':
                return 'dotDash';
            case 'DashLargeGap':
                return 'dashed';
            case 'DashDotDot':
                return 'dotDotDash';
            case 'Double':
                return 'double';
            case 'ThinThickSmallGap':
                return 'thinThickSmallGap';
            case 'ThickThinSmallGap':
                return 'thickThinSmallGap';
            case 'ThinThickThinSmallGap':
                return 'thinThickThinSmallGap';
            case 'ThickThinMediumGap':
                return 'thickThinMediumGap';
            case 'ThinThickMediumGap':
                return 'thinThickMediumGap';
            case 'ThinThickThinMediumGap':
                return 'thinThickThinMediumGap';
            case 'ThickThinLargeGap':
                return 'thickThinLargeGap';
            case 'ThinThickLargeGap':
                return 'thinThickLargeGap';
            case 'ThinThickThinLargeGap':
                return 'thinThickThinLargeGap';
            case 'Thick':
                return 'thick';
            case 'SingleWavy':
                return 'wave';
            case 'DoubleWavy':
                return 'doubleWave';
            case 'DashDotStroked':
                return 'dashDotStroked';
            case 'Engrave3D':
                return 'threeDEngrave';
            case 'Emboss3D':
                return 'threeDEmboss';
            case 'Outset':
                return 'outset';
            case 'Inset':
                return 'inset';
            // case 'None':
            //     return 'none';
            default:
                return 'single';
        }
    }
    // Serialize the table indentation.
    private serializeTableIndentation(writer: XmlWriter, format: any): void {
        if (!isNullOrUndefined(format.leftIndent)) {
            writer.writeStartElement(undefined, 'tblInd', this.wNamespace);
            let tableIndent: number = Math.round(format.leftIndent * this.twipsInOnePoint);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, tableIndent.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
    }
    // Serialize the cell spacing.
    private serializeCellSpacing(writer: XmlWriter, format: any): void {
        if (!isNullOrUndefined(format.cellSpacing) && format.cellSpacing > 0) {
            writer.writeStartElement(undefined, 'tblCellSpacing', this.wNamespace);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal((format.cellSpacing / 2) * this.twentiethOfPoint).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
    }
    // Serialize the table width
    private serializeTableWidth(writer: XmlWriter, table: any): void {

        writer.writeStartElement(undefined, 'tblW', this.wNamespace);
        if (table.tableFormat.preferredWidthType === 'Percent') {
            writer.writeAttributeString(undefined, 'w', this.wNamespace, (table.tableFormat.preferredWidth * this.percentageFactor).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'pct');
        } else if (table.tableFormat.preferredWidthType === 'Point') {
            let tableWidth: number = Math.round(table.tableFormat.preferredWidth * this.twipsInOnePoint);
            writer.writeAttributeString(undefined, 'w', this.wNamespace, tableWidth.toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
        } else {
            writer.writeAttributeString(undefined, 'w', this.wNamespace, '0');
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'auto');
        }
        writer.writeEndElement();
    }
    // Serialize the table alignment
    private serializeTableAlignment(writer: XmlWriter, format: any): void {
        writer.writeStartElement(undefined, 'jc', this.wNamespace);

        switch (format.tableAlignment) {
            case 'Right':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'right');
                break;
            case 'Center':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'center');
                break;
            default:
                writer.writeAttributeString('w', 'val', this.wNamespace, 'left');
                break;
        }

        writer.writeEndElement();
    }
    // Serialize the field
    private serializeFieldCharacter(writer: XmlWriter, field: any): void {
        writer.writeStartElement(undefined, 'r', this.wNamespace);
        this.serializeCharacterFormat(writer, field.characterFormat);
        writer.writeStartElement(undefined, 'fldChar', this.wNamespace);
        let type: string = field.fieldType === 0 ? 'begin'
            : field.fieldType === 1 ? 'end' : 'separate';
        writer.writeAttributeString(undefined, 'fldCharType', this.wNamespace, type);
        if (type === 'begin' && !isNullOrUndefined(field.formFieldData)) {
            let formFieldData: any = field.formFieldData;
            writer.writeStartElement(undefined, 'ffData', this.wNamespace);
            writer.writeStartElement(undefined, 'name', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.name);
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'enabled', this.wNamespace);
            writer.writeEndElement();
            if (formFieldData.hasOwnProperty('textInput')) {
                writer.writeStartElement(undefined, 'textInput', this.wNamespace);
                let type: any = formFieldData.textInput.type;
                if (type === 'Number' || 'Date') {
                    writer.writeStartElement(undefined, 'type', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.textInput.type.toString().toLowerCase());
                    writer.writeEndElement();
                }
                writer.writeStartElement(undefined, 'defalut', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.textInput.defaultValue);
                writer.writeEndElement();
                writer.writeStartElement(undefined, 'format', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.textInput.format);
                writer.writeEndElement();
                writer.writeEndElement();
            } else if (formFieldData.hasOwnProperty('checkBox')) {
                writer.writeStartElement(undefined, 'checkBox', this.wNamespace);
                if (formFieldData.checkBox.sizeType === 'Auto') {
                    writer.writeStartElement(undefined, 'sizeAuto', this.wNamespace);
                    writer.writeEndElement();
                } else {
                    writer.writeStartElement(undefined, 'size', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, this.roundToTwoDecimal(formFieldData.checkBox.size * 2).toString());
                    writer.writeEndElement();
                }
                writer.writeStartElement(undefined, 'defalut', this.wNamespace);
                writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.checkBox.defaultValue ? '1' : '0');
                writer.writeEndElement();
                if (formFieldData.checkBox.checked) {
                    writer.writeStartElement(undefined, 'checked', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.checkBox.checked ? '1' : '0');
                    writer.writeEndElement();
                }
                writer.writeEndElement();
            } else {
                writer.writeStartElement(undefined, 'ddList', this.wNamespace);
                if (formFieldData.dropDownList.selectedIndex !== 0) {
                    writer.writeStartElement(undefined, 'result', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.dropDownList.selectedIndex.toString());
                    writer.writeEndElement();
                }
                for (let i: number = 0; i < formFieldData.dropDownList.dropDownItems.length; i++) {
                    writer.writeStartElement(undefined, 'listEntry', this.wNamespace);
                    writer.writeAttributeString(undefined, 'val', this.wNamespace, formFieldData.dropDownList.dropDownItems[i].toString());
                    writer.writeEndElement();
                }
                writer.writeEndElement();
            }
            writer.writeEndElement();
        }
        writer.writeEndElement();
        writer.writeEndElement();
        if (field.fieldType === 0 && field.fieldCodeType === 'FieldFormTextInput') {
            writer.writeStartElement('w', 'r', this.wNamespace);
            writer.writeStartElement(undefined, 'instrText', this.wNamespace);
            writer.writeAttributeString('xml', 'space', this.xmlNamespace, 'preserve');
            writer.writeString('FORMTEXT');
            writer.writeEndElement();
            writer.writeEndElement();
        }
    }
    // Serialize the text range.
    private serializeTextRange(writer: XmlWriter, span: any, previousNode: any, efType?: string): void {
        writer.writeStartElement('w', 'r', this.wNamespace);
        if (!isNullOrUndefined(span.characterFormat)) {
            this.serializeCharacterFormat(writer, span.characterFormat);
        }
        if (span.text === '\t') {
            writer.writeElementString(undefined, 'tab', this.wNamespace, undefined);
        } else if (span.text === '\v') {
            writer.writeElementString(undefined, 'br', this.wNamespace, undefined);
        } else if (span.text === '\f') {
            writer.writeStartElement(undefined, 'br', this.wNamespace);
            writer.writeAttributeString('w', 'type', this.wNamespace, 'page');
            writer.writeEndElement();
        } else if (encodeURI(span.text) === '%02') {
            writer.writeStartElement(undefined, 'footnoteRef', this.wNamespace);
            writer.writeEndElement();
        } else if (encodeURI(span.text) === '%02' && efType === 'endnote') {
            writer.writeStartElement(undefined, 'endnoteRef', this.wNamespace);
            writer.writeEndElement();
        } else if (encodeURI(span.text) === '%03') {
            writer.writeStartElement(undefined, 'separator', this.wNamespace);
            writer.writeEndElement();
        } else if (encodeURI(span.text) === '%04') {
            writer.writeStartElement(undefined, 'continuationSeparator', this.wNamespace);
            writer.writeEndElement();
        } else {
            let isDeleteText: boolean = this.retrieveDeleteRevision(span);
            let isField: boolean = !isNullOrUndefined(previousNode)
                && previousNode.hasOwnProperty('fieldType') && previousNode.fieldType !== 2;
            let localName: string = isField ? isDeleteText ? 'delInstrText' : 'instrText' : isDeleteText ? 'delText' : 't';
            writer.writeStartElement(undefined, localName, this.wNamespace);
            writer.writeAttributeString('xml', 'space', this.xmlNamespace, 'preserve');
            writer.writeString(span.text);
            writer.writeEndElement();
        }

        writer.writeEndElement();
    }
    private retrieveDeleteRevision(span: any): boolean {
        if (span.hasOwnProperty('revisionIds')) {
            if (span.revisionIds.length > 0) {
                for (let i: number = 0; i < span.revisionIds.length; i++) {
                    if (this.retrieveRevision(span.revisionIds[i]).revisionType === 'Deletion') {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    // Serializes the paragraph format
    private serializeParagraphFormat(writer: XmlWriter, paragraphFormat: any, paragraph: any): void {
        if (isNullOrUndefined(paragraphFormat)) {
            return;
        }
        if (!isNullOrUndefined(paragraphFormat.styleName)) {
            writer.writeStartElement(undefined, 'pStyle', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, paragraphFormat.styleName);
            writer.writeEndElement(); //end of pStyle
        }
        if (!isNullOrUndefined(paragraph)) {
            this.serializeListFormat(writer, paragraph.paragraphFormat.listFormat);
        } else {
            this.serializeListFormat(writer, paragraphFormat.listFormat);
        }
        if (paragraphFormat.bidi) {
            writer.writeStartElement(undefined, 'bidi', this.wNamespace);
            writer.writeEndElement();
        }

        if (!isNullOrUndefined(paragraphFormat.keepWithNext) && paragraphFormat.keepWithNext) {
            writer.writeStartElement(undefined, 'keepNext', this.wNamespace);
            writer.writeEndElement();
        }

        if (!isNullOrUndefined(paragraphFormat.keepLinesTogether) && paragraphFormat.keepLinesTogether) {
            writer.writeStartElement(undefined, 'keepLines', this.wNamespace);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(paragraphFormat.outlineLevel)) {
            writer.writeStartElement(undefined, 'outlineLvl', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getOutlineLevelValue(paragraphFormat.outlineLevel).toString());
            writer.writeEndElement();
        }
        this.serializeParagraphSpacing(writer, paragraphFormat);
        if (!isNullOrUndefined(paragraphFormat.contextualSpacing)) {
            writer.writeStartElement('w', 'contextualSpacing', this.wNamespace);
            if (!paragraphFormat.contextualSpacing) {
                writer.writeAttributeString('w', 'val', this.wNamespace, '0');
            }
            writer.writeEndElement();
        }
        this.serializeIndentation(writer, paragraphFormat);
        this.serializeParagraphAlignment(writer, paragraphFormat.textAlignment, paragraphFormat.bidi);
        if (!isNullOrUndefined(paragraphFormat.tabs) && paragraphFormat.tabs.length > 0) {
            this.serializeTabs(writer, paragraphFormat.tabs);
        }
    }

    private getOutlineLevelValue(outlineLvl: string): number {
        if (outlineLvl.indexOf('Level') !== -1) {
            let lvlNumber: number = parseInt(outlineLvl.substring(5), 10);
            if (lvlNumber > 0) {
                return lvlNumber - 1;
            }
        }
        return 9;
    }

    // Serialize Tabs
    private serializeTabs(writer: XmlWriter, tabStops: WTabStop[]): void {
        writer.writeStartElement('w', 'tabs', this.wNamespace);
        for (let i: number = 0; i < tabStops.length; i++) {
            this.serializeTab(writer, tabStops[i]);
        }
        writer.writeEndElement();
    }
    private serializeTab(writer: XmlWriter, tabStop: WTabStop): void {
        let position: number = 0;
        writer.writeStartElement('w', 'tab', this.wNamespace);
        if (tabStop.position === 0 && tabStop.deletePosition !== 0) {
            position = tabStop.deletePosition * this.twentiethOfPoint;
            writer.writeAttributeString('w', 'val', this.wNamespace, 'clear');
        } else {
            position = tabStop.position * this.twentiethOfPoint;
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getTabJustification(tabStop.tabJustification));
        }
        if (!isNullOrUndefined(tabStop.tabLeader) && (tabStop.tabLeader !== 'None')) {
            writer.writeAttributeString('w', 'leader', this.wNamespace, this.getTabLeader(tabStop.tabLeader));
        }
        if (!isNaN(position)) {
            writer.writeAttributeString('w', 'pos', this.wNamespace, position.toString() + '');
        }
        writer.writeEndElement();
    }
    private getTabLeader(tabLeader: TabLeader): string {
        switch (tabLeader) {
            case 'Dot':
                return 'dot';
            case 'Hyphen':
                return 'hyphen';
            case 'Underscore':
                return 'underscore';
            default:
                return 'none';
        }
    }
    private getTabJustification(tabJustification: TabJustification): string {
        switch (tabJustification) {
            case 'Bar':
                return 'bar';
            case 'Center':
                return 'center';
            case 'Decimal':
                return 'decimal';
            case 'Left':
                return 'left';
            case 'List':
                return 'num';
            case 'Right':
                return 'right';
            default:
                return 'clear';
        }
    }
    // // Seraializes the pargraph list format
    // private serializeListParagraph(writer: XmlWriter, paragraph: any): void {
    //     if (!isNullOrUndefined(paragraph.paragraphFormat.listFormat)) {
    //         this.serializeListFormat(writer, paragraph.paragraphFormat.listFormat);
    //     }
    // }
    // Serialize the list format
    private serializeListFormat(writer: XmlWriter, lf: any): void {
        // let pStyleName = undefined;

        // if (lf.CurrentListStyle.IsBuiltInStyle && !isNullOrUndefined(lf.OwnerParagraph))
        // {
        //     pStyleName = lf.OwnerParagraph.StyleName;
        // }

        // int listId = GetListId(lf);

        // if (!isNullOrUndefined(pStyleName) && string.IsNullOrEmpty(lf.LFOStyleName)) 
        // {
        //     WordDocument doc = lf.OwnerParagraph.Document;
        //     WParagraphStyle style = doc.Styles.FindByName(pStyleName, StyleType.ParagraphStyle) as WParagraphStyle;

        //     if (style.ListIndex === -1)
        //     {
        //         ListStyle lstStyle = lf.OwnerParagraph.Document.ListStyles.FindByName(lf.CustomStyleName);
        //         style.ListIndex = listId;

        //         if (lstStyle.Levels.length > 1)
        //         {
        //             style.ListLevel = lf.ListLevelNumber;
        //         }

        //         pStyleName = pStyleName.Replace(' ', '');
        //         lstStyle.Levels[lf.ListLevelNumber].ParaStyleName = pStyleName;
        //     }
        // }
        // else
        // {
        // if (!isNullOrUndefined(lf.listId) && !isNullOrUndefined(lf.listLevelNumber)) {
        //     this.serializeNumPr(writer, lf.listId, lf.listLevelNumber);
        // }
        // }
        if (!isNullOrUndefined(lf.listId) || !isNullOrUndefined(lf.listLevelNumber)) {
            writer.writeStartElement(undefined, 'numPr', this.wNamespace);

            if (!isNullOrUndefined(lf.listLevelNumber) && lf.listLevelNumber !== -1) {
                writer.writeStartElement(undefined, 'ilvl', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, lf.listLevelNumber.toString());
                writer.writeEndElement();
            }

            if (!isNullOrUndefined(lf.listId)) {
                writer.writeStartElement(undefined, 'numId', this.wNamespace);
                let listId = (lf.listId + 1).toString()
                if (lf.listId === -1) {
                    listId = '';
                }
                writer.writeAttributeString('w', 'val', this.wNamespace, listId);
                writer.writeEndElement();
            }

            writer.writeEndElement();
        }
    }
    // // Serializes the numbering properties to the paragraph
    // private serializeNumPr(writer: XmlWriter, listId: number, listLevel: number): void {
    //     writer.writeStartElement(undefined, 'numPr', this.wNamespace);

    //     if (listLevel !== -1) {
    //         writer.writeStartElement(undefined, 'ilvl', this.wNamespace);
    //         writer.writeAttributeString('w', 'val', this.wNamespace, listLevel.toString());
    //         writer.writeEndElement();
    //     }

    //     if (listId !== -1) {
    //         writer.writeStartElement(undefined, 'numId', this.wNamespace);
    //         writer.writeAttributeString('w', 'val', this.wNamespace, listId.toString());
    //         writer.writeEndElement();
    //     }

    //     writer.writeEndElement();
    // }
    private serializeParagraphAlignment(writer: XmlWriter, txtAlignment: any, isBidi: boolean): void {
        if (isBidi) {
            if (txtAlignment === 'Right') {
                txtAlignment = 'Left';
            } else if (txtAlignment === 'Left') {
                txtAlignment = 'Right';
            }
        }
        if (!isNullOrUndefined(txtAlignment)) {
            writer.writeStartElement(undefined, 'jc', this.wNamespace);
            let alignment: string;
            switch (txtAlignment) {
                case 'Center':
                    alignment = 'center';
                    break;
                case 'Right':
                    alignment = 'right';
                    break;
                case 'Justify':
                    alignment = 'both';
                    break;
                default:
                    alignment = 'left';
                    break;
            }
            writer.writeAttributeString('w', 'val', this.wNamespace, alignment);
            writer.writeEndElement();
        }
    }
    // Serializes the paragraph spacings
    private serializeParagraphSpacing(writer: XmlWriter, paragraphFormat: any): void {
        writer.writeStartElement(undefined, 'spacing', this.wNamespace);
        // if (paragraphFormat.HasValue(WParagraphFormat.BeforeLinesKey))
        // {
        //     short beforeLines = (short)Math.Round(paragraphFormat.BeforeLines * DLSConstants.HundredthsUnit);
        //     writer.WriteAttributeString('beforeLines', this.wNamespace, ToString((float)beforeLines));               
        // }
        // if (paragraphFormat.HasValue(WParagraphFormat.AfterLinesKey))
        // {
        //     short afterLines = (short)Math.Round(paragraphFormat.AfterLines * DLSConstants.HundredthsUnit);
        //     writer.WriteAttributeString('afterLines', this.wNamespace, ToString((float)afterLines));                 
        // }
        if (!isNullOrUndefined(paragraphFormat.beforeSpacing)) {
            writer.writeAttributeString(undefined, 'before', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.beforeSpacing * this.twentiethOfPoint).toString());
        }
        //TODO:ISSUEFIX(paragraphFormat.beforeSpacing * this.twentiethOfPoint).toString());

        // if (paragraphFormat.HasValue(WParagraphFormat.SpacingBeforeAutoKey))
        // {
        //     if (paragraphFormat.SpaceBeforeAuto)
        //     {
        //         writer.WriteAttributeString('beforeAutospacing', this.wNamespace, '1');
        //     }
        //     else
        //     {
        //         writer.WriteAttributeString('beforeAutospacing', this.wNamespace, '0');
        //     }
        // }


        if (!isNullOrUndefined(paragraphFormat.afterSpacing)) {
            writer.writeAttributeString(undefined, 'after', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.afterSpacing * this.twentiethOfPoint).toString());
        }
        //TODO:ISSUEFIX(paragraphFormat.afterSpacing * this.twentiethOfPoint).toString());


        // if (paragraphFormat.HasValue(WParagraphFormat.SpacingAfterAutoKey))
        // {
        //     if (paragraphFormat.SpaceAfterAuto)
        //     {
        //         writer.WriteAttributeString('afterAutospacing', this.wNamespace, '1');
        //     }
        //     else
        //     {
        //         writer.WriteAttributeString('afterAutospacing', this.wNamespace, '0');
        //     }
        // }


        //TODO:ISSUEFIX((paragraphFormat.lineSpacing) * this.twentiethOfPoint).toString());
        if (!isNullOrUndefined(paragraphFormat.lineSpacing)) {
            let lineSpacingValue: number = (paragraphFormat.lineSpacingType === 'AtLeast' || paragraphFormat.lineSpacingType === 'Exactly') ? this.roundToTwoDecimal(paragraphFormat.lineSpacing * this.twentiethOfPoint) : this.roundToTwoDecimal(paragraphFormat.lineSpacing * 240);
            writer.writeAttributeString(undefined, 'line', this.wNamespace, lineSpacingValue.toString());
        }
        if (!isNullOrUndefined(paragraphFormat.lineSpacingType)) {
            let lineSpacingType: string = 'auto';
            if (paragraphFormat.lineSpacingType === 'AtLeast') {
                lineSpacingType = 'atLeast';
            } else if (paragraphFormat.lineSpacingType === 'Exactly') {
                lineSpacingType = 'exact';
            }
            writer.writeAttributeString(undefined, 'lineRule', this.wNamespace, lineSpacingType);
        }
        writer.writeEndElement();
    }
    // Serializes the paragraph indentation
    private serializeIndentation(writer: XmlWriter, paragraphFormat: any): void {

        writer.writeStartElement(undefined, 'ind', this.wNamespace);
        if (!isNullOrUndefined(paragraphFormat.leftIndent)) {
            writer.writeAttributeString(undefined, 'left', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.leftIndent * this.twipsInOnePoint).toString());
        }
        if (!isNullOrUndefined(paragraphFormat.rightIndent)) {
            writer.writeAttributeString(undefined, 'right', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.rightIndent * this.twipsInOnePoint).toString());
        }
        if (!isNullOrUndefined(paragraphFormat.firstLineIndent)) {
            if (paragraphFormat.firstLineIndent < 0) {
                writer.writeAttributeString(undefined, 'hanging', this.wNamespace, this.roundToTwoDecimal(-1 * paragraphFormat.firstLineIndent * this.twipsInOnePoint).toString());
            } else {
                writer.writeAttributeString(undefined, 'firstLine', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.firstLineIndent * this.twipsInOnePoint).toString());
            }
        }
        writer.writeEndElement();
    }
    //creates custom xml mapping
    private serializeCustomXMLMapping(customXML: any, writer: XmlWriter): any {
        if (customXML.length > 0) {
            let keys: string = customXML.keys;
            for (let i: number = 0; i < keys.length; i++) {
                let customXmlWriter: XmlWriter = new XmlWriter();
                customXmlWriter.writeStartElement(undefined, 'Relationships', this.rpNamespace);
                let xmlData: any = this.mCustomXML.get(keys[i]);
                let itemID: string = keys[i];
                let id: string = this.getNextRelationShipID();
                let fileIndex: number = i + 1;
                let itemPath: string = this.createXMLItem(xmlData, id, fileIndex);
                let itemPropsPath: string = this.createXMLItemProps(itemID, fileIndex);
                this.serializeRelationShip(writer, id, this.customXmlRelType, '../' + itemPath);
                this.customXMLRelation(customXmlWriter, fileIndex, itemPropsPath);
                customXmlWriter.writeEndElement();
                let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(customXmlWriter.buffer, this.customXMLRelPath + fileIndex + '.xml.rels');
                this.mArchive.addItem(zipArchiveItem);
            }
        }
    }
    private customXMLRelation(writer: XmlWriter, fileIndex: number, itemPropsPath: string): void {
        this.serializeRelationShip(writer, 'rId1', this.wordMLCustomXmlPropsRelType, itemPropsPath);
    }
    private createXMLItem(xmlData: any, id: string, fileIndex: number): any {
        let xmlBlob: Blob = new Blob([xmlData], { type: 'text/plain' });
        let itemPath: string = this.customXMLItemsPath + fileIndex + '.xml';
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(xmlBlob, itemPath);
        this.mArchive.addItem(zipArchiveItem);
        return itemPath;
    }
    private createXMLItemProps(itemID: string, fileIndex: number): any {
        let writer: XmlWriter = new XmlWriter();
        let customitemPropsPath: string = this.customXMLItemsPropspath + fileIndex + '.xml';
        let itemPropsPath: string = this.itemPropsPath + fileIndex + '.xml';
        writer.writeStartElement('ds', 'datastoreItem', this.wNamespace);
        writer.writeAttributeString('ds', 'itemID', undefined, itemID);
        writer.writeAttributeString('xmlns', 'ds', undefined, this.dsNamespace);
        writer.writeEndElement();
        this.customXMLProps.push(customitemPropsPath);
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, customitemPropsPath);
        this.mArchive.addItem(zipArchiveItem);
        return itemPropsPath;
    }
    // Serialize the styles (styles.xml)
    private serializeStyles(): void {

        let writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('w', 'styles', this.wNamespace);
        writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'w', undefined, this.wNamespace);
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');
        //writes the document defaults, latent styles and default styles.
        this.serializeDefaultStyles(writer);
        //writes the document styles
        this.serializeDocumentStyles(writer);

        writer.writeEndElement(); //end of styles tag
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.stylePath);
        this.mArchive.addItem(zipArchiveItem); //this.stylePath, styleStream, false, FileAttributes.Archive);
    }
    // Serializes the default styles (document default paragraph and character format)
    private serializeDefaultStyles(writer: XmlWriter): void {
        writer.writeStartElement(undefined, 'docDefaults', this.wNamespace);


        //if (HasDefaultCharFormat())
        //{
        writer.writeStartElement(undefined, 'rPrDefault', this.wNamespace);
        // if (!isNullOrUndefined(this.mDocument.characterFormat)) {
        this.serializeCharacterFormat(writer, this.defCharacterFormat);
        writer.writeEndElement(); // end of rPrDefault
        // }
        // else {
        //     writer.writeStartElement(undefined, 'rPr', this.wNamespace);
        //     writer.writeStartElement(undefined, 'rFonts', this.wNamespace);

        //     if (!string.IsNullOrEmpty(m_document.StandardAsciiFont))
        //         writer.WriteAttributeString('ascii', this.wNamespace, m_document.StandardAsciiFont);

        //     if (!string.IsNullOrEmpty(m_document.StandardFarEastFont))
        //         writer.WriteAttributeString('eastAsia', this.wNamespace, m_document.StandardFarEastFont);

        //     if (!string.IsNullOrEmpty(m_document.StandardNonFarEastFont))
        //         writer.WriteAttributeString('hAnsi', this.wNamespace, m_document.StandardNonFarEastFont);

        //     if (!string.IsNullOrEmpty(m_document.StandardBidiFont))
        //         writer.WriteAttributeString('cs', this.wNamespace, m_document.StandardBidiFont);

        //     writer.WriteEndElement();

        //     float fontSize = GetDefFontSize(m_document, WCharacterFormat.FontSizeKey);
        //     if (fontSize !== 0f)
        //     {
        //         writer.WriteStartElement('sz', this.wNamespace);
        //         writer.WriteAttributeString('val', this.wNamespace, (fontSize * 2).ToString(CultureInfo.InvariantCulture));
        //         writer.WriteEndElement();
        //     }

        //     fontSize = GetDefFontSize(m_document, WCharacterFormat.FontSizeBidiKey);
        //     if (fontSize !== 0f)
        //     {
        //         writer.WriteStartElement('szCs', this.wNamespace);
        //         writer.WriteAttributeString('val', this.wNamespace, (fontSize * 2).ToString(CultureInfo.InvariantCulture));
        //         writer.WriteEndElement();
        //     }

        //     writer.WriteEndElement();
        // }
        // writer.WriteEndElement();
        // //}

        writer.writeStartElement(undefined, 'pPrDefault', this.wNamespace);
        if (!isNullOrUndefined(this.defParagraphFormat)) {
            writer.writeStartElement(undefined, 'pPr', this.wNamespace);
            this.serializeParagraphFormat(writer, this.defParagraphFormat, undefined);
            writer.writeEndElement(); //end of pPr
        }
        writer.writeEndElement(); //end of pPrDefault
        // writer.WriteEndElement();


        // SerializeLatentStyles();

        // //Default styles
        // if (m_document.Styles.length === 0 || isNullOrUndefined(m_document.Styles.FindByName('Normal')))
        // {
        //     SerializeDefaultParagraphStyle();
        // }
        // if (!IsDocumentContainsDefaultTableStyle())
        // {
        //     SerializeTableNormalStyle();
        // }
        // if (isNullOrUndefined(m_document.Styles.FindByName('No List')) && isNullOrUndefined(m_document.Styles.FindByName('NoList')))
        //     SerializeNoListStyle();
        // if (isNullOrUndefined(m_document.Styles.FindByName('Table Grid')) && isNullOrUndefined(m_document.Styles.FindByName('TableGrid')))
        // {
        //     SerializeTableGridStyle();
        // }
        // }        
        writer.writeEndElement();
    }
    private serializeDocumentStyles(writer: XmlWriter): void {
        for (let i: number = 0; i < this.mStyles.length; i++) {
            let style: any = this.mStyles[i];
            writer.writeStartElement(undefined, 'style', this.wNamespace);
            let type: string = style.type === 'Paragraph' ? 'paragraph' : 'character';
            writer.writeAttributeString('w', 'type', this.wNamespace, type);
            writer.writeAttributeString('w', 'styleId', this.wNamespace, style.name);
            //name
            writer.writeStartElement(undefined, 'name', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, style.name);
            writer.writeEndElement();
            //basedOn
            if (!isNullOrUndefined(style.basedOn)) {
                writer.writeStartElement(undefined, 'basedOn', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, style.basedOn);
                writer.writeEndElement();
            }
            //next
            if (!isNullOrUndefined(style.next)) {
                writer.writeStartElement(undefined, 'next', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, style.next);
                writer.writeEndElement();
            }
            //link
            if (!isNullOrUndefined(style.link)) {
                writer.writeStartElement(undefined, 'link', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, style.link);
                writer.writeEndElement();
            }
            if (style.type === 'Paragraph') {
                writer.writeStartElement(undefined, 'pPr', this.wNamespace);
                this.serializeParagraphFormat(writer, style.paragraphFormat, undefined);
                writer.writeEndElement();
            }
            // let value = (style.characterFormat as WCharacterFormat).newgetCharacterFormat();
            this.serializeCharacterFormat(writer, style.characterFormat);
            writer.writeEndElement(); //end of Style
        }
    }
    // Serializes the Character format
    private serializeCharacterFormat(writer: XmlWriter, characterFormat: any): void {
        writer.writeStartElement(undefined, 'rPr', this.wNamespace);
        if (!isNullOrUndefined(characterFormat.styleName)) {
            writer.writeStartElement(undefined, 'rStyle', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, characterFormat.styleName);
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.fontFamily)) {
            writer.writeStartElement(undefined, 'rFonts', this.wNamespace);
            writer.writeAttributeString(undefined, 'ascii', this.wNamespace, characterFormat.fontFamily);
            writer.writeAttributeString(undefined, 'hAnsi', this.wNamespace, characterFormat.fontFamily);
            writer.writeAttributeString(undefined, 'eastAsia', this.wNamespace, characterFormat.fontFamily);
            writer.writeAttributeString(undefined, 'cs', this.wNamespace, characterFormat.fontFamilyBidi);
            writer.writeEndElement(); //end         
        }
        if (!isNullOrUndefined(characterFormat.bold)) {
            this.serializeBoolProperty(writer, 'b', characterFormat.bold);
        }
        if (characterFormat.boldBidi) {
            this.serializeBoolProperty(writer, 'bCs', characterFormat.boldBidi);
        }
        if (!isNullOrUndefined(characterFormat.italic)) {
            this.serializeBoolProperty(writer, 'i', characterFormat.italic);
        }
        if (!isNullOrUndefined(characterFormat.italicBidi)) {
            this.serializeBoolProperty(writer, 'iCs', characterFormat.italicBidi);
        }
        if (characterFormat.bidi) {
            writer.writeStartElement(undefined, 'rtl', this.wNamespace);
            writer.writeEndElement();
        }
        if (characterFormat.allCaps) {
            this.serializeBoolProperty(writer, 'caps', characterFormat.allCaps);
        }
        if (!isNullOrUndefined(characterFormat.strikethrough)) {
            switch (characterFormat.strikethrough) {
                case 'SingleStrike':
                    this.serializeBoolProperty(writer, 'strike', true);
                    break;
                case 'DoubleStrike':
                    this.serializeBoolProperty(writer, 'dstrike', true);
                    break;
                default:
                    this.serializeBoolProperty(writer, 'strike', false);
                    this.serializeBoolProperty(writer, 'dstrike', false);
                    break;

            }
        }
        if (!isNullOrUndefined(characterFormat.fontColor)) {
            writer.writeStartElement(undefined, 'color', this.wNamespace);
            // "empty" is old value used for auto color till v19.2.49. It is maintained for backward compatibility.
            if (characterFormat.fontColor === 'empty' || characterFormat.fontColor === '#00000000') {
                writer.writeAttributeString('w', 'val', this.wNamespace, 'auto');
            } else {
                writer.writeAttributeString('w', 'val', this.wNamespace, this.getColor(characterFormat.fontColor));
            }
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.fontSize)) {
            writer.writeStartElement(undefined, 'sz', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.roundToTwoDecimal(characterFormat.fontSize * 2).toString());
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.fontSizeBidi)) {
            writer.writeStartElement(undefined, 'szCs', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.roundToTwoDecimal(characterFormat.fontSizeBidi * 2).toString());
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.highlightColor) && characterFormat.highlightColor !== 'NoColor') {
            writer.writeStartElement(undefined, 'highlight', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getHighlightColor(characterFormat.highlightColor));
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.revisionIds) && characterFormat.revisionIds.length > 0) {
            this.serializeRevisionStart(writer, characterFormat, undefined);
            this.serializeRevisionEnd(writer, characterFormat, undefined);
        }
        if (!isNullOrUndefined(characterFormat.underline) && characterFormat.underline !== 'None') {
            writer.writeStartElement(undefined, 'u', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getUnderlineStyle(characterFormat.underline));
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.baselineAlignment)) {
            writer.writeStartElement(undefined, 'vertAlign', this.wNamespace);
            switch (characterFormat.baselineAlignment) {
                case 'Subscript':
                    writer.writeAttributeString('w', 'val', this.wNamespace, 'subscript');
                    break;
                case 'Superscript':
                    writer.writeAttributeString('w', 'val', this.wNamespace, 'superscript');
                    break;
                default:
                    writer.writeAttributeString('w', 'val', this.wNamespace, 'baseline');
                    break;
            }
            writer.writeEndElement();
        }
        writer.writeEndElement(); //end of rPrChange

    }
    private getColor(color: string): string {
        if (color.length > 0) {
            if (color[0] === '#') {
                color = color.substr(1);
            }
            if (color.length > 6) {
                color = color.substr(0, 6);
            }
        }
        return color;
    }
    // Get the underline style as string
    private getUnderlineStyle(underlineStyle: any): string {
        switch (underlineStyle) {
            case 'DotDotDashHeavy':
                return 'dashDotDotHeavy';
            case 'DotDashHeavy':
                return 'dashDotHeavy';
            case 'DashHeavy':
                return 'dashedHeavy';
            case 'DashLong':
                return 'dashLong';
            case 'DashLongHeavy':
                return 'dashLongHeavy';
            case 'DotDash':
                return 'dotDash';
            case 'DotDotDash':
                return 'dotDotDash';
            case 'Dotted':
                return 'dotted';
            case 'DottedHeavy':
                return 'dottedHeavy';
            case 'Double':
                return 'double';
            case 'Single':
                return 'single';
            case 'Thick':
                return 'thick';
            case 'Wavy':
                return 'wave';
            case 'WavyDouble':
                return 'wavyDouble';
            case 'WavyHeavy':
                return 'wavyHeavy';
            case 'Words':
                return 'words';
            default:
                return 'dash';
        }
    }
    private getHighlightColor(highlight: any): string {
        switch (highlight) {
            // Highlights the content with bright green (#ff00ff00) color.
            case 'BrightGreen':
                return 'green';
            // Highlights the content with turquoise (#ff00ffff) color.
            case 'Turquoise':
                return 'cyan';
            // Highlights the content with pink (#ffff00ff) color.
            case 'Pink':
                return 'magenta';
            // Highlights the content with blue (#ff0000ff) color.
            case 'Blue':
                return 'blue';
            // Highlights the content with red (#ffff0000) color.
            case 'Red':
                return 'red';
            // Highlights the content with dark blue (#ff000080) color.
            case 'DarkBlue':
                return 'darkBlue';
            // Highlights the content with teal (#ff008080) color.
            case 'Teal':
                return 'darkCyan';
            // Highlights the content with green (#ff008000) color.
            case 'Green':
                return 'darkGreen';
            // Highlights the content with violet (#ff800080) color.
            case 'Violet':
                return 'darkMagenta';
            // Highlights the content with dark red (#ff800000) color.
            case 'DarkRed':
                return 'darkRed';
            // Highlights the content with dark yellow (#ff808000)  color.
            case 'DarkYellow':
                return 'darkYellow';
            // Highlights the content with gray 50 (#ff808080) color.
            case 'Gray50':
                return 'darkGray';
            // Highlights the content with gray 25 (#ffc0c0c0) color.
            case 'Gray25':
                return 'lightGray';
            // Highlights the content with black (#ff000000) color.
            case 'Black':
                return 'black';
            // Highlights the content with yellow (#ffffff00) color.
            default:
                return 'yellow';

        }

    }
    /*private toggleFirstCahar(text: string) {
        return text.charAt(0).toLowerCase() + text.slice(1);
    }*/
    // Serializes the bool character format property
    private serializeBoolProperty(writer: XmlWriter, tag: string, value: boolean): void {
        writer.writeStartElement(undefined, tag, this.wNamespace);
        if (!value) {
            writer.writeAttributeString(undefined, 'val', this.wNamespace, '0');
        }
        writer.writeEndElement();
    }
    // Serialize the list styles and numberings (numberings.xml)
    private serializeNumberings(): void {

        if (this.document.lists.length === 0) {
            return;
        }

        let writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('w', 'numbering', this.wNamespace);
        this.writeCommonAttributeStrings(writer);
        // this.serializePictureBullets(writer, this.mDocument.lists);
        this.serializeAbstractListStyles(writer, this.document.abstractLists);
        this.serializeListInstances(writer, this.document.lists);
        // SerializeListOverrides(writer, this.mDocument.ridesm_document.ListOverrides);
        writer.writeEndElement();
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.numberingPath);
        this.mArchive.addItem(zipArchiveItem);
    }
    // Serializes the abstract list styles
    private serializeAbstractListStyles(writer: XmlWriter, listStyles: any): void {
        for (let i: number = 0; i < listStyles.length; i++) {
            let abstractList: any = listStyles[i];
            writer.writeStartElement(undefined, 'abstractNum', this.wNamespace);
            writer.writeAttributeString(undefined, 'abstractNumId', this.wNamespace, abstractList.abstractListId.toString());
            writer.writeStartElement(undefined, 'nsid', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, this.generateHex());
            writer.writeEndElement();
            for (let ilvl: number = 0, cnt: number = abstractList.levels.length; ilvl < cnt; ilvl++) {
                this.serializeListLevel(writer, abstractList.levels[ilvl], ilvl);
            }
            writer.writeEndElement(); //end of abstractNum
        }
    }
    // Serializes the list styles
    private serializeListInstances(writer: XmlWriter, listStyles: any): void {
        for (let i: number = 0; i < listStyles.length; i++) {
            let list: any = listStyles[i];
            writer.writeStartElement(undefined, 'num', this.wNamespace);
            writer.writeAttributeString(undefined, 'numId', this.wNamespace, (list.listId + 1).toString());
            writer.writeStartElement(undefined, 'abstractNumId', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, list.abstractListId.toString());
            writer.writeEndElement();
            writer.writeEndElement();
        }
    }
    private generateHex(): string {
        return (Math.floor(Math.random() * (4000000000 - 270000000)) + 270000000).toString(16).toUpperCase();
    }
    private roundToTwoDecimal(num: number): number {
        return Math.round(num); // * 100) / 100;
    }
    // Serialize the list level
    private serializeListLevel(writer: XmlWriter, listLevel: any, levelIndex: number): void {
        writer.writeStartElement(undefined, 'lvl', this.wNamespace);
        writer.writeAttributeString(undefined, 'ilvl', this.wNamespace, levelIndex.toString());

        writer.writeStartElement(undefined, 'start', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, listLevel.startAt.toString());
        writer.writeEndElement();
        writer.writeStartElement(undefined, 'numFmt', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, this.getLevelPattern(listLevel.listLevelPattern));
        writer.writeEndElement();

        // if (listLevel.restartLevel > 0) {
        //     writer.writeStartElement(undefined, 'lvlRestart', this.wNamespace);
        //     writer.writeAttributeString(undefined, 'val', this.wNamespace, '0');
        //     writer.writeEndElement();
        // }

        // if (!isNullOrUndefined(listLevel.paragraphFormat)) {
        //     string name = listLevel.ParaStyleName.Substring(0, 1).ToUpper() + listLevel.ParaStyleName.Remove(0, 1);

        //     writer.WriteStartElement('pStyle', this.wNamespace);
        //     writer.WriteAttributeString('val', this.wNamespace, name);
        //     writer.WriteEndElement();
        // }

        // if (listLevel.IsLegalStyleNumbering) {
        //     writer.WriteStartElement('isLgl', this.wNamespace);
        //     writer.WriteEndElement();
        // }

        this.serializeLevelFollow(writer, listLevel);
        this.serializeLevelText(writer, listLevel, levelIndex + 1);

        // SerializeLegacyProperties(listLevel);

        // if (listLevel.PicBulletId > 0) {
        //     writer.WriteStartElement('lvlPicBulletId', this.wNamespace);
        //     writer.WriteAttributeString('val', this.wNamespace, listLevel.PicBulletId.ToString());
        //     writer.WriteEndElement();
        // }

        // //lvlJc
        // if (listLevel.NumberAlignment !== ListNumberAlignment.Left) {
        //     writer.WriteStartElement('lvlJc', this.wNamespace);
        //     string alignment = string.Empty;

        //     if (listLevel.NumberAlignment === ListNumberAlignment.Right) {
        //         alignment = 'right';
        //     }
        //     else {
        //         alignment = 'center';
        //     }
        //     writer.WriteAttributeString('val', this.wNamespace, alignment);

        //     writer.WriteEndElement();
        // }
        writer.writeStartElement(undefined, 'pPr', this.wNamespace);
        this.serializeParagraphFormat(writer, listLevel.paragraphFormat, undefined);
        writer.writeEndElement(); //end of pPr
        this.serializeCharacterFormat(writer, listLevel.characterFormat);
        writer.writeEndElement();
    }
    private getLevelPattern(levelPattern: any): string {
        let patternType: string;
        switch (levelPattern) {
            case 'Arabic':
                patternType = 'decimal';
                break;
            case 'UpRoman':
                patternType = 'upperRoman';
                break;
            case 'LowRoman':
                patternType = 'lowerRoman';
                break;
            case 'UpLetter':
                patternType = 'upperLetter';
                break;
            case 'LowLetter':
                patternType = 'lowerLetter';
                break;
            // case 'Ordinal':
            //     patternType = 'ordinal';
            //     break;
            // case 'Number':
            //     patternType = 'cardinalText';
            //     break;
            // case 'OrdinalText':
            //     patternType = 'ordinalText';
            //     break;
            // case 'LeadingZero':
            //     patternType = 'decimalZero';
            //     break;
            // case 'Bullet':
            default:
                patternType = 'bullet';
                break;
            // case 'FarEast':
            //     patternType = 'aiueoFullWidth';
            //     break;
            // case 'Special':
            //     patternType = 'russianLower';
            //     break;
            // case 'None':
            //     patternType = 'none';
            //     break;
        }
        return patternType;
    }
    // Serializes the level text
    private serializeLevelText(writer: XmlWriter, listLevel: any, lvlIndex: number): void {
        writer.writeStartElement(undefined, 'lvlText', this.wNamespace);

        writer.writeAttributeString(undefined, 'val', this.wNamespace, (listLevel.numberFormat));
        writer.writeEndElement();
    }
    // Serialize the level follow character
    private serializeLevelFollow(writer: XmlWriter, listLevel: any): void {
        let fc: string;
        //TODO:Type issue returns number instead of string
        if (listLevel.followCharacter === 'Tab') {
            fc = 'tab';
        } else if (listLevel.followCharacter === 'Space') {
            fc = 'space';
        } else {
            fc = 'nothing';
        }
        writer.writeStartElement(undefined, 'suff', this.wNamespace);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, fc);
        writer.writeEndElement();
    }
    private serializeDocumentProtectionSettings(writer: XmlWriter): void {
        writer.writeStartElement('w', 'documentProtection', this.wNamespace);
        if (this.formatting) {
            writer.writeAttributeString('w', 'formatting', this.wNamespace, '1');
        }
        if (this.protectionType && this.protectionType !== 'NoProtection') {
            let editMode: string = this.protectionType === 'ReadOnly' ? 'readOnly' : 'forms';
            writer.writeAttributeString('w', 'edit', this.wNamespace, editMode);
        }
        writer.writeAttributeString('w', 'cryptProviderType', this.wNamespace, 'rsaAES');
        writer.writeAttributeString('w', 'cryptAlgorithmClass', this.wNamespace, 'hash');
        writer.writeAttributeString('w', 'cryptAlgorithmType', this.wNamespace, 'typeAny');
        writer.writeAttributeString('w', 'cryptAlgorithmSid', this.wNamespace, '14');
        writer.writeAttributeString('w', 'cryptSpinCount', this.wNamespace, '100000');
        if (this.enforcement) {
            writer.writeAttributeString('w', 'enforcement', this.wNamespace, '1');
        }
        if (this.hashValue) {
            writer.writeAttributeString('w', 'hash', this.wNamespace, this.hashValue);
        }
        if (this.saltValue) {
            writer.writeAttributeString('w', 'salt', this.wNamespace, this.saltValue);
        }

        writer.writeEndElement();
    }
    private serializeSettings(): void {
        let writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('w', 'settings', this.wNamespace);
        this.writeCustom(writer);
        // writer.writeAttributeString('xmlns', 'mc', undefined, this.veNamespace);
        // writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        // writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        // writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        // writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'w14', undefined, this.w14Namespace);
        writer.writeAttributeString('xmlns', 'w15', undefined, this.w15Namespace);
        writer.writeAttributeString('xmlns', 'sl', undefined, this.slNamespace);
        writer.writeAttributeString('mc', 'Ignorable', undefined, 'w14 w15');


        // //w:writeProtection - Write Protection
        this.serializeDocumentProtectionSettings(writer);
        //w:view - Document View Setting
        // if (this.mDocument.ViewSetup.DocumentViewType !== DocumentViewType.PrintLayout &&
        //   m_document.ViewSetup.DocumentViewType !== DocumentViewType.NormalLayout)
        // {
        //     writer.writeStartElement('view', this.wNamespace);
        //     string viewTypeStr = string.Empty;
        //     if (m_document.ViewSetup.DocumentViewType === DocumentViewType.OutlineLayout)
        //     {
        //         viewTypeStr = 'outline';
        //     }
        //     else if (m_document.ViewSetup.DocumentViewType === DocumentViewType.WebLayout)
        //     {
        //         viewTypeStr = 'web';
        //     }
        //     writer.writeAttributeString('val', this.wNamespace, viewTypeStr);
        //     writer.writeEndElement();
        // }
        //w:zoom - Magnification Setting

        writer.writeStartElement('w', 'zoom', this.wNamespace);
        // switch (m_document.ViewSetup.ZoomType)
        // {
        //     case ZoomType.FullPage:
        //         writer.writeAttributeString('w', 'val', this.wNamespace, 'fullPage');
        //         break;
        //     case ZoomType.PageWidth:
        //         writer.writeAttributeString('w', 'val', this.wNamespace, 'bestFit');
        //         break;
        //     case ZoomType.TextFit:
        //         writer.writeAttributeString('w', 'val', this.wNamespace, 'textFit');
        //         break;
        // default:
        writer.writeAttributeString('w', 'val', this.wNamespace, 'none');
        // break;
        // }
        writer.writeAttributeString('w', 'percent', this.wNamespace, '100');
        writer.writeEndElement();

        //w:displayBackgroundShape - Display Background Objects When Displaying Document
        // if (m_document.Background.Type !== BackgroundType.NoBackground)
        // {
        writer.writeStartElement(undefined, 'displayBackgroundShape', this.wNamespace);
        writer.writeEndElement();
        // }
        //w:defaultTabStop - Distance Between Automatic Tab Stops
        writer.writeStartElement(undefined, 'defaultTabStop', this.wNamespace);
        let tabWidth: number = Math.round(this.defaultTabWidthValue * this.twipsInOnePoint);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, tabWidth.toString());
        writer.writeEndElement();
        if (this.trackChanges) {
            writer.writeStartElement(undefined, 'trackRevisions', this.wNamespace);
            writer.writeEndElement();
        }
        //w:evenAndOddHeaders - Different Even/Odd Page Headers and Footers        
        if (this.mDifferentFirstPage) {
            writer.writeStartElement(undefined, 'evenAndOddHeaders', this.wNamespace);
            writer.writeEndElement();
        }
        //w:footnotePr - Document-Wide Footnote Properties and w:endnotePr - Document-Wide Endnote Properties
        // SerializeFootnoteSettings();
        //w:compat - Compatibility Settings
        if (!this.formFieldShading) {
            writer.writeStartElement(undefined, 'doNotShadeFormData', this.wNamespace);
            writer.writeEndElement();
        }
        writer.writeStartElement(undefined, 'compat', this.wNamespace);
        if (this.dontUseHtmlParagraphAutoSpacing) {
            this.serializeBoolProperty(writer, 'doNotUseHTMLParagraphAutoSpacing', this.dontUseHtmlParagraphAutoSpacing);
        }
        writer.writeStartElement(undefined, 'compatSetting', this.wNamespace);
        writer.writeAttributeString(undefined, 'name', this.wNamespace, 'compatibilityMode');
        writer.writeAttributeString(undefined, 'uri', this.wNamespace, 'http://schemas.microsoft.com/office/word');
        let compatValue: string = HelperMethods.getCompatibilityModeValue(this.compatibilityMode);
        writer.writeAttributeString(undefined, 'val', this.wNamespace, compatValue);
        writer.writeEndElement();
        writer.writeEndElement();
        if (this.document.footnotes) {
            //this.serializeFootNotesPr(writer, this.document.section.sectionFormat);
            writer.writeStartElement(undefined, 'footnotePr', this.wNamespace);
            writer.writeStartElement(undefined, 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'footnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            writer.writeEndElement();
            writer.writeEndElement();
        }
        if (this.document.endnotes) {
            // this.serializeEndNotesPr(writer, this.document.section.sectionFormat);
            writer.writeStartElement(undefined, 'endnotePr', this.wNamespace);
            writer.writeStartElement(undefined, 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '-1');
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'endnote', this.wNamespace);
            writer.writeAttributeString(undefined, 'id', this.wNamespace, '0');
            writer.writeEndElement();
            writer.writeEndElement();
        }
        writer.writeEndElement();
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.settingsPath);
        this.mArchive.addItem(zipArchiveItem);
    }
    private serializeCoreProperties(): void {
        //implementation
    }
    private serializeAppProperties(): void {
        //implementation
    }
    private serializeFontTable(contentType: String): void {
        //implementation
    }
    private serializeSettingsRelation(): void {
        //implementation
    }
    private serializeHeaderFooters(): void {
        this.serializeHeaderFooter('EvenFooter');
        this.serializeHeaderFooter('EvenHeader');
        this.serializeHeaderFooter('FirstPageFooter');
        this.serializeHeaderFooter('FirstPageHeader');
        this.serializeHeaderFooter('OddFooter');
        this.serializeHeaderFooter('OddHeader');
    }
    // Serializes the Header/Footer
    private serializeHeaderFooter(hfType: any): void {
        if (this.headersFooters.length === 0) {
            return;
        }

        let headerFooterPath: string;
        let headerFooterRelsPath: string;
        if (!this.headersFooters.containsKey(hfType)) {
            return;
        }
        let hfColl: Dictionary<string, any> = this.headersFooters.get(hfType);
        let hf: any = undefined;
        for (let i: number = 0; i < hfColl.keys.length; i++) {
            let id: string = hfColl.keys[i];
            hf = hfColl.get(id);

            if (hfType === 'EvenHeader' || hfType === 'FirstPageHeader' ||
                hfType === 'OddHeader') {
                headerFooterPath = this.headerPath + id.replace('rId', '') + '.xml';
                headerFooterRelsPath = this.headerRelationPath + id.replace('rId', '') + '.xml.rels';
                this.serializeHeader(hf, id, headerFooterPath, headerFooterRelsPath);
            } else {
                headerFooterPath = this.footerPath + id.replace('rId', '') + '.xml';
                headerFooterRelsPath = this.footerRelationPath + id.replace('rId', '') + '.xml.rels';
                this.serializeFooter(hf, id, headerFooterPath, headerFooterRelsPath);
            }
        }
    }
    // Serialize the header part
    private serializeHeader(header: any, id: string, headerFooterPath: string, headerFooterRelsPath: string): void {
        this.headerFooter = header;
        let writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('w', 'hdr', this.wNamespace);
        this.writeHFCommonAttributes(writer);
        let owner: any = this.blockOwner;
        this.blockOwner = header;
        this.serializeBodyItems(writer, header.blocks, true);
        this.blockOwner = owner;
        writer.writeEndElement();
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, headerFooterPath);
        this.mArchive.addItem(zipArchiveItem);
        this.serializeHFRelations(id, headerFooterRelsPath);
        this.headerFooter = undefined;
    }
    // Serializes the HeaderFooter relations
    private serializeHFRelations(hfId: string, headerFooterRelsPath: string): void {
        let hasHFImage: boolean = this.headerFooterImages.containsKey(hfId);
        // let hasHFHyperlinks = HeaderFooterHyperlinks.ContainsKey(hfId);
        // let hasHFInclPics = HeaderFooterInclPicUrls.ContainsKey(hfId);
        // let hasHFAlternateChunks = HeaderFooterAlternateChunks.ContainsKey(hfId);

        if (hasHFImage) { // || hasHFHyperlinks ||hasHFAlternateChunks

            let writer: XmlWriter = new XmlWriter();
            writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
            this.serializeImagesRelations(this.headerFooterImages.get(hfId), writer);
            // if (hasHFHyperlinks)
            //     SerializeHyperlinkRelations(stream, HeaderFooterHyperlinks[hfId]);
            // if (hasHFAlternateChunks)
            //     SerializeAltChunkRelations(stream, HeaderFooterAlternateChunks[hfId]);

            // if (hasHFInclPics)
            //     SerializeIncludePictureUrlRelations(stream, HeaderFooterInclPicUrls[hfId]);

            // if (HFOleContainers.ContainsKey(hfId))
            // {
            //     AddOLEToZip(HFOleContainers[hfId]);
            // }

            // if (HFRelations.ContainsKey(hfId))
            //     SerializeHFCommonRelations(stream, HFRelations[hfId]);

            writer.writeEndElement();

            let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, headerFooterRelsPath);
            this.mArchive.addItem(zipArchiveItem);

        } else {
            return;
        }
    }
    private writeHFCommonAttributes(writer: XmlWriter): void {
        writer.writeAttributeString('xmlns', 'v', undefined, this.vNamespace);
        writer.writeAttributeString('xmlns', 'w10', undefined, this.w10Namespace);
        writer.writeAttributeString('xmlns', 'o', undefined, this.oNamespace);
        writer.writeAttributeString('xmlns', 've', undefined, this.veNamespace);
        writer.writeAttributeString('xmlns', 'r', undefined, this.rNamespace);
        writer.writeAttributeString('xmlns', 'm', undefined, this.mNamespace);
        writer.writeAttributeString('xmlns', 'wne', undefined, this.wneNamespace);
        writer.writeAttributeString('xmlns', 'a', undefined, this.aNamespace);
        writer.writeAttributeString('xmlns', 'pic', undefined, this.pictureNamespace);
        writer.writeAttributeString('xmlns', 'wp', undefined, this.wpNamespace);
        writer.writeAttributeString('xmlns', 'wpc', undefined, this.wpCanvasNamespace);
        writer.writeAttributeString('xmlns', 'wp14', undefined, this.wpDrawingNamespace);
        this.writeDup(writer);
        writer.writeAttributeString('xmlns', 'wps', undefined, this.wpShapeNamespace);
        writer.writeAttributeString('ve', 'Ignorable', undefined, 'w14 w15 wp14');

    }
    // Serailize the footer and its relations
    private serializeFooter(footer: any, id: string, headerFooterPath: string, headerFooterRelsPath: string): void {
        this.headerFooter = footer;
        let writer: XmlWriter = new XmlWriter();
        writer.writeStartElement('w', 'ftr', this.wNamespace);
        this.writeHFCommonAttributes(writer);
        this.serializeBodyItems(writer, footer.blocks, true);

        writer.writeEndElement();

        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, headerFooterPath);
        this.mArchive.addItem(zipArchiveItem);

        this.serializeHFRelations(id, headerFooterRelsPath);

    }
    private serializeDocumentRelations(): void {

        let writer: XmlWriter = new XmlWriter();
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextRelationShipID(), this.stylesRelType, 'styles.xml');
        this.serializeRelationShip(writer, this.getNextRelationShipID(), this.settingsRelType, 'settings.xml');
        if (this.document.endnotes) {
            this.serializeRelationShip(writer, this.getNextRelationShipID(), this.endnoteRelType, 'endnotes.xml');
        }
        if (this.document.footnotes) {
            this.serializeRelationShip(writer, this.getNextRelationShipID(), this.footnoteRelType, 'footnotes.xml');
        }
        if (this.mComments.length > 0) {
            if (!(this.mComments.length === 1 && this.mComments[0].text === '')) {
                this.serializeRelationShip(writer, this.getNextRelationShipID(), this.commentsRelType, 'comments.xml');
                this.serializeRelationShip(writer, this.getNextRelationShipID(), this.commentsExRelType, 'commentsExtended.xml');
            }
        }
        // this.serializeRelationShip(writer, this.getNextRelationShipID(), this.ThemeRelType, 'theme/theme1.xml');

        if (this.document.lists.length > 0) {
            this.serializeRelationShip(writer, this.getNextRelationShipID(), this.numberingRelType, 'numbering.xml');
        }


        //this.serializeFootnoteEndnoteRelations(writer);
        this.serializeHeaderFooterRelations(writer);

        //this.serializeFootnoteXMLMapping(writer);

        // if (HasFontTable) {
        //     SerializeRelationShip(docRelstream, GetNextRelationShipID(), this.FontTableRelType, 'fontTable.xml');
        // }

        // SerializeIncludePictureUrlRelations(docRelstream, InclPicFieldUrl);
        // //// Creating relationships for every hyperlink and image containing in the document
        this.serializeImagesRelations(this.documentImages, writer);
        // serialize custom xml
        this.serializeCustomXMLMapping(this.mCustomXML, writer);
        // serialize chart relations
        this.serializeChartDocumentRelations(this.documentCharts, writer);
        // SerializeSvgImageRelation();
        //this.serializeExternalLinkImages(writer);

        // if (HasHyperlink && HyperlinkTargets.length > 0) {
        //     SerializeHyperlinkRelations(docRelstream, HyperlinkTargets);
        // }

        // if (m_document.HasMacros
        //     && IsMacroEnabled)
        //     SerializeRelationShip(docRelstream, GetNextRelationShipID(), this.VbaProjectRelType, this.VbaProject);
        writer.writeEndElement();
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.wordRelationPath);
        this.mArchive.addItem(zipArchiveItem);
        this.headerFooter = undefined;
    }
    // serialize chart relations
    private serializeChartDocumentRelations(charts: Dictionary<string, any>, writer: XmlWriter): void {
        if (charts.length > 0) {
            let keys: string[] = charts.keys;
            for (let i: number = 1; i <= keys.length; i++) {
                this.serializeRelationShip(writer, keys[i - 1], this.chartRelType, 'charts/chart' + i + '.xml');
            }
        }
    }
    private serializeChartRelations(): void {
        let writer: XmlWriter = new XmlWriter();
        this.resetChartRelationShipId();
        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        let chartColorPath: string = 'colors' + this.chartCount + '.xml';
        let chartRelationPath: string = this.chartPath + '/_rels/chart' + this.chartCount + '.xml.rels';
        let chartExcelPath: string = '../embeddings/Microsoft_Excel_Worksheet' + this.chartCount + '.xlsx';
        this.serializeRelationShip(writer, this.getNextChartRelationShipID(), this.packageRelType, chartExcelPath);
        this.serializeRelationShip(writer, this.getNextChartRelationShipID(), this.chartColorStyleRelType, chartColorPath);
        writer.writeEndElement(); // end of relationships
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, chartRelationPath);
        this.mArchive.addItem(zipArchiveItem);
    }
    // Serializes the image relations
    private serializeImagesRelations(images: Dictionary<string, any>, writer: XmlWriter): void {
        if (images.length > 0) {
            let imagePath: string = '';
            let base64ImageString: string;
            let keys: string[] = images.keys;
            for (let i: number = 0; i < keys.length; i++) {
                let mImage: any = images.get(keys[i]);
                base64ImageString = mImage.imageString;

                if (isNullOrUndefined(base64ImageString)) {
                    imagePath = this.imagePath + '/0.jpeg';
                    this.serializeRelationShip(writer, keys[i], this.imageRelType, imagePath.replace('word/', ''));
                } else {
                    let imageInfo: ImageFormatInfo = HelperMethods.formatClippedString(base64ImageString);
                    let extension: string = imageInfo.extension;
                    let formatClippedString: string = imageInfo.formatClippedString;
                    imagePath = this.imagePath + keys[i] + extension;

                    this.serializeRelationShip(writer, keys[i], this.imageRelType, imagePath.replace('word/', ''));

                    //if (m_archive.Find(imagePath.Replace('\\', '/')) === -1)
                    // {
                    let imageBlob: Blob = new Blob([this.encodedString(formatClippedString)]);

                    let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(imageBlob, imagePath);
                    // let TestArchive = new ZipArchive();
                    this.mArchive.addItem(zipArchiveItem);

                    // TestArchive.save('image.zip').then(function (): void {
                    //     TestArchive.destroy();
                    // });
                    // }
                }

            }
        }
    }

    /**
     * @private
     */
    public encodedString(input: string): Uint8Array {
        let keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let chr1: number;
        let chr2: number;
        let chr3: number;
        let encode1: number;
        let encode2: number;
        let encode3: number;
        let encode4: number;
        let count: number = 0;
        let resultIndex: number = 0;

        /*let dataUrlPrefix: string = 'data:';*/

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        let totalLength: number = input.length * 3 / 4;
        if (input.charAt(input.length - 1) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (input.charAt(input.length - 2) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (totalLength % 1 !== 0) {
            // totalLength is not an integer, the length does not match a valid
            // base64 content. That can happen if:
            // - the input is not a base64 content
            // - the input is *almost* a base64 content, with a extra chars at the
            // beginning or at the end
            // - the input uses a base64 variant (base64url for example)
            throw new Error('Invalid base64 input, bad content length.');
        }


        let output: Uint8Array = new Uint8Array(totalLength | 0);

        while (count < input.length) {

            encode1 = keyStr.indexOf(input.charAt(count++));
            encode2 = keyStr.indexOf(input.charAt(count++));
            encode3 = keyStr.indexOf(input.charAt(count++));
            encode4 = keyStr.indexOf(input.charAt(count++));

            chr1 = (encode1 << 2) | (encode2 >> 4);
            chr2 = ((encode2 & 15) << 4) | (encode3 >> 2);
            chr3 = ((encode3 & 3) << 6) | encode4;

            output[resultIndex++] = chr1;

            if (encode3 !== 64) {
                output[resultIndex++] = chr2;
            }
            if (encode4 !== 64) {
                output[resultIndex++] = chr3;
            }
        }
        return output;
    }
    private serializeExternalLinkImages(writer: XmlWriter): void {
        let imagePath: string = '';
        let keys: string[] = this.externalImages.keys;
        for (let i: number = 0; i < this.externalImages.keys.length; i++) {
            this.serializeRelationShip(writer, keys[i], this.imageRelType, this.externalImages.get(keys[i]));
        }
    }
    // Serializes the HeaderFooters relations to the document relations stream
    private serializeHeaderFooterRelations(writer: XmlWriter): void {
        this.serializeHFRelation(writer, 'EvenFooter');
        this.serializeHFRelation(writer, 'EvenHeader');
        this.serializeHFRelation(writer, 'FirstPageFooter');
        this.serializeHFRelation(writer, 'FirstPageHeader');
        this.serializeHFRelation(writer, 'OddFooter');
        this.serializeHFRelation(writer, 'OddHeader');
    }
    // Serializes the headers footers relations.
    private serializeHFRelation(writer: XmlWriter, hfType: any): void {
        let headerFooterPath: string = '';
        let relType: string;

        if (!this.headersFooters.containsKey(hfType)) {
            return;
        }

        let hfColl: Dictionary<string, any> = this.headersFooters.get(hfType);
        for (let i: number = 0; i < hfColl.keys.length; i++) {
            let id: string = hfColl.keys[i];

            if (hfType === 'EvenHeader' || hfType === 'FirstPageHeader' ||
                hfType === 'OddHeader') {
                headerFooterPath = 'header' + id.replace('rId', '') + '.xml';
                relType = this.headerRelType;
            } else {
                headerFooterPath = 'footer' + id.replace('rId', '') + '.xml';
                relType = this.footerRelType;
            }
            this.serializeRelationShip(writer, id, relType, headerFooterPath);
        }
    }
    // Serializes the relationship
    private serializeRelationShip(writer: XmlWriter, relationshipID: string, relationshipType: string, targetPath: string): void {
        writer.writeStartElement(undefined, 'Relationship', undefined);
        writer.writeAttributeString(undefined, 'Id', undefined, relationshipID);
        writer.writeAttributeString(undefined, 'Type', undefined, relationshipType);
        writer.writeAttributeString(undefined, 'Target', undefined, targetPath.replace('\\', '/').replace('\v', ''));
        if (relationshipType === this.hyperlinkRelType || this.startsWith(targetPath, 'http://') || this.startsWith(targetPath, 'https://') || this.startsWith(targetPath, 'file:///')) {
            // Uri targetUri;
            // if ((!targetPath.StartsWith('file:///')) && Uri.TryCreate(targetPath, UriKind.Absolute, out targetUri))
            // {
            //     //Handled using Try catch to avoid exception if the Host name type is None because in 
            //Silverlight 'HostNameType' property is not available.
            //     try
            //     {
            //         m_writer.WriteAttributeString('Target', targetUri.AbsoluteUri);
            //     }
            //     catch
            //     {
            //         m_writer.WriteAttributeString('Target', targetPath.Replace('\\', '/').Replace(ControlChar.LineBreak, string.Empty));
            //     }
            // }
            // else
            // {
            //     m_writer.WriteAttributeString('Target', targetPath.Replace('\\', '/').Replace(ControlChar.LineBreak, string.Empty));
            // }
            writer.writeAttributeString(undefined, 'TargetMode', undefined, 'External');
        }
        writer.writeEndElement();
    }
    // Get the next relationship ID
    private getNextRelationShipID(): string {
        return 'rId' + (++this.mRelationShipID);
    }
    private getEFNextRelationShipID(): string {
        return (++this.efRelationShipId).toString();
    }
    private serializeGeneralRelations(): void {

        let writer: XmlWriter = new XmlWriter();
        this.resetRelationShipID();

        writer.writeStartElement(undefined, 'Relationships', this.rpNamespace);
        this.serializeRelationShip(writer, this.getNextRelationShipID(), this.documentRelType, this.documentPath);
        // this.serializeRelationShip(writer, this.getNextRelationShipID(), this.AppRelType, this.appPath);
        // this.serializeRelationShip(writer, this.getNextRelationShipID(), this.CoreRelType, this.corePath);

        //End of Relationships tag
        writer.writeEndElement();
        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.generalRelationPath);
        this.mArchive.addItem(zipArchiveItem);

    }
    private serializeContentTypes(contentType: String): void {

        let writer: XmlWriter = new XmlWriter();


        writer.writeStartElement(undefined, 'Types', 'http://schemas.openxmlformats.org/package/2006/content-types');
        //if (m_hasOleObject)
        //{
        //    //<Default Extension='bin' ContentType='application/vnd.openxmlformats-officedocument.oleObject'/>
        //    SerializeDefaultContentType(contentStream, 'bin', 'application/vnd.openxmlformats-officedocument.oleObject');
        //}
        this.serializeDefaultContentType(writer, 'rels', this.relationContentType);
        this.serializeDefaultContentType(writer, 'xml', this.xmlContentType);
        // if (m_hasEmbedFonts && !string.IsNullOrEmpty(type))
        // {
        //     SerializeDefaultContentType(contentStream,type, this.fontContentType);
        // }
        if (this.documentImages.length > 0 || this.externalImages.length > 0 || this.headerFooterImages.length > 0) {
            this.serializeDefaultContentType(writer, 'png', 'image/png');
            this.serializeDefaultContentType(writer, 'bmp', 'image/bmp');
            this.serializeDefaultContentType(writer, 'emf', 'image/x-emf');
            this.serializeDefaultContentType(writer, 'wmf', 'image/x-wmf');
            this.serializeDefaultContentType(writer, 'gif', 'image/gif');
            this.serializeDefaultContentType(writer, 'ico', 'image/x-icon');
            this.serializeDefaultContentType(writer, 'tif', 'image/tiff');
            this.serializeDefaultContentType(writer, 'tiff', 'image/tiff');
            this.serializeDefaultContentType(writer, 'jpeg', 'image/jpeg');
            this.serializeDefaultContentType(writer, 'jpg', 'image/jpeg');
            this.serializeDefaultContentType(writer, 'svg', 'image/svg+xml');
        }
        // if (m_document.HasMacros
        //     && IsMacroEnabled && !m_isSkipBinExtension)
        // {
        //     SerializeDefaultContentType(contentStream, 'bin', this.VbaProjectContentType);
        //     m_isSkipBinExtension = true;
        // }
        // if (m_hasOleObject)
        // {
        //     SerializeOleContentType(contentStream);
        // }



        //document.xml

        this.serializeOverrideContentType(writer, this.documentPath, this.documentContentType);


        //<Override PartName='/word/numbering.xml' ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml'/>
        // if (HasNumbering) {
        this.serializeOverrideContentType(writer, this.numberingPath, this.numberingContentType);
        // }

        //Add the header/footer Alternate chunks
        // if (HeaderFooterAlternateChunks.length > 0) {
        //     foreach(Dictionary < string, string > item in m_headerFooterAlternateChunks.Values)
        //     AddAlternateChunkItem(item);
        // }
        //styles.xml
        this.serializeOverrideContentType(writer, this.stylePath, this.stylesContentType);
        //settings.xml
        this.serializeOverrideContentType(writer, this.settingsPath, this.settingsContentType);
        this.serializeOverrideContentType(writer, this.commentsPath, this.commentsContentType);
        //comments.xml
        this.serializeOverrideContentType(writer, this.commentsExtendedPath, this.commentsExContentType);
        //charts.xml
        if (this.chartCount > 0) {
            let count: number = 1;
            this.serializeDefaultContentType(writer, 'xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            while (count <= this.chartCount) {
                this.serializeOverrideContentType(writer, 'word/charts/chart' + count + '.xml', this.chartsContentType);
                this.serializeOverrideContentType(writer, 'word/charts/colors' + count + '.xml', this.chartColorStyleContentType);
                count++;
            }
        }
        // Custom XML mapping
        if (this.customXMLProps.length > 0) {
            for (let i: number = 0; i < this.customXMLProps.length; i++) {
                this.serializeOverrideContentType(writer, this.customXMLProps[i], this.customXmlContentType);
            }
        }
        //             //core.xml
        //             SerializeOverrideContentType(contentStream, this.corePath, this.CoreContentType);
        //             //app.xml
        //             SerializeOverrideContentType(contentStream, this.appPath, this.AppContentType);
        //             //custom.xml
        //             if (!isNullOrUndefined(m_document.CustomDocumentProperties) && m_document.CustomDocumentProperties.length > 0)
        //                 SerializeOverrideContentType(contentStream, this.CustomPath, this.CustomContentType);
        // #if Chart
        //             if (m_hasChart)
        //                 SerializeChartContentType(contentStream);
        // #endif
        this.serializeHFContentTypes(writer);
        this.SerializeEFContentTypes(writer);
        // WriteXmlItemsContentTypes(contentStream);

        //End of Types tag
        writer.writeEndElement();

        let zipArchiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.contentTypesPath);
        this.mArchive.addItem(zipArchiveItem);


    }
    // Serializes the HeaderFooter content types
    private serializeHFContentTypes(writer: XmlWriter): void {
        this.serializeHeaderFootersContentType(writer, 'EvenFooter');
        this.serializeHeaderFootersContentType(writer, 'EvenHeader');
        this.serializeHeaderFootersContentType(writer, 'FirstPageFooter');
        this.serializeHeaderFootersContentType(writer, 'FirstPageHeader');
        this.serializeHeaderFootersContentType(writer, 'OddFooter');
        this.serializeHeaderFootersContentType(writer, 'OddHeader');
    }
    // Serializes the HeaderFooter content types.
    private serializeHeaderFootersContentType(writer: XmlWriter, headerFooterType: any): void {
        let contentType: string;
        let partName: string;

        if (!this.headersFooters.containsKey(headerFooterType)) {
            return;
        }

        let hfColl: Dictionary<string, any> = this.headersFooters.get(headerFooterType);
        for (let i: number = 0; i < hfColl.keys.length; i++) {
            let id: string = hfColl.keys[i];


            if (headerFooterType === 'EvenHeader' || headerFooterType === 'FirstPageHeader' ||
                headerFooterType === 'OddHeader') {
                partName = this.headerPath + id.replace('rId', '') + '.xml';
                contentType = this.headerContentType;
            } else {
                partName = this.footerPath + id.replace('rId', '') + '.xml';
                contentType = this.footerContentType;
            }
            this.serializeOverrideContentType(writer, partName, contentType);
        }
    }
    private SerializeEFContentTypes(writer: XmlWriter): void {
        this.serializeEFContentType(writer);
    }
    // Serializes the HeaderFooter content types.
    private serializeEFContentType(writer: XmlWriter): void {
        let contentType: string;
        let partName: string;
        partName = this.endnotesPath;
        contentType = this.endnoteContentType;
        this.serializeOverrideContentType(writer, partName, contentType);
        partName = this.footnotesPath;
        contentType = this.footnoteContentType;
        this.serializeOverrideContentType(writer, partName, contentType);
    }
    // Serializes the Override content type.
    private serializeOverrideContentType(writer: XmlWriter, partName: string, contentType: string): void {
        writer.writeStartElement(undefined, 'Override', undefined);
        writer.writeAttributeString(undefined, 'PartName', undefined, '/' + partName.replace('\\', '/'));
        writer.writeAttributeString(undefined, 'ContentType', undefined, contentType);
        writer.writeEndElement();
    }
    // Serializes the default content type
    private serializeDefaultContentType(writer: XmlWriter, extension: string, contentType: string): void {
        writer.writeStartElement(undefined, 'Default', undefined);
        writer.writeAttributeString(undefined, 'Extension', undefined, extension);
        writer.writeAttributeString(undefined, 'ContentType', undefined, contentType);
        writer.writeEndElement();
    }
    // Reset the relationship id counter
    private resetRelationShipID(): void {
        this.mRelationShipID = 0;
    }
    private resetExcelRelationShipId(): void {
        this.eRelationShipId = 0;
    }
    private resetChartRelationShipId(): void {
        this.cRelationShipId = 0;
    }
    private close(): void {
        //Implement
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /* eslint-enable */
}
