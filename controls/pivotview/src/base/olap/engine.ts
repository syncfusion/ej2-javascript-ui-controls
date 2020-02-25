import { extend, Internationalization, isNullOrUndefined, L10n, Ajax } from '@syncfusion/ej2-base';
import { PivotUtil } from '../util';
import { MDXQuery } from './mdx-query';
import { IField, IDataOptions, IMembers, IDrillOptions, IDrilledItem, IFieldOptions, IPageSettings, ISort, IPivotRows } from '../engine';
import { IAxisSet, IGridValues, IPivotValues, IFilter, ICustomProperties, IValueSortSettings, ICalculatedFieldSettings } from '../engine';
import { IFormatSettings, IMatrix2D } from '../engine';
import * as cls from '../../common/base/css-constant';
import { SummaryTypes } from '../types';
/**
 * OlapEngine is used to manipulate the olap or Multi-Dimensional data as pivoting values.
 */

/** @hidden */
export class OlapEngine {

    /** @hidden */
    public isEmptyData: boolean;
    /** @hidden */
    public globalize: Internationalization;
    /** @hidden */
    public fieldList: IOlapFieldListOptions = {};
    /** @hidden */
    public fields: string[];
    /** @hidden */
    public rows: IFieldOptions[];
    /** @hidden */
    public columns: IFieldOptions[];
    /** @hidden */
    public values: IFieldOptions[];
    /** @hidden */
    public filters: IFieldOptions[];
    /** @hidden */
    public calculatedFieldSettings: ICalculatedFieldSettings[];
    /** @hidden */
    public isMutiMeasures: boolean;
    /** @hidden */
    public drilledMembers: IDrillOptions[];
    /** @hidden */
    public valueSortSettings: IValueSortSettings;
    /** @hidden */
    public isEngineUpdated: boolean;
    /** @hidden */
    public savedFieldList: IOlapFieldListOptions;
    /** @hidden */
    public savedFieldListData: IOlapField[];
    /** @hidden */
    public valueAxis: string;
    /** @hidden */
    public columnCount: number = 0;
    /** @hidden */
    public rowCount: number = 0;
    /** @hidden */
    public colFirstLvl: number = 0;
    /** @hidden */
    public rowFirstLvl: number = 0;
    /** @hidden */
    public pageColStartPos: number = 0;
    /** @hidden */
    public enableSort: boolean = false;
    /** @hidden */
    public enableValueSorting: boolean = false;
    /** @hidden */
    public isHeaderAvail: boolean;
    /** @hidden */
    public fieldListData: IOlapField[];
    /** @hidden */
    public fieldListObj: FieldData;
    /** @hidden */
    public dataFields: { [key: string]: IFieldOptions } = {};
    /** @hidden */
    public formats: IFormatSettings[];
    /** @hidden */
    public formatFields: { [key: string]: IFormatSettings } = {};
    /** @hidden */
    public emptyCellTextContent: string;
    /** @hidden */
    public isMondrian: boolean;
    /** @hidden */
    public isMeasureAvail: boolean;
    /** @hidden */
    public selectedItems: string[];
    /** @hidden */
    public filterSettings: IFilter[];
    /** @hidden */
    public sortSettings: ISort[];
    /** @hidden */
    public filterMembers: { [key: string]: string[] | IFilter[] } = {};
    /** @hidden */
    public allowMemberFilter: boolean;
    /** @hidden */
    public allowLabelFilter: boolean;
    /** @hidden */
    public allowValueFilter: boolean;
    /** @hidden */
    public mdxQuery: string;
    /** @hidden */
    public isPaging: boolean;
    /** @hidden */
    public pageSettings: IPageSettings;
    /** @hidden */
    public calcChildMembers: IOlapField[];
    /** @hidden */
    public drilledSets: { [key: string]: HTMLElement } = {};
    /** @hidden */
    public aggregatedValueMatrix: IMatrix2D = [];
    private localeObj: L10n;
    private measureReportItems: string[];
    private locale: string;
    /* tslint:disable-next-line:max-line-length */
    private customRegex: RegExp = /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
    private formatRegex: RegExp = /(^[ncpae]{1})([0-1]?[0-9]|20)?$/i;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /** @hidden */
    public xmlaCellSet: NodeListOf<Element>;
    /** @hidden */
    public pivotValues: IPivotValues = [];
    /** @hidden */
    public dataSourceSettings: IDataOptions;
    /** @hidden */
    public valueContent: IGridValues = [];
    /** @hidden */
    public headerContent: IGridValues = [];
    /** @hidden */
    public colMeasurePos: number;
    /** @hidden */
    public rowStartPos: number = 0;
    /** @hidden */
    public pageRowStartPos: number = 0;
    /** @hidden */
    public rowMeasurePos: number;
    /** @hidden */
    public tupColumnInfo: ITupInfo[] = [];
    /** @hidden */
    public tupRowInfo: ITupInfo[] = [];
    /** @hidden */
    public gridJSON: string = '';
    /** @hidden */
    public namedSetsPosition: { [key: string]: { [key: number]: string } } = {};
    private colDepth: number = 0;
    private totalCollection: ITotCollection[] = [];
    private parentObjCollection: IParentObjCollection = {};
    private colMeasures: { [key: string]: Element };
    private curDrillEndPos: number = -1;
    private headerGrouping: { [key: number]: { UName: { [key: number]: string }, Caption: { [key: number]: string } } } = {};
    private lastLevel: number[] = [];
    private xmlDoc: Document;
    private request: Ajax;
    private customArgs: FieldData;
    private onDemandDrillEngine: IPivotValues;
    private showRowSubTotals: boolean = true;
    private showColumnSubTotals: boolean = true;
    private hideRowTotalsObject: { [key: string]: number } = {};
    private hideColumnTotalsObject: { [key: string]: number } = {};
    private sortObject: { [key: string]: string } = {};
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public renderEngine(dataSourceSettings?: IDataOptions, customProperties?: IOlapCustomProperties): void {
        this.isEmptyData = false;
        this.mdxQuery = '';
        this.isMeasureAvail = false;
        this.allowMemberFilter = false;
        this.allowLabelFilter = false;
        this.allowValueFilter = false;
        this.isMondrian = false;
        this.aggregatedValueMatrix = [];
        this.measureReportItems = [];
        this.calcChildMembers = [];
        this.selectedItems = [];
        this.savedFieldList = undefined;
        this.savedFieldListData = undefined;
        this.formatFields = {};
        this.filterMembers = {};
        this.dataFields = {};
        this.valueAxis = '';
        this.columnCount = 0;
        this.rowCount = 0;
        this.colFirstLvl = 0;
        this.rowFirstLvl = 0;
        this.pageColStartPos = 0;
        this.enableValueSorting = false;
        this.sortObject = {};
        this.globalize = new Internationalization();
        /* tslint:disable */
        this.locale = (this.globalize as any).getCulture();
        /* tslint:enable */
        this.localeObj = customProperties ? customProperties.localeObj : undefined;
        this.enableValueSorting = customProperties ? customProperties.enableValueSorting : false;
        if (dataSourceSettings.url) {
            // this.isMondrian = (dataSourceSettings.providerType === 'mondrian');
            this.dataSourceSettings = dataSourceSettings;
            this.valueAxis = dataSourceSettings.valueAxis === 'row' ? 'row' : 'column';
            this.getAxisFields();
            this.formats = dataSourceSettings.formatSettings ? dataSourceSettings.formatSettings : [];
            this.enableSort = dataSourceSettings.enableSorting === undefined ? true : dataSourceSettings.enableSorting;
            this.valueSortSettings = dataSourceSettings.valueSortSettings ? dataSourceSettings.valueSortSettings : undefined;
            this.filterSettings = dataSourceSettings.filterSettings ? dataSourceSettings.filterSettings : [];
            this.sortSettings = dataSourceSettings.sortSettings ? dataSourceSettings.sortSettings : [];
            this.allowMemberFilter = dataSourceSettings.allowMemberFilter ? true : false;
            this.allowLabelFilter = dataSourceSettings.allowLabelFilter ? true : false;
            this.allowValueFilter = dataSourceSettings.allowValueFilter ? true : false;
            this.drilledMembers = dataSourceSettings.drilledMembers ? this.updateDrilledItems(dataSourceSettings.drilledMembers) : [];
            this.calculatedFieldSettings = dataSourceSettings.calculatedFieldSettings ? dataSourceSettings.calculatedFieldSettings : [];
            this.emptyCellTextContent = dataSourceSettings.emptyCellsTextContent ? dataSourceSettings.emptyCellsTextContent : '';
            this.pageSettings = customProperties ? (customProperties.pageSettings ? customProperties.pageSettings : this.pageSettings)
                : undefined;
            this.isPaging = this.pageSettings ? true : false;
            this.frameSortObject();
            this.getFormattedFields(this.formats);
            this.savedFieldList = customProperties ? customProperties.savedFieldList : undefined;
            this.savedFieldListData = customProperties ? customProperties.savedFieldListData : undefined;
            this.fieldListData = [];
            this.fieldListObj = {};
            this.setNamedSetsPosition();
            if (!(this.savedFieldList && this.savedFieldListData)) {
                this.getFieldList(dataSourceSettings);
            } else {
                this.updateFieldlist(true);
            }
            this.loadCalculatedMemberElements(this.calculatedFieldSettings);
            this.measureReportItems = [];
            // this.updateAllMembers(dataSourceSettings, this.filters);
            this.updateFilterItems(this.filterSettings);
            this.generateGridData(dataSourceSettings);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public generateGridData(dataSourceSettings: IDataOptions, action?: string): void {
        let refPaging: boolean = (action && action === 'navPaging' &&
            this.isPaging && this.pageSettings !== undefined ? true : false);
        if (this.rows.length > 0 || this.columns.length > 0 || this.values.length > 0 || this.filters.length > 0) {
            MDXQuery.getCellSets(dataSourceSettings, this, refPaging);
        } else {
            MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
            this.generateEngine(undefined, undefined, { dataSourceSettings: dataSourceSettings, action: 'loadTableElements' });
        }
    }
    public generatePagingData(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let xmlaCellSet: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axes, CellData'));
        // this.rowCount =
        //     (xmlaCellSet.length > 0 && [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')).length > 0 ?
        //         [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')).length : 0);
        // this.columnCount =
        //     (xmlaCellSet.length > 0 && [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')).length > 0 ?
        //         [].slice.call(xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')).length : 0);
        let countCells: NodeListOf<Element> = xmlaCellSet[1] ? xmlaCellSet[1].querySelectorAll('FmtValue') : null;
        if (countCells && countCells.length > 0) {
            this.columnCount = Number(countCells[0].textContent);
            this.rowCount = Number(countCells[1].textContent);
        }
        let dataSourceSettings: IDataOptions = customArgs.dataSourceSettings;
        MDXQuery.getCellSets(dataSourceSettings, this, true);
    }
    public scrollPage(direction: string, newPage?: number, prevPage?: number): void {
        MDXQuery.getCellSets(this.dataSourceSettings, this, true);
    }

    public generateEngine(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        if (customArgs.action !== 'down') {
            this.pivotValues = [];
            this.valueContent = [];
            this.headerContent = [];
            this.colDepth = 0;
            this.tupColumnInfo = [];
            this.tupRowInfo = [];
            this.colMeasures = {};
            this.colMeasurePos = undefined;
            this.rowMeasurePos = undefined;
            this.rowStartPos = -1;
        }
        this.xmlDoc = xmlDoc ? xmlDoc.cloneNode(true) as Document : undefined;
        this.request = request;
        this.customArgs = customArgs;
        this.totalCollection = [];
        this.parentObjCollection = {};
        this.curDrillEndPos = -1;
        this.onDemandDrillEngine = [];
        this.getSubTotalsVisibility();
        this.xmlaCellSet = xmlDoc ? xmlDoc.querySelectorAll('Axes, CellData') : undefined;

        let columnTuples: Element[] = this.xmlaCellSet && this.xmlaCellSet.length > 0 ?
            [].slice.call(this.xmlaCellSet[0].querySelectorAll('Axis[name|="Axis0"] Tuple')) : [];
        let rowTuples: Element[] = this.xmlaCellSet && this.xmlaCellSet.length > 0 ?
            [].slice.call(this.xmlaCellSet[0].querySelectorAll('Axis[name|="Axis1"] Tuple')) : [];
        let valCollection: Element[] = this.xmlaCellSet && this.xmlaCellSet.length > 1 ?
            [].slice.call(this.xmlaCellSet[1].querySelectorAll('Cell')) : [];
        if (this.drilledMembers.length > 0) {
            // let st1: number = new Date().getTime();
            let measureInfo: IMeasureInfo = this.getMeasureInfo();
            let orderedInfo: IOrderedInfo;
            orderedInfo = this.frameMeasureOrder(measureInfo, 'column', columnTuples, valCollection, columnTuples.length);
            columnTuples = orderedInfo.orderedHeaderTuples;
            valCollection = orderedInfo.orderedValueTuples;
            orderedInfo = this.frameMeasureOrder(measureInfo, 'row', rowTuples, valCollection, columnTuples.length);
            rowTuples = orderedInfo.orderedHeaderTuples;
            valCollection = orderedInfo.orderedValueTuples;
            // let st2: number = (new Date().getTime() - st1) / 1000;
            // console.log('over-all:' + st2);
        }
        if (customArgs.action === 'down') {
            this.updateTupCollection(customArgs.drillInfo.axis === 'row' ? rowTuples.length : columnTuples.length);
        }
        if (customArgs.action === 'down' ? customArgs.drillInfo.axis === 'column' : true) {
            this.frameColumnHeader(columnTuples);
            if (!this.isPaging) {
                this.performColumnSorting();
            }
        }
        if (customArgs.action === 'down' ? customArgs.drillInfo.axis === 'row' : true) {
            this.frameRowHeader(rowTuples);
            if (!this.isPaging) {
                this.performRowSorting();
            }
        }
        this.frameValues(valCollection, columnTuples.length);
        this.performColumnSpanning();
        if (!this.isPaging && this.enableSort) {
            for (let i: number = 0; i < this.headerContent.length; i++) {
                this.headerContent[i] = this.pivotValues[i] as IAxisSet[];
            }
        }
        this.isEngineUpdated = true;
        this.isEmptyData = columnTuples.length === 0;
        //this.append(columnTuples.length);
    }

    private getSubTotalsVisibility(): void {
        this.showRowSubTotals = this.dataSourceSettings.showRowSubTotals && this.dataSourceSettings.showSubTotals;
        this.showColumnSubTotals = this.dataSourceSettings.showColumnSubTotals && this.dataSourceSettings.showSubTotals;
        this.hideRowTotalsObject = {};
        this.hideColumnTotalsObject = {};
        let axisCount: number = 1;
        do {
            if (axisCount === 1) {
                if (this.showColumnSubTotals) {
                    for (let cCnt: number = 0; cCnt < this.dataSourceSettings.columns.length; cCnt++) {
                        if (this.dataSourceSettings.columns[cCnt].showSubTotals === false) {
                            this.hideColumnTotalsObject[this.dataSourceSettings.columns[cCnt].name] = cCnt;
                        }
                    }
                }
            } else {
                if (this.showRowSubTotals) {
                    for (let rCnt: number = 0; rCnt < this.dataSourceSettings.rows.length; rCnt++) {
                        if (this.dataSourceSettings.rows[rCnt].showSubTotals === false) {
                            this.hideRowTotalsObject[this.dataSourceSettings.rows[rCnt].name] = rCnt;
                        }
                    }
                }
            }
            axisCount++;
        } while (axisCount < 3);
    }

    /* tslint:disable:max-func-body-length */
    private frameRowHeader(tuples: Element[]): void {
        this.headerGrouping = {};
        this.lastLevel = [];
        let position: number = this.pivotValues.length;
        let pivotValues: IPivotValues = [];
        let valueContent: IGridValues = [];
        if (this.customArgs.action !== 'down') {
            pivotValues = this.pivotValues;
            valueContent = this.valueContent;
        } else {
            position = this.customArgs.drillInfo.currentCell.rowIndex + 1;
        }
        this.rowStartPos = this.rowStartPos > 0 ? this.rowStartPos : position;
        let tupPos: number = 0;
        let lastAllStartPos: number;
        let lastAllCount: number;
        let prevUNArray: string[] = [];
        let allType: { [key: number]: number } = {};
        let rowMembers: string[] = [];
        let availAllMember: boolean = false;
        let withoutAllStartPos: number = -1;
        let withoutAllEndPos: number = -1;
        let minLevel: number[] = [];
        let gTotals: IAxisSet[] = [{
            axis: 'row',
            colIndex: 0,
            formattedText: 'Grand Total',
            hasChild: false,
            level: -1,
            rowIndex: 0,
            index: [],
            type: 'grand sum',
            ordinal: 0,
            colSpan: 1,
            rowSpan: 1,
            memberType: 2,
            isDrilled: false,
            valueSort: { 'Grand Total': 1, levelName: 'Grand Total' }
        }];
        let maxLevel: number[] = [];
        let measurePos: number;
        let newTupPosition: number = (this.customArgs.drillInfo && this.customArgs.drillInfo.axis === 'row') ?
            (this.customArgs.drillInfo.currentCell.ordinal + 1) : 0;
        while (tupPos < tuples.length) {
            let members: NodeListOf<Element> = tuples[tupPos].querySelectorAll('Member');
            maxLevel = this.frameTupCollection(
                members, maxLevel, (tupPos + newTupPosition), this.tupRowInfo, this.showRowSubTotals,
                this.hideRowTotalsObject, 'row');
            tupPos++;
        }
        tupPos = 0;
        let prevTupInfo: ITupInfo;
        let tuplesLength: number = tuples.length;
        if (this.customArgs.action === 'down') {
            let ordinal: number = this.customArgs.drillInfo.currentCell.ordinal + 1;
            tupPos = ordinal;
            tuplesLength += ordinal;
            lastAllCount = this.tupRowInfo[ordinal - 1].allCount;
            lastAllStartPos = this.tupRowInfo[ordinal - 1].allStartPos;
            prevTupInfo = this.tupRowInfo[ordinal - 1];
        }
        let startTupPos: number = tupPos;
        let pagingAllowFlag: boolean = true;
        while (tupPos < tuplesLength && pagingAllowFlag) {
            let members: NodeListOf<Element> = tuples[this.customArgs.action === 'down' ?
                (tupPos - (this.customArgs.drillInfo.currentCell.ordinal + 1)) : tupPos].querySelectorAll('Member');
            let memPos: number = 0;
            let prevParent: IAxisSet;
            let allCount: number = this.tupRowInfo[tupPos].allCount;
            let allStartPos: number = this.tupRowInfo[tupPos].allStartPos;
            let measure: Element = this.tupRowInfo[tupPos].measure;
            let typeColl: string[] = this.tupRowInfo[tupPos].typeCollection;
            let drillInfo: IDrillInfo[] = this.tupRowInfo[tupPos].drillInfo;
            let drillStartPos: number = this.tupRowInfo[tupPos].drillStartPos;
            let startDrillUniquename: string = this.tupRowInfo[tupPos].startDrillUniquename;
            let drillEndPos: number = this.tupRowInfo[tupPos].drillEndPos;
            let levelColl: number[] = this.tupRowInfo[tupPos].levelCollection;

            if (tupPos === 0 || tupPos === startTupPos) {
                let firstTupMembers: NodeListOf<Element> = this.customArgs.action === 'down' ? this.tupRowInfo[0].members : members;
                while (memPos < firstTupMembers.length) {
                    if (firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                        Number(firstTupMembers[memPos].querySelector('LNum').textContent) === 0) {
                        minLevel[memPos] = 0;
                    } else {
                        minLevel[memPos] = Number(firstTupMembers[memPos].querySelector('LNum').textContent);
                    }
                    // if (firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                    //   (this.isPaging || Number(firstTupMembers[memPos].querySelector('LNum').textContent) === 0)) {
                    if (firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '1') {
                        allType[memPos] = 0;
                        withoutAllStartPos = withoutAllStartPos === -1 ? memPos : withoutAllStartPos;
                        withoutAllEndPos = memPos;
                    } else {
                        allType[memPos] = 1;
                        availAllMember = firstTupMembers[memPos].querySelector('MEMBER_TYPE').textContent === '3' ? availAllMember : true;
                    }
                    memPos++;
                }
                measurePos = typeColl.indexOf('3');
            }
            memPos = 0;

            if (tupPos === 0 && (members.length > (allCount + (measure ? 1 : 0)) || (members.length === 1 && measure))) {
                gTotals.pop();
            }
            if ((tupPos === 0 && this.isPaging) ? gTotals.length === 0 :
                (!availAllMember || allCount === lastAllCount || allStartPos !== lastAllStartPos || (members.length === 1 && measure))) {
                let drillAllow: boolean = drillStartPos > -1 ? (allCount > 0 ? (allStartPos > drillStartPos) : true) : true;
                /* tslint:disable-next-line:max-line-length */
                drillAllow = (prevTupInfo && drillAllow && drillStartPos > -1) ?
                    (prevTupInfo.startDrillUniquename !== startDrillUniquename ? true :
                        ((withoutAllEndPos > prevTupInfo.measurePosition ? false :
                            prevTupInfo.measureName !== this.tupRowInfo[tupPos].measureName) &&
                            (allStartPos === (drillStartPos + 1) || this.tupRowInfo[tupPos].measurePosition === (drillStartPos + 1))))
                    : drillAllow;
                let withoutAllAllow: boolean = (withoutAllStartPos > -1 && allCount > 0) ? (allStartPos > withoutAllEndPos) : true;
                if (members.length === allCount + (measure ? 1 : 0) && measure) {
                    let levelName: string = 'Grand Total.' + members[measurePos].querySelector('Caption').textContent;
                    gTotals.push({
                        axis: 'row',
                        actualText: this.getUniqueName(members[measurePos].querySelector('UName').textContent),
                        colIndex: 0,
                        formattedText: members[measurePos].querySelector('Caption').textContent,
                        hasChild: false,
                        level: - 1,
                        rowIndex: position,
                        index: [],
                        ordinal: tupPos,
                        colSpan: 1,
                        rowSpan: 1,
                        memberType: Number(typeColl[measurePos]),
                        isDrilled: false,
                        parentUniqueName: members[measurePos].querySelector('PARENT_UNIQUE_NAME') ?
                            members[measurePos].querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                        levelUniqueName: members[measurePos].querySelector('LName').textContent,
                        hierarchy: members[measurePos].getAttribute('Hierarchy'),
                        valueSort: { levelName: levelName, axis: members[measurePos].getAttribute('Hierarchy') }
                    });
                    gTotals[gTotals.length - 1].valueSort['Grand Total.' + members[measurePos].querySelector('Caption').textContent] = 1;
                } else if (!(allStartPos === 0 || (measurePos === 0 && allStartPos === 1)) && drillAllow && withoutAllAllow) {
                    prevTupInfo = this.tupRowInfo[tupPos];
                    let lastPos: number = position;
                    let lastMemPos: number = memPos;
                    prevParent = {};
                    let withoutAllDrilled: boolean = false;
                    while (memPos < members.length && pagingAllowFlag) {
                        let member: Element = members[memPos];
                        if (member.querySelector('UName').textContent !== prevUNArray[memPos] && typeColl[memPos] !== '2'
                            && ((Object.keys(prevParent).length > 0 ? prevParent.isDrilled : withoutAllDrilled) ?
                                (typeColl[memPos] === '3' && (allType[memPos - 1] && allType[memPos + 1] !== 0)) : true)) {
                            /* tslint:disable-next-line:max-line-length */
                            let lvl: number = Number(member.querySelector('LNum').textContent) -
                                ((allType[memPos] && typeColl[memPos] !== '3') ? 1 : minLevel[memPos]);
                            /* tslint:disable-next-line:no-string-literal */
                            let isNamedSet: boolean = this.namedSetsPosition['row'][memPos] ? true : false;
                            (pivotValues[position] as IAxisSet[]) = [{
                                axis: 'row',
                                actualText: this.getUniqueName(member.querySelector('UName').textContent),
                                colIndex: 0,
                                formattedText: member.querySelector('Caption').textContent,
                                hasChild: Number(member.querySelector('CHILDREN_CARDINALITY').textContent) > 0 ? true : false,
                                level: lvl,
                                rowIndex: position,
                                index: [],
                                ordinal: tupPos,
                                type: 'header',
                                colSpan: 1,
                                rowSpan: 1,
                                memberType: Number(typeColl[memPos]),
                                isDrilled: this.tupRowInfo[tupPos].drillInfo[memPos].isDrilled,
                                parentUniqueName: member.querySelector('PARENT_UNIQUE_NAME') ?
                                    member.querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                                levelUniqueName: member.querySelector('LName').textContent,
                                hierarchy: member.getAttribute('Hierarchy'),
                                isNamedSet: isNamedSet,
                                valueSort: { levelName: '', axis: member.getAttribute('Hierarchy') }
                            }];
                            prevParent = typeColl[memPos] !== '3' ? (pivotValues[position] as IAxisSet[])[0] : prevParent;
                            if (!prevParent) {
                                rowMembers.push(member.querySelector('Caption').textContent);
                            }
                            let levelName: string = this.getCaptionCollectionWithMeasure(this.tupRowInfo[tupPos]);
                            (pivotValues[position] as IAxisSet[])[0].valueSort.levelName = levelName;
                            (pivotValues[position] as IAxisSet[])[0].valueSort[levelName] = 1;
                            valueContent[position - this.rowStartPos] = {} as IAxisSet[];
                            valueContent[position - this.rowStartPos][0] = pivotValues[position][0] as IAxisSet;
                            if (measure && measurePos > memPos) {
                                prevUNArray[measurePos] = '';
                            }
                            for (let pos: number = memPos + 1; pos < members.length; pos++) {
                                prevUNArray[pos] = '';
                            }
                            prevUNArray[memPos] = member.querySelector('UName').textContent;
                            position++;
                            lastMemPos = memPos;
                        } else if (typeColl[memPos] === '2') {
                            lastMemPos = memPos;
                        } else {
                            if (this.tupRowInfo[tupPos].drillInfo[memPos].isDrilled && allType[memPos] === 0) {
                                withoutAllDrilled = true;
                            }
                        }
                        if (this.tupRowInfo[tupPos].drillInfo[memPos].isDrilled && this.tupRowInfo[tupPos].showTotals) {
                            this.tupRowInfo[tupPos].showTotals = !this.showRowSubTotals ? false :
                                this.hideRowTotalsObject[this.tupRowInfo[tupPos].drillInfo[memPos].hierarchy] === undefined;
                        }
                        memPos++;
                    }
                    if (lastPos < position && lastMemPos >= (members.length - 1)) {
                        (pivotValues[position - 1] as IAxisSet[])[0].ordinal = tupPos;
                        if ((pivotValues[position - 1] as IAxisSet[])[0].type === 'header') {
                            delete (pivotValues[position - 1] as IAxisSet[])[0].type;
                        }
                    }
                }
                lastAllCount = allCount;
                lastAllStartPos = allStartPos;
            }
            tupPos++;
        }
        if (gTotals.length > 1 && gTotals[0].memberType !== 3) {
            gTotals[0].ordinal = -1;
        }
        // if (!(this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals)) {
        //     for (let totPos: number = 0; totPos < gTotals.length; totPos++) {
        //         if (this.tupRowInfo[gTotals[totPos].ordinal]) {
        //             this.tupRowInfo[gTotals[totPos].ordinal].showTotals = false;
        //         }
        //     }
        // }
        if (this.customArgs.action !== 'down') {
            if (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals) {
                for (let totPos: number = 0; totPos < gTotals.length; totPos++) {
                    gTotals[totPos].rowIndex = position;
                    (pivotValues[position] as IAxisSet[]) = [gTotals[totPos]];
                    valueContent[position - this.rowStartPos] = {} as IAxisSet[];
                    valueContent[position - this.rowStartPos][0] = pivotValues[position][0] as IAxisSet;
                    position++;
                }
            }
        } else {
            this.updateRowEngine(pivotValues, valueContent, tuples.length);
            this.onDemandDrillEngine = pivotValues;
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private frameTupCollection(
        members: NodeListOf<Element>, maxLevel: number[], tupPos: number, tupInfo: ITupInfo[],
        showSubTotals: boolean, hideTotalsObject: { [key: string]: number }, axis: string): number[] {
        let memPos: number = 0;
        let allCount: number = 0;
        let allStartPos: number;
        let measure: Element;
        let measureName: string;
        let measurePosition: number;
        let typeColl: string[] = [];
        let levelColl: number[] = [];
        let drillState: IDrillInfo[] = [];
        let uNameCollection: string = '';
        let captionCollection: string = '';
        let showTotals: boolean = true;
        let hideFieldPos: number = -1;
        while (memPos < members.length) {
            let member: Element = members[memPos];
            let memberlevel: number = Number(member.querySelector('LNum').textContent);
            let memberUName: string = member.querySelector('UName').textContent;
            /* tslint:disable */
            if (Number(member.querySelector('MEMBER_TYPE').textContent) > 3) {
                member.querySelector('MEMBER_TYPE').textContent = (memberUName as any).startsWith('[Measures]') ? '3' : '1';
            }
            let memberType: string = (memberUName as any).startsWith('[Measures]') ? '3' :
                (Number(member.querySelector('MEMBER_TYPE').textContent) > 3 ? '1' : member.querySelector('MEMBER_TYPE').textContent);
            /* tslint:enable */
            let memberCaption: string = member.querySelector('Caption').textContent;
            if (this.fieldList[memberCaption] && this.fieldList[memberCaption].type === 'CalculatedField') {
                memberCaption = this.fieldList[memberCaption].caption;
                member.querySelector('Caption').textContent = memberCaption;
            }
            let hierarchy: string = member.getAttribute('Hierarchy');
            /* tslint:disable-next-line:max-line-length */
            let parentUName: string = member.querySelector('PARENT_UNIQUE_NAME') ? member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            if (memberType === '2') {
                allCount++;
                allStartPos = isNullOrUndefined(allStartPos) ? memPos : allStartPos;
            } else if (memberType === '3') {
                measure = member;
                measureName = memberUName;
                measurePosition = memPos;
                if (axis === 'column') {
                    this.colMeasures[memberUName] = member;
                    this.colMeasurePos = memPos;
                } else {
                    this.rowMeasurePos = memPos;
                }
            } else {
                hideFieldPos = hideTotalsObject[hierarchy];
            }
            if (memberType !== '2') {
                if (this.headerGrouping[memPos]) {
                    if (memberlevel > this.lastLevel[memPos]) {
                        this.lastLevel[memPos] = memberlevel;
                    } else if (memberlevel < this.lastLevel[memPos]) {
                        let levelPos: number = this.lastLevel[memPos];
                        while (levelPos >= memberlevel) {
                            delete this.headerGrouping[memPos].UName[levelPos];
                            delete this.headerGrouping[memPos].Caption[levelPos];
                            levelPos--;
                        }
                        this.lastLevel[memPos] = memberlevel;
                    }
                    this.headerGrouping[memPos].UName[memberlevel] = memberUName;
                    this.headerGrouping[memPos].Caption[memberlevel] = memberCaption;
                } else {
                    this.lastLevel[memPos] = memberlevel;
                    this.headerGrouping[memPos] = { UName: { [memberlevel]: memberUName }, Caption: { [memberlevel]: memberCaption } };
                }
                if (this.isPaging) {
                    let currUName: string = parentUName;
                    while (this.drilledSets[currUName]) {
                        let currCaption: string = this.drilledSets[currUName].querySelector('Caption').textContent;
                        let currLevel: number = Number(this.drilledSets[currUName].querySelector('LNum').textContent);
                        this.headerGrouping[memPos].UName[currLevel] = currUName;
                        this.headerGrouping[memPos].Caption[currLevel] = currCaption;
                        currUName = this.drilledSets[currUName].querySelector('PARENT_UNIQUE_NAME') === null ? '' :
                            this.drilledSets[currUName].querySelector('PARENT_UNIQUE_NAME').textContent;
                    }
                }
                /* tslint:disable */
                let uNames: string = (Object as any).values(this.headerGrouping[memPos].UName).join('~~');
                uNameCollection = uNameCollection === '' ? uNames :
                    (uNameCollection + '::' + uNames);
                let captions: string = (Object as any).values(this.headerGrouping[memPos].Caption).join('~~');
                /* tslint:enable */
                if (memPos !== measurePosition) {
                    captionCollection = captionCollection === '' ? captions :
                        (captionCollection + '::' + captions);
                }
            }
            typeColl.push(memberType);
            levelColl.push(memberlevel);
            if (isNullOrUndefined(maxLevel[memPos]) || maxLevel[memPos] < memberlevel) {
                maxLevel[memPos] = memberlevel;
            }
            drillState.push({ level: memberlevel, uName: memberUName, hierarchy: hierarchy, isDrilled: false });
            if (tupInfo[tupPos - 1] && tupInfo[tupPos - 1].typeCollection[memPos] === '1' &&
                drillState[memPos].level > tupInfo[tupPos - 1].drillInfo[memPos].level) {
                let uCollection: string[] = uNameCollection.split(/~~|::\[/).map((item: string) => {
                    return item[0] === '[' ? item : ('[' + item);
                });
                uCollection.pop();
                let parentLevel: string = uCollection.join('~~');
                this.setDrillInfo(parentUName, parentLevel, memPos, tupPos, tupInfo);
            }
            memPos++;
        }
        if (hideFieldPos > -1) {
            showTotals = typeColl[hideFieldPos + 1] !== '2';
        }
        tupInfo[tupPos] = {
            allCount: allCount,
            allStartPos: allStartPos,
            measure: measure,
            measureName: measureName,
            measurePosition: measurePosition,
            members: members,
            typeCollection: typeColl,
            uNameCollection: uNameCollection,
            captionCollection: captionCollection,
            levelCollection: levelColl,
            drillInfo: drillState,
            drillStartPos: -1,
            drillEndPos: -1,
            showTotals: (!showSubTotals && allCount > 0 && allStartPos > (measurePosition === 0 ? 1 : 0)) ? false : showTotals
        };
        return maxLevel;
    }

    private getCaptionCollectionWithMeasure(tuple: ITupInfo): string {
        let captionColection: string = tuple.captionCollection;
        if (tuple.measure) {
            let measureName: string = tuple.measure.querySelector('Caption').textContent;
            let measurePosition: number = tuple.uNameCollection.split(/[~~,::]+/g).indexOf(tuple.measureName);
            let captionCollectionArray: string[] = tuple.captionCollection.split(/[~~,::]+/g);
            captionCollectionArray.splice(measurePosition, 0, measureName);
            captionColection = captionCollectionArray.join('.');
        } else {
            let captionCollectionArray: string[] = tuple.captionCollection.split(/[~~,::]+/g);
            captionColection = captionCollectionArray.join('.');
        }
        return captionColection;
    }

    /** hidden */
    public setNamedSetsPosition(): void {
        this.namedSetsPosition = {};
        let axis: number = 0;
        do {
            let setsPositions: { [key: number]: string } = {};
            let axisFields: IFieldOptions[] = axis ? this.dataSourceSettings.rows : this.dataSourceSettings.columns;
            for (let fPos: number = 0; fPos < axisFields.length; fPos++) {
                if (axisFields[fPos].isNamedSet) {
                    setsPositions[fPos] = axisFields[fPos].name;
                }
            }
            this.namedSetsPosition[axis ? 'row' : 'column'] = setsPositions;
            axis++;
        } while (axis < 2);
    }

    private updateRowEngine(pivotValues: IPivotValues, valueContent: IGridValues, tuplesLength: number): void {
        let currEngineCount: number = this.pivotValues.length - 1;
        let newEngineCount: number = Object.keys(pivotValues).length;
        while (currEngineCount > this.customArgs.drillInfo.currentCell.rowIndex) {
            this.pivotValues[currEngineCount + newEngineCount] = this.pivotValues[currEngineCount];
            (this.pivotValues[currEngineCount + newEngineCount][0] as IAxisSet).ordinal += tuplesLength;
            (this.pivotValues[currEngineCount + newEngineCount][0] as IAxisSet).rowIndex += newEngineCount;
            /* tslint:disable-next-line:max-line-length */
            this.valueContent[(currEngineCount + newEngineCount) - this.rowStartPos] = this.valueContent[currEngineCount - this.rowStartPos];
            currEngineCount--;
        }

        // for (let key in pivotValues) {
        for (let key: number = 0; key < pivotValues.length; key++) {
            this.pivotValues[key] = pivotValues[key];
            this.valueContent[Number(key) - this.rowStartPos] = valueContent[Number(key) - this.rowStartPos];
        }
        (this.pivotValues[this.customArgs.drillInfo.currentCell.rowIndex][0] as IAxisSet).isDrilled = true;
    }

    private updateTupCollection(newTuplesCount: number): void {
        let tupCollection: ITupInfo[] = this.customArgs.drillInfo.axis === 'row' ? this.tupRowInfo : this.tupColumnInfo;
        let currTupCount: number = tupCollection.length - 1;
        while (currTupCount > this.customArgs.drillInfo.currentCell.ordinal) {
            tupCollection[currTupCount + newTuplesCount] = tupCollection[currTupCount];
            currTupCount--;
        }
    }

    /* tslint:disable:max-func-body-length */
    private frameColumnHeader(tuples: Element[]): void {
        this.headerGrouping = {};
        this.lastLevel = [];
        let tupPos: number = 0;
        let maxLevel: number[] = [];
        let allType: number[] = [];
        let minLevel: number[] = [];
        let withoutAllStartPos: number = -1;
        let withoutAllEndPos: number = -1;
        let newTupPosition: number = (this.customArgs.drillInfo && this.customArgs.drillInfo.axis === 'column') ?
            (this.customArgs.drillInfo.currentCell.ordinal + 1) : 0;
        while (tupPos < tuples.length) {
            let members: NodeListOf<Element> = tuples[tupPos].querySelectorAll('Member');
            maxLevel = this.frameTupCollection(
                members, maxLevel, (tupPos + newTupPosition),
                this.tupColumnInfo, this.showColumnSubTotals, this.hideColumnTotalsObject, 'column');
            tupPos++;
        }
        if (tuples.length > 0) {
            let members: NodeListOf<Element> = tuples[0].querySelectorAll('Member');
            let memPos: number = 0;
            while (memPos < members.length) {
                minLevel[memPos] = (members[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                    Number(members[memPos].querySelector('LNum').textContent) === 0) ? 0 :
                    Number(members[memPos].querySelector('LNum').textContent);
                if (members[memPos].querySelector('MEMBER_TYPE').textContent === '1' &&
                    (this.isPaging || Number(members[memPos].querySelector('LNum').textContent) === 0)) {
                    allType[memPos] = 0;
                    withoutAllStartPos = withoutAllStartPos === -1 ? memPos : withoutAllStartPos;
                    withoutAllEndPos = memPos;
                } else {
                    allType[memPos] = 1;
                }
                memPos++;
            }
        }
        /* tslint:disable */
        let _this: any = this;
        /* tslint:enable */
        /* tslint:disable-next-line:max-line-length */
        maxLevel.map((item: number, pos: number) => { _this.colDepth = _this.colDepth + (allType[pos] === 0 ? (item + (1 - (minLevel[pos] > 1 ? 1 : minLevel[pos]))) : (item === 0 ? 1 : item)); });
        tupPos = 0;
        let position: number = 1;
        let lastAllStartPos: number;
        let lastSavedInfo: ILastSavedInfo = {};
        let drillLastAllStartPos: number;
        let lastAllCount: number;
        let drillLastAllCount: number;
        let isSubTotIncluded: boolean = true;
        let withoutAllAvail: boolean = false;
        let lastRealTup: ITupInfo;
        while (tupPos < tuples.length) {
            let members: NodeListOf<Element> = tuples[tupPos].querySelectorAll('Member');
            let allCount: number = this.tupColumnInfo[tupPos].allCount;
            let allStartPos: number = this.tupColumnInfo[tupPos].allStartPos;
            let measure: Element = this.tupColumnInfo[tupPos].measure;
            let typeColl: string[] = this.tupColumnInfo[tupPos].typeCollection;
            let drillInfo: IDrillInfo[] = this.tupColumnInfo[tupPos].drillInfo;
            let drillStartPos: number = this.tupColumnInfo[tupPos].drillStartPos;
            let startDrillUniquename: string = this.tupColumnInfo[tupPos].startDrillUniquename;
            let endDrillUniquename: string = this.tupColumnInfo[tupPos].endDrillUniquename;
            let drillEndPos: number = this.tupColumnInfo[tupPos].drillEndPos;
            let levelColl: number[] = this.tupColumnInfo[tupPos].levelCollection;
            let isStartCol: boolean = typeColl[0] === '2' ? false : (typeColl[0] === '3' ? typeColl[1] !== '2' : true);
            if (tupPos === 0 && members.length > (allCount + (measure ? 1 : 0))) {
                withoutAllAvail = true;
                isStartCol = (allCount > 0 && isStartCol) ? (allStartPos > withoutAllStartPos) : isStartCol;
            }
            if (isStartCol) {
                if (allCount === 0) {
                    let levelComp: number[] = [-1, -1, -1];
                    if (this.tupColumnInfo[tupPos - 1] && this.tupColumnInfo[tupPos - 1].allCount === 0) {
                        levelComp = this.levelCompare(levelColl, this.tupColumnInfo[tupPos - 1].levelCollection);
                    } else if (withoutAllAvail && lastRealTup) {
                        levelComp = this.levelCompare(levelColl, lastRealTup.levelCollection);
                    }
                    if (this.tupColumnInfo[tupPos].drillStartPos < 0) {
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this.mergeTotCollection(
                                position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                        }
                        this.setParentCollection(members);
                        this.frameCommonColumnLoop(members, tupPos, position, maxLevel, allType, minLevel);
                        if (!this.tupColumnInfo[tupPos].showTotals) {
                            position--;
                        }
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this.mergeTotCollection(
                                position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                        }
                        isSubTotIncluded = false;
                        position++;
                        /* tslint:disable-next-line:max-line-length */
                    } else if ((lastSavedInfo as ITupInfo).drillStartPos === drillStartPos ?
                        ((lastSavedInfo as ITupInfo).startDrillUniquename !== startDrillUniquename ||
                            (lastSavedInfo as ITupInfo).allCount === allCount) : true) {
                        if (!isSubTotIncluded && levelComp[0] > -1 && levelComp[2] > -1) {
                            position = this.mergeTotCollection(
                                position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo, levelComp);
                            isSubTotIncluded = true;
                        }
                        this.setParentCollection(members);
                        if (withoutAllAvail ? (withoutAllEndPos <= drillStartPos) : true) {
                            /* tslint:disable-next-line:max-line-length */
                            this.totalCollection[this.totalCollection.length] = ({ allCount: allCount, ordinal: tupPos, members: members, drillInfo: drillInfo });
                            (lastSavedInfo as ITupInfo).allCount = allCount;
                            (lastSavedInfo as ITupInfo).allStartPos = allStartPos;
                            (lastSavedInfo as ITupInfo).drillStartPos = drillStartPos;
                            (lastSavedInfo as ITupInfo).startDrillUniquename = startDrillUniquename;
                            (lastSavedInfo as ITupInfo).endDrillUniquename = endDrillUniquename;
                        }
                    }
                    lastRealTup = this.tupColumnInfo[tupPos];
                }
            }
            if (allCount > 0 && (withoutAllAvail ? (isStartCol && withoutAllEndPos < allStartPos) : true)) {
                if (allCount === (lastSavedInfo as ITupInfo).allCount || allStartPos !== (lastSavedInfo as ITupInfo).allStartPos) {
                    /* tslint:disable-next-line:max-line-length */
                    let endAllow: boolean = drillEndPos !== drillStartPos ? ((lastSavedInfo as ITupInfo).endDrillUniquename === endDrillUniquename) : true;
                    /* tslint:disable-next-line:max-line-length */
                    let allow: boolean = allStartPos !== (lastSavedInfo as ITupInfo).allStartPos ? ((lastSavedInfo as ITupInfo).startDrillUniquename !== startDrillUniquename) : endAllow;
                    if (drillStartPos > -1 ? (allow) : true) {
                        if (!isSubTotIncluded) {
                            position = this.mergeTotCollection(position, allCount, maxLevel, minLevel, allType, allStartPos, drillInfo);
                            isSubTotIncluded = true;
                        }
                        this.setParentCollection(members);
                        if ((withoutAllAvail && drillStartPos > -1) ? (withoutAllEndPos <= drillStartPos) : true) {
                            /* tslint:disable-next-line:max-line-length */
                            this.totalCollection[this.totalCollection.length] = ({ allCount: allCount, ordinal: tupPos, members: members, allStartPos: allStartPos, drillInfo: drillInfo });
                            (lastSavedInfo as ITupInfo).allCount = allCount;
                            (lastSavedInfo as ITupInfo).allStartPos = allStartPos;
                            (lastSavedInfo as ITupInfo).drillStartPos = drillStartPos;
                            (lastSavedInfo as ITupInfo).startDrillUniquename = startDrillUniquename;
                            (lastSavedInfo as ITupInfo).endDrillUniquename = endDrillUniquename;
                        }
                    }
                }
            }
            tupPos++;
        }
        if (this.totalCollection.length > 0) {
            if (Object.keys(this.colMeasures).length > 1) {
                this.orderTotals(position, maxLevel, allType, minLevel);
            } else {
                this.totalCollection = this.totalCollection.reverse();
                for (let coll of this.totalCollection) {
                    let isGrandTotal: boolean = this.tupColumnInfo[coll.ordinal].measurePosition === 0 ?
                        this.tupColumnInfo[coll.ordinal].allStartPos === 1 : this.tupColumnInfo[coll.ordinal].allStartPos === 0;
                    if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                        this.frameCommonColumnLoop(
                            coll.members, coll.ordinal, position, maxLevel, minLevel, allType);
                        if (this.tupColumnInfo[coll.ordinal].showTotals) {
                            position++;
                        }
                    }
                }
            }
        }
    }

    private orderTotals(position: number, maxLevel: number[], allType: number[], minLevel: number[]): void {
        let groupColl: { [key: string]: { coll: ITotCollection[], count: number } } = {};
        let maxCnt: number = 1;
        for (let coll of this.totalCollection) {
            let isGrandTotal: boolean = this.tupColumnInfo[coll.ordinal].measurePosition === 0 ?
                this.tupColumnInfo[coll.ordinal].allStartPos === 1 : this.tupColumnInfo[coll.ordinal].allStartPos === 0;
            if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                let measureName: string = this.tupColumnInfo[coll.ordinal].measure.querySelector('UName').textContent;
                if (groupColl[measureName]) {
                    groupColl[measureName].coll.push(coll);
                    groupColl[measureName].count++;
                    maxCnt = maxCnt < groupColl[measureName].count ? groupColl[measureName].count : maxCnt;
                } else {
                    groupColl[measureName] = { coll: [coll], count: 1 };
                }
            }
        }
        let keys: string[] = Object.keys(groupColl);
        let collLength: number = maxCnt - 1;
        while (collLength > -1) {
            for (let key of keys) {
                let coll: ITotCollection = groupColl[key].coll[collLength];
                if (coll) {
                    this.frameCommonColumnLoop(
                        coll.members, coll.ordinal, position, maxLevel, allType, minLevel);
                    if (this.tupColumnInfo[coll.ordinal].showTotals) {
                        position++;
                    }
                }
            }
            collLength--;
        }
    }

    private setParentCollection(members: NodeListOf<Element>): void {
        let memPos: number = 0;
        while (members.length > memPos) {
            let member: Element = members[memPos];
            let memberType: string = Number(member.querySelector('MEMBER_TYPE').textContent) > 2 ? '3' :
                member.querySelector('MEMBER_TYPE').textContent;
            let memberlevel: number = Number(member.querySelector('LNum').textContent);
            let memberUName: string = member.querySelector('UName').textContent;
            let parentUName: string = member.querySelector('PARENT_UNIQUE_NAME') ?
                member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            let isSameParent: boolean = true;
            let isWithoutAllMember: boolean = false;
            if (this.parentObjCollection[memPos]) {
                let levelCollection: string[] = Object.keys(this.parentObjCollection[memPos]);
                let parentMember: Element = this.parentObjCollection[memPos][memberlevel - 1];
                isSameParent = parentMember ? parentUName === parentMember.querySelector('UName').textContent :
                    levelCollection.length === 0;
                isWithoutAllMember = this.tupColumnInfo[0].typeCollection[memPos] === '1';
            }
            if (memberType === '2') {
                delete this.parentObjCollection[memPos];
            } else {
                if ((this.isPaging || isWithoutAllMember) ? !isSameParent : false) {
                    delete this.parentObjCollection[memPos];
                }
                if (!this.parentObjCollection[memPos]) {
                    this.parentObjCollection[memPos] = {};
                    this.parentObjCollection[memPos][memberlevel] = member;
                } else if (!this.parentObjCollection[memPos][memberlevel] ||
                    this.parentObjCollection[memPos][memberlevel].querySelector('UName').textContent !== memberUName) {
                    this.parentObjCollection[memPos][memberlevel] = member;
                }
            }
            memPos++;
        }
    }

    private setDrillInfo(pUName: string, parentLvlCollection: string, memPos: number, tupPos: number, tupInfo: ITupInfo[]): void {
        tupPos--;
        while (tupInfo[tupPos] && tupInfo[tupPos].drillInfo[memPos].uName === pUName) {
            let prevUcollection: string[] =
                tupInfo[tupPos].uNameCollection.split(/~~|::\[/).map((item: string) => {
                    return item[0] === '[' ? item : ('[' + item);
                });
            if (prevUcollection.join('~~').indexOf(parentLvlCollection) < 0) {
                break;
            }
            tupInfo[tupPos].drillInfo[memPos].isDrilled = true;
            if (this.curDrillEndPos <= memPos) {
                tupInfo[tupPos].drillEndPos = this.curDrillEndPos = memPos;
                tupInfo[tupPos].endDrillUniquename = pUName;
            }
            if (tupInfo[tupPos].drillStartPos > memPos || tupInfo[tupPos].drillStartPos === -1) {
                tupInfo[tupPos].drillStartPos = memPos;
            }
            tupInfo[tupPos].startDrillUniquename = pUName;
            tupPos--;
        }
    }

    private levelCompare(newLevels: number[], oldLevels: number[]): number[] {
        let changePos: number[] = [-1, 0];
        for (let lPos: number = 0; lPos < oldLevels.length; lPos++) {
            if (newLevels[lPos] !== oldLevels[lPos]) {
                changePos = [lPos, newLevels[lPos], (oldLevels[lPos] - newLevels[lPos])];
                break;
            }
        }
        return changePos;
    }

    /* tslint:disable-next-line:max-line-length */
    private mergeTotCollection(position: number, allCount: number, maxLevel: number[], allType: number[], minLevel: number[], allStartPos: number, drillInfo: IDrillInfo[], levelComp?: number[]): number {
        /* tslint:disable-next-line:max-line-length */
        let prevHdrPos: number = isNullOrUndefined(allStartPos) ? levelComp[0] : (allStartPos - ((this.colMeasurePos === (allStartPos - 1)) ? 2 : 1));
        let flagLevel: number = drillInfo[prevHdrPos] && drillInfo[prevHdrPos].level;
        let flagLevelString: string = this.getLevelsAsString(prevHdrPos - 1, drillInfo);
        let groupColl: { [key: string]: { coll: ITotCollection[], count: number } } = {};
        let maxCnt: number = 1;
        let enterFlag: boolean = false;
        for (let coll of this.totalCollection) {
            if (enterFlag || (coll.allCount <= allCount &&
                ((flagLevel > -1 && coll.drillInfo[prevHdrPos]) ? ((coll.drillInfo[prevHdrPos].level >= flagLevel) &&
                    (this.getLevelsAsString(prevHdrPos - 1, coll.drillInfo)) === flagLevelString) : true))) {
                /* tslint:disable-next-line:max-line-length */
                let measureName: string = this.tupColumnInfo[coll.ordinal].measure ? this.tupColumnInfo[coll.ordinal].measure.querySelector('UName').textContent : 'measure';
                if (groupColl[measureName]) {
                    groupColl[measureName].coll.push(coll);
                    groupColl[measureName].count++;
                    maxCnt = maxCnt < groupColl[measureName].count ? groupColl[measureName].count : maxCnt;
                } else {
                    groupColl[measureName] = { coll: [coll], count: 1 };
                }
                enterFlag = false;
            }
        }
        let keys: string[] = Object.keys(groupColl);
        let collLength: number = maxCnt - 1;
        while (collLength > -1) {
            for (let key of keys) {
                let coll1: ITotCollection = groupColl[key].coll[collLength];
                if (coll1) {
                    let isGrandTotal: boolean = this.tupColumnInfo[coll1.ordinal].measurePosition === 0 ?
                        this.tupColumnInfo[coll1.ordinal].allStartPos === 1 : this.tupColumnInfo[coll1.ordinal].allStartPos === 0;
                    if (isGrandTotal ? (this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showColumnGrandTotals) : true) {
                        this.frameCommonColumnLoop(
                            coll1.members, coll1.ordinal, position, maxLevel, minLevel, allType);
                        if (this.tupColumnInfo[coll1.ordinal].showTotals) {
                            position++;
                        }
                    }
                    this.totalCollection.pop();
                }
            }
            collLength--;
        }
        return position;
    }

    private getLevelsAsString(prevHdrPos: number, drillInfo: IDrillInfo[]): string {
        let lvlCollection: number[] = [];
        for (let pos: number = 0; pos < prevHdrPos; pos++) {
            lvlCollection[pos] = drillInfo[pos].level;
        }
        return lvlCollection.length > 0 ? lvlCollection.toString() : '';
    }

    /* tslint:disable-next-line:max-line-length */
    private frameCommonColumnLoop(members: NodeListOf<Element>, tupPos: number, position: number, maxLevel: number[], minLevel: number[], allType: number[]): void {
        let drillMemberPosition: number = -1;
        if (this.tupColumnInfo[tupPos].showTotals) {
            let memberPos: number = 0;
            let memberDepth: number = 0;
            while (memberPos < members.length) {
                memberDepth += (allType[memberPos] > 0 && this.tupColumnInfo[tupPos].measurePosition !== memberPos) ?
                    maxLevel[memberPos] :
                    (maxLevel[memberPos] + (1 - minLevel[memberPos]));
                if (this.tupColumnInfo[tupPos].drillInfo[memberPos].isDrilled && this.tupColumnInfo[tupPos].showTotals) {
                    this.tupColumnInfo[tupPos].showTotals = !this.showColumnSubTotals ? false :
                        this.hideColumnTotalsObject[this.tupColumnInfo[tupPos].drillInfo[memberPos].hierarchy] === undefined;
                    memberDepth -= maxLevel[memberPos] -
                        this.tupColumnInfo[tupPos].levelCollection[memberPos];
                    drillMemberPosition = this.tupColumnInfo[tupPos].showTotals ? -1 : (memberDepth - 1);
                }
                memberPos++;
            }
        }
        if (this.tupColumnInfo[tupPos].showTotals) {
            let memPos: number = 0;
            let spanMemPos: number = 0;
            let colMembers: { [key: string]: string } = {};
            while (memPos < members.length) {
                let member: Element = members[memPos];
                let memberType: string = Number(member.querySelector('MEMBER_TYPE').textContent) > 2 ? '3' :
                    member.querySelector('MEMBER_TYPE').textContent;
                let memDup: number = 0;
                for (let rowDepthPos: number = memberType !== '2' ? (allType[memPos] ? 1 : minLevel[memPos]) : 1;
                    rowDepthPos <= (memberType === '3' ? 1 : maxLevel[memPos]); rowDepthPos++) {
                    let isDrilled: boolean = false;
                    if (!this.pivotValues[spanMemPos]) {
                        (this.pivotValues[spanMemPos] as IAxisSet[]) = [];
                    }
                    if (Number(members[memPos].querySelector('LNum').textContent) > rowDepthPos && memberType !== '2') {
                        if (!this.parentObjCollection[memPos][rowDepthPos]) {
                            this.getDrilledParent(members[memPos], rowDepthPos, this.parentObjCollection[memPos]);
                        }
                        if (this.parentObjCollection[memPos][rowDepthPos]) {
                            member = this.parentObjCollection[memPos][rowDepthPos];
                        }
                        isDrilled = true;
                    } else {
                        member = members[memPos];
                        memDup++;
                    }
                    if (memberType !== '2') {
                        colMembers[member.querySelector('UName').textContent] = member.querySelector('Caption').textContent;
                    }
                    /* tslint:disable */
                    let levelName: string = (Object as any).values(colMembers).join('.');
                    let isNamedSet: boolean = this.namedSetsPosition['column'][memPos] ? true : false;
                    (this.pivotValues[spanMemPos] as IAxisSet[])[position] = {
                        axis: 'column',
                        actualText: this.getUniqueName(member.querySelector('UName').textContent),
                        colIndex: position,
                        formattedText: member.querySelector('Caption').textContent,
                        hasChild: Number(member.querySelector('CHILDREN_CARDINALITY').textContent) > 0 ? true : false,
                        /* tslint:disable-next-line:max-line-length */
                        level: memDup > 1 ? -1 : (Number(member.querySelector('LNum').textContent) - ((allType[memPos] && memberType !== '3') ? 1 : 0)),
                        rowIndex: spanMemPos,
                        ordinal: tupPos,
                        memberType: Number(memberType),
                        isDrilled: isDrilled || this.tupColumnInfo[tupPos].drillInfo[memPos].isDrilled,
                        /* tslint:disable-next-line:max-line-length */
                        parentUniqueName: member.querySelector('PARENT_UNIQUE_NAME') ? member.querySelector('PARENT_UNIQUE_NAME').textContent : undefined,
                        levelUniqueName: member.querySelector('LName').textContent,
                        hierarchy: member.getAttribute('Hierarchy'),
                        isNamedSet: isNamedSet,
                        valueSort: { levelName: levelName, [levelName]: 1, axis: member.getAttribute('Hierarchy') }
                        /* tslint:enable */
                    };
                    if (!this.headerContent[spanMemPos]) {
                        this.headerContent[spanMemPos] = {} as IAxisSet[];
                    }
                    this.headerContent[spanMemPos][position] = (this.pivotValues[spanMemPos] as IAxisSet[])[position];
                    spanMemPos++;
                }
                memPos++;
            }
        } else {
            if (drillMemberPosition > -1) {
                (this.pivotValues[drillMemberPosition] as IAxisSet[])[position - 1].ordinal = tupPos;
            } else if (this.tupColumnInfo[tupPos].allCount > 0) {
                let memberPos: number = 0;
                let memberDepth: number = 0;
                while (memberPos < this.tupColumnInfo[tupPos].allStartPos) {
                    memberDepth += (allType[memberPos] > 0 && this.tupColumnInfo[tupPos].measurePosition !== memberPos) ?
                        maxLevel[memberPos] :
                        (maxLevel[memberPos] + (1 - minLevel[memberPos]));
                    memberPos++;
                }
                if (this.tupColumnInfo[tupPos].allStartPos === (this.tupColumnInfo[tupPos].measurePosition + 1)) {
                    memberDepth -= maxLevel[this.tupColumnInfo[tupPos].allStartPos - 2] -
                        this.tupColumnInfo[tupPos].levelCollection[this.tupColumnInfo[tupPos].allStartPos - 2] + 1;
                } else {
                    memberDepth -= maxLevel[this.tupColumnInfo[tupPos].allStartPos - 1] -
                        this.tupColumnInfo[tupPos].levelCollection[this.tupColumnInfo[tupPos].allStartPos - 1];
                }
                (this.pivotValues[memberDepth - 1] as IAxisSet[])[position - 1].ordinal = tupPos;
            }
        }
    }

    private getDrilledParent(childMember: Element, parentLevel: number, savedCollection: { [key: number]: Element }): void {
        let childlevel: number = Number(childMember.querySelector('LNum').textContent);
        let currentChild: Element = childMember;
        for (let lvl: number = childlevel - 1; lvl >= parentLevel; lvl--) {
            let currentParent: Element = this.drilledSets[currentChild.querySelector('PARENT_UNIQUE_NAME').textContent];
            if (currentParent) {
                savedCollection[lvl] = currentParent;
                currentChild = currentParent;
            } else {
                break;
            }
        }
    }

    /* tslint:disable */
    private performRowSorting(): void {
        if (this.enableSort && this.tupRowInfo.length > 0) {
            let rowCount: number = this.pivotValues.length;
            let lvlGrouping: { [key: number]: { [key: string]: IAxisSet[] } } = {};
            let measureObjects: { [key: string]: IAxisSet[] } = {};
            let gSumGrouping: IAxisSet[] = [];
            let gSumFlag: boolean = false;
            let withoutAllLastPos: number = this.tupRowInfo[0].typeCollection.lastIndexOf('1');
            for (let rPos: number = this.colDepth; rPos < rowCount; rPos++) {
                let currentCell: IAxisSet = (this.pivotValues[rPos] as IAxisSet[])[0];
                let currentTuple: ITupInfo = this.tupRowInfo[currentCell.ordinal];
                let uniqueName: string = currentTuple ? currentTuple.uNameCollection : '';
                if (uniqueName !== '') {
                    if (withoutAllLastPos > -1) {
                        uniqueName = this.frameUniqueName(uniqueName, currentCell, currentTuple);
                    }
                    let level: number = uniqueName.split(/~~|::\[/).length;
                    if (currentCell.memberType === 3 && this.tupRowInfo[0].measurePosition > 0) {
                        let parentUName: string = this.getParentUname(uniqueName, currentCell, true, true);
                        if (measureObjects[parentUName]) {
                            measureObjects[parentUName].push(currentCell);
                        } else {
                            measureObjects[parentUName] = [currentCell];
                        }
                    } else if (lvlGrouping[level]) {
                        lvlGrouping[level][uniqueName] = [currentCell];
                    } else {
                        lvlGrouping[level] = { [uniqueName]: [currentCell] };
                    }
                }
                if (gSumFlag) {
                    gSumGrouping.push(currentCell);
                }
                if (currentCell.type === 'grand sum') {
                    gSumFlag = true;
                }
            }
            let isMeasureAvail: boolean = Object.keys(measureObjects).length > 0 && this.tupRowInfo[0].measurePosition > 0;
            let levels: number[] = Object.keys(lvlGrouping).map((item: string) => {
                return Number(item);
            }).sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
            let sortLvlGrouping: { [key: number]: { [key: string]: IAxisSet[] } } = {};
            for (let lPos: number = levels.length - 1; lPos >= 0; lPos--) {
                let parentGrouping: { [key: string]: IAxisSet[] } = {};
                let objCollection: { [key: string]: IAxisSet[] } = lvlGrouping[levels[lPos]];
                let objKeys: string[] = Object.keys(objCollection);
                for (let oPos: number = 0; oPos < objKeys.length; oPos++) {
                    let parentUName: string = lPos === 0 ? 'parent' :
                        this.getParentUname(objKeys[oPos], objCollection[objKeys[oPos]][0], isMeasureAvail, false);
                    if (parentGrouping[parentUName]) {
                        parentGrouping[parentUName].push(objCollection[objKeys[oPos]][0]);
                    } else {
                        parentGrouping[parentUName] = [objCollection[objKeys[oPos]]][0];
                    }
                }
                let pKeys: string[] = Object.keys(parentGrouping);
                /* tslint:disable:typedef */
                for (let kPos: number = 0; kPos < pKeys.length; kPos++) {
                    parentGrouping[pKeys[kPos]] = this.sortRowHeaders(parentGrouping[pKeys[kPos]]);
                }
                /* tslint:enable:typedef */
                if (sortLvlGrouping[levels[lPos + 1]]) {
                    for (let kPos: number = 0; kPos < pKeys.length; kPos++) {
                        let groupSets: IAxisSet[] = [];
                        let axisSets: IAxisSet[] = parentGrouping[pKeys[kPos]];
                        for (let aPos: number = 0; aPos < axisSets.length; aPos++) {
                            let tupInfo: ITupInfo = this.tupRowInfo[axisSets[aPos].ordinal];
                            let uName: string = tupInfo.uNameCollection;
                            groupSets.push(axisSets[aPos]);
                            if (withoutAllLastPos > -1) {
                                uName = this.frameUniqueName(uName, axisSets[aPos], tupInfo);
                            }
                            let isMembersIncluded: boolean = false;
                            if (isMeasureAvail) {
                                let parentUName: string = this.getParentUname(uName, axisSets[aPos], isMeasureAvail, true);
                                if (measureObjects[parentUName]) {
                                    measureObjects[parentUName] = this.sortRowHeaders(measureObjects[parentUName]);
                                    let isLastMeasure: boolean = uName.lastIndexOf('::[') === uName.indexOf('::[Measures]');
                                    let isFullLength: boolean = uName.split('::[').length - 1 === tupInfo.measurePosition;
                                    let isLastNotDrilledMember: boolean = !tupInfo.drillInfo[tupInfo.measurePosition - 1].isDrilled;
                                    let isActualLastMember: boolean = tupInfo.members.length > (tupInfo.measurePosition + 1);
                                    if (isLastMeasure && isFullLength && isLastNotDrilledMember && isActualLastMember) {
                                        isMembersIncluded = true;
                                        for (let mPos: number = 0; mPos < measureObjects[parentUName].length; mPos++) {
                                            groupSets.push(measureObjects[parentUName][mPos]);
                                            let matchParent: string = (uName.substring(
                                                0, uName.indexOf(
                                                    '::[Measures]')) + '::' + measureObjects[parentUName][mPos].actualText);
                                            if (sortLvlGrouping[levels[lPos + 1]][matchParent]) {
                                                groupSets = groupSets.concat(sortLvlGrouping[levels[lPos + 1]][matchParent]);
                                            }
                                        }
                                    } else {
                                        groupSets = groupSets.concat(measureObjects[parentUName]);
                                    }
                                }
                            }
                            if (!isMembersIncluded &&
                                sortLvlGrouping[levels[lPos + 1]][uName]) {
                                /* tslint:disable-next-line:max-line-length */
                                groupSets = groupSets.concat(sortLvlGrouping[levels[lPos + 1]][uName]);
                            }
                        }
                        parentGrouping[pKeys[kPos]] = groupSets;
                    }
                } else if (isMeasureAvail) {
                    for (let kPos: number = 0; kPos < pKeys.length; kPos++) {
                        let axisSets: IAxisSet[] = parentGrouping[pKeys[kPos]];
                        let groupSets: IAxisSet[] = [];
                        for (let aPos: number = 0; aPos < axisSets.length; aPos++) {
                            groupSets.push(axisSets[aPos]);
                            let uName: string = this.tupRowInfo[axisSets[aPos].ordinal].uNameCollection;
                            if (withoutAllLastPos > -1) {
                                uName = this.frameUniqueName(uName, axisSets[aPos], this.tupRowInfo[axisSets[aPos].ordinal]);
                            }
                            let parentUName: string =
                                this.getParentUname(uName, axisSets[aPos], true, true);
                            if (measureObjects[parentUName]) {
                                measureObjects[parentUName] = this.sortRowHeaders(measureObjects[parentUName]);
                                groupSets = groupSets.concat(measureObjects[parentUName]);
                            }
                        }
                        parentGrouping[pKeys[kPos]] = groupSets;
                    }
                }
                sortLvlGrouping[levels[lPos]] = parentGrouping;
            }
            let newPos: number = 0;
            let totPos: number = 0;
            gSumFlag = false;
            gSumGrouping = this.sortRowHeaders(gSumGrouping);
            for (let rPos: number = this.colDepth; rPos < rowCount; rPos++) {
                let cell: IAxisSet[] = gSumFlag ? gSumGrouping : sortLvlGrouping[levels[0]]['parent'];
                let currPos: number = gSumFlag ? (newPos - totPos) : newPos;
                if (cell[currPos]) {
                    this.pivotValues[rPos] = [cell[currPos]];
                    (this.pivotValues[rPos][0] as IAxisSet).rowIndex = rPos;
                    this.valueContent[newPos][0] = this.pivotValues[rPos][0] as IAxisSet;
                }
                newPos++;
                if ((this.pivotValues[rPos][0] as IAxisSet).type === 'grand sum') {
                    gSumFlag = true;
                    totPos = newPos;
                }
            }
        }
    }
    /* tslint:disable:max-func-body-length */
    private performColumnSorting(): void {
        if (this.enableSort) {
            for (let i: number = 0; i < this.dataSourceSettings.columns.length; i++) {
                let temporary: Object[] = [];
                let index: number = 0;
                let grandTotal: Object[] = [];
                for (let j: number = 0; j < this.pivotValues.length; j++) {
                    let header: IAxisSet[] = this.pivotValues[j] as IAxisSet[];
                    let key: string[];
                    let keys: string[];
                    let arrange: { [key: string]: IAxisSet[] } = {};
                    let value: number = 1;
                    grandTotal[index] = [];
                    temporary[index] = [];
                    let k: number = 1;
                    for (k = k; k < header.length; k++) {
                        if (!header[k].isNamedSet) {
                            if ((header[k] as IAxisSet).memberType != 2 && header[k].hierarchy
                                != '[Measures]' && (header[k] as IAxisSet).level != -1) {
                                isNullOrUndefined(arrange[(header[k] as IAxisSet).formattedText]) ?
                                    arrange[(header[k] as IAxisSet).formattedText] = [] : arrange[k];
                                arrange[(header[k] as IAxisSet).formattedText][(header[k] as IAxisSet).colIndex] = header[k];
                            }
                            else if (Object.keys(arrange).length > 0) {
                                (grandTotal[index] as Object[])[(grandTotal[index] as Object[]).length + value] = header[k];
                                key = Object.keys(arrange);
                                /* tslint:disable:typedef */
                                key = this.sortColumnHeaders(key, this.sortObject[header[k - 1].levelUniqueName] ||
                                    this.sortObject[header[k].hierarchy]);
                                isNullOrUndefined(temporary[index]) ? temporary[index] = [] : temporary[index];
                                for (let l: number = 0; l < key.length; l++) {
                                    let length: number = Object.keys(arrange[key[l]]).length;
                                    for (let q: number = 0; q < length; q++) {
                                        value = (temporary[index] as Object[]).length == 0 ? 1 : 0;
                                        (temporary[index] as Object[])[(temporary[index] as Object[]).length + value] =
                                            arrange[key[l]][Number(Object.keys(arrange[key[l]])[q])];
                                    }
                                }
                            }
                            else if (((header[k] as IAxisSet).level === -1 || (header[k] as IAxisSet).level === 0) &&
                                Object.keys(arrange).length >= 0 && header[k].hierarchy != '[Measures]') {
                                (grandTotal[index] as Object[])[(grandTotal[index] as Object[]).length + value] = header[k];
                            }
                            if ((header[k] as IAxisSet).level != -1 && Object.keys(arrange).length === 1 &&
                                header[k].hierarchy != '[Measures]' && !isNullOrUndefined(header[k + 1]) &&
                                (header[k + 1] as IAxisSet).level === -1) {
                                let height: number = Object.keys(arrange[(header[k] as IAxisSet).formattedText]).length;
                                let weight: string[] = Object.keys(arrange[(header[k] as IAxisSet).formattedText]);
                                if (height > 1) {
                                    for (let hgt: number = 0; hgt < height; hgt++) {
                                        value = (grandTotal[index] as Object[]).length == 0 ? 1 : 0;
                                        (grandTotal[index] as Object[])[(grandTotal[index] as Object[]).length + value] =
                                            arrange[(header[k] as IAxisSet).formattedText][Number(weight[hgt])];
                                    }
                                }
                                else {
                                    (grandTotal[index] as Object[])[(grandTotal[index] as Object[]).length + value] = header[k];
                                }
                            }
                            if (Object.keys(grandTotal[index]).length > 0) {
                                value = (temporary[index] as Object[]).length == 0 ? 1 : 0;
                                let height1: number = (grandTotal[index] as Object[]).length;
                                if (height1 > 2) {
                                    for (let hgt1: number = 1; hgt1 < height1; hgt1++) {
                                        value = (temporary[index] as Object[]).length == 0 ? 1 : 0;
                                        (temporary[index] as Object[])[(temporary[index] as Object[]).length + value] =
                                            (grandTotal[index] as Object[])[hgt1];
                                    }
                                }
                                else {
                                    (temporary[index] as Object[])[(temporary[index] as Object[]).length + value] =
                                        (grandTotal[index] as Object[])[1] || (grandTotal[index] as Object[])[0];
                                }
                                arrange = {};
                                grandTotal[index] = [];
                            }
                        }
                    }
                    if (Object.keys(arrange).length > 0) {
                        (grandTotal[index] as Object[])[(grandTotal[index] as Object[]).length + value] = header[k];
                        keys = Object.keys(arrange);
                        /* tslint:disable:typedef */
                        let order: string = this.sortObject[header[k - 1].levelUniqueName] || this.sortObject[header[k - 1].hierarchy];
                        key = this.sortColumnHeaders(keys, order);
                        isNullOrUndefined(temporary[index]) ? temporary[index] = [] : temporary[index];
                        for (let len: number = 0; len < keys.length; len++) {
                            let leng: number = Object.keys(arrange[keys[len]]).length;
                            for (let q: number = 0; q < leng; q++) {
                                value = (temporary[index] as Object[]).length == 0 ? 1 : 0;
                                (temporary[index] as Object[])[(temporary[index] as Object[]).length + value] =
                                    arrange[key[len]][Number(Object.keys(arrange[keys[len]])[q])];
                            }
                        }
                    }
                    for (let m: number = 1; m < (temporary[index] as Object[]).length; m++) {
                        this.pivotValues[index][m] = (temporary[index] as Object[])[m];
                    }
                    for (let n: number = j; n < this.pivotValues.length; n++) {
                        let pElement: IPivotRows = extend({}, this.pivotValues[n + 1], null, true) as IPivotValues;
                        let cElement: IPivotRows = extend({}, this.pivotValues[n], null, true) as IPivotValues;
                        if (Object.keys(pElement).length === Object.keys(cElement).length && Object.keys(pElement).length > 2) {
                            for (let o: number = 1; o < this.pivotValues[j].length; o++) {
                                if (Object.keys(pElement).length > 0 && (cElement[o] as IAxisSet).colIndex
                                    != (pElement[o] as IAxisSet).colIndex) {
                                    this.pivotValues[n + 1][o] = pElement[(cElement[o] as IAxisSet).colIndex];
                                }
                            }
                            break;
                        }
                    }
                    index++;
                    arrange = {};
                }
                for (let i: number = 0; i < this.pivotValues.length; i++) {
                    let header: IPivotRows = this.pivotValues[i];
                    for (let j: number = 1; j < header.length; j++) {
                        (header[j] as IAxisSet).colIndex = j;
                    }
                }
            }
        }
    }
    private frameUniqueName(uniqueName: string, currentCell: IAxisSet, currentTuple: ITupInfo): string {
        let hasLastMeasure: boolean = uniqueName.indexOf(currentCell.actualText.toString() + '::[Measures]') > -1;
        uniqueName = uniqueName.substring(0, uniqueName.indexOf(currentCell.actualText.toString())) +
            currentCell.actualText.toString();
        let measureAvail: boolean = uniqueName.split('::[').length <= currentTuple.measurePosition;
        uniqueName = uniqueName + ((hasLastMeasure || measureAvail) ? ('::' + currentTuple.measureName) : '');
        return uniqueName;
    }
    private sortRowHeaders(headers: IAxisSet[]): IAxisSet[] {
        if (headers.length > 0 && headers[0].memberType !== 3 && !headers[0].isNamedSet) {
            let order: string = (this.sortObject[headers[0].hierarchy] || this.sortObject[headers[0].levelUniqueName]);
            if (order === 'Ascending' || order === undefined) {
                headers == headers.sort((a: IAxisSet, b: IAxisSet) => (a.formattedText > b.formattedText) ? 1 :
                    ((b.formattedText > a.formattedText) ? -1 : 0));
            } else if (order === 'Descending') {
                headers == headers.sort((a: IAxisSet, b: IAxisSet) => (a.formattedText < b.formattedText) ? 1 :
                    ((b.formattedText < a.formattedText) ? -1 : 0));
            } else {
                headers;
            }
        }
        return headers;
    }
    private sortColumnHeaders(keys: string[], order: string): string[] {
        if (order === 'Ascending' || order === undefined) {
            keys.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
        } else if (order === 'Descending') {
            keys.sort((a, b) => (a < b) ? 1 : ((b < a) ? -1 : 0));
        }
        return keys;
    }
    private frameSortObject(): void {
        if (this.enableSort) {
            for (let fPos: number = 0; fPos < this.sortSettings.length; fPos++) {
                this.sortObject[this.sortSettings[fPos].name] = this.sortSettings[fPos].order;
            }
        }
    }
    /* tslint:enable */
    private getParentUname(uniqueNameColl: string, cell: IAxisSet, isMeasureAvail: boolean, isLastMeasure: boolean): string {
        let parentString: string = '';
        if (isMeasureAvail && !isLastMeasure) {
            let tuple: ITupInfo = this.tupRowInfo[cell.ordinal];
            let sepPos: number[] = [];
            let sepObjects: { [key: number]: string } = {};
            for (let i: number = 0; i < uniqueNameColl.length; i++) {
                if (uniqueNameColl[i] === '~' || uniqueNameColl[i] === ':') {
                    sepPos.push(i);
                    sepObjects[i] = uniqueNameColl[i] + uniqueNameColl[i];
                    i++;
                }
            }
            if (tuple.measurePosition >= (uniqueNameColl.split('::[').length - 1)) {
                if (sepPos[sepPos.length - 2] > -1) {
                    parentString = uniqueNameColl.substring(0, sepPos[sepPos.length - 2]) + sepObjects[sepPos[sepPos.length - 1]] +
                        tuple.measureName;
                } else {
                    parentString = 'parent';
                }
            } else {
                let lastPosition: number = uniqueNameColl.lastIndexOf('~~') > uniqueNameColl.lastIndexOf('::[') ?
                    uniqueNameColl.lastIndexOf('~~') : uniqueNameColl.lastIndexOf('::[');
                parentString = lastPosition > -1 ? uniqueNameColl.substring(0, lastPosition) : 'parent';
            }
        } else {
            let lastPosition: number = uniqueNameColl.lastIndexOf('~~') > uniqueNameColl.lastIndexOf('::[') ?
                uniqueNameColl.lastIndexOf('~~') : uniqueNameColl.lastIndexOf('::[');
            parentString = lastPosition > -1 ? uniqueNameColl.substring(0, lastPosition) : 'parent';
        }
        return parentString;
    }

    private performColumnSpanning(): void {
        let spanCollection: { [key: number]: { [key: number]: number } } = {};
        let rowPos: number = this.rowStartPos - 1;
        let colMeasureCount: number = Object.keys(this.colMeasures).length;
        while (rowPos > -1) {
            spanCollection[rowPos] = {};
            let colPos: number = (this.pivotValues[rowPos] as IAxisSet[]).length - 1;
            while (colPos > 0) {
                spanCollection[rowPos][colPos] = 1;
                let nextColCell: IAxisSet = (this.pivotValues[rowPos] as IAxisSet[])[colPos + 1];
                /* tslint:disable-next-line:max-line-length */
                let nextRowCell: IAxisSet = ((this.pivotValues[rowPos + 1] as IAxisSet[]) && this.rowStartPos - rowPos > 1) ? (this.pivotValues[rowPos + 1] as IAxisSet[])[colPos] : undefined;
                let currCell: IAxisSet = (this.pivotValues[rowPos] as IAxisSet[])[colPos];
                let colflag: boolean = false;
                let rowflag: boolean = false;
                let tupColInfo: ITupInfo = this.tupColumnInfo[currCell.ordinal];
                let isSubTot: boolean = tupColInfo.allStartPos > (tupColInfo.typeCollection[0] === '3' ? 1 : 0);
                if (nextRowCell && nextColCell && ((currCell.memberType === 2 || currCell.level === -1) ?
                    (nextColCell.actualText === currCell.actualText) :
                    ((currCell.memberType === 3 && currCell.actualText === nextColCell.actualText) ||
                        nextColCell.valueSort.levelName === currCell.valueSort.levelName))) {
                    if (currCell.memberType === 2) {
                        if (isSubTot ? nextColCell.type === 'sum' : true) {
                            currCell.colSpan = (nextColCell.colSpan + 1) >
                                (tupColInfo.measurePosition > rowPos ? colMeasureCount : 0) ? 1 : (nextColCell.colSpan + 1);
                        } else {
                            currCell.colSpan = 1;
                        }
                    } else {
                        currCell.colSpan = nextColCell.colSpan + 1;
                        currCell.ordinal = nextColCell.ordinal;
                    }
                    colflag = true;
                }
                if (currCell.memberType === 2) {
                    if (isSubTot) {
                        currCell.type = 'sum';
                        /* tslint:disable-next-line:max-line-length */
                        //currCell.formattedText = (this.pivotValues[tupColInfo.allStartPos - 1] as IAxisSet[])[colPos].formattedText + ' Total';
                        currCell.formattedText = 'Total';
                        currCell.valueSort.levelName = currCell.valueSort.levelName;
                        currCell.valueSort[currCell.valueSort.levelName.toString()] = 1;
                    } else {
                        let levelName: string | number | Date = 'Grand Total';
                        if (nextRowCell && colMeasureCount > 0) {
                            levelName = nextRowCell.memberType === 3 ? ('Grand Total.' + nextRowCell.formattedText) :
                                nextRowCell.valueSort.levelName;
                        }
                        currCell.type = 'grand sum';
                        currCell.formattedText = 'Grand Total';
                        currCell.valueSort.levelName = levelName;
                        currCell.valueSort[levelName.toString()] = 1;
                    }
                    currCell.hasChild = false;
                } else if (currCell.level === -1) {
                    currCell.type = 'sum';
                    //currCell.formattedText = currCell.formattedText + ' Total';
                    currCell.formattedText = 'Total';
                    currCell.hasChild = false;
                    currCell.valueSort.levelName = currCell.valueSort.levelName;
                    currCell.valueSort[currCell.valueSort.levelName.toString()] = 1;
                }
                if (nextRowCell) {
                    if ((currCell.memberType === 2 && nextRowCell.memberType === 2) || nextRowCell.actualText === currCell.actualText) {
                        spanCollection[rowPos][colPos] = spanCollection[rowPos + 1] ? (spanCollection[rowPos + 1][colPos] + 1) : 1;
                        /* tslint:disable-next-line:max-line-length */
                        if (rowPos === 0 || (currCell.memberType === 1 && currCell.level > -1 && nextRowCell.memberType === 1 && nextRowCell.level === -1)) {
                            currCell.rowSpan = currCell.isDrilled ? 1 : (spanCollection[rowPos + 1][colPos] + 1);
                            /* tslint:disable-next-line:max-line-length */
                            nextRowCell.rowSpan = (nextRowCell.isDrilled && nextRowCell.level === -1) ? spanCollection[rowPos + 1][colPos] : nextRowCell.rowSpan;
                        } else {
                            if (currCell.memberType === 3) {
                                currCell.rowSpan = 1;
                            } else {
                                currCell.rowSpan = -1;
                            }
                        }
                        rowflag = true;
                    } else if (currCell.isDrilled && currCell.level === -1 && nextRowCell.memberType === 2) {
                        spanCollection[rowPos][colPos] = spanCollection[rowPos + 1] ? (spanCollection[rowPos + 1][colPos] + 1) : 1;
                        currCell.rowSpan = -1;
                        rowflag = true;
                    } else {
                        currCell.rowSpan = rowPos === 0 ? spanCollection[rowPos][colPos] : -1;
                        /* tslint:disable-next-line:max-line-length */
                        nextRowCell.rowSpan = ((nextRowCell.level > -1 && !nextRowCell.isDrilled) || (currCell.memberType !== 2 && nextRowCell.memberType === 2)) ? spanCollection[rowPos + 1][colPos] : 1;
                    }
                } else {
                    currCell.rowSpan = (currCell.level > -1 || this.rowStartPos === 1) ? spanCollection[rowPos][colPos] : -1;
                }
                if (!colflag) {
                    currCell.colSpan = 1;
                }
                if (!rowflag) {
                    spanCollection[rowPos][colPos] = 1;
                }
                colPos--;
            }
            rowPos--;
        }
    }

    private frameValues(tuples: Element[], colLength: number): void {
        let rowStartPos: number = this.colDepth;
        let rowEndPos: number = this.pivotValues.length;
        let startRowOrdinal: number = 0;
        if (this.customArgs.action === 'down') {
            let keys: string[] = Object.keys(this.onDemandDrillEngine);
            rowStartPos = Number(keys[0]);
            rowEndPos = Number(keys[keys.length - 1]) + 1;
            startRowOrdinal = (this.onDemandDrillEngine[rowStartPos][0] as IAxisSet).ordinal;
        }
        let valCollection: { [key: string]: Element } = {};
        for (let colPos: number = 0; colPos < tuples.length; colPos++) {
            valCollection[Number(tuples[colPos].getAttribute('CellOrdinal'))] = tuples[colPos];
        }
        for (let rowPos: number = rowStartPos; rowPos < rowEndPos; rowPos++) {
            let columns: IAxisSet[] = this.pivotValues[rowPos] as IAxisSet[];
            let rowOrdinal: number = columns[0].ordinal;
            for (let colPos: number = 1; colPos < (this.pivotValues[0] as IAxisSet[]).length; colPos++) {
                let colOrdinal: number = (this.pivotValues[this.colDepth - 1] as IAxisSet[])[colPos].ordinal;
                let lastColCell: IAxisSet = (this.pivotValues[this.colDepth - 1][colPos] as IAxisSet);
                let measure: string | number = columns[0].memberType === 3 ? columns[0].actualText.toString() :
                    ((this.tupColumnInfo[lastColCell.ordinal] && this.tupColumnInfo[lastColCell.ordinal].measure) ?
                        this.tupColumnInfo[lastColCell.ordinal].measure.querySelector('UName').textContent :
                        columns[0].actualText);
                if (columns[0].type === 'header') {
                    columns[colPos] = {
                        axis: 'value',
                        actualText: this.getUniqueName(measure as string),
                        formattedText: '',
                        value: 0,
                        colIndex: colPos,
                        rowIndex: rowPos
                    };
                } else {
                    let valElement: Element;
                    let formattedText: string;
                    let value: string = '0';
                    let measureName: string = this.getUniqueName(measure as string);
                    let showTotals: boolean = true;
                    if (this.tupRowInfo[rowOrdinal]) {
                        showTotals = this.tupRowInfo[rowOrdinal].showTotals;
                    } else {
                        showTotals = this.dataSourceSettings.showGrandTotals && this.dataSourceSettings.showRowGrandTotals;
                    }
                    valElement = valCollection[(rowOrdinal - startRowOrdinal) * colLength + colOrdinal];
                    /* tslint:disable:max-line-length */
                    formattedText = !showTotals ? '' :
                        ((!isNullOrUndefined(valElement) && !isNullOrUndefined(valElement.querySelector('FmtValue'))) ?
                            valElement.querySelector('FmtValue').textContent : this.emptyCellTextContent);
                    value = !showTotals ? '0' :
                        ((!isNullOrUndefined(valElement) && !isNullOrUndefined(valElement.querySelector('Value'))) ?
                            valElement.querySelector('Value').textContent : null);
                    formattedText = showTotals && !isNullOrUndefined(value) ?
                        this.getFormattedValue(Number(value), measureName, (formattedText !== '' ? formattedText : value)) :
                        formattedText;
                    let isSum: boolean = (this.tupColumnInfo[colOrdinal] ? (this.tupColumnInfo[colOrdinal].allCount > 0 ||
                        this.tupColumnInfo[colOrdinal].drillStartPos > -1) : true) ||
                        (this.tupRowInfo[rowOrdinal] ? (this.tupRowInfo[rowOrdinal].allCount > 0 ||
                            this.tupRowInfo[rowOrdinal].drillStartPos > -1) : true);
                    columns[colPos] = {
                        axis: 'value',
                        actualText: measureName,
                        formattedText: formattedText,
                        colOrdinal: colOrdinal,
                        rowOrdinal: rowOrdinal,
                        columnHeaders: this.tupColumnInfo[colOrdinal] ? this.tupColumnInfo[colOrdinal].captionCollection : '',
                        rowHeaders: this.tupRowInfo[rowOrdinal] ? this.tupRowInfo[rowOrdinal].captionCollection : '',
                        value: !isNullOrUndefined(value) ? Number(value) : null,
                        colIndex: colPos,
                        rowIndex: rowPos,
                        isSum: isSum
                    };
                }
                this.valueContent[rowPos - this.rowStartPos][colPos] = columns[colPos];
            }
        }
    }

    /** hidden */
    public getFormattedValue(value: number, fieldName: string, formattedText: string): string {
        let formattedValue: string = formattedText;
        if (this.formatFields[fieldName] && !isNullOrUndefined(value)) {
            let formatField: IFormatSettings = ((<{ [key: string]: Object }>this.formatFields[fieldName]).properties ?
                (<{ [key: string]: Object }>this.formatFields[fieldName]).properties : this.formatFields[fieldName]);
            let formatObj: IFormatSettings = extend({}, formatField, null, true) as IFormatSettings;

            delete formatObj.name;
            if (!formatObj.minimumSignificantDigits && formatObj.minimumSignificantDigits < 1) {
                delete formatObj.minimumSignificantDigits;
            }
            if (!formatObj.maximumSignificantDigits && formatObj.maximumSignificantDigits < 1) {
                delete formatObj.maximumSignificantDigits;
            }
            if (formatObj.type) {
                formattedValue = this.globalize.formatDate(new Date(value.toString()), formatObj);
            } else {
                delete formatObj.type;
                if ((formatObj.format) && !(this.formatRegex.test(formatObj.format))) {
                    let pattern: string[] = formatObj.format.match(this.customRegex);
                    let integerPart: string = pattern[6];
                    formatObj.useGrouping = integerPart.indexOf(',') !== -1;
                }
                formattedValue = this.globalize.formatNumber(value, formatObj);
            }
        }
        return formattedValue;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private getMeasureInfo(): IMeasureInfo {
        let mAxis: string = 'column';
        let mIndex: number;
        let values: string[] = [];
        for (let field of this.values) {
            values[values.length] = (field.isCalculatedField ? this.fieldList[field.name].tag : field.name);
        }
        if (values.length > 1) {
            if (this.isMeasureAvail) {
                let isAvail: boolean = false;
                for (let i: number = 0, cnt: number = this.rows.length; i < cnt; i++) {
                    if (this.rows[i].name.toLowerCase() === '[measures]') {
                        mAxis = 'row';
                        mIndex = i;
                        isAvail = true;
                        break;
                    }
                }
                if (!isAvail) {
                    for (let i: number = 0, cnt: number = this.columns.length; i < cnt; i++) {
                        if (this.columns[i].name.toLowerCase() === '[measures]') {
                            mAxis = 'column';
                            mIndex = i;
                            isAvail = true;
                            break;
                        }
                    }
                }
            } else {
                mAxis = this.valueAxis;
                mIndex = mAxis === 'row' ? this.rows.length - 1 : this.columns.length - 1;
            }
            return { measureAxis: mAxis, measureIndex: mIndex, valueInfo: values };
        } else {
            return { measureAxis: mAxis, measureIndex: -1, valueInfo: [] };
        }
    }

    /* tslint:disable:max-func-body-length */
    private frameMeasureOrder(measureInfo: IMeasureInfo, axis: string, tuples: Element[], vTuples: Element[], cLen: number): IOrderedInfo {
        let orderedTuples: Element[] = [];
        let orderedVTuples: Element[] = [];
        let orderedIndex: number[] = [];
        let levels: { [key: string]: { index: number, node: Element } } = {};
        let cLevels: string[] = [];
        let measureAxis: string = measureInfo.measureAxis;
        let measureIndex: number = measureInfo.measureIndex;
        let values: string[] = measureInfo.valueInfo;
        if (measureAxis === axis && values.length > 0) {
            let levelCollection: { [key: string]: string[] } = {};
            let uniqueLevels: string[] = [];
            for (let j: number = 0, lnt: number = tuples.length; j < lnt; j++) {
                let node: Element = tuples[j];
                let members: HTMLElement[] = [].slice.call(node.querySelectorAll('Member'));
                let level: string = '';
                let cLevel: string = '';
                let i: number = 0;
                while (i < members.length) {
                    level = level + (level !== '' ? '~~' : '') + members[i].querySelector('UName').textContent;
                    if (i === measureIndex && measureIndex === 0) {
                        cLevel = level;
                    } else if (i === (measureIndex - 1)) {
                        cLevel = level;
                    }
                    i++;
                }
                if (levelCollection[cLevel]) {
                    levelCollection[cLevel][levelCollection[cLevel].length] = level;
                } else {
                    levelCollection[cLevel] = [level];
                    uniqueLevels[uniqueLevels.length] = cLevel;
                }
                levels[level] = { index: j, node: node };
                cLevels[cLevels.length] = level;
            }
            if (cLevels.length > 0) {
                if (uniqueLevels.length > 0) {
                    if (measureIndex === 0) {
                        for (let name of values) {
                            for (let key of uniqueLevels) {
                                if (key === name) {
                                    for (let level of levelCollection[key]) {
                                        orderedIndex[orderedIndex.length] = levels[level].index;
                                        orderedTuples[orderedTuples.length] = levels[level].node;
                                    }
                                }
                            }
                        }
                    } else {
                        for (let key of uniqueLevels) {
                            for (let name of values) {
                                for (let level of levelCollection[key]) {
                                    let levelInfo: string[] = level.split('~~');
                                    if (levelInfo[measureIndex] === name) {
                                        orderedIndex[orderedIndex.length] = levels[level].index;
                                        orderedTuples[orderedTuples.length] = levels[level].node;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (vTuples.length > 0) {
                let valueIndex: IPivotValues = [];
                let vOrdinalIndex: number[] = [];
                let len: number = 0;
                let cRow: number = 0;
                for (let j: number = 0, cnt: number = vTuples.length; j < cnt; j++) {
                    if (len > (cLen - 1)) {
                        cRow++;
                        len = 0;
                        if (!valueIndex[cRow]) {
                            valueIndex[cRow] = [];
                        }
                        valueIndex[cRow][len] = j;
                        len++;
                    } else {
                        if (!valueIndex[cRow]) {
                            valueIndex[cRow] = [];
                        }
                        valueIndex[cRow][len] = j;
                        len++;
                    }
                    vOrdinalIndex[vOrdinalIndex.length] = Number(vTuples[j].getAttribute('CellOrdinal'));
                }
                if (measureAxis === 'column') {
                    if (valueIndex.length > 0 && valueIndex[0].length === orderedIndex.length) {
                        for (let i: number = 0, cnt: number = orderedIndex.length; i < cnt; i++) {
                            let j: number = 0;
                            while (j < valueIndex.length) {
                                let index: number = (j * cLen) + i;
                                let ordinalValue: string = vOrdinalIndex[index].toString();
                                let tuple: Element = vTuples[Number(valueIndex[j][orderedIndex[i]])];
                                tuple.setAttribute('CellOrdinal', ordinalValue.toString());
                                orderedVTuples[index] = tuple;
                                j++;
                            }
                        }
                    }
                } else {
                    if (valueIndex.length === orderedIndex.length) {
                        for (let i: number = 0, cnt: number = orderedIndex.length; i < cnt; i++) {
                            let j: number = 0;
                            while (j < valueIndex[orderedIndex[i]].length) {
                                let index: number = (i * cLen) + j;
                                let ordinalValue: string = vOrdinalIndex[index].toString();
                                let tuple: Element = vTuples[Number(valueIndex[orderedIndex[i]][j])];
                                tuple.setAttribute('CellOrdinal', ordinalValue.toString());
                                orderedVTuples[orderedVTuples.length] = tuple;
                                j++;
                            }
                        }
                    }
                }
            }
            return { orderedHeaderTuples: orderedTuples, orderedValueTuples: orderedVTuples };
        } else {
            return { orderedHeaderTuples: tuples, orderedValueTuples: vTuples };
        }
    }

    /* tslint:disable:max-func-body-length */
    public getDrilledSets(uNameCollection: string, currentCell: IAxisSet, fieldPos: number, axis: string): { [key: string]: string } {
        let levels: string[] = [];
        let memberName: string = currentCell.actualText.toString();
        let tupCollection: ITupInfo[] = axis === 'row' ? this.tupRowInfo : this.tupColumnInfo;
        let currTuple: ITupInfo = tupCollection[currentCell.ordinal];
        let measurePos: number = tupCollection[0].typeCollection.indexOf('3');
        let allStartPos: number = measurePos === 0 ? 1 : 0;
        let tupPos: number = 0;
        let isWithoutAllMember: boolean = tupCollection[0].typeCollection[fieldPos] === '1';
        while (tupPos < tupCollection.length) {
            /* tslint:disable-next-line:max-line-length */
            if (isNullOrUndefined(tupCollection[tupPos].allStartPos) || tupCollection[tupPos].allStartPos > allStartPos) {
                levels[levels.length] = tupCollection[tupPos].uNameCollection;
            }
            tupPos++;
        }
        let memberArray: string[] = uNameCollection.split('::[').map((item: string) => {
            return item[0] === '[' ? item : ('[' + item);
        });
        let joinArray: string[] = [];
        for (let memPos: number = 0; memPos <= fieldPos; memPos++) {
            if ((isWithoutAllMember || this.isPaging) && memPos === fieldPos) {
                let splitLevels: string[] = memberArray[memPos].split('~~');
                let drillLevel: number = splitLevels.indexOf(memberName);
                let cropLevels: string[] = [];
                for (let lPos: number = 0; lPos <= drillLevel; lPos++) {
                    cropLevels.push(splitLevels[lPos]);
                }
                joinArray[joinArray.length] = cropLevels.length > 0 ? cropLevels.join('~~') : memberArray[memPos];
            } else {
                joinArray[joinArray.length] = memberArray[memPos];
            }
        }
        uNameCollection = joinArray.join('::');
        let childSets: string[] = [];
        let memberObj: { [key: string]: string } = {};
        for (let item of levels) {
            if (item.indexOf(uNameCollection) === 0) {
                childSets.push(item);
                if (this.isPaging) {
                    let drillField: string = item.split('::[')[fieldPos];
                    drillField = drillField[0] === '[' ? drillField : ('[' + drillField);
                    let drillFieldSep: string[] = drillField.split('~~');
                    for (let fPos: number = drillFieldSep.indexOf(memberName); fPos < drillFieldSep.length; fPos++) {
                        memberObj[drillFieldSep[fPos]] = drillFieldSep[fPos];
                    }
                }
            }
        }
        if (this.isPaging) {
            let fieldSep: string[] = currTuple.uNameCollection.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            });
            let cropArray: string[] = [];
            for (let fPos: number = 0; fPos < fieldSep.length; fPos++) {
                if (fPos !== fieldPos) {
                    cropArray[fPos] = fieldSep[fPos];
                }
            }
            let drillFieldSep: string[] = Object.keys(memberObj);
            for (let fPos: number = 0; fPos < drillFieldSep.length; fPos++) {
                cropArray[fieldPos] = drillFieldSep[fPos];
                childSets.push(cropArray.join('::'));
            }
        }
        let drillSets: { [key: string]: string } = {};
        for (let level of childSets) {
            let fields: string[] = level.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            });
            let set: string = '';
            for (let pos: number = 0; pos <= fieldPos; pos++) {
                let field: string = fields[pos];
                let members: string[] = field.split('~~');
                set = set + (set !== '' ? '~~' : '') + members[members.length - 1];
            }
            drillSets[set] = set;
        }
        return drillSets;
    }
    public updateDrilledInfo(dataSourceSettings: IDataOptions): void {
        this.dataSourceSettings = dataSourceSettings;
        this.drilledMembers = dataSourceSettings.drilledMembers ? this.updateDrilledItems(dataSourceSettings.drilledMembers) : [];
        // MDXQuery.getCellSets(this.dataSourceSettings as IDataOptions, this);
        this.generateGridData(dataSourceSettings);
    }
    public updateCalcFields(dataSourceSettings: IDataOptions, lastcalcInfo: ICalculatedFieldSettings): void {
        this.dataSourceSettings = dataSourceSettings;
        this.calculatedFieldSettings = dataSourceSettings.calculatedFieldSettings ? dataSourceSettings.calculatedFieldSettings : [];
        this.getAxisFields();
        this.updateFieldlist();
        this.loadCalculatedMemberElements(this.calculatedFieldSettings);
        if (this.dataFields[lastcalcInfo.name]) {
            this.generateGridData(dataSourceSettings);
        } else {
            MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
        }
    }
    public onSort(dataSourceSettings: IDataOptions): void {
        this.dataSourceSettings = dataSourceSettings;
        this.sortSettings = dataSourceSettings.sortSettings ? dataSourceSettings.sortSettings : [];
        this.getAxisFields();
        this.frameSortObject();
        this.updateFieldlist();
        if (this.xmlaCellSet.length > 0 && this.xmlDoc) {
            this.generateEngine(this.xmlDoc, this.request, this.customArgs);
        } else {
            this.generateGridData(dataSourceSettings);
        }
    }
    private updateFieldlist(isInit?: boolean): void {
        let i: number = 0;
        while (i < this.savedFieldListData.length) {
            let fieldName: string = this.savedFieldListData[i].id;
            let parentID: string = this.savedFieldListData[i].pid;
            // let aggregateType: string = this.getAggregateType(fieldName);
            // this.savedFieldListData[i].aggregateType = aggregateType;
            if (this.savedFieldList[fieldName]) {
                let sortOrder: string = (this.enableSort ? this.sortObject[fieldName] ? this.sortObject[fieldName] : 'Ascending' : 'None');
                this.savedFieldList[fieldName].isSelected = false;
                this.savedFieldList[fieldName].isExcelFilter = false;
                // this.savedFieldList[fieldName].aggregateType = aggregateType;
                this.savedFieldList[fieldName].sort = sortOrder;
                this.savedFieldListData[i].sort = sortOrder;
                if (isInit) {
                    this.savedFieldList[fieldName].filter = [];
                    this.savedFieldList[fieldName].actualFilter = [];
                }
            }
            if (this.dataFields[fieldName] && this.savedFieldList[fieldName] && this.selectedItems.indexOf(fieldName) > -1) {
                this.savedFieldList[fieldName].isSelected = true;
                this.savedFieldListData[i].isSelected = true;
            } else {
                if (this.dataFields[parentID] && this.savedFieldList[parentID] && this.selectedItems.indexOf(parentID) > -1) {
                    this.savedFieldListData[i].isSelected = true;
                } else {
                    this.savedFieldListData[i].isSelected = false;
                }
            }
            if ((this.savedFieldList[fieldName] && this.savedFieldList[fieldName].isCalculatedField) ||
                fieldName.toLowerCase() === '[calculated members].[_0]') {
                let isAvail: boolean = false;
                for (let field of this.calculatedFieldSettings) {
                    if (fieldName === field.name) {
                        let expression: string = field.formula;
                        let formatString: string = field.formatString;
                        this.savedFieldListData[i].formula = expression;
                        this.savedFieldListData[i].formatString = formatString;
                        this.savedFieldListData[i].parentHierarchy = (expression.toLowerCase().indexOf('measure') > -1 ?
                            undefined : field.hierarchyUniqueName);
                        this.savedFieldList[fieldName].formula = expression;
                        this.savedFieldList[fieldName].formatString = formatString;
                        this.savedFieldList[fieldName].parentHierarchy = this.savedFieldListData[i].parentHierarchy;
                        isAvail = true;
                    }
                }
                if (!isAvail || (fieldName.toLowerCase() === '[calculated members].[_0]' &&
                    this.calculatedFieldSettings.length === 0)) {
                    this.savedFieldListData.splice(i, 1);
                    i--;
                    if (this.savedFieldList[fieldName]) {
                        delete this.savedFieldList[fieldName];
                    }
                }
            }
            i++;
        }
        this.fieldList = this.savedFieldList;
        this.fieldListData = this.savedFieldListData;
    }
    public updateFieldlistData(name: string, isSelect?: boolean): void {
        for (let item of this.fieldListData) {
            if (item.id === name) {
                item.isSelected = isSelect ? true : false;
                break;
            }
        }
    }
    private getFormattedFields(formats: IFormatSettings[]): void {
        this.formatFields = {};
        let cnt: number = formats.length;
        while (cnt--) {
            this.formatFields[formats[cnt].name] = formats[cnt];
        }
    }
    private getFieldList(dataSourceSettings: IDataOptions): void {
        let args: ConnectionInfo = {
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            url: dataSourceSettings.url,
            LCID: dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_HIERARCHIES'
        };
        this.getTreeData(args, this.getFieldListItems.bind(this), { dataSourceSettings: dataSourceSettings, action: 'loadFieldElements' });
    }
    public getTreeData(args: ConnectionInfo, successMethod: Function, customArgs: object): void {
        let connectionString: ConnectionInfo = this.getConnectionInfo(args.url, args.LCID);
        /* tslint:disable-next-line:max-line-length */
        let soapMessage: string = '<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"><Header/><Body><Discover xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><RequestType>' +
            args.request + '</RequestType><Restrictions><RestrictionList><CATALOG_NAME>' + args.catalog +
            /* tslint:disable-next-line:max-line-length */
            '</CATALOG_NAME><CUBE_NAME>' + args.cube + '</CUBE_NAME></RestrictionList></Restrictions><Properties><PropertyList><Catalog>' + args.catalog +
            /* tslint:disable-next-line:max-line-length */
            '</Catalog> <LocaleIdentifier>' + connectionString.LCID + '</LocaleIdentifier></PropertyList></Properties></Discover></Body></Envelope>';
        this.doAjaxPost('POST', connectionString.url, soapMessage, successMethod, customArgs);
    }
    private getAxisFields(): void {
        this.rows = this.dataSourceSettings.rows ? this.dataSourceSettings.rows : [];
        this.columns = this.dataSourceSettings.columns ? this.dataSourceSettings.columns : [];
        this.filters = this.dataSourceSettings.filters ? this.dataSourceSettings.filters : [];
        this.values = this.dataSourceSettings.values ? this.dataSourceSettings.values : [];
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.values, this.filters);
        let len: number = dataFields.length;
        while (len--) {
            this.dataFields[dataFields[len].name] = dataFields[len];
            if (dataFields[len].name.toLowerCase() === '[measures]') {
                this.isMeasureAvail = true;
            } else {
                this.selectedItems.push(dataFields[len].name);
            }
        }
        if (!this.isMeasureAvail && this.values.length > 0) {
            let measureField: IFieldOptions = { name: '[Measures]', caption: 'Measures' };
            if (this.valueAxis === 'row') {
                this.rows.push(measureField);
            } else {
                this.columns.push(measureField);
            }
            this.isMeasureAvail = true;
        }
    }
    private getAggregateType(fieldName: string, aggregateType: string): string {
        let type: SummaryTypes;
        switch (aggregateType) {
            case '1':
                type = 'Sum';
                break;
            case '2':
                type = 'Count';
                break;
            case '3':
                type = 'Min';
                break;
            case '4':
                type = 'Max';
                break;
            case '5':
                type = 'Avg';
                break;
            case '8':
                type = 'DistinctCount';
                break;
            case '127':
                type = 'CalculatedField';
                break;
            default:
                type = undefined;
                break;
        }
        // if (this.dataFields[fieldName]) {
        //     return this.dataFields[fieldName].type;
        // } else {
        //     return undefined;
        // }
        if (type) {
            return type;
        } else {
            return undefined;
        }
    }
    public getUniqueName(name: string): string {
        let uName: string = name;
        for (let item of this.calculatedFieldSettings) {
            let expression: string = item.formula;
            let prefixName: string = (expression.toLowerCase().indexOf('measure') > -1 ? '[Measures].' : item.hierarchyUniqueName + '.');
            let uniqueName: string = prefixName + '[' + item.name + ']';
            if (name === uniqueName) {
                uName = item.name;
                break;
            }
        }
        return uName;
    }
    private updateFilterItems(filterItems: IFilter[]): void {
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns);
        for (let filter of filterItems) {
            if (filter.type === 'Include' && this.allowMemberFilter) {
                let members: IMembers = this.fieldList[filter.name].members;
                let isMembersAvail: boolean = (members && Object.keys(members).length > 0);
                this.fieldList[filter.name].actualFilter = [...filter.items];
                let selectedElements: string[] = extend([], filter.items, null, true) as string[];
                if (isMembersAvail) {
                    let i: number = 0;
                    while (i < selectedElements.length) {
                        let parentNodes: string[] = [];
                        parentNodes = this.getParentNode(selectedElements[i], members, parentNodes);
                        for (let node of parentNodes) {
                            let index: number = PivotUtil.inArray(node, filter.items);
                            if (index !== -1) {
                                filter.items.splice(index, 1);
                            }
                        }
                        i++;
                    }
                }
                let currentItems: string[] = [];
                for (let selectedElement of filter.items) {
                    // currentItems.push(selectedElement.replace(/\&/g, '&amp;'));
                    currentItems.push(selectedElement);
                    if (isMembersAvail) {
                        this.fieldList[filter.name].filter.push(members[selectedElement].caption);
                    } else {
                        this.fieldList[filter.name].filter.push(selectedElement);
                    }
                }
                this.filterMembers[filter.name] = currentItems;
                this.fieldList[filter.name].isExcelFilter = false;
            } else if ((this.allowValueFilter || this.allowLabelFilter) &&
                ['Date', 'Label', 'Number', 'Value'].indexOf(filter.type) !== -1) {
                for (let item of dataFields) {
                    if (item.name === filter.name) {
                        let filterMembers: IFilter[] = this.filterMembers[filter.name] as IFilter[];
                        if (filterMembers && (typeof filterMembers[0] === 'object' && filterMembers[0].type === filter.type)) {
                            filterMembers[filterMembers.length] = filter;
                        } else {
                            this.filterMembers[filter.name] = [filter];
                        }
                        this.fieldList[filter.name].isExcelFilter = true;
                        break;
                    }
                }
            }
        }
    }
    private getParentNode(name: string, members: IMembers, items: string[]): string[] {
        if (members[name].parent && name !== members[name].parent) {
            let parentItem: string = members[name].parent;
            items.push(parentItem);
            this.getParentNode(parentItem, members, items);
        }
        return items;
    }
    public updateDrilledItems(drilledMembers: IDrillOptions[]): IDrillOptions[] {
        let drilledItems: IDrillOptions[] = [];
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns);
        for (let item of drilledMembers) {
            for (let field of dataFields) {
                if (item.name === field.name) {
                    drilledItems.push(item);
                    break;
                }
            }
        }
        return drilledItems;
    }
    // private updateAllMembers(dataSourceSettings: IDataOptions, slicers: IFieldOptions[]): void {
    //     let query: string = '';
    //     for (let field of slicers) {
    //         let fieldList: IOlapField = this.fieldList[field.name];
    //         if (!(fieldList && fieldList.hasAllMember && fieldList.allMember)) {
    //             query = query + (query !== '' ? ' * ' : '') + '{' + field.name + '}';
    //         } else {
    //             continue;
    //         }
    //     }
    //     if (query !== '') {
    //         this.getAllMember(dataSourceSettings, query);
    //     } else {
    //         return;
    //     }
    // }
    // private getAllMember(dataSourceSettings: IDataOptions, query: string): void {
    //     let dimProp: string = 'DIMENSION PROPERTIES HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY';
    //     let mdxQuery: string = 'SELECT (' + query + ')' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
    //     let xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
    //     let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
    //     /* tslint:disable-next-line:max-line-length */
    //     this.doAjaxPost('POST', connectionString.url, xmla, this.generateAllMembers.bind(this), 
    // { dataSourceSettings: dataSourceSettings, action: 'fetchAllMembers' });
    // }

    /**
     * @hidden
     */
    public getDrillThroughData(pivotValue: IAxisSet, maxRows: number): void {
        let column: string[] = this.tupColumnInfo[pivotValue.colOrdinal] &&
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection &&
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection !== '' ?
            this.tupColumnInfo[pivotValue.colOrdinal].uNameCollection.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            }) : [];
        let row: string[] = this.tupRowInfo[pivotValue.rowOrdinal] &&
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection &&
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection !== '' ?
            this.tupRowInfo[pivotValue.rowOrdinal].uNameCollection.split('::[').map((item: string) => {
                return item[0] === '[' ? item : ('[' + item);
            }) : [];
        let columnQuery: string = ''; let rowQuery: string = '';
        for (let i: number = 0; i < column.length; i++) {
            columnQuery = (columnQuery.length > 0 ? (columnQuery + ',') : '') + (column[i].split('~~').length > 1 ?
                column[i].split('~~')[column[i].split('~~').length - 1] : column[i]);
        }
        for (let i: number = 0; i < row.length; i++) {
            rowQuery = (rowQuery.length > 0 ? (rowQuery + ',') : '') + (row[i].split('~~').length > 1 ?
                row[i].split('~~')[row[i].split('~~').length - 1] : row[i]);
        }
        let drillQuery: string = 'DRILLTHROUGH MAXROWS ' + maxRows + ' Select(' + (columnQuery.length > 0 ? columnQuery : '') +
            (columnQuery.length > 0 && rowQuery.length > 0 ? ',' : '') + (rowQuery.length > 0 ? rowQuery : '') + ') on 0 from [' +
            this.dataSourceSettings.cube + ']';
        drillQuery = drillQuery.replace(/&/g, '&amp;');
        let xmla: string = this.getSoapMsg(this.dataSourceSettings, drillQuery);
        let connectionString: ConnectionInfo =
            this.getConnectionInfo(this.dataSourceSettings.url, this.dataSourceSettings.localeIdentifier);
        this.doAjaxPost(
            'POST', connectionString.url, xmla, this.drillThroughSuccess.bind(this),
            { dataSourceSettings: this.dataSourceSettings, action: 'drillThrough' });
    }

    private drillThroughSuccess(xmlDoc: Document): void {
        let tag: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        let gridJSON: string = '';
        if (tag.length > 0) {
            let json: string[] = [];
            let i: number = 0;
            while (i < tag.length) {
                let child: HTMLElement[] = [].slice.call(tag[i].children);
                let j: number = 0;
                while (j < child.length) {
                    json.push('"' + child[j].tagName + '"' + ':' + '"' + child[j].textContent + '"');
                    j++;
                }
                i++;
            }
            let value: string = json[0];
            let k: number = 0;
            while (k < json.length) {
                if (Object.keys(JSON.parse('[{' + json[k] + '}]')[0])[0] === Object.keys(JSON.parse('[{' + value + '}]')[0])[0]) {
                    gridJSON += gridJSON === '' ? '[{' + json[k] : '}, {' + json[k];
                    k++;
                    continue;
                }
                gridJSON += ',' + json[k];
                k++;
            }
            gridJSON += '}]';
        } else {
            let tag: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('faultstring'));
            let i: number = 0;
            while (i < tag.length) {
                gridJSON += tag[i].textContent;
                i++;
            }
        }
        this.gridJSON = gridJSON;
    }

    /* tslint:disable-next-line:max-line-length */
    public getFilterMembers(dataSourceSettings: IDataOptions, fieldName: string, levelCount: number, isSearchFilter?: boolean, loadLevelMember?: boolean): string {
        // let dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE';
        let levels: IOlapField[] = this.fieldList[fieldName].levels;
        let cLevel: number = this.fieldList[fieldName].levelCount;
        let filterQuery: string;
        if (loadLevelMember) {
            filterQuery = 'Descendants({' + levels[cLevel].id + '}, ' +
                levels[levelCount - 1].id + ', ' + ((levelCount - cLevel) === 1 ? 'SELF)' : 'SELF_AND_BEFORE)');
        } else {
            filterQuery = fieldName + ', Descendants({' + levels[0].id + '}, ' + levels[levelCount - 1].id + ', SELF_AND_BEFORE)';
        }
        this.fieldList[fieldName].levelCount = levelCount;
        if (!isSearchFilter) {
            this.getMembers(dataSourceSettings, fieldName, false, filterQuery, loadLevelMember);
        }
        return filterQuery;
    }
    /* tslint:disable-next-line:max-line-length */
    public getMembers(dataSourceSettings: IDataOptions, fieldName: string, isAllFilterData?: boolean, filterParentQuery?: string, loadLevelMember?: boolean): void {
        // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
        /* tslint:disable-next-line:max-line-length */
        let dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        let mdxQuery: string;
        let hasAllMember: boolean = this.fieldList[fieldName].hasAllMember;
        let hierarchy: string = (hasAllMember ? fieldName : fieldName + '.LEVELS(0)').replace(/\&/g, '&amp;');
        if (!isAllFilterData) {
            mdxQuery = 'SELECT ({' + (filterParentQuery ?
                filterParentQuery : (hasAllMember ? hierarchy + ', ' + hierarchy + '.CHILDREN' : hierarchy + '.ALLMEMBERS')) + '})' +
                dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        } else {
            mdxQuery = 'SELECT ({' + hierarchy + '.ALLMEMBERS})' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        }
        let xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
        let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        if (!loadLevelMember) {
            this.fieldList[fieldName].filterMembers = [];
            this.fieldList[fieldName].childMembers = [];
            this.fieldList[fieldName].searchMembers = [];
            // this.fieldList[fieldName].isHierarchy = true;
            this.fieldList[fieldName].members = {};
            this.fieldList[fieldName].currrentMembers = {};
            /* tslint:disable-next-line:max-line-length */
        }
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, loadLevelMembers: loadLevelMember, action: 'fetchMembers' });
    }
    public getChildMembers(dataSourceSettings: IDataOptions, memberUQName: string, fieldName: string): void {
        // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
        /* tslint:disable-next-line:max-line-length */
        let dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        /* tslint:disable-next-line:max-line-length */
        // var mdxQuery = 'SELECT SUBSET({' + memberUQName + '.CHILDREN}, 0, 5000)' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        /* tslint:disable-next-line:max-line-length */
        let mdxQuery: string = 'SELECT ({' + memberUQName.replace(/\&/g, '&amp;') + '.CHILDREN})' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        let xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
        let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        /* tslint:disable-next-line:max-line-length */
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, action: 'fetchChildMembers' });
    }
    public getCalcChildMembers(dataSourceSettings: IDataOptions, memberUQName: string): void {
        this.calcChildMembers = [];
        /* tslint:disable-next-line:max-line-length */
        let dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        let mdxQuery: string = 'SELECT ({' + memberUQName.replace(/\&/g, '&amp;') + '.MEMBERS})' +
            dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
        let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        let xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
        /* tslint:disable-next-line:max-line-length */
        this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, action: 'fetchCalcChildMembers' });
    }
    /* tslint:disable-next-line:max-line-length */
    public getSearchMembers(dataSourceSettings: IDataOptions, fieldName: string, searchString: string, maxNodeLimit: number, isAllFilterData?: boolean, levelCount?: number): void {
        this.fieldList[fieldName].searchMembers = [];
        this.fieldList[fieldName].currrentMembers = {};
        if (searchString !== '') {
            // dimProp = "dimension properties CHILDREN_CARDINALITY, MEMBER_TYPE";
            /* tslint:disable-next-line:max-line-length */
            let dimProp: string = 'DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
            let hierarchy: string = fieldName.replace(/\&/g, '&amp;');
            let mdxQuery: string = 'WITH SET [SearchMembersSet] AS &#39;FILTER(' + (isAllFilterData ? hierarchy + '.ALLMEMBERS, ' :
                '{' + (levelCount > 1 ? this.getFilterMembers(dataSourceSettings, fieldName, levelCount, true) :
                    hierarchy + ', ' + hierarchy + '.CHILDREN') + '},') +
                '(INSTR(1, ' + hierarchy + '.CurrentMember.member_caption, "' + searchString + '") > 0))&#39;' +
                'SET [SearchParentsSet] AS &#39;GENERATE([SearchMembersSet], ASCENDANTS([SearchMembersSet].Current))&#39;' +
                'SET [SearchSet] AS &#39;HIERARCHIZE(DISTINCT({[SearchMembersSet], [SearchParentsSet]}))&#39;' +
                'SELECT SUBSET([SearchSet], 0, ' + maxNodeLimit + ')' + dimProp + ' ON 0 FROM [' + dataSourceSettings.cube + ']';
            let xmla: string = this.getSoapMsg(dataSourceSettings, mdxQuery);
            let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
            /* tslint:disable-next-line:max-line-length */
            this.doAjaxPost('POST', connectionString.url, xmla, this.generateMembers.bind(this), { dataSourceSettings: dataSourceSettings, fieldName: fieldName, action: 'fetchSearchMembers' });
        } else {
            return;
        }
    }
    private generateMembers(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axis[name="Axis0"] Tuple'));
        let fieldName: string = customArgs.fieldName;
        let allMember: string;
        let filterMembers: IOlapField = {};
        for (let field of fields) {
            // let hierarchyUqName: string = fields[0].querySelector('Member HIERARCHY_UNIQUE_NAME').textContent;
            let member: HTMLElement = field.querySelector('Member');
            let memberType: string = member.querySelector('MEMBER_TYPE').textContent;
            let memberUqName: string = member.querySelector('UName').textContent;
            let caption: string = member.querySelector('Caption').textContent;
            let nodeAttr: { [key: string]: string } = { 'data-fieldName': fieldName };
            /* tslint:disable-next-line:max-line-length */
            let parentUqName: string = member.querySelector('PARENT_UNIQUE_NAME') ? member.querySelector('PARENT_UNIQUE_NAME').textContent : '';
            if (parentUqName === '' && memberType === '1') {
                filterMembers = {
                    /* tslint:disable-next-line:max-line-length */
                    hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                    isSelected: false,
                    id: memberUqName,
                    tag: memberUqName,
                    name: caption,
                    caption: caption,
                    htmlAttributes: nodeAttr
                };
                if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                    /* tslint:disable-next-line:max-line-length */
                    this.fieldList[fieldName].members[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    this.fieldList[fieldName].filterMembers.push(filterMembers);
                    this.fieldList[fieldName].childMembers.push(filterMembers);
                } else if (customArgs.action === 'fetchSearchMembers') {
                    /* tslint:disable-next-line:max-line-length */
                    this.fieldList[fieldName].currrentMembers[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    this.fieldList[fieldName].searchMembers.push(filterMembers);
                    filterMembers.expanded = true;
                } else {
                    this.calcChildMembers.push(filterMembers);
                }
            } else if (parentUqName !== '' && memberType === '1') {
                if (parentUqName === allMember && memberType === '1') {
                    filterMembers = {
                        /* tslint:disable-next-line:max-line-length */
                        hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                        id: memberUqName,
                        name: caption,
                        isSelected: false,
                        caption: caption,
                        htmlAttributes: nodeAttr,
                        tag: memberUqName
                    };
                    if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                        this.fieldList[fieldName].filterMembers.push(filterMembers);
                        this.fieldList[fieldName].childMembers.push(filterMembers);
                        /* tslint:disable-next-line:max-line-length */
                        this.fieldList[fieldName].members[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    } else if (customArgs.action === 'fetchSearchMembers') {
                        filterMembers.expanded = true;
                        this.fieldList[fieldName].searchMembers.push(filterMembers);
                        /* tslint:disable-next-line:max-line-length */
                        this.fieldList[fieldName].currrentMembers[memberUqName] = { name: memberUqName, caption: caption, parent: undefined, isNodeExpand: false, isSelected: false };
                    } else {
                        this.calcChildMembers.push(filterMembers);
                    }
                } else {
                    if (customArgs.action === 'fetchMembers' && this.fieldList[fieldName].members[memberUqName]) {
                        continue;
                    }
                    /* tslint:disable-next-line:max-line-length */
                    let nodeSelect: boolean = (customArgs.loadLevelMembers ? this.fieldList[fieldName].members[parentUqName].isSelected : false);
                    filterMembers = {
                        /* tslint:disable-next-line:max-line-length */
                        hasChildren: (field.querySelector('CHILDREN_CARDINALITY') ? (field.querySelector('CHILDREN_CARDINALITY').textContent !== '0') ? true : false : false),
                        htmlAttributes: nodeAttr,
                        isSelected: false,
                        id: memberUqName,
                        pid: parentUqName,
                        name: caption,
                        caption: caption,
                        tag: memberUqName
                    };
                    if (customArgs.action === 'fetchMembers' || customArgs.action === 'fetchChildMembers') {
                        this.fieldList[fieldName].isHierarchy = false;
                        this.fieldList[fieldName].filterMembers.push(filterMembers);
                        this.fieldList[fieldName].childMembers.push(filterMembers);
                        /* tslint:disable-next-line:max-line-length */
                        this.fieldList[fieldName].members[memberUqName] = { name: memberUqName, caption: caption, parent: parentUqName, isNodeExpand: false, isSelected: nodeSelect };
                    } else if (customArgs.action === 'fetchSearchMembers') {
                        this.fieldList[fieldName].searchMembers.push(filterMembers);
                        filterMembers.expanded = true;
                        /* tslint:disable-next-line:max-line-length */
                        this.fieldList[fieldName].currrentMembers[memberUqName] = { name: memberUqName, caption: caption, parent: parentUqName, isNodeExpand: false, isSelected: false };
                    } else {
                        this.calcChildMembers.push(filterMembers);
                    }
                }
            } else if (memberType === '2') {
                allMember = memberUqName;
            }
        }
    }
    // private generateAllMembers(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
    //     let members: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('Axis[name="Axis0"] Member'));
    //     for (let member of members) {
    //         let caption: string = member.querySelector('Caption').textContent;
    //         let fieldName: string = member.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
    //         this.fieldList[fieldName].allMember = caption;
    //     }
    // }
    private getFieldListItems(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let fieldDate: FieldData = {};
        let hierarchyElements: IOlapField[] = [];
        let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (let field of fields) {
            let isAllMemberAvail: boolean = [].slice.call(field.querySelectorAll('ALL_MEMBER')).length > 0;
            hierarchyElements.push({
                pid: field.querySelector('DIMENSION_UNIQUE_NAME').textContent,
                id: field.querySelector('HIERARCHY_UNIQUE_NAME').textContent,
                name: field.querySelector('HIERARCHY_CAPTION').textContent,
                caption: field.querySelector('HIERARCHY_CAPTION').textContent,
                tag: field.querySelector('HIERARCHY_UNIQUE_NAME').textContent,
                hasAllMember: isAllMemberAvail,
                allMember: (isAllMemberAvail ? field.querySelectorAll('ALL_MEMBER')[0].textContent : undefined),
                // aggregateType: this.getAggregateType(field.querySelector('HIERARCHY_UNIQUE_NAME').textContent),
                type: 'string'
            });
        }
        fieldDate = {
            hierarchy: hierarchyElements,
            hierarchySuccess: xmlDoc,
            measures: []
        };
        this.fieldListObj = fieldDate;
        let args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_DIMENSIONS'
        };
        this.getTreeData(args, this.loadDimensionElements.bind(this), customArgs);
    }
    private loadCalculatedMemberElements(calcMembers: ICalculatedFieldSettings[]): void {
        if (calcMembers.length > 0) {
            let fieldListElements: IOlapField[] = this.fieldListData;
            // let calcElements: IOlapField[] = [];
            let calcObj: IOlapField = {
                hasChildren: true,
                isSelected: false,
                id: '[Calculated Members].[_0]',
                name: '[Calculated Members].[_0]',
                caption: 'Calculated Members',
                spriteCssClass: 'e-calcMemberGroupCDB' + ' ' + cls.ICON,
                tag: '[Calculated Members].[_0]',
                //aggregateType: this.getAggregateType(dimensionName),
                type: 'string'
            };
            if (fieldListElements.length > 0 && fieldListElements[0].id.toLowerCase() === '[measures]') {
                fieldListElements.splice(0, 0, calcObj);
            }
            for (let field of calcMembers) {
                if (!this.fieldList[field.name]) {
                    let expression: string = field.formula;
                    let prefixName: string = (expression.toLowerCase().indexOf('measure') > -1 ? '[Measures].' :
                        field.hierarchyUniqueName + '.');
                    let uniqueName: string = prefixName + '[' + field.name + ']';
                    let caption: string = (this.dataFields[field.name] && this.dataFields[field.name].caption ?
                        this.dataFields[field.name].caption : field.name);
                    let formatString: string = field.formatString;
                    let calcField: IOlapField = {
                        hasChildren: false,
                        isSelected: false,
                        id: field.name,
                        pid: '[Calculated Members].[_0]',
                        name: field.name,
                        caption: caption,
                        spriteCssClass: 'e-calc-member' + ' ' + (expression.toLowerCase().indexOf('measure') > -1 ?
                            'e-calc-measure-icon' : 'e-calc-dimension-icon') + ' ' + cls.ICON,
                        tag: uniqueName,
                        formula: expression,
                        formatString: formatString,
                        aggregateType: undefined,
                        type: 'CalculatedField',
                        filter: [],
                        dateMember: [],
                        sort: 'Ascending',
                        actualFilter: [],
                        filterMembers: [],
                        childMembers: [],
                        searchMembers: [],
                        members: {},
                        currrentMembers: {},
                        isHierarchy: true,
                        isExcelFilter: false,
                        isCalculatedField: true,
                        fieldType: (expression.toLowerCase().indexOf('measure') > -1 ? 'Measure' : 'Dimension'),
                        parentHierarchy: (expression.toLowerCase().indexOf('measure') > -1 ? undefined : field.hierarchyUniqueName),
                    };
                    fieldListElements.push(calcField);
                    this.fieldList[calcField.id] = calcField;
                }
            }
        } else {
            return;
        }
    }
    private loadDimensionElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let hierarchyElements: IOlapField[] = [];
        let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        let measure: IOlapField = {};
        for (let field of fields) {
            let dimensionName: string = field.querySelector('DIMENSION_UNIQUE_NAME').textContent;
            let dimensionCaption: string = field.querySelector('DIMENSION_CAPTION').textContent;
            if (dimensionName.toLowerCase().indexOf('[measure') >= 0) {
                measure = {
                    hasChildren: true,
                    isSelected: false,
                    id: dimensionName,
                    name: dimensionName,
                    caption: dimensionCaption,
                    /* tslint:disable-next-line:max-line-length */
                    spriteCssClass: dimensionName.toLowerCase() === '[measures]' ? 'e-measureGroupCDB-icon' + ' ' + cls.ICON : 'e-dimensionCDB-icon' + ' ' + cls.ICON,
                    tag: dimensionName,
                    // aggregateType: this.getAggregateType(dimensionName),
                    type: 'string'
                };
            } else if (isNullOrUndefined(fields[0].querySelector('HIERARCHY_CAPTION'))) {
                hierarchyElements.push({
                    hasChildren: true,
                    isSelected: false,
                    id: (this.isMondrian ? dimensionName + '~#^Dim' : dimensionName),
                    name: dimensionName,
                    caption: dimensionCaption,
                    spriteCssClass: 'e-dimensionCDB-icon' + ' ' + cls.ICON,
                    tag: dimensionName,
                    defaultHierarchy: field.querySelector('DEFAULT_HIERARCHY').textContent,
                    // aggregateType: this.getAggregateType(dimensionName),
                    type: 'string'
                });
            }
        }
        hierarchyElements.splice(0, 0, measure);
        this.fieldListData = hierarchyElements;
        // customArgs.hierarchy = this.fieldListData;
        // customArgs.hierarchySuccess = this.fieldListObj.hierarchySuccess;
        // this.loadHierarchyElements(customArgs);
        let args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_SETS'
        };
        this.getTreeData(args, this.loadNamedSetElements.bind(this), customArgs);
    }
    private loadNamedSetElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.filters);
        let dimensionElements: IOlapField[] = this.fieldListData;
        let reportElement: string[] = [];
        for (let field of dataFields) {
            reportElement.push(field.name);
        }
        let measureGroupItems: string[] = [];
        let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (let field of fields) {
            if (!(measureGroupItems.indexOf(field.querySelector('DIMENSIONS').textContent.split('.')[0]) >= 0)) {
                dimensionElements.push({
                    hasChildren: true,
                    isSelected: false,
                    pid: field.querySelector('DIMENSIONS').textContent.split('.')[0],
                    /* tslint:disable-next-line:max-line-length */
                    id: field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0],
                    name: field.querySelector('SET_DISPLAY_FOLDER').textContent,
                    spriteCssClass: 'e-folderCDB-icon' + ' ' + cls.ICON + ' ' + 'namedSets',
                    caption: field.querySelector('SET_DISPLAY_FOLDER').textContent,
                    /* tslint:disable-next-line:max-line-length */
                    // aggregateType: this.getAggregateType(field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0]),
                    type: 'string'
                });
                measureGroupItems.push(field.querySelector('DIMENSIONS').textContent.split('.')[0]);
            }
            let id: string = '[' + field.querySelector('SET_NAME').textContent.trim() + ']';
            let fieldObj: IOlapField = {
                hasChildren: true,
                isNamedSets: true,
                isSelected: (reportElement.indexOf('[' + field.querySelector('SET_NAME').textContent + ']') >= 0),
                /* tslint:disable-next-line:max-line-length */
                pid: field.querySelector('SET_DISPLAY_FOLDER').textContent + '_' + field.querySelector('DIMENSIONS').textContent.split('.')[0],
                id: id,
                name: field.querySelector('SET_CAPTION').textContent,
                caption: field.querySelector('SET_CAPTION').textContent,
                spriteCssClass: 'e-namedSetCDB-icon' + ' ' + cls.ICON,
                tag: field.querySelector('EXPRESSION').textContent,
                // aggregateType: this.getAggregateType(id),
                type: 'string',
                filter: [],
                dateMember: [],
                // sort: 'Ascending',
                actualFilter: [],
                filterMembers: [],
                childMembers: [],
                searchMembers: [],
                members: {},
                currrentMembers: {},
                isHierarchy: true,
                isExcelFilter: false
            };
            dimensionElements.push(fieldObj);
            this.fieldList[id] = fieldObj;
        }
        // let args: ConnectionInfo = {
        //     catalog: customArgs.dataSourceSettings.catalog,
        //     cube: customArgs.dataSourceSettings.cube,
        //     url: customArgs.dataSourceSettings.url,
        //     LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
        //     request: 'MDSCHEMA_SETS'
        // };
        // this.getTreeData(args, this.loadHierarchyElements.bind(this), customArgs);
        customArgs.hierarchy = this.fieldListData;
        customArgs.hierarchySuccess = this.fieldListObj.hierarchySuccess;
        this.loadHierarchyElements(customArgs);
    }

    private loadHierarchyElements(customArgs: FieldData): void {
        let data: Document = customArgs.hierarchySuccess;
        let dimensionElements: IOlapField[] = customArgs.hierarchy;
        let dataFields: IFieldOptions[] = extend([], this.rows, null, true) as IFieldOptions[];
        dataFields = dataFields.concat(this.columns, this.filters);
        let reportElement: string[] = [];
        for (let field of dataFields) {
            reportElement.push(field.name);
        }
        let fields: HTMLElement[] = [].slice.call(data.querySelectorAll('row'));
        for (let field of fields) {
            let dimensionName: string = field.querySelector('DIMENSION_UNIQUE_NAME').textContent;
            let hierarchyName: string = field.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
            let isAllMemberAvail: boolean = [].slice.call(field.querySelectorAll('ALL_MEMBER')).length > 0;
            let allMember: string;
            if (isAllMemberAvail) {
                let stringCollection: string[] = field.querySelectorAll('ALL_MEMBER')[0].textContent.replace(/[\[\]\&']+/g, '').split('.');
                allMember = stringCollection[stringCollection.length - 1].trim();
            } else {
                allMember = undefined;
            }
            /* tslint:disable-next-line:max-line-length */
            let hierarchyFolderName: string = ((field.querySelector('HIERARCHY_DISPLAY_FOLDER')) ? (field.querySelector('HIERARCHY_DISPLAY_FOLDER').textContent) : '');
            let curElement: IOlapField[] = [];
            for (let item of dimensionElements) {
                if (item.tag === dimensionName) {
                    curElement.push(item);
                }
            }
            if (curElement.length > 0 && (dimensionName !== hierarchyName || this.isMondrian)) {
                let parentID: string = dimensionName + (this.isMondrian ? '~#^Dim' : '');
                if (hierarchyFolderName !== '') {
                    let folderName: string = dimensionName + (this.isMondrian ? '~#^Dim' : '') + '_' + hierarchyFolderName;
                    let curParentElement: IOlapField[] = [];
                    for (let item of dimensionElements) {
                        if (item.tag === folderName && item.pid === parentID) {
                            curParentElement.push(item);
                        }
                    }
                    if (curParentElement.length === 0) {
                        let fieldObj: IOlapField = {
                            hasChildren: true,
                            isSelected: false,
                            pid: dimensionName + (this.isMondrian ? '~#^Dim' : ''),
                            id: folderName,
                            name: hierarchyFolderName,
                            spriteCssClass: 'e-folderCDB-icon' + ' ' + cls.ICON,
                            tag: folderName,
                            caption: hierarchyFolderName,
                            // aggregateType: this.getAggregateType(hierarchyFolderName),
                            type: 'string'
                        };
                        dimensionElements.push(fieldObj);
                    }
                    parentID = folderName;
                }
                let fieldObj: IOlapField = {
                    /* tslint:disable-next-line:max-line-length */
                    hasChildren: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? true : false : true),
                    // hasChildren: true,
                    isSelected: (reportElement.indexOf(hierarchyName) >= 0),
                    pid: parentID,
                    id: hierarchyName,
                    name: field.querySelector('HIERARCHY_CAPTION').textContent,
                    /* tslint:disable-next-line:max-line-length */
                    spriteCssClass: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? 'e-hierarchyCDB-icon' : 'e-attributeCDB-icon' : 'e-hierarchyCDB-icon') + ' ' + cls.ICON,
                    hasAllMember: isAllMemberAvail,
                    allMember: allMember,
                    tag: hierarchyName,
                    caption: field.querySelector('HIERARCHY_CAPTION').textContent,
                    // aggregateType: this.getAggregateType(hierarchyName),
                    type: 'string',
                    filter: [],
                    dateMember: [],
                    sort: (this.enableSort ? this.sortObject[hierarchyName] ? this.sortObject[hierarchyName] : 'Ascending' : 'None'),
                    actualFilter: [],
                    filterMembers: [],
                    childMembers: [],
                    searchMembers: [],
                    members: {},
                    currrentMembers: {},
                    levels: [],
                    levelCount: 1,
                    /* tslint:disable-next-line:max-line-length */
                    isHierarchy: (field.querySelector('HIERARCHY_ORIGIN') ? ((field.querySelector('HIERARCHY_ORIGIN').textContent !== '2') && field.querySelector('HIERARCHY_ORIGIN').textContent !== '6') ? false : true : false),
                    isExcelFilter: false
                };
                dimensionElements.push(fieldObj);
                this.fieldList[hierarchyName] = fieldObj;
            }
        }
        let args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_LEVELS'
        };
        this.getTreeData(args, this.loadLevelElements.bind(this), customArgs);
    }

    private loadLevelElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let newDataSource: IOlapField[] = [];
        let dimensionElements: IOlapField[] = this.fieldListData;
        newDataSource = [];
        let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (let field of fields) {
            /* tslint:disable-next-line:max-line-length */
            if (parseInt(field.querySelector('LEVEL_TYPE').textContent, 10) !== 1 && field.querySelector('HIERARCHY_UNIQUE_NAME').textContent.toLowerCase() !== '[measures]') {
                let dimensionName: string = field.querySelector('HIERARCHY_UNIQUE_NAME').textContent;
                let levelName: string = field.querySelector('LEVEL_UNIQUE_NAME').textContent;
                let levelCaption: string = field.querySelector('LEVEL_CAPTION').textContent;
                let levelObj: IOlapField = {
                    hasChildren: false,
                    isChecked: false,
                    isSelected: this.fieldList[dimensionName].isSelected,
                    pid: dimensionName,
                    id: levelName,
                    name: levelCaption,
                    tag: levelName,
                    /* tslint:disable-next-line:max-line-length */
                    spriteCssClass: 'e-level-members e-hierarchy-level-' + parseInt(field.querySelector('LEVEL_NUMBER').textContent, 10) + '-icon' + ' ' + cls.ICON,
                    caption: levelCaption,
                    // aggregateType: this.getAggregateType(levelName),
                    type: 'string'
                };
                newDataSource.push(levelObj);
                if (this.fieldList[dimensionName] && this.fieldList[dimensionName].spriteCssClass &&
                    this.fieldList[dimensionName].spriteCssClass.indexOf('e-attributeCDB-icon') === -1) {
                    this.fieldList[dimensionName].levels.push(levelObj);
                    this.fieldList[dimensionName].isHierarchy = false;
                } else {
                    this.fieldList[dimensionName].isHierarchy = true;
                }
            }
        }
        this.fieldListData = dimensionElements = dimensionElements.concat(newDataSource);
        let args: ConnectionInfo = {
            catalog: customArgs.dataSourceSettings.catalog,
            cube: customArgs.dataSourceSettings.cube,
            url: customArgs.dataSourceSettings.url,
            LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
            request: 'MDSCHEMA_MEASURES'
        };
        this.getTreeData(args, this.loadMeasureElements.bind(this), customArgs);
    }
    private loadMeasureElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        let dimensionElements: IOlapField[] = this.fieldListData;
        let measureGroupItems: string[] = [];
        let caption: string;
        let dataFields: IFieldOptions[] = extend([], this.values, null, true) as IFieldOptions[];
        let reportElement: string[] = [];
        for (let field of dataFields) {
            reportElement.push(field.name);
        }
        if (this.locale !== 'en-US') {
            let args: ConnectionInfo = {
                catalog: customArgs.dataSourceSettings.catalog,
                cube: customArgs.dataSourceSettings.cube,
                url: customArgs.dataSourceSettings.url,
                LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
                request: 'MDSCHEMA_MEASUREGROUPS'
            };
            this.getTreeData(args, this.loadMeasureGroups.bind(this), customArgs);
        }
        let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
        for (let field of fields) {
            /* tslint:disable-next-line:max-line-length */
            let measureGRPName: string = isNullOrUndefined(field.querySelector('MEASUREGROUP_NAME')) ? '' : field.querySelector('MEASUREGROUP_NAME').textContent;
            let measureName: string = field.querySelector('MEASURE_UNIQUE_NAME').textContent;
            let formatString: string = field.querySelector('DEFAULT_FORMAT_STRING') ?
                field.querySelector('DEFAULT_FORMAT_STRING').textContent : '#,#';
            let aggregateType: string = field.querySelector('MEASURE_AGGREGATOR') ?
                field.querySelector('MEASURE_AGGREGATOR').textContent : '1';
            if (!(measureGroupItems.indexOf(measureGRPName) >= 0)) {
                if (this.locale !== 'en-US') {
                    let measureInfo: HTMLElement[] = [];
                    for (let item of this.fieldListObj.measuresGroups) {
                        if (item.querySelector('MEASUREGROUP_NAME').textContent === measureGRPName) {
                            measureInfo.push(item);
                        }
                    }
                    caption = measureInfo.length > 0 ? measureInfo[0].querySelector('MEASUREGROUP_CAPTION').textContent : measureGRPName;
                } else {
                    caption = measureGRPName;
                }
                if (measureGRPName !== '') {
                    dimensionElements.push({
                        hasChildren: true,
                        isChecked: false,
                        isSelected: false,
                        pid: '[Measures]',
                        id: measureGRPName,
                        name: caption,
                        spriteCssClass: 'e-measureCDB e-folderCDB-icon' + ' ' + cls.ICON,
                        tag: measureGRPName,
                        caption: caption,
                        aggregateType: this.getAggregateType(measureGRPName, aggregateType),
                        type: 'string'
                    });
                    measureGroupItems.push(measureGRPName);
                }
            }
            let fieldObj: IOlapField = {
                hasChildren: false,
                isSelected: (reportElement.indexOf(measureName) >= 0),
                pid: measureGRPName === '' ? '[Measures]' : measureGRPName,
                id: measureName,
                name: field.querySelector('MEASURE_CAPTION').textContent,
                spriteCssClass: 'e-measure-icon' + ' ' + cls.ICON,
                tag: measureName,
                caption: field.querySelector('MEASURE_CAPTION').textContent,
                aggregateType: this.getAggregateType(measureName, aggregateType),
                type: 'number',
                filter: [],
                // sort: 'Ascending',
                actualFilter: [],
                filterMembers: [],
                childMembers: [],
                searchMembers: [],
                members: {},
                currrentMembers: {},
                formatString: formatString
            };
            dimensionElements.push(fieldObj);
            this.fieldList[measureName] = fieldObj;
            if ((reportElement.indexOf(measureName) >= 0)) {
                reportElement.splice(reportElement.indexOf(measureName), 1);
            }
        }
        this.measureReportItems = reportElement;
        // let args: ConnectionInfo = {
        //     catalog: customArgs.dataSourceSettings.catalog,
        //     cube: customArgs.dataSourceSettings.cube,
        //     url: customArgs.dataSourceSettings.url,
        //     LCID: customArgs.dataSourceSettings.localeIdentifier.toString(),
        //     request: 'MDSCHEMA_KPIS'
        // };
        // customArgs.reportElement = this.measureReportItems;
        // this.getTreeData(args, this.loadKPIElements.bind(this), customArgs);
    }
    private loadMeasureGroups(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
        if (isNullOrUndefined(this.fieldListObj)) {
            this.fieldListObj = {};
        }
        this.fieldListObj.measuresGroups = [].slice.call(xmlDoc.querySelectorAll('row'));
    }
    // private loadKPIElements(xmlDoc: Document, request: Ajax, customArgs: FieldData): void {
    //     let dimensionElements: IOlapField[] = this.fieldListData;
    //     let parser = new DOMParser();
    //     let measureGroupItems: string[] = [];
    //     let fields: HTMLElement[] = [].slice.call(xmlDoc.querySelectorAll('row'));
    //     dimensionElements.splice(1, 0, {
    //         hasChildren: true,
    //         isChecked: false,
    //         id: 'folderStruct',
    //         name: 'KPI',
    //         spriteCssClass: 'kpiCDB e-kpiCDB-icon' + ' ' +  cls.ICON,
    //         tag: '',
    //         caption: 'KPI',
    //         aggregateType: this.getAggregateType('folderStruct'),
    //         type: 'string'
    //     });
    //     for (let field of fields) {
    //         let kpiName: string = field.querySelector('KPI_CAPTION').textContent;
    //         let kpiGoal: string = field.querySelector('KPI_GOAL').textContent;
    //         let kpiStatus: string = field.querySelector('KPI_STATUS').textContent;
    //         let kpiTrend: string = field.querySelector('KPI_TREND').textContent;
    //         let kpiValue: string = field.querySelector('KPI_VALUE').textContent;
    //         if (!(measureGroupItems.indexOf(field.querySelector('KPI_NAME').textContent) >= 0)) {
    //             dimensionElements.push({
    //                 hasChildren: true,
    //                 isChecked: false,
    //                 pid: 'folderStruct',
    //                 id: kpiName,
    //                 name: kpiName,
    //                 spriteCssClass: 'e-folderCDB-icon' + ' ' +  cls.ICON,
    //                 tag: kpiName,
    //                 caption: kpiName,
    //                 aggregateType: this.getAggregateType(kpiName),
    //                 type: 'string'
    //             });
    //             measureGroupItems.push(kpiName);
    //         }
    //         let kpiCollection: { [key: string]: string } = {
    //             'kpiGoal': kpiGoal,
    //             'kpiStatus': kpiStatus,
    //             'kpiTrend': kpiTrend,
    //             'kpiValue': kpiValue
    //         };
    //         let i: number = 0;
    //         for (let kpi of Object.keys(kpiCollection)) {
    //             let id: string = kpiCollection[kpi];
    //             let name: string = (kpi).split('kpi')[1];
    //             let cssClass: string = 'e-' + kpi + '-icon';
    //             let fieldObj: IOlapField = {
    //                 hasChildren: true,
    //                 isSelected: (customArgs.reportElement.indexOf(id) >= 0),
    //                 id: id,
    //                 pid: kpiName,
    //                 name: name,
    //                 spriteCssClass: cssClass + ' ' +  cls.ICON,
    //                 tag: id,
    //                 caption: name,
    //                 aggregateType: this.getAggregateType(id),
    //                 type: 'number',
    //                 filter: [],
    //                 sort: 'Ascending',
    //                 filterMembers: [],
    //                 searchMembers: [],
    //                 members: {},
    //                 currrentMembers: {}
    //             };
    //             dimensionElements.push(fieldObj);
    //             this.fieldList[id] = fieldObj;
    //         }
    //     }
    // }
    public doAjaxPost(type: string, url: string, data: string, success: Function, customArgs?: Object): void {
        let ajax: Ajax = new Ajax(
            {
                mode: false,
                contentType: 'text/xml',
                url: url,
                data: data,
                dataType: 'xml',
                type: type,
                onSuccess: (args: string | Object, request: Ajax) => {
                    let parser: DOMParser = new DOMParser();
                    // parsing string type result as XML
                    let xmlDoc: Document = parser.parseFromString(args as string, 'text/xml');
                    success(xmlDoc, request, customArgs);
                },
                onFailure: (e: string) => {
                    return e;
                }
            }
        );
        ajax.send();
    }
    private getSoapMsg(dataSourceSettings: IDataOptions, query: string): string {
        let xmlMsg: string = '';
        let sourceInfo: string = '';
        let connectionString: ConnectionInfo = this.getConnectionInfo(dataSourceSettings.url, dataSourceSettings.localeIdentifier);
        if (this.isMondrian) {
            sourceInfo = '';
            /* tslint:disable-next-line:max-line-length */
            xmlMsg = '<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><SOAP-ENV:Body><Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"><Command><Statement><![CDATA[' +
                query + ']]></Statement></Command><Properties><PropertyList><DataSourceInfo>' + sourceInfo +
                /* tslint:disable-next-line:max-line-length */
                '</DataSourceInfo><Catalog>' + dataSourceSettings.catalog + '</Catalog><AxisFormat>TupleFormat</AxisFormat><Content>Data</Content><Format>Multidimensional</Format></PropertyList></Properties></Execute></SOAP-ENV:Body></SOAP-ENV:Envelope>';
        } else {
            /* tslint:disable-next-line:max-line-length */
            xmlMsg = '<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\"> <Header></Header> <Body> <Execute xmlns=\"urn:schemas-microsoft-com:xml-analysis\"> <Command> <Statement> ' +
                query + ' </Statement> </Command> <Properties> <PropertyList> <Catalog>' + dataSourceSettings.catalog +
                /* tslint:disable-next-line:max-line-length */
                '</Catalog> <LocaleIdentifier>' + connectionString.LCID + '</LocaleIdentifier></PropertyList> </Properties> </Execute> </Body> </Envelope>';
        }
        return xmlMsg;
    }
    public getConnectionInfo(connectionString: string, locale: string | number): ConnectionInfo {
        let connectionInfo: ConnectionInfo = { url: '', LCID: '1033' };
        if (connectionString !== '') {
            for (let obj of connectionString.split(';')) {
                if (obj.toLowerCase().indexOf('locale') < 0 && connectionInfo.url.length === 0) {
                    connectionInfo.url = obj;
                } else if (obj.toLowerCase().indexOf('locale') >= 0) {
                    connectionInfo.LCID = obj.replace(/ /g, '').split('=')[1];
                } else if (!isNullOrUndefined(locale)) {
                    connectionInfo.LCID = locale.toString();
                }
            }
        }
        return connectionInfo;
    }

    public getMDXQuery(dataSourceSettings: IDataOptions): string {
        MDXQuery.getCellSets(dataSourceSettings, this, true, undefined, true);
        return this.mdxQuery;
    }
}
/**
 * @hidden
 */
export interface IOlapFieldListOptions {
    [index: string]: IOlapField;
}
/**
 * @hidden
 */
export interface IOlapField extends IField {
    pid?: string;
    tag?: string;
    hasChildren?: boolean;
    expanded?: boolean;
    spriteCssClass?: string;
    name?: string;
    defaultHierarchy?: string;
    hasAllMember?: boolean;
    allMember?: string;
    isChecked?: boolean;
    filterMembers?: IOlapField[];
    childMembers?: IOlapField[];
    searchMembers?: IOlapField[];
    htmlAttributes?: { [key: string]: string };
    currrentMembers?: IMembers;
    isHierarchy?: boolean;
    isNamedSets?: boolean;
    formatString?: string;
    actualFilter?: string[];
    levels?: IOlapField[];
    levelCount?: number;
    memberType?: number;
    isCalculatedField?: boolean;
    fieldType?: string;
    parentHierarchy?: string;
}
/**
 * @hidden
 */
export interface ConnectionInfo {
    url?: string;
    LCID?: string;
    catalog?: string;
    cube?: string;
    request?: string;
}
/**
 * @hidden
 */
export interface FieldData {
    hierarchy?: IOlapField[];
    hierarchySuccess?: Document;
    /* tslint:disable */
    measures?: any;
    /* tslint:enable */
    dataSourceSettings?: IDataOptions;
    action?: string;
    reportElement?: string[];
    measuresGroups?: HTMLElement[];
    fieldName?: string;
    drillInfo?: IDrilledItem;
    loadLevelMembers?: boolean;
}
/** @hidden */
export interface IOlapCustomProperties extends ICustomProperties {
    savedFieldList?: IOlapFieldListOptions;
    savedFieldListData?: IOlapField[];
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/** @hidden */
export interface ITupInfo {
    allCount?: number;
    allStartPos?: number;
    measure?: Element;
    measureName?: string;
    measurePosition?: number;
    members?: NodeListOf<Element>;
    typeCollection?: string[];
    levelCollection?: number[];
    uNameCollection?: string;
    captionCollection?: string;
    drillInfo?: IDrillInfo[];
    drillStartPos?: number;
    drillEndPos?: number;
    startDrillUniquename?: string;
    endDrillUniquename?: string;
    showTotals?: boolean;
}
/** @hidden */
export interface IDrillInfo {
    level: number;
    uName: string;
    hierarchy: string;
    isDrilled: boolean;
}
/** @hidden */
export interface ITotCollection {
    allCount: number;
    allStartPos?: number;
    ordinal: number;
    members: NodeListOf<Element>;
    drillInfo?: IDrillInfo[];
}
/** @hidden */
export interface IParentObjCollection {
    [key: number]: { [key: number]: Element; };
}
/** @hidden */
export interface ILastSavedInfo {
    [key: string]: string | number;
}
/** @hidden */
export interface IMeasureInfo {
    measureAxis: string;
    measureIndex: number;
    valueInfo: string[];
}
/** @hidden */
export interface IOrderedInfo {
    orderedValueTuples: Element[];
    orderedHeaderTuples: Element[];
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////