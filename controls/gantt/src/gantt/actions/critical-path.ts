import { isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { ganttChart } from "../base/css-constants";
import { Gantt } from "../base/gantt";
import { IGanttData, IPredecessor, ITaskData } from "../base/interface";
import { TaskFieldsModel } from "../models/task-fields-model";
import { addClass, removeClass } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';

export class CriticalPath {

    private parent: Gantt;
    public detailPredecessorCollection: object[];
    public criticalPathCollection: number[];
    public resourceCollectionIds: string[] = [];
    public predecessorCollectionTaskIds: number[];
    public criticalTasks: IGanttData[] = [];
    public maxEndDate: Date;
    constructor(parent: Gantt) {
        this.parent = parent;
    }
    public getCriticalTasks(): IGanttData[] {
        return this.criticalTasks;
    }
    public showCriticalPath(isCritical: boolean): void {
        const modelIds: string[] = this.parent.ids;
        const totalRecords: IGanttData[] = this.parent.flatData;
        if (isCritical && this.parent.flatData.length > 0) {
            this.parent.enableCriticalPath = true;
            const parentRecords: IGanttData[] = this.parent.treeGrid.parentData;
            let checkEndDateTaskid: number | string;
            let checkEndDate: Date = parentRecords[0].ganttProperties.endDate;
            let dateDifference: number = 0;
            const checkBeyondEnddate: any[] = [];
            const totalPredecessorsCollection: IGanttData[] = [];
            const totalPredecessorsCollectionId: any[] = [];
            let predecessorIndex: number = 0;
            const taskBeyondEnddate: number[] = [];
            const predecessorTaskBeyondEnddate: number[] = [];
            const collection: object[] = [];
            const collectionTaskId: number[] = [];
            const fromDataObject: object[] = [];
            let criticalPathIds: number[] = [];
            /* eslint-disable-next-line */
            if (parentRecords[0].ganttProperties.autoEndDate > parentRecords[0].ganttProperties.endDate && !parentRecords[0].ganttProperties.isAutoSchedule) {
                checkEndDate = parentRecords[0].ganttProperties.autoEndDate;
            }
            checkEndDateTaskid = parentRecords[0].ganttProperties.taskId;
            // Find the total project endDate
            for (let i: number = 1; i < parentRecords.length; i++) {
                if (parentRecords[i].ganttProperties.endDate >= checkEndDate) {
                    checkEndDate = parentRecords[i].ganttProperties.endDate;
                    checkEndDateTaskid = parentRecords[i].ganttProperties.taskId;
                }
                if (!parentRecords[i].ganttProperties.isAutoSchedule) {
                    if (parentRecords[i].ganttProperties.autoEndDate >= checkEndDate) {
                        checkEndDate = parentRecords[i].ganttProperties.autoEndDate;
                        checkEndDateTaskid = parentRecords[i].ganttProperties.taskId;
                    }
                }
            }
            this.maxEndDate = checkEndDate;
            // find the tasks that ends on total project end date that stored in checkBeyondEnddate
            // find the tasks with predecessor that stored in totalPredecessorsCollectionId.
            for (let j: number = 0; j < totalRecords.length; j++) {
                totalRecords[j].isCritical = false;
                totalRecords[j].ganttProperties.isCritical = false;
                /* eslint-disable-next-line */
                dateDifference = this.parent.dataOperation.getDuration(totalRecords[j].ganttProperties.endDate, checkEndDate, totalRecords[j].ganttProperties.durationUnit, totalRecords[j].ganttProperties.isAutoSchedule, totalRecords[j].ganttProperties.isMilestone);
                totalRecords[j].slack = dateDifference + ' ' + totalRecords[j].ganttProperties.durationUnit;
                totalRecords[j].ganttProperties.slack = dateDifference + ' ' + totalRecords[j].ganttProperties.durationUnit;
                if (totalRecords[j].ganttProperties.endDate >= checkEndDate) {
                    checkBeyondEnddate.push(totalRecords[j].ganttProperties.taskId);
                }
                if (totalRecords[j].ganttProperties.predecessor) {
                    if (totalRecords[j].ganttProperties.predecessor.length !== 0) {
                        totalPredecessorsCollection.push(totalRecords[j]);
                        totalPredecessorsCollectionId.push((totalRecords[j].ganttProperties.taskId));
                    }
                }
            }
            if (this.parent.viewType === 'ResourceView') {
                for (let i: number = 0; i < this.parent.taskIds.length; i++) {
                    this.resourceCollectionIds[i] = this.parent.taskIds[i].slice(1);
                }
            }
            // seperate the predecessor connected taskes from the individual taskes that ends on total project end date
            for (let k: number = 0; k < checkBeyondEnddate.length; k++) {
                if (totalPredecessorsCollectionId.indexOf(checkBeyondEnddate[k]) === -1) {
                    if (this.parent.viewType === 'ProjectView') {
                        predecessorIndex = modelIds.indexOf(checkBeyondEnddate[k].toString());
                    }
                    else {
                        let currentRecords: IGanttData[] = this.parent.currentViewData.filter((data: IGanttData) => {
                            return parseInt(data.ganttProperties.taskId) == checkBeyondEnddate[k];
                        });
                        for (let i: number = 0; i < currentRecords.length; i++) {
                            if (!currentRecords[i].hasChildRecords && currentRecords[i].ganttProperties.endDate >= this.maxEndDate) {
                                predecessorIndex = currentRecords[i].index;
                            }
                        }
                    }
                    if (totalRecords[predecessorIndex].ganttProperties.progress < 100) {
                        totalRecords[predecessorIndex].isCritical = true;
                        totalRecords[predecessorIndex].ganttProperties.isCritical = true;
                    }
                    totalRecords[predecessorIndex]['slack'] = 0 + ' ' + totalRecords[predecessorIndex].ganttProperties.durationUnit;
                    taskBeyondEnddate.push(checkBeyondEnddate[k]);
                }
                else {
                    predecessorTaskBeyondEnddate.push(checkBeyondEnddate[k]);
                }
            }

            const predecessorLength: number = totalPredecessorsCollection.length;
            const endTask: object[] = [];

            // find the detail collection of predecessor for each taskes that stored in collection.
            for (let x: number = 0; x < predecessorLength; x++) {
                let to: number | string = -1;
                let from: number | string = -1;
                let toPredecessor: number | string = -1;
                let fromPredecessor: number | string = -1;
                let tempTaskId: any;
                const currentIndex: number = x;
                const predecessor: IPredecessor[] = totalPredecessorsCollection[x].ganttProperties.predecessor;
                const individualPredecessorLength: number = totalPredecessorsCollection[x].ganttProperties.predecessor.length;
                const taskid: any = ((totalPredecessorsCollection[x].ganttProperties.taskId));
                for (let y: number = 0; y < individualPredecessorLength; y++) {
                    if (!isNaN(Number(predecessor[y].from)) && typeof(taskid) != "string") {
                        tempTaskId = parseInt((predecessor[y].from),10);
                    } else if (!isNaN(Number(predecessor[y].from)) && typeof(taskid) === "string") {
                        tempTaskId = predecessor[y].from;
                    } else {
                        tempTaskId = predecessor[y].from;
                    }
                    if (tempTaskId === taskid) {
                        if (to === -1) {
                            if (!predecessor[y].offset) {
                                to = predecessor[y].to;
                                toPredecessor = predecessor[y].type;
                            } else {
                                to = predecessor[y].to + ':' + predecessor[y].offset + predecessor[y].offsetUnit;
                                toPredecessor = predecessor[y].type;
                            }
                        } else {
                            if (!predecessor[y].offset) {
                                to = to + ',' + predecessor[y].to;
                                toPredecessor = toPredecessor + ',' + predecessor[y].type;
                            } else {
                                to = to + ',' + predecessor[y].to + ':' + predecessor[y].offset + predecessor[y].offsetUnit;
                                toPredecessor = toPredecessor + ',' + predecessor[y].type;
                            }
                        }
                    }
                    if (!isNaN(Number(predecessor[y].to)) && typeof(taskid) != "string") {
                        tempTaskId = parseInt((predecessor[y].to),10);
                    } else if (!isNaN(Number(predecessor[y].to)) && typeof(taskid) === "string") {
                        tempTaskId = predecessor[y].to;
                    } else {
                        tempTaskId = predecessor[y].to;
                    }
                    if (tempTaskId === taskid) {
                        if (from === -1) {
                            if (!predecessor[y].offset) {
                                from = predecessor[y].from;
                                fromPredecessor = predecessor[y].type;
                            } else {
                                from = predecessor[y].from + ':' + predecessor[y].offset + predecessor[y].offsetUnit;
                                fromPredecessor = predecessor[y].type;
                            }
                        } else {
                            if (!predecessor[y].offset) {
                                from = from + ',' + predecessor[y].from;
                                fromPredecessor = fromPredecessor + ',' + predecessor[y].type;
                            } else {
                                from = from + ',' + predecessor[y].from + ':' + predecessor[y].offset + predecessor[y].offsetUnit;
                                fromPredecessor = fromPredecessor + ',' + predecessor[y].type;
                            }
                        }
                    }
                }
                if (from === -1) {
                    from = null;
                    fromPredecessor = null;
                }
                if (to === -1) {
                    to = null;
                    toPredecessor = null;
                }
                /* eslint-disable-next-line */
                collection.push({ from: from, fromPredecessor: fromPredecessor, taskid: taskid, to: to, toPredecessor: toPredecessor, currentIndex: currentIndex, slack: null, enddate: null });
                collectionTaskId.push(taskid);
            }
            const collectionLength: number = collection.length;
            let indexEnddate: number = 0;
            let num: number;
            // find the predecessors connected taskes that does not contains any successor.
            for (let z: number = 0; z < collectionLength; z++) {
                if (!collection[z]['to']) {
                    num = collection[z]['taskid'];
                    if (this.parent.viewType === 'ProjectView') {
                        indexEnddate = modelIds.indexOf(num.toString());
                    }
                    else {
                        indexEnddate = this.resourceCollectionIds.indexOf(num.toString());
                    }
                    const flatData: ITaskData = totalRecords[indexEnddate].ganttProperties;
                    /* eslint-disable-next-line */
                    dateDifference = this.parent.dataOperation.getDuration(flatData.endDate, checkEndDate, 'minute', flatData.isAutoSchedule, flatData.isMilestone);
                    collection[z]['slack'] = dateDifference;
                    collection[z]['fs'] = -1;
                    collection[z]['enddate'] = flatData.endDate;
                    endTask.push({
                        fromdata: collection[z]['from'], todateID: collection[z]['taskid'],
                        fromDataPredecessor: collection[z]['fromPredecessor']
                    });
                }
            }
            for (let k: number = 0; k < endTask.length; k++) {
                fromDataObject.push(endTask[k]);
                this.slackCalculation(fromDataObject, collection, collectionTaskId, checkEndDate, totalRecords, modelIds);
            }
            criticalPathIds = this.finalCriticalPath(collection, taskBeyondEnddate, totalRecords, modelIds, checkEndDate);
            this.criticalPathCollection = criticalPathIds;
            this.detailPredecessorCollection = collection;
            this.predecessorCollectionTaskIds = collectionTaskId;
        }
        if (isCritical === false && this.parent.flatData.length > 0) {
            let pathIndex: number;
            this.parent.enableCriticalPath = false;
            for (let z: number = 0; z < this.criticalPathCollection.length; z++) {
                pathIndex = modelIds.indexOf(this.criticalPathCollection[z].toString());
                totalRecords[pathIndex].isCritical = false;
            }
            this.criticalPathCollection = [];
            this.detailPredecessorCollection = [];
            this.predecessorCollectionTaskIds = [];
        }
    }
    /* eslint-disable-next-line */
    public slackCalculation(fromDataObject: object[], collection: object[], collectionTaskId: any, checkEndDate: Date, flatRecords: IGanttData[], modelRecordIds: string[]): void {
        const fromDateArray: string[] = fromDataObject[0]['fromdata'].split(',');
        const fromDataPredecessor: string[] = fromDataObject[0]['fromDataPredecessor'].split(',');
        collectionTaskId = collectionTaskId.toString();
        collectionTaskId = collectionTaskId.split(',');
        let fromDateArray1: string[] = [];
        let fromTaskIdIndex: number;
        let indexFromTaskId: number;
        let indexToTaskId: number;
        let totaskId: number;
        let dateDifference: number;
        let prevTaskEnddate: Date;
        let offsetInMillSec: number;
        let ffslack: number;
        for (let i: number = 0; i < fromDateArray.length; i++) {
            fromDateArray1 = fromDateArray[i].split(':');
            fromTaskIdIndex = collectionTaskId.indexOf((fromDateArray1[0].toString()));
            totaskId = collectionTaskId.indexOf((fromDataObject[0]['todateID'].toString()));
            if (this.parent.viewType === 'ProjectView') {
                indexFromTaskId = modelRecordIds.indexOf(fromDateArray1[0].toString());
                indexToTaskId = modelRecordIds.indexOf(fromDataObject[0]['todateID'].toString());
            }
            else {
                indexFromTaskId = this.resourceCollectionIds.indexOf(fromDateArray1[0].toString());
                indexToTaskId = this.resourceCollectionIds.indexOf(fromDataObject[0]['todateID'].toString());
            }
            const fromIdFlatData: ITaskData = flatRecords[indexFromTaskId].ganttProperties;
            const toIdFlatData: ITaskData = flatRecords[indexToTaskId].ganttProperties;
            if (fromDateArray1.length > 1) {
                if (fromDateArray1[1].indexOf('hour') !== -1) {
                    offsetInMillSec = parseFloat(fromDateArray1[1]) * 60;
                }
                else if (fromDateArray1[1].indexOf('day') !== -1) {
                    offsetInMillSec = parseFloat(fromDateArray1[1]) * (this.parent.secondsPerDay / 3600) * 60;
                } else {
                    offsetInMillSec = parseFloat(fromDateArray1[1]);
                }
            }
            // calculate slack value for the task contains predecessor connection in "finish to start".
            if (fromDataPredecessor[i] === 'FS') {
                if (fromIdFlatData.endDate > toIdFlatData.startDate) {
                    /* eslint-disable-next-line */
                    dateDifference = -(this.parent.dataOperation.getDuration(toIdFlatData.startDate, fromIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                }
                else {
                    /* eslint-disable-next-line */
                    dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.endDate, toIdFlatData.startDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                }

                // execute if the slack value is not set initially.
                if (isNullOrUndefined(collection[fromTaskIdIndex]['slack'])) {
                    // execute if the offset value is not given.
                    if (fromDateArray1.length <= 1) {
                        if (collection[totaskId]['slack'] + dateDifference < 0) {
                            collection[fromTaskIdIndex]['slack'] = 0;
                        }
                        else {
                            collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                        }
                    }
                }
                // execute if the current calculated slack value is less than the previous slack value.
                else if (collection[fromTaskIdIndex]['slack'] > dateDifference && collection[fromTaskIdIndex]['slack'] !== 0) {
                    // execute if the offset value is not given.
                    if (fromDateArray1.length <= 1) {
                        if (collection[totaskId]['slack'] + dateDifference < 0) {
                            collection[fromTaskIdIndex]['slack'] = 0;
                        }
                        else {
                            collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                        }
                    }
                }
                // execute if the offset value is given.
                if (fromDateArray1.length > 1) {
                    collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                    collection[fromTaskIdIndex]['slack'] = collection[fromTaskIdIndex]['slack'] - (offsetInMillSec);
                    if (collection[fromTaskIdIndex]['slack'] < 0) {
                        collection[fromTaskIdIndex]['slack'] = 0;
                    }
                }
                collection[fromTaskIdIndex]['fs'] = 1;
                collection[fromTaskIdIndex]['fsslack'] = collection[fromTaskIdIndex]['slack'];
                collection[fromTaskIdIndex]['enddate'] = fromIdFlatData.startDate;
                if (fromIdFlatData.endDate >= checkEndDate && fromIdFlatData.endDate <= checkEndDate) {
                    collection[fromTaskIdIndex]['slack'] = 0;
                }
            }

            //  calculate slack value for the task contains predecessor connection in "start to start".
            if (fromDataPredecessor[i] === 'SS') {
                // It execute if the task is in auto mode.
                if (fromIdFlatData.isAutoSchedule) {
                    if (fromIdFlatData.startDate > toIdFlatData.startDate) {
                        /* eslint-disable-next-line */
                        dateDifference = -(this.parent.dataOperation.getDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                    }
                    else {
                        /* eslint-disable-next-line */
                        dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.startDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                    }
                    // It execute while the slack value is not set to the corresponding task.
                    if (isNullOrUndefined(collection[fromTaskIdIndex]['slack'])) {
                        if (fromDateArray1.length <= 1) {
                            if (collection[totaskId]['slack'] + dateDifference < 0) {
                                collection[fromTaskIdIndex]['slack'] = 0;
                            }
                            else {
                                collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                            }
                        }
                    }
                    //It execute while already the slack value is set and it is higher than the datedifference. 
                    else if (collection[fromTaskIdIndex]['slack'] > dateDifference && collection[fromTaskIdIndex]['slack'] !== 0) {
                        if (fromDateArray1.length <= 1) {
                            if (collection[totaskId]['slack'] + dateDifference < 0) {
                                collection[fromTaskIdIndex]['slack'] = 0;
                            }
                            else {
                                collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                            }
                        }
                    }
                    // execute if the offset value is given.
                    if (fromDateArray1.length > 1) {
                        collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                        collection[fromTaskIdIndex]['slack'] = collection[fromTaskIdIndex]['slack'] - (offsetInMillSec);
                        if (collection[fromTaskIdIndex]['slack'] < 0) {
                            collection[fromTaskIdIndex]['slack'] = 0;
                        }
                    }
                    collection[fromTaskIdIndex]['fs'] = 1;
                    collection[fromTaskIdIndex]['fsslack'] = collection[fromTaskIdIndex]['slack'];
                    collection[fromTaskIdIndex]['enddate'] = fromIdFlatData.startDate;
                }
                // It execute if the task is in not an auto mode task.
                else if (!fromIdFlatData.isAutoSchedule) {
                    dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId]);
                    if (isNullOrUndefined(collection[fromTaskIdIndex]['slack'])) {
                        collection[fromTaskIdIndex]['slack'] = dateDifference;
                    }
                    else if (collection[fromTaskIdIndex]['slack'] > dateDifference && collection[fromTaskIdIndex]['slack'] !== 0) {
                        collection[fromTaskIdIndex]['slack'] = dateDifference;
                    }
                }
                if (fromIdFlatData.endDate >= checkEndDate && fromIdFlatData.endDate <= checkEndDate) {
                    collection[fromTaskIdIndex]['slack'] = 0;
                }
            }

            //  calculate slack value for the task contains predecessor connection in "finish to finish".
            if (fromDataPredecessor[i] === 'FF') {
                // execute if the previous task is from finish to start or finish to finish state.
                if (collection[totaskId]['fs'] === 1 || collection[totaskId]['ff'] === 1 || collection[totaskId]['fs'] === -1) {
                    if (collection[totaskId]['fs'] === 1 || collection[totaskId]['ff'] === 1) {
                        prevTaskEnddate = toIdFlatData.endDate;
                        ffslack = collection[totaskId]['slack'];
                    }
                    if (collection[totaskId]['fs'] === -1) {
                        prevTaskEnddate = collection[totaskId]['enddate'];
                        ffslack = collection[totaskId]['slack'];
                    }
                    if (prevTaskEnddate > fromIdFlatData.endDate) {
                        dateDifference = -(this.getSlackDuration(fromIdFlatData.endDate, prevTaskEnddate, 'minute',
                                                                 flatRecords[indexFromTaskId]));
                    }
                    else {
                        dateDifference = this.getSlackDuration(prevTaskEnddate, fromIdFlatData.endDate, 'minute',
                                                               flatRecords[indexFromTaskId]);
                    }
                    // set the slack value if the slack value is not set initially.
                    if (isNullOrUndefined(collection[fromTaskIdIndex]['slack'])) {
                        // execute if the offset value is not given.
                        if (fromDateArray1.length <= 1) {
                            if (ffslack - dateDifference < 0) {
                                collection[fromTaskIdIndex]['slack'] = 0;
                            }
                            else {
                                collection[fromTaskIdIndex]['slack'] = ffslack - dateDifference;
                            }
                        }
                    }
                    // overright the slack value if the current calculated slack value is less than the previous slack value.
                    else if (collection[fromTaskIdIndex]['slack'] > dateDifference && collection[fromTaskIdIndex]['slack'] !== 0) {
                        // execute if the offset value is not given.
                        if (fromDateArray1.length <= 1) {
                            if (ffslack - dateDifference < 0) {
                                collection[fromTaskIdIndex]['slack'] = 0;
                            }
                            else {
                                collection[fromTaskIdIndex]['slack'] = ffslack - dateDifference;
                            }
                        }
                    }
                    // execute if the offset value is given.
                    if (fromDateArray1.length > 1) {
                        collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] - dateDifference;
                        collection[fromTaskIdIndex]['slack'] = collection[fromTaskIdIndex]['slack'] - (offsetInMillSec);
                        if (collection[fromTaskIdIndex]['slack'] < 0) {
                            collection[fromTaskIdIndex]['slack'] = 0;
                        }
                    }
                    collection[fromTaskIdIndex]['ff'] = 1;
                    collection[fromTaskIdIndex]['enddate'] = prevTaskEnddate;
                    collection[fromTaskIdIndex]['fsslack'] = ffslack;
                }
                if (fromIdFlatData.endDate >= checkEndDate && fromIdFlatData.endDate <= checkEndDate) {
                    collection[fromTaskIdIndex]['slack'] = 0;
                }
            }

            //  calculate slack value for the task contains predecessor connection in "start to finish".
            if (fromDataPredecessor[i] === 'SF') {
                //It execute if the task is an auto mode task.
                if (fromIdFlatData.isAutoSchedule) {
                    //execute if the slack value is not set initially.
                    if (isNullOrUndefined(collection[fromTaskIdIndex]['slack'])) {
                        // execute if the offset value is not given.
                        if (fromDateArray1.length <= 1) {
                            // execute if the previous task does no has sucessor.
                            if (isNullOrUndefined(collection[totaskId]['to'])) {
                                dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute',
                                                                       flatRecords[indexFromTaskId]);
                                collection[fromTaskIdIndex]['slack'] = dateDifference;
                            }
                            // execute if the previous task has sucessor.
                            else if (!isNullOrUndefined(collection[totaskId]['to'])) {
                                if (toIdFlatData.endDate > fromIdFlatData.startDate) {
                                    /* eslint-disable-next-line */
                                    dateDifference = -(this.parent.dataOperation.getDuration(fromIdFlatData.startDate,toIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                                }
                                else {
                                    dateDifference = this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute',
                                                                           flatRecords[indexFromTaskId]);
                                }
                                if (collection[totaskId]['slack'] + dateDifference < 0) {
                                    collection[fromTaskIdIndex]['slack'] = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                                }
                            }
                        }
                        // execute if the offset value is given.
                        else if (fromDateArray1.length > 1) {
                            if (toIdFlatData.endDate >= fromIdFlatData.endDate) {
                                if (fromIdFlatData.startDate > toIdFlatData.endDate) {
                                    /* eslint-disable-next-line */
                                    dateDifference = -(this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute', flatRecords[indexFromTaskId]));
                                }
                                else {
                                    /* eslint-disable-next-line */
                                    dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                                }
                            } else {
                                dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute',
                                                                       flatRecords[indexFromTaskId]);
                            }
                            collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                            collection[fromTaskIdIndex]['slack'] = collection[fromTaskIdIndex]['slack'] - (offsetInMillSec);
                            if (collection[fromTaskIdIndex]['slack'] < 0) {
                                collection[fromTaskIdIndex]['slack'] = 0;
                            }
                        }
                        collection[fromTaskIdIndex]['fs'] = 1;
                        collection[fromTaskIdIndex]['fsslack'] = collection[fromTaskIdIndex]['slack'];
                        collection[fromTaskIdIndex]['enddate'] = fromIdFlatData.startDate;
                    }
                    else {
                        if (fromDateArray1.length <= 1) {
                            if (isNullOrUndefined(collection[totaskId]['to'])) {
                                /* eslint-disable-next-line */
                                dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId]);
                            } else if (!isNullOrUndefined(collection[totaskId]['to'])) {
                                if (toIdFlatData.endDate > fromIdFlatData.startDate) {
                                    // eslint-disable-next-line
                                    dateDifference = -(this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.endDate,'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                                }
                                else {
                                    dateDifference = this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute',
                                                                           flatRecords[indexFromTaskId]);
                                }
                            }
                            // execute if the current calculated slack value is less than the previous slack value.
                            if (collection[fromTaskIdIndex]['slack'] > dateDifference && collection[fromTaskIdIndex]['slack'] !== 0) {
                                if (isNullOrUndefined(collection[totaskId]['to'])) {
                                    collection[fromTaskIdIndex]['slack'] = dateDifference;
                                } else if (!isNullOrUndefined(collection[totaskId]['to'])) {
                                    if (collection[totaskId]['slack'] + dateDifference < 0) {
                                        collection[fromTaskIdIndex]['slack'] = 0;
                                    }
                                    else {
                                        collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                                    }
                                }
                            }
                        } else if (fromDateArray1.length > 1) {
                            if (toIdFlatData.endDate > fromIdFlatData.endDate) {
                                if (fromIdFlatData.startDate > toIdFlatData.endDate) {
                                    /* eslint-disable-next-line */
                                    dateDifference = -(this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute', flatRecords[indexFromTaskId]));
                                }
                                else {
                                    // eslint-disable-next-line
                                    dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                                }
                            } else {
                                /* eslint-disable-next-line */
                                dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId]);
                            }
                            // execute if the current calculated slack value is less than the previous slack value.
                            if (collection[fromTaskIdIndex]['slack'] > dateDifference && collection[fromTaskIdIndex]['slack'] !== 0) {
                                collection[fromTaskIdIndex]['slack'] = collection[totaskId]['slack'] + dateDifference;
                                collection[fromTaskIdIndex]['slack'] = collection[fromTaskIdIndex]['slack'] - (offsetInMillSec);
                                if (collection[fromTaskIdIndex]['slack'] < 0) {
                                    collection[fromTaskIdIndex]['slack'] = 0;
                                }
                            }
                        }
                        collection[fromTaskIdIndex]['fs'] = 1;
                        collection[fromTaskIdIndex]['fsslack'] = collection[fromTaskIdIndex]['slack'];
                        collection[fromTaskIdIndex]['enddate'] = fromIdFlatData.startDate;
                    }
                }
                //It execute if the task is an auto mode task.
                else if (!fromIdFlatData.isAutoSchedule) {
                    dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId]);
                    if (isNullOrUndefined(collection[fromTaskIdIndex]['slack'])) {
                        collection[fromTaskIdIndex]['slack'] = dateDifference;
                    }
                    else if (collection[fromTaskIdIndex]['slack'] > dateDifference && collection[fromTaskIdIndex]['slack'] !== 0) {
                        collection[fromTaskIdIndex]['slack'] = dateDifference;
                    }
                }
                if (fromIdFlatData.endDate >= checkEndDate && fromIdFlatData.endDate <= checkEndDate) {
                    collection[fromTaskIdIndex]['slack'] = 0;
                }
            }
            if (collection[fromTaskIdIndex]['from']) {
                fromDataObject.push({
                    fromdata: collection[fromTaskIdIndex]['from'], todateID: collection[fromTaskIdIndex]['taskid'],
                    fromDataPredecessor: collection[fromTaskIdIndex]['fromPredecessor']
                });
            }
        }
        if (fromDataObject) {
            fromDataObject.splice(0, 1);
            if (fromDataObject.length > 0) {
                this.slackCalculation(fromDataObject, collection, collectionTaskId, checkEndDate, flatRecords, modelRecordIds);
            }
        }
    }
    private getSlackDuration(sDate: Date, eDate: Date, durationUnit: string, record: IGanttData) {
        const startDate: Date = this.parent.dateValidationModule.checkStartDate(new Date(sDate));
        const endDate: Date = this.parent.dateValidationModule.checkEndDate(new Date(eDate));
        if (this.parent.dataOperation['getTimeDifference'](startDate, endDate, true) <= 0) {
            return 0;
        }
        else {
            return this.parent.dataOperation.getDuration(startDate, endDate, durationUnit, record.ganttProperties.isAutoSchedule, true);
        }
    }
    /* eslint-disable-next-line */
    private finalCriticalPath(collection: object[], taskBeyondEnddate: number[], flatRecords: IGanttData[], modelRecordIds: string[], checkEndDate: Date) {
        let criticalPathIds: number[] = [];
        let index: number;
        let predecessorFrom: any;
        for (let x: number = collection.length - 1; x >= 0; x--) {
            if (this.parent.viewType === 'ProjectView') {
                index = modelRecordIds.indexOf(collection[x]['taskid'].toString());
            }
            else {
                index = this.resourceCollectionIds.indexOf(collection[x]['taskid'].toString());
            }
            const predecessorLength: IPredecessor[] = flatRecords[index].ganttProperties.predecessor;
            const noSlackValue: string = 0 + ' ' + flatRecords[index].ganttProperties.durationUnit;
            for (let i: number = 0; i < predecessorLength.length; i++) {
                let toID: number;
                if (this.parent.viewType === 'ProjectView') {
                    toID = this.parent.ids.indexOf(predecessorLength[i].to);
                }
                else {
                    toID = this.resourceCollectionIds.indexOf(predecessorLength[i].to);
                }
                let dateDifference: number;
                const currentData: ITaskData = flatRecords[index].ganttProperties;
                if (predecessorLength[i].type === 'FS') {
                    /* eslint-disable-next-line */
                    dateDifference = this.parent.dataOperation.getDuration(currentData.endDate,flatRecords[toID].ganttProperties.startDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                    if (dateDifference === 0 && index !== toID && flatRecords[index].slack !== noSlackValue) {
                        flatRecords[index].slack = flatRecords[toID].slack;
                        flatRecords[index].ganttProperties.slack = flatRecords[toID].slack;
                    }
                    else if (dateDifference !== 0 && index !== toID && flatRecords[toID].isCritical) {
                        flatRecords[index].slack = dateDifference + ' ' + flatRecords[index].ganttProperties.durationUnit;
                        flatRecords[index].ganttProperties.slack = dateDifference + ' ' + flatRecords[index].ganttProperties.durationUnit;
                    }
                }
                else if (predecessorLength[i].type === 'SF') {
                    /* eslint-disable-next-line */
                    dateDifference = this.parent.dataOperation.getDuration(currentData.startDate,flatRecords[toID].ganttProperties.endDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                }
                else if (predecessorLength[i].type === 'SS') {
                    /* eslint-disable-next-line */
                    dateDifference = this.parent.dataOperation.getDuration(currentData.startDate,flatRecords[toID].ganttProperties.startDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                }
                else {
                    /* eslint-disable-next-line */
                    dateDifference = this.parent.dataOperation.getDuration(currentData.endDate,flatRecords[toID].ganttProperties.endDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                }
                if (typeof(flatRecords[index][this.parent.taskFields.id]) === 'number') {
                    predecessorFrom = parseInt(predecessorLength[i].from, 10);
                } else {
                    predecessorFrom = predecessorLength[i].from
                }
                if (predecessorFrom === flatRecords[index][this.parent.taskFields.id] &&
                    flatRecords[toID].slack === noSlackValue && dateDifference <= 0) {
                    flatRecords[index].slack = noSlackValue;
                    flatRecords[index].ganttProperties.slack = noSlackValue;
                }
            }
            if (flatRecords[index].slack === noSlackValue) {
                if (flatRecords[index].ganttProperties.progress < 100) {
                    flatRecords[index].isCritical = true;
                    flatRecords[index].ganttProperties.isCritical = true;
                    this.criticalTasks.push(flatRecords[index]);
                    criticalPathIds.push(collection[x]['taskid']);
                }
            }
        }
        if (taskBeyondEnddate.length > 0) {
            for (let i: number = 0; i < taskBeyondEnddate.length; i++) {
                if (this.parent.viewType === 'ProjectView') {
                    index = modelRecordIds.indexOf(taskBeyondEnddate[i].toString());
                }
                else {
                    index = this.resourceCollectionIds.indexOf(taskBeyondEnddate[i].toString());
                }
                if (index !== -1 && flatRecords[index].ganttProperties.progress < 100) {
                    this.criticalTasks.push(flatRecords[index]);
                    criticalPathIds = criticalPathIds.concat(taskBeyondEnddate[i]);
                }
            }
        }
        return criticalPathIds;
    }
    /* eslint-disable-next-line */
    public criticalConnectorLine(criticalPathIds: number[], collection: object[], condition: boolean, collectionTaskId: number[]) {
        const ganttChartElement: HTMLElement = this.parent.ganttChartModule.chartElement;
        this.parent.removeCriticalPathStyles();
        for (let i: number = 0; i < criticalPathIds.length; i++) {
            let criticalData: IGanttData;
            if (this.parent.viewType === 'ProjectView') {
                criticalData = this.parent.currentViewData[this.parent.ids.indexOf(criticalPathIds[i].toString())];
            }
            else {
                let currentRecords: IGanttData[] = this.parent.currentViewData.filter((data: IGanttData) => {
                    return (data.ganttProperties.taskId).toString() == criticalPathIds[i].toString();
                });
                for (let i: number = 0; i < currentRecords.length; i++) {
                    if (currentRecords[i].ganttProperties.isCritical || currentRecords[i].ganttProperties.endDate >= this.maxEndDate) {
                        criticalData = currentRecords[i];
                    }
                }
            }
            const index: number = this.parent.currentViewData.indexOf(criticalData);
            const element: HTMLElement = this.parent.getRowByIndex(index);
            let taskClass: string;
            const columnFields: TaskFieldsModel = this.parent.taskFields;
            if (criticalData.parentItem) {
                const parentRecord: IGanttData[] = this.parent.currentViewData.filter((data: IGanttData) => {
                    return criticalData.parentItem.uniqueID == data.uniqueID;
                })
                const parentIndex: number = this.parent.currentViewData.indexOf(parentRecord[0]);
                const parentElement: HTMLElement = this.parent.getRowByIndex(parentIndex);
                let parentTaskbarElement = parentElement.querySelectorAll('.e-taskbar-main-container')
                for (let i: number = 0; i < parentTaskbarElement.length; i++) {
                    if (parentTaskbarElement[i].getAttribute('rowuniqueid') == criticalData['rowUniqueID']) {
                        addClass(parentTaskbarElement[i].querySelectorAll('.e-gantt-child-taskbar-inner-div'), cls.criticalChildTaskBarInnerDiv);
                    }
                }
            }
            /* eslint-disable-next-line */
            if (this.parent.allowUnscheduledTasks && !criticalData[columnFields.startDate] && !criticalData[columnFields.endDate] && criticalData[columnFields.duration]) {
                taskClass = cls.criticalUnscheduledTask;
            }
            else {
                taskClass = cls.criticalChildProgressBarInnerDiv;
            }
            if (element && (this.parent.viewType === 'ProjectView' || (this.parent.viewType === 'ResourceView' &&
               !criticalData.hasChildRecords))) {
                if (element.getElementsByClassName('e-milestone-top')[0]) {
                    addClass(element.querySelectorAll('.e-milestone-top'), cls.criticalMilestoneTop);
                }
                if (element.getElementsByClassName('e-milestone-bottom')[0]) {
                    addClass(element.querySelectorAll('.e-milestone-bottom'), cls.criticalMilestoneBottom);
                }
                if (element.getElementsByClassName('e-gantt-child-taskbar-inner-div').length > 0) {
                    addClass(element.querySelectorAll('.e-gantt-child-taskbar-inner-div'), cls.criticalChildTaskBarInnerDiv);
                }
                if (element.getElementsByClassName('e-gantt-child-progressbar-inner-div').length > 0) {
                    addClass(element.querySelectorAll('.e-gantt-child-progressbar-inner-div'), taskClass);
                }
            }
        }
        if (collection.length !== 0) {
            let index: number = 0;
            let currentdata: object;
            let checking: string[] = [];
            let checkint: any;
            let values: string[];
            let offsetValue: string;
            for (let i: number = 0; i < this.criticalPathCollection.length; i++) {
                index = collectionTaskId.indexOf(this.criticalPathCollection[i]);
                currentdata = collection[index];
                if (index !== -1 && currentdata['to']) {
                    checking = currentdata['to'].split(',');
                    for (let j: number = 0; j < checking.length; j++) {
                        values = checking[j].split('+');
                        offsetValue = '+';
                        if (checking[j].indexOf('-') >= 0) {
                            values = checking[j].split('-');
                            offsetValue = '-';
                        }
                        checkint = (values[0].replace(":", ""));
                        if (typeof(criticalPathIds[j]) === "number") {
                            checkint = parseInt(values[0], 10);
                        }
                        if (criticalPathIds.indexOf(checkint) !== -1) {
                            const lineElement: NodeList = this.parent.element.querySelectorAll('#ConnectorLineparent' +
                                currentdata['taskid'] + 'child' + checkint);
                            if (lineElement.length > 0) {
                                addClass(this.parent.element.querySelectorAll('#ConnectorLineparent' + currentdata['taskid'] + 'child' +
                                    checkint)[0].querySelectorAll('.e-line'), cls.criticalConnectorLine);
                                addClass(this.parent.element.querySelectorAll('#ConnectorLineparent' + currentdata['taskid'] + 'child' +
                                    checkint)[0].querySelectorAll('.e-connector-line-right-arrow'), cls.criticalConnectorLineRightArrow);
                                addClass(this.parent.element.querySelectorAll('#ConnectorLineparent' + currentdata['taskid'] + 'child' +
                                    checkint)[0].querySelectorAll('.e-connector-line-left-arrow'), cls.criticalConnectorLineLeftArrow);
                            }
                        }
                    }
                }
            }
        }
    }
    public getModuleName(): string {
        return 'criticalPath';
    }

    /**
     * Destroys the Critical Path of Gantt.
     *
     * @returns {void} .
     * @private
     */
    public destroy(): void {
        if (!this.parent.enableCriticalPath && this.parent.criticalPathModule) {
            this.parent.criticalPathModule = undefined;
        }
    }
}
