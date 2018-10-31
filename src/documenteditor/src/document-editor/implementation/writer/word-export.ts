
import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { XmlWriter } from '@syncfusion/ej2-file-utils';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { LayoutViewer } from '../index';
import { Dictionary, TabJustification, TabLeader } from '../../index';
import { WCharacterFormat, WParagraphFormat, WTabStop } from '../index';

/** 
 * Exports the document to Word format.
 */
export class WordExport {
    private getModuleName(): string {
        return 'WordExport';
    }

    //Part path
    private documentPath: string = 'word/document.xml';
    private stylePath: string = 'word/styles.xml';
    private numberingPath: string = 'word/numbering.xml';
    private settingsPath: string = 'word/settings.xml';
    private headerPath: string = 'word/header';
    private footerPath: string = 'word/footer';
    //private commentsPath: string = 'word/comments.xml';
    private imagePath: string = 'word/media/image';
    // private footnotesPath: string = 'word/footnotes.xml';
    // private endnotesPath: string = 'word/endnotes.xml';
    private appPath: string = 'docProps/app.xml';
    private corePath: string = 'docProps/core.xml';
    // private CustomPath: string = 'docProps/custom.xml';
    // private FontTablePath: string = 'word/fontTable.xml';
    private contentTypesPath: string = '[Content_Types].xml';
    // private ChartsPath: string = 'word/charts/';
    // private DefaultEmbeddingPath: string = 'word/embeddings/';
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
    // private FontRelationPath: string = 'word/_rels/fontTable.xml.rels';
    // private CommentsRelationPath: string = 'word/_rels/comments.xml.rels';
    // private FootnotesRelationPath: string = 'word/_rels/footnotes.xml.rels';
    // private EndnotesRelationPath: string = 'word/_rels/endnotes.xml.rels';
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
    // private EndnoteContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml';
    // private FontTableContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml';
    private footerContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml';
    // private FootnoteContentType: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml';
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
    // private ChartsContentType: string = 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml';
    // private ThemeContentType: string = 'application/vnd.openxmlformats-officedocument.theme+xml';
    // private ChartDrawingContentType: string = 'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml';
    // private ActiveXContentType: string = 'application/vnd.ms-office.activeX+xml';
    // private ActiveXBinContentType: string = 'application/vnd.ms-office.activeX';
    private tableStyleContentType: string = 'application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml';
    // private ChartStyleContentType: string = 'application/vnd.ms-office.chartstyle+xml';
    // private ChartColorStyleContentType: string = 'application/vnd.ms-office.chartcolorstyle+xml';
    // private VbaProjectContentType: string = 'application/vnd.ms-office.vbaProject';
    // private VbaDataContentType: string = 'application/vnd.ms-word.vbaData+xml';
    // private MacroDocumentContentType: string = 'application/vnd.ms-word.document.macroEnabled.main+xml';
    // private MacroTemplateContentType: string = 'application/vnd.ms-word.template.macroEnabledTemplate.main+xml';
    // private OleObjectContentType: string = 'application/vnd.openxmlformats-officedocument.oleObject';

    // Relationship types of document parts
    // private AltChunkRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk';
    // private CommentsRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments';
    private settingsRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings';
    // private EndnoteRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/endnotes';
    // private FontTableRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable';
    private footerRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer';
    // private FootnoteRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes';
    private headerRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header';
    private documentRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument';
    private numberingRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering';
    private stylesRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles';
    // private OleObjectRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/oleObject';
    // private ChartRelType: string = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart';
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
    // private ChartColorStyleRelType: string = 'http://schemas.microsoft.com/office/2011/relationships/chartColorStyle';
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

    /* tslint:disable:no-any */
    // Owner Nodes
    private section: any;
    private lastSection: boolean = false;
    private blockOwner: any;
    private paragraph: any;
    private table: any;
    private row: any;
    private headerFooter: any;

    private document: any;
    private mSections: any;
    private mLists: any;
    private mAbstractLists: any;
    private mStyles: any;
    private defCharacterFormat: any;
    private defParagraphFormat: any;
    private defaultTabWidthValue: number;
    private mRelationShipID: number = 0;
    private mDocPrID: number = 0;
    private mDifferentFirstPage: boolean = false;
    private mHeaderFooterColl: Dictionary<any, Dictionary<string, any>>;
    private mVerticalMerge: Dictionary<number, number>;
    private mGridSpans: Dictionary<number, number>;
    private mDocumentImages: Dictionary<string, any>;
    private mExternalLinkImages: Dictionary<string, string>;
    private mHeaderFooterImages: Dictionary<string, Dictionary<string, any>>;
    private mArchive: ZipArchive;
    private mBookmarks: string[] = undefined;
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
    /// Gets the HeaderFooter Collection
    private get headersFooters(): Dictionary<any, Dictionary<string, any>> {
        if (this.mHeaderFooterColl === undefined) {
            this.mHeaderFooterColl = new Dictionary<any, Dictionary<string, any>>();
        }
        return this.mHeaderFooterColl;
    }
    /**
     * @private
     */
    public save(viewer: LayoutViewer, fileName: string): void {
        this.serialize(viewer);
        this.mArchive.save(fileName + '.docx').then((mArchive: ZipArchive): void => {
            mArchive.destroy();
        });
        this.close();
    }
    /**
     * @private
     */
    public saveAsBlob(viewer: LayoutViewer): Promise<Blob> {
        this.serialize(viewer);
        return new Promise((resolve: Function, reject: Function) => {
            this.mArchive.saveAsBlob().then((blob: Blob) => {
                this.mArchive.destroy();
                blob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                resolve(blob);
            });
        });
    }
    /**
     * @private
     */
    public destroy(): void {
        this.clearDocument();
        this.mRelationShipID = undefined;
        this.mDocPrID = undefined;
        this.mDifferentFirstPage = undefined;
        if (this.mArchive) {
            this.mArchive.destroy();
            this.mArchive = undefined;
        }
    }
    // Saves the word document in the stream
    private serialize(viewer: LayoutViewer): void {
        /* tslint:disable:no-any */
        let document: any = viewer.owner.sfdtExportModule.write();
        this.setDocument(document);

        this.mArchive = new ZipArchive();
        this.mArchive.compressionLevel = 'Normal';

        this.mVerticalMerge = new Dictionary<number, number>();
        this.mGridSpans = new Dictionary<number, number>();

        let contenttype: string;
        //document.xml
        this.serializeDocument();
        //Styles.xml
        this.serializeStyles();
        //numbering.xml
        this.serializeNumberings();
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

        //document relations
        this.serializeDocumentRelations();


        // // Add controls to archieve.
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
        this.mStyles = document.styles;
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

        this.document = undefined;
        this.mSections = undefined;
        this.mLists = undefined;
        this.mAbstractLists = undefined;
        this.defCharacterFormat = undefined;
        this.defParagraphFormat = undefined;
        this.defaultTabWidthValue = undefined;
        this.mRelationShipID = 0;
        this.mDocPrID = 0;
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
    }
    // Serializes the document elements (document.xml)
    private serializeDocument(): void {
        let writer: XmlWriter = new XmlWriter();

        writer.writeStartElement('w', 'document', this.wNamespace);
        this.writeCommonAttributeStrings(writer);
        this.serializeDocumentBody(writer);

        writer.writeEndElement(); //end of document tag
        let archiveItem: ZipArchiveItem = new ZipArchiveItem(writer.buffer, this.documentPath);
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
        let count: number = this.document.sections.length;
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
        this.serializeColumns(writer, section);
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

        // if (section.PageSetup.Bidi) {
        //     writer.WriteStartElement('bidi', this.wNamespace);
        //     writer.WriteEndElement();
        // }
        //rtlGutter
        // SerializeDocGrid(section);
        //printerSettings
        writer.writeEndElement(); //end of sectPr tag

    }
    // Serialize the column properties of section.
    private serializeColumns(writer: XmlWriter, section: any): void {
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
        // tslint:disable-next-line:max-line-length
        //     writer.WriteAttributeString('space', this.wNamespace, ToString(columns.length > 0 ? columns[0].Space * this.TwentiethOfPoint : 0));
        // }
        // else if (columns.length > 0)
        // {
        //     writer.WriteAttributeString('equalWidth', this.wNamespace, '0');

        //     foreach (Column column in columns)
        //     {
        //         writer.WriteStartElement('col', this.wNamespace);
        //         writer.WriteAttributeString('w', this.wNamespace, ToString(column.Width * this.TwentiethOfPoint));
        // tslint:disable-next-line:max-line-length
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
        // tslint:disable-next-line:max-line-length
        writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(pageSetup.pageWidth * this.twentiethOfPoint).toString());
        // tslint:disable-next-line:max-line-length
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
        // tslint:disable-next-line:max-line-length
        writer.writeAttributeString(undefined, 'header', this.wNamespace, this.roundToTwoDecimal(pageSetup.headerDistance * this.twentiethOfPoint).toString());
        // tslint:disable-next-line:max-line-length
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
        let hfColl: Dictionary<string, any> = new Dictionary<string, any>();
        this.headersFooters.add(hfType, hfColl);
        this.headersFooters.get(hfType).add(id, hf);
    }
    // Serializes the bodyItems
    private serializeBodyItems(writer: XmlWriter, blockCollection: any, isLastSection: boolean): void {
        for (let i: number = 0; i < blockCollection.length; i++) {
            this.serializeBodyItem(writer, blockCollection[i], isLastSection);
        }
    }
    // Serialize the TextBody item
    private serializeBodyItem(writer: XmlWriter, item: any, isLastSection: boolean): void {
        if (isNullOrUndefined(item)) {
            throw new Error('BodyItem should not be undefined');
        }
        if (item.hasOwnProperty('inlines')) {
            this.paragraph = item;
            this.serializeParagraph(writer, item, isLastSection);
            this.paragraph = undefined;
        } else {
            let table: any = item;
            for (let i: number = 0; i < table.rows.length; i++) {
                if (table.rows[i].cells.length > 0) {
                    this.serializeTable(writer, table);
                    break;
                }
            }
        }
    }
    // Serialize the paragraph
    private serializeParagraph(writer: XmlWriter, paragraph: any, isLastSection: boolean): void {
        if (isNullOrUndefined(paragraph)) {
            throw new Error('Paragraph should not be undefined');
        }
        let sec: any = this.blockOwner;
        //Need to write the Section Properties if the Paragraph is last item in the section
        if (!isLastSection && sec.hasOwnProperty('sectionFormat')
            && sec.blocks.indexOf(paragraph) === sec.blocks.length - 1) {
            writer.writeStartElement('w', 'p', this.wNamespace);
            writer.writeStartElement(undefined, 'pPr', this.wNamespace);

            this.serializeSectionProperties(writer, sec);
            writer.writeEndElement();
            writer.writeEndElement();
        }

        // if (paragraph.ParagraphFormat.PageBreakAfter && !IsPageBreakNeedToBeSkipped(paragraph as Entity))
        //     paragraph.InsertBreak(BreakType.PageBreak);
        // if (paragraph.ParagraphFormat.ColumnBreakAfter && !IsPageBreakNeedToBeSkipped(paragraph as Entity))
        //     paragraph.InsertBreak(BreakType.ColumnBreak);
        //Splits the paragraph based on the newline character
        // paragraph.SplitTextRange();

        writer.writeStartElement('w', 'p', this.wNamespace);
        writer.writeStartElement(undefined, 'pPr', this.wNamespace);
        this.serializeParagraphFormat(writer, paragraph.paragraphFormat, paragraph);
        writer.writeEndElement(); //end of pPr

        // Serialize watermark if paragraph is the first item of Header document.
        // EnsureWatermark(paragraph);

        this.serializeParagraphItems(writer, paragraph.inlines);
        writer.writeEndElement(); //end of paragraph tag.
    }
    // Serialize the paragraph items
    private serializeParagraphItems(writer: XmlWriter, paraItems: any): void {
        let previousNode: any = undefined;
        for (let i: number = 0; i < paraItems.length; i++) {
            let item: any = paraItems[i];
            if (item.hasOwnProperty('fieldType')) {
                this.serializeFieldCharacter(writer, item);
            } else if (item.hasOwnProperty('imageString')) {
                this.serializePicture(writer, item);
            } else if (item.hasOwnProperty('bookmarkType')) {
                this.serializeBookMark(writer, item);
            } else {
                this.serializeTextRange(writer, item, previousNode);
            }
            previousNode = item;
        }
    }
    // Serialize the book mark
    private serializeBookMark(writer: XmlWriter, bookmark: any): void {
        let bookmarkId: number = this.getBookmarkId(bookmark.name);
        let bookmarkName: string = bookmark.name;
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
    // Serialize the drawing element.
    private serializeDrawing(writer: XmlWriter, image: any): void {
        writer.writeStartElement(undefined, 'drawing', this.wNamespace);
        this.serializeInlinePicture(writer, image);
        writer.writeEndElement();
    }
    // Serialize the inline picture.
    private serializeInlinePicture(writer: XmlWriter, image: any): void {
        writer.writeStartElement(undefined, 'inline', this.wpNamespace);
        writer.writeStartElement(undefined, 'extent', this.wpNamespace);
        let cx: number = Math.round(image.width * this.emusPerPoint);
        writer.writeAttributeString(undefined, 'cx', undefined, cx.toString());
        let cy: number = Math.round(image.height * this.emusPerPoint);
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

        this.serializeDrawingGraphics(writer, image);
        writer.writeEndElement();
    }
    private startsWith(sourceString: string, startString: string): boolean {
        return startString.length > 0 && sourceString.substring(0, startString.length) === startString;
    }
    // Serialize the graphics element for pictures.
    private serializeDrawingGraphics(writer: XmlWriter, picture: any): void {
        let id: string = '';

        id = this.updateShapeId(picture);
        // picture.ShapeId = this.getNextDocPrID();
        // Processing picture
        writer.writeStartElement('wp', 'docPr', this.wpNamespace);
        writer.writeAttributeString(undefined, 'id', undefined, (this.mDocPrID++).toString());
        // if (!isNullOrUndefined(picture.AlternativeText))
        //     m_writer.WriteAttributeString('descr', picture.AlternativeText);
        writer.writeAttributeString(undefined, 'name', undefined, '1'.toString());
        // if (!string.IsNullOrEmpty(picture.Title))
        //     m_writer.WriteAttributeString('title', picture.Title);
        // else
        writer.writeAttributeString(undefined, 'title', undefined, '');
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
        writer.writeStartElement('a', 'srcRect', this.aNamespace);
        writer.writeEndElement();
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
        this.serializeTableRows(writer, table.rows);

        writer.writeEndElement();
        this.table = owner;
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
        if (rows.length > 0) {
            for (let i: number = 0; i < rows.length; i++) {
                let row: any = rows[i];
                if (row.cells.length > 0) {
                    this.serializeRow(writer, row);
                }
            }
        }
    }
    // Serialize the table row
    private serializeRow(writer: XmlWriter, row: any): void {
        let owner: any = this.row;
        this.row = row;
        writer.writeStartElement(undefined, 'tr', this.wNamespace);
        this.serializeRowFormat(writer, row);

        this.serializeCells(writer, row.cells);

        writer.writeEndElement(); //end od table row 'tr'
        this.row = owner;
    }
    // Serialize the row format
    private serializeRowFormat(writer: XmlWriter, row: any): void {
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
        writer.writeEndElement();
    }
    // serialize the table cells
    private serializeCells(writer: XmlWriter, cells: any): void {
        for (let i: number = 0; i < cells.length; i++) {
            this.serializeCell(writer, cells[i]);
        }
    }
    // Serialize the table cell
    private serializeCell(writer: XmlWriter, cell: any): void {
        let owner: any = this.blockOwner;
        this.blockOwner = cell;
        writer.writeStartElement(undefined, 'tc', this.wNamespace);
        this.serializeCellFormat(writer, cell.cellFormat);
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

        this.blockOwner = owner;
    }
    // Serialize the cell formatting
    private serializeCellFormat(writer: XmlWriter, cellFormat: any): void {

        let cell: any = this.blockOwner;
        //Get the table fomat
        let tf: any = this.table.tableFormat;
        //Get the row format
        let rf: any = this.row.rowFormat;
        writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
        //w:cnfStyle -   Table Cell Conditional Formatting
        // SerializeCnfStyleElement(cell);
        //w:tcW -    Preferred Table Cell Width
        this.serializeCellWidth(writer, cell);
        //w:hMerge -    Horizontally Merged Cell and w:vMerge -    Vertically Merged Cell
        this.serializeCellMerge(writer, cellFormat);
        //w:gridSpan -   Grid Columns Spanned by Current Table Cell
        this.serializeGridSpan(writer, cell);
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
        writer.writeEndElement();
    }
    // Serialize the cell width
    private serializeCellWidth(writer: XmlWriter, cell: any): void {
        let cf: any = cell.cellFormat;
        writer.writeStartElement(undefined, 'tcW', this.wNamespace);
        if (cf.preferredWidthType === 'Percent') {
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'pct');
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(cf.preferredWidth * this.percentageFactor).toString());
        } else if (cf.preferredWidthType === 'Point') {

            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(cf.preferredWidth * this.twipsInOnePoint).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
        } else {
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'auto');
            writer.writeAttributeString(undefined, 'w', this.wNamespace, '0');
        }

        writer.writeEndElement();
    }
    // Serialize cell merge
    private serializeCellMerge(writer: XmlWriter, cellFormat: any): void {
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
                if (this.mVerticalMerge.containsKey(collKey)) {
                    this.createMerge(writer, collKey, cell);
                }
            }
        }
        if (cellFormat.rowSpan > 1) {
            writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
            this.mVerticalMerge.add(collKey, cellFormat.rowSpan - 1);
            if (cellFormat.columnSpan > 1) {
                this.mGridSpans.add(collKey, cellFormat.columnSpan);
            }
            writer.writeAttributeString('w', 'val', this.wNamespace, 'restart');
            writer.writeEndElement();
        } else if (this.mVerticalMerge.containsKey(collKey) && isserialized) {
            this.createMerge(writer, collKey, cell);
        } else if (this.mVerticalMerge.containsKey(cellIndex + 1) && isserialized && cell.nextNode === undefined) {
            collKey = cell.columnIndex + 1;
            writer.writeEndElement();
            writer.writeStartElement('w', 'p', this.wNamespace);
            writer.writeEndElement();
            writer.writeEndElement();
            writer.writeStartElement(undefined, 'tc', this.wNamespace);
            writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
            this.serializeColumnSpan(collKey, writer);
            writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'continue');
            writer.writeEndElement();
            this.checkMergeCell(collKey);
        }
    }
    private createMerge(writer: XmlWriter, collKey: number, cell: any): void {
        this.serializeColumnSpan(collKey, writer);
        writer.writeStartElement(undefined, 'vMerge', this.wNamespace);
        writer.writeAttributeString('w', 'val', this.wNamespace, 'continue');
        writer.writeEndElement();
        writer.writeEndElement(); //end tcPr
        writer.writeStartElement('w', 'p', this.wNamespace);
        writer.writeEndElement();
        writer.writeEndElement(); //end tc
        writer.writeStartElement(undefined, 'tc', this.wNamespace);
        writer.writeStartElement(undefined, 'tcPr', this.wNamespace);
        this.serializeCellWidth(writer, cell);
        this.checkMergeCell(collKey);
    }
    private serializeColumnSpan(collKey: number, writer: XmlWriter): void {
        if (this.mGridSpans.keys.length > 0 && this.mGridSpans.containsKey(collKey)) {
            writer.writeStartElement(undefined, 'gridSpan', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.mGridSpans.get(collKey).toString());
            writer.writeEndElement();
        }
    }
    private checkMergeCell(collKey: number): void {
        if ((this.mVerticalMerge.get(collKey) - 1) === 0) {
            this.mVerticalMerge.remove(collKey);
            if (this.mGridSpans.keys.length > 0 && this.mGridSpans.containsKey(collKey)) {
                this.mGridSpans.remove(collKey);
            }
        } else {
            this.mVerticalMerge.set(collKey, this.mVerticalMerge.get(collKey) - 1);
        }
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
            case 'Top':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'top');
                break;
            case 'Center':
                writer.writeAttributeString('w', 'val', this.wNamespace, 'center');
                break;
            default:
                writer.writeAttributeString('w', 'val', this.wNamespace, 'bottom');
                break;
        }
        writer.writeEndElement();
    }
    // Serialize the table grid columns.
    private serializeGridColumns(writer: XmlWriter, grid: number[]): void {
        for (let i: number = 1, count: number = grid.length; i < count; i++) {
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
        //     if (format.Bidi)
        //     {
        //         m_writer.WriteStartElement('bidiVisual', W_namespace);
        //         m_writer.WriteEndElement();
        //     }
        //     SerializeDocxProps(tempDocxProps, 'tblStyleRowBandSize');
        //     SerializeDocxProps(tempDocxProps, 'tblStyleColBandSize');
        this.serializeTableWidth(writer, table);
        this.serializeTableAlignment(writer, table.tableFormat);
        this.serializeCellSpacing(writer, table.tableFormat);
        this.serializeTableIndentation(writer, table.tableFormat);
        this.serializeTableBorders(writer, table.tableFormat);
        this.serializeShading(writer, table.tableFormat.shading);
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
    // Serialize the table borders
    private serializeShading(writer: XmlWriter, format: any): void {
        // if (format.textureStyle !== 'TextureNone') {
        writer.writeStartElement(undefined, 'shd', this.wNamespace);
        writer.writeAttributeString(undefined, 'fill', this.wNamespace, this.getColor(format.backgroundColor));
        if (format.foregroundColor === 'empty') {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, 'auto');
        } else {
            writer.writeAttributeString(undefined, 'color', this.wNamespace, this.getColor(format.foregroundColor));
        }
        writer.writeAttributeString('w', 'val', this.wNamespace, this.getTextureStyle(format.textureStyle));
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
        //TODO: AUTO size property is not mapped yet
        // if (!format.IsAutoResized)
        // {
        //     writer.writeStartElement(undefined, 'tblLayout', this.wNamespace);
        //     writer.writeAttributeString(undefined, 'type', this.wNamespace, 'fixed');
        //     writer.writeEndElement();
        // }
    }
    // Serializes the Border
    private serializeBorder(writer: XmlWriter, border: any, tagName: string, multiplier: number): void {
        let borderStyle: any = border.lineStyle;
        let sz: number = (border.lineWidth * multiplier);
        let space: number = border.space;

        if (borderStyle === 'Cleared') {
            writer.writeStartElement(undefined, tagName, this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, 'nil');
            writer.writeEndElement();
            return;
        } else if ((borderStyle === 'None' && !border.hasNoneStyle) || sz <= 0) {
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
        writer.writeAttributeString(undefined, 'color', this.wNamespace, this.getColor(border.color));
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
        writer.writeStartElement(undefined, 'tblInd', this.wNamespace);
        let tableIndent: number = Math.round(format.leftIndent * this.twipsInOnePoint);
        writer.writeAttributeString(undefined, 'w', this.wNamespace, tableIndent.toString());
        writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
        writer.writeEndElement();
    }
    // Serialize the cell spacing.
    private serializeCellSpacing(writer: XmlWriter, format: any): void {
        if (!isNullOrUndefined(format.cellSpacing) && format.cellSpacing >= 0) {
            writer.writeStartElement(undefined, 'tblCellSpacing', this.wNamespace);
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'w', this.wNamespace, this.roundToTwoDecimal(format.cellSpacing * this.twentiethOfPoint).toString());
            writer.writeAttributeString(undefined, 'type', this.wNamespace, 'dxa');
            writer.writeEndElement();
        }
    }
    // Serialize the table width
    private serializeTableWidth(writer: XmlWriter, table: any): void {

        writer.writeStartElement(undefined, 'tblW', this.wNamespace);
        if (table.tableFormat.preferredWidthType === 'Percent') {
            // tslint:disable-next-line:max-line-length
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
        writer.writeEndElement();
        writer.writeEndElement();
    }
    // Serialize the text range.
    private serializeTextRange(writer: XmlWriter, span: any, previousNode: any): void {
        writer.writeStartElement('w', 'r', this.wNamespace);
        this.serializeCharacterFormat(writer, span.characterFormat);
        if (span.text === '\t') {
            writer.writeElementString(undefined, 'tab', this.wNamespace, undefined);
        } else if (span.text === '\v') {
            writer.writeElementString(undefined, 'br', this.wNamespace, undefined);
        } else if (span.text === '\f') {
            writer.writeStartElement(undefined, 'br', this.wNamespace);
            writer.writeAttributeString('w', 'type', this.wNamespace, 'page');
            writer.writeEndElement();
        } else {
            let isField: boolean = !isNullOrUndefined(previousNode)
                && previousNode.hasOwnProperty('fieldType') && previousNode.fieldType !== 2;
            writer.writeStartElement(undefined, isField ? 'instrText' : 't', this.wNamespace);
            writer.writeAttributeString('xml', 'space', this.xmlNamespace, 'preserve');
            writer.writeString(span.text);
            writer.writeEndElement();
        }

        writer.writeEndElement();
    }
    // Serializes the paragraph format
    private serializeParagraphFormat(writer: XmlWriter, paragraphFormat: any, paragraph: any): void {
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
        this.serializeParagraphSpacing(writer, paragraphFormat);
        this.serializeIndentation(writer, paragraphFormat);
        this.serializeParagraphAlignment(writer, paragraphFormat.textAlignment);
        if (!isNullOrUndefined(paragraphFormat.tabs) && paragraphFormat.tabs.length > 0) {
            this.serializeTabs(writer, paragraphFormat.tabs);
        }
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
        writer.writeAttributeString('w', 'pos', this.wNamespace, position.toString() + '');
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

            if (!isNullOrUndefined(lf.listId) && lf.listId !== -1) {
                writer.writeStartElement(undefined, 'numId', this.wNamespace);
                writer.writeAttributeString('w', 'val', this.wNamespace, (lf.listId + 1).toString());
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
    private serializeParagraphAlignment(writer: XmlWriter, txtAlignment: any): void {
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
        // tslint:disable-next-line:max-line-length
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
            // tslint:disable-next-line:max-line-length
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


        writer.writeAttributeString(undefined, 'line', this.wNamespace, '240');
        //TODO:ISSUEFIX((paragraphFormat.lineSpacing) * this.twentiethOfPoint).toString());

        switch (paragraphFormat.lineSpacingType) {
            case 'AtLeast':
                writer.writeAttributeString(undefined, 'lineRule', this.wNamespace, 'atLeast');
                break;
            case 'Exactly':
                writer.writeAttributeString(undefined, 'lineRule', this.wNamespace, 'exact');
                break;
            default:
                writer.writeAttributeString(undefined, 'lineRule', this.wNamespace, 'auto');
                break;
        }


        writer.writeEndElement();
    }
    // Serializes the paragraph indentation
    private serializeIndentation(writer: XmlWriter, paragraphFormat: any): void {

        writer.writeStartElement(undefined, 'ind', this.wNamespace);
        if (!isNullOrUndefined(paragraphFormat.leftIndent)) {
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'left', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.leftIndent * this.twipsInOnePoint).toString());
        }
        if (!isNullOrUndefined(paragraphFormat.rightIndent)) {
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString(undefined, 'right', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.rightIndent * this.twipsInOnePoint).toString());
        }
        if (!isNullOrUndefined(paragraphFormat.firstLineIndent)) {
            if (paragraphFormat.firstLineIndent < 0) {
                // tslint:disable-next-line:max-line-length
                writer.writeAttributeString(undefined, 'hanging', this.wNamespace, this.roundToTwoDecimal(-1 * paragraphFormat.firstLineIndent * this.twipsInOnePoint).toString());
            } else {
                // tslint:disable-next-line:max-line-length
                writer.writeAttributeString(undefined, 'firstLine', this.wNamespace, this.roundToTwoDecimal(paragraphFormat.firstLineIndent * this.twipsInOnePoint).toString());
            }
        }
        writer.writeEndElement();
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
        // tslint:disable-next-line:max-line-length
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
            writer.writeAttributeString(undefined, 'cs', this.wNamespace, characterFormat.fontFamily);
            writer.writeEndElement(); //end         
        }
        if (!isNullOrUndefined(characterFormat.bold)) {
            this.serializeBoolProperty(writer, 'b', characterFormat.bold);
        }
        if (!isNullOrUndefined(characterFormat.italic)) {
            this.serializeBoolProperty(writer, 'i', characterFormat.italic);
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
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getColor(characterFormat.fontColor));
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.fontSize)) {
            writer.writeStartElement(undefined, 'sz', this.wNamespace);
            // tslint:disable-next-line:max-line-length
            writer.writeAttributeString('w', 'val', this.wNamespace, this.roundToTwoDecimal(characterFormat.fontSize * 2).toString());
            writer.writeEndElement();
        }
        if (!isNullOrUndefined(characterFormat.highlightColor) && characterFormat.highlightColor !== 'NoColor') {
            writer.writeStartElement(undefined, 'highlight', this.wNamespace);
            writer.writeAttributeString('w', 'val', this.wNamespace, this.getHighlightColor(characterFormat.highlightColor));
            writer.writeEndElement();
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

        if (listLevel.restartLevel > 0) {
            writer.writeStartElement(undefined, 'lvlRestart', this.wNamespace);
            writer.writeAttributeString(undefined, 'val', this.wNamespace, '0');
            writer.writeEndElement();
        }

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
        // if (m_document.WriteProtected)
        // {
        //     writer.writeStartElement('w', 'writeProtection', this.wNamespace);
        //     writer.writeAttributeString('recommended', this.wNamespace, '1');
        //     writer.writeEndElement();
        // }
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
        //w:evenAndOddHeaders - Different Even/Odd Page Headers and Footers        
        if (this.mDifferentFirstPage) {
            writer.writeStartElement(undefined, 'evenAndOddHeaders', this.wNamespace);
            writer.writeEndElement();
        }
        //w:footnotePr - Document-Wide Footnote Properties and w:endnotePr - Document-Wide Endnote Properties
        // SerializeFootnoteSettings();
        //w:compat - Compatibility Settings
        writer.writeStartElement(undefined, 'compat', this.wNamespace);
        writer.writeStartElement(undefined, 'compatSetting', this.wNamespace);

        writer.writeAttributeString(undefined, 'name', this.wNamespace, 'compatibilityMode');
        writer.writeAttributeString(undefined, 'uri', this.wNamespace, 'http://schemas.microsoft.com/office/word');
        writer.writeAttributeString(undefined, 'val', this.wNamespace, '15');
        writer.writeEndElement();
        writer.writeEndElement();

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
        // this.serializeRelationShip(writer, this.getNextRelationShipID(), this.ThemeRelType, 'theme/theme1.xml');

        if (this.document.lists.length > 0) {
            this.serializeRelationShip(writer, this.getNextRelationShipID(), this.numberingRelType, 'numbering.xml');
        }



        this.serializeHeaderFooterRelations(writer);

        // if (HasFontTable) {
        //     SerializeRelationShip(docRelstream, GetNextRelationShipID(), this.FontTableRelType, 'fontTable.xml');
        // }

        // SerializeIncludePictureUrlRelations(docRelstream, InclPicFieldUrl);
        // //// Creating relationships for every hyperlink and image containing in the document
        this.serializeImagesRelations(this.documentImages, writer);
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
                    let extension: string = '';
                    let formatClippedString: string = '';
                    if (this.startsWith(base64ImageString, 'data:image/bmp;base64,')) {
                        extension = '.bmp';
                        formatClippedString = base64ImageString.replace('data:image/bmp;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/x-emf;base64,')) {
                        extension = '.emf';
                        formatClippedString = base64ImageString.replace('data:image/x-emf;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/exif;base64,')) {
                        extension = '.exif';
                        formatClippedString = base64ImageString.replace('data:image/exif;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/gif;base64,')) {
                        extension = '.gif';
                        formatClippedString = base64ImageString.replace('data:image/gif;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/icon;base64,')) {
                        extension = '.ico';
                        formatClippedString = base64ImageString.replace('data:image/icon;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/jpeg;base64,')) {
                        extension = '.jpeg';
                        formatClippedString = base64ImageString.replace('data:image/jpeg;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/jpg;base64,')) {
                        extension = '.jpg';
                        formatClippedString = base64ImageString.replace('data:image/jpg;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/png;base64,')) {
                        extension = '.png';
                        formatClippedString = base64ImageString.replace('data:image/png;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/tiff;base64,')) {
                        extension = '.tif';
                        formatClippedString = base64ImageString.replace('data:image/tiff;base64,', '');
                    } else if (this.startsWith(base64ImageString, 'data:image/x-wmf;base64,')) {
                        extension = '.wmf';
                        formatClippedString = base64ImageString.replace('data:image/x-wmf;base64,', '');
                    } else {
                        extension = '.jpeg';
                    }
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
        let enc1: number;
        let enc2: number;
        let enc3: number;
        let enc4: number;
        let i: number = 0;
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

        while (i < input.length) {

            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output[resultIndex++] = chr1;

            if (enc3 !== 64) {
                output[resultIndex++] = chr2;
            }
            if (enc4 !== 64) {
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
        // tslint:disable-next-line:max-line-length
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


        // tslint:disable-next-line:max-line-length
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
    private close(): void {
        //Implement
    }
    /* tslint:enable:no-any */
}
