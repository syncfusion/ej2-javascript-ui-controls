/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { Schedule } from '../base/schedule';
import { EventFieldsMapping } from '../base/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * data module is used to generate query and data source.
 *
 * @private
 */
export class Data {

    public dataManager: DataManager;
    private query: Query;
    private parent: Schedule;

    /**
     * Constructor for data module
     *
     * @param {Schedule} parent Accepts the schedule element instance
     * @param {Object | DataManager} dataSource Accepts the datasource as JSON objects or DataManager
     * @param {Query} query Accepts the query to process the data
     * @private
     */
    constructor(parent: Schedule, dataSource?: Record<string, any>[] | DataManager, query?: Query) {
        this.parent = parent;
        this.initDataManager(dataSource, query);
    }

    /**
     * The function used to initialize dataManager and query
     *
     * @param {Object | DataManager} dataSource Accepts the datasource as JSON objects or DataManager
     * @param {Query} query Accepts the query to process the data
     * @returns {void}
     * @private
     */
    public initDataManager(dataSource: Record<string, any>[] | DataManager, query: Query): void {
        this.dataManager = dataSource instanceof DataManager ? <DataManager>dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    }

    /**
     * The function used to generate updated Query from schedule model
     *
     * @param {Date} startDate Accepts the start date
     * @param {Date} endDate Accepts the end date
     * @returns {void}
     * @private
     */
    public generateQuery(startDate?: Date, endDate?: Date): Query {
        const query: Query = this.query.clone();
        if (this.parent && startDate && endDate) {
            if (this.parent.activeViewOptions && this.parent.activeViewOptions.enableLazyLoading &&
                !isNullOrUndefined(this.parent.activeViewOptions.group.resources) &&
                this.parent.activeViewOptions.group.resources.length > 0 && this.parent.resourceBase &&
                this.parent.resourceBase.resourceCollection.length > 0 && this.parent.resourceBase.renderedResources.length > 0) {
                const resIdCollection: string[][] = [];
                this.parent.resourceBase.resourceCollection.forEach(() => resIdCollection.push([]));
                this.parent.resourceBase.renderedResources.forEach((resource: Record<string, any>) => {
                    resIdCollection.forEach((resId: string[], index: number) => {
                        const groupId: string = resource.groupOrder[parseInt(index.toString(), 10)];
                        if (groupId && resId.indexOf(groupId) < 0) {
                            resId.push(groupId);
                        }
                    });
                });
                this.parent.resourceBase.resourceCollection.forEach((resource: Record<string, any>, index: number) => {
                    query.addParams(resource.field, resIdCollection[parseInt(index.toString(), 10)].toString());
                });
            }
            if (this.parent.timezone) {
                startDate = this.parent.tzModule.remove(new Date(+startDate.getTime()), this.parent.timezone);
                endDate = this.parent.tzModule.remove(new Date(+endDate.getTime()), this.parent.timezone);
            }
            if (this.parent.eventSettings.includeFiltersInQuery) {
                const dateQuery: Predicate = this.getStartEndQuery(startDate, endDate);
                const recurrenceQuery: Predicate = new Predicate(this.parent.eventFields.recurrenceRule, 'notequal', null).and(new Predicate(this.parent.eventFields.recurrenceRule, 'notequal', ''));
                return query.where(dateQuery.or(recurrenceQuery));
            }
            query.addParams('StartDate', startDate.toISOString());
            query.addParams('EndDate', endDate.toISOString());
        }
        return query;
    }

    /**
     * The function used to generate updated Query from schedule model
     *
     * @param {Date} startDate Accepts the start date
     * @param {Date} endDate Accepts the end date
     * @returns {void}
     * @private
     */
    public getStartEndQuery(startDate?: Date, endDate?: Date): Predicate {
        const fieldMapping: EventFieldsMapping = this.parent.eventFields;
        const dateQuery: Predicate = new Predicate(fieldMapping.startTime, 'greaterthanorequal', startDate)
            .and(new Predicate(fieldMapping.endTime, 'greaterthanorequal', startDate))
            .and(new Predicate(fieldMapping.startTime, 'lessthan', endDate))
            .or(new Predicate(fieldMapping.startTime, 'lessthanorequal', startDate)
                .and(new Predicate(fieldMapping.endTime, 'greaterthan', startDate)));
        return dateQuery;
    }

    /**
     * The function used to get dataSource by executing given Query
     *
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @returns {void}
     * @private
     */
    public getData(query: Query): Promise<any> {
        return this.dataManager.executeQuery(query);
    }

    /**
     * To destroy the crud module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.dataManager = null;
        this.query = null;
    }

}
