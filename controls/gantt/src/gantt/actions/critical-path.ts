import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { IGanttData, IPredecessor, ITaskData } from '../base/interface';
import { TaskFieldsModel } from '../models/task-fields-model';
import { addClass } from '@syncfusion/ej2-base';
import * as cls from '../base/css-constants';

/** @hidden */

export class CriticalPath {

    private parent: Gantt;
    private validatedids: number[] = [];
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
            let checkEndDate: Date = parentRecords[0].ganttProperties.endDate;
            let dateDifference: number = 0;
            /* eslint-disable-next-line */
            const checkBeyondEnddate: any[] = [];
            const totalPredecessorsCollection: IGanttData[] = [];
            const totalPredecessorsCollectionId: string[] = [];
            let predecessorIndex: number = 0;
            const taskBeyondEnddate: number[] = [];
            const predecessorTaskBeyondEnddate: number[] = [];
            const collection: object[] = [];
            const collectionTaskId: number[] = [];
            const fromDataObject: object[] = [];
            let criticalPathIds: number[] = [];
            this.criticalTasks = [];
            /* eslint-disable-next-line */
            if (parentRecords[0].ganttProperties.autoEndDate > parentRecords[0].ganttProperties.endDate && !parentRecords[0].ganttProperties.isAutoSchedule) {
                checkEndDate = parentRecords[0].ganttProperties.autoEndDate;
            }
            // Find the total project endDate
            for (let i: number = 1; i < parentRecords.length; i++) {
                if (parentRecords[i as number].ganttProperties.endDate >= checkEndDate) {
                    checkEndDate = parentRecords[i as number].ganttProperties.endDate;
                }
                if (!parentRecords[i as number].ganttProperties.isAutoSchedule) {
                    if (parentRecords[i as number].ganttProperties.autoEndDate >= checkEndDate) {
                        checkEndDate = parentRecords[i as number].ganttProperties.autoEndDate;
                    }
                }
            }
            this.maxEndDate = checkEndDate;
            // find the tasks that ends on total project end date that stored in checkBeyondEnddate
            // find the tasks with predecessor that stored in totalPredecessorsCollectionId.
            for (let j: number = 0; j < totalRecords.length; j++) {
                totalRecords[j as number].isCritical = false;
                totalRecords[j as number].ganttProperties.isCritical = false;
                /* eslint-disable-next-line */
                dateDifference = this.parent.dataOperation.getDuration(totalRecords[j as number].ganttProperties.endDate, checkEndDate, totalRecords[j as number].ganttProperties.durationUnit, totalRecords[j as number].ganttProperties.isAutoSchedule, totalRecords[j as number].ganttProperties.isMilestone);
                totalRecords[j as number].slack = dateDifference + ' ' + totalRecords[j as number].ganttProperties.durationUnit;
                totalRecords[j as number].ganttProperties.slack = dateDifference + ' ' + totalRecords[j as number].ganttProperties.durationUnit;
                if (totalRecords[j as number].ganttProperties.endDate >= checkEndDate) {
                    checkBeyondEnddate.push(totalRecords[j as number].ganttProperties.taskId);
                }
                if (totalRecords[j as number].ganttProperties.predecessor) {
                    if (totalRecords[j as number].ganttProperties.predecessor.length !== 0) {
                        totalPredecessorsCollection.push(totalRecords[j as number]);
                        totalPredecessorsCollectionId.push((totalRecords[j as number].ganttProperties.taskId));
                    }
                }
            }
            if (this.parent.viewType === 'ResourceView') {
                for (let i: number = 0; i < this.parent.taskIds.length; i++) {
                    this.resourceCollectionIds[i as number] = this.parent.taskIds[i as number].slice(1);
                }
            }
            // seperate the predecessor connected taskes from the individual taskes that ends on total project end date
            for (let k: number = 0; k < checkBeyondEnddate.length; k++) {
                if (totalPredecessorsCollectionId.indexOf(checkBeyondEnddate[k as number]) === -1) {
                    if (this.parent.viewType === 'ProjectView') {
                        predecessorIndex = modelIds.indexOf(checkBeyondEnddate[k as number].toString());
                    }
                    else {
                        const currentRecords: IGanttData[] = this.parent.currentViewData.filter((data: IGanttData) => {
                            return parseInt(data.ganttProperties.taskId, 10) === checkBeyondEnddate[k as number];
                        });
                        for (let i: number = 0; i < currentRecords.length; i++) {
                            if (!currentRecords[i as number].hasChildRecords &&
                                currentRecords[i as number].ganttProperties.endDate >= this.maxEndDate) {
                                predecessorIndex = currentRecords[i as number].index;
                            }
                        }
                    }
                    if (totalRecords[predecessorIndex as number].ganttProperties.progress < 100) {
                        totalRecords[predecessorIndex as number].isCritical = true;
                        totalRecords[predecessorIndex as number].ganttProperties.isCritical = true;
                    }
                    totalRecords[predecessorIndex as number]['slack'] = 0 + ' ' + totalRecords[predecessorIndex as number].ganttProperties.durationUnit;
                    taskBeyondEnddate.push(checkBeyondEnddate[k as number]);
                }
                else {
                    predecessorTaskBeyondEnddate.push(checkBeyondEnddate[k as number]);
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
                let tempTaskId: number | string;
                const currentIndex: number = x;
                const predecessor: IPredecessor[] = totalPredecessorsCollection[x as number].ganttProperties.predecessor;
                const individualPredecessorLength: number = totalPredecessorsCollection[x as number].ganttProperties.predecessor.length;
                /* eslint-disable-next-line */
                const taskid: any = ((totalPredecessorsCollection[x as number].ganttProperties.taskId));
                for (let y: number = 0; y < individualPredecessorLength; y++) {
                    if (!isNaN(Number(predecessor[y as number].from)) && typeof (taskid) !== 'string') {
                        tempTaskId = parseInt((predecessor[y as number].from), 10);
                    } else if (!isNaN(Number(predecessor[y as number].from)) && typeof (taskid) === 'string') {
                        tempTaskId = predecessor[y as number].from;
                    } else {
                        tempTaskId = predecessor[y as number].from;
                    }
                    if (tempTaskId === taskid) {
                        if (to === -1) {
                            if (!predecessor[y as number].offset) {
                                to = predecessor[y as number].to;
                                toPredecessor = predecessor[y as number].type;
                            } else {
                                to = predecessor[y as number].to + ':' + predecessor[y as number].offset + predecessor[y as number].offsetUnit;
                                toPredecessor = predecessor[y as number].type;
                            }
                        } else {
                            if (!predecessor[y as number].offset) {
                                to = to + ',' + predecessor[y as number].to;
                                toPredecessor = toPredecessor + ',' + predecessor[y as number].type;
                            } else {
                                to = to + ',' + predecessor[y as number].to + ':' + predecessor[y as number].offset +
                                    predecessor[y as number].offsetUnit;
                                toPredecessor = toPredecessor + ',' + predecessor[y as number].type;
                            }
                        }
                    }
                    if (!isNaN(Number(predecessor[y as number].to)) && typeof (taskid) !== 'string') {
                        tempTaskId = parseInt((predecessor[y as number].to), 10);
                    } else if (!isNaN(Number(predecessor[y as number].to)) && typeof (taskid) === 'string') {
                        tempTaskId = predecessor[y as number].to;
                    } else {
                        tempTaskId = predecessor[y as number].to;
                    }
                    if (tempTaskId === taskid) {
                        if (from === -1) {
                            if (!predecessor[y as number].offset) {
                                from = predecessor[y as number].from;
                                fromPredecessor = predecessor[y as number].type;
                            } else {
                                from = predecessor[y as number].from + ':' + predecessor[y as number].offset +
                                    predecessor[y as number].offsetUnit;
                                fromPredecessor = predecessor[y as number].type;
                            }
                        } else {
                            if (!predecessor[y as number].offset) {
                                from = from + ',' + predecessor[y as number].from;
                                fromPredecessor = fromPredecessor + ',' + predecessor[y as number].type;
                            } else {
                                from = from + ',' + predecessor[y as number].from + ':' + predecessor[y as number].offset +
                                    predecessor[y as number].offsetUnit;
                                fromPredecessor = fromPredecessor + ',' + predecessor[y as number].type;
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
                if (!collection[z as number]['to']) {
                    num = collection[z as number]['taskid'];
                    if (this.parent.viewType === 'ProjectView') {
                        indexEnddate = modelIds.indexOf(num.toString());
                    }
                    else {
                        indexEnddate = this.resourceCollectionIds.indexOf(num.toString());
                    }
                    const flatData: ITaskData = totalRecords[indexEnddate as number].ganttProperties;
                    dateDifference = this.parent.dataOperation.getDuration(flatData.endDate, checkEndDate, 'minute', flatData.isAutoSchedule, flatData.isMilestone);
                    collection[z as number]['slack'] = dateDifference;
                    collection[z as number]['fs'] = -1;
                    collection[z as number]['enddate'] = flatData.endDate;
                    endTask.push({
                        fromdata: collection[z as number]['from'], todateID: collection[z as number]['taskid'],
                        fromDataPredecessor: collection[z as number]['fromPredecessor']
                    });
                }
            }
            for (let k: number = 0; k < endTask.length; k++) {
                fromDataObject.push(endTask[k as number]);
                this.slackCalculation(fromDataObject, collection, collectionTaskId, checkEndDate, totalRecords, modelIds);
            }
            criticalPathIds = this.finalCriticalPath(collection, taskBeyondEnddate, totalRecords, modelIds, checkEndDate);
            this.validatedids = [];
            this.criticalPathCollection = criticalPathIds;
            this.detailPredecessorCollection = collection;
            this.predecessorCollectionTaskIds = collectionTaskId;
        }
        if (isCritical === false && this.parent.flatData.length > 0) {
            let pathIndex: number;
            this.parent.enableCriticalPath = false;
            for (let z: number = 0; z < this.criticalPathCollection.length; z++) {
                pathIndex = modelIds.indexOf(this.criticalPathCollection[z as number].toString());
                totalRecords[pathIndex as number].isCritical = false;
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
            fromDateArray1 = fromDateArray[i as number].split(':');
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
            let fromIdFlatData: ITaskData;
            if (indexFromTaskId !== -1) {
                fromIdFlatData = flatRecords[indexFromTaskId as number].ganttProperties;
            }
            const toIdFlatData: ITaskData = flatRecords[indexToTaskId as number].ganttProperties;
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
            if (fromIdFlatData) {
                // calculate slack value for the task contains predecessor connection in "finish to start".
                if (fromDataPredecessor[i as number] === 'FS') {
                    if (fromIdFlatData.endDate > toIdFlatData.startDate) {
                        dateDifference = -(this.parent.dataOperation.getDuration(toIdFlatData.startDate, fromIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                    }
                    else {
                        dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.endDate, toIdFlatData.startDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                    }

                    // execute if the slack value is not set initially.
                    if (isNullOrUndefined(collection[fromTaskIdIndex as number]['slack'])) {
                        // execute if the offset value is not given.
                        if (fromDateArray1.length <= 1) {
                            if (collection[totaskId as number]['slack'] + dateDifference <= 0) {
                                collection[fromTaskIdIndex as number]['slack'] = 0;
                            }
                            else {
                                collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                            }
                        }
                    }
                    // execute if the current calculated slack value is less than the previous slack value.
                    else if (collection[fromTaskIdIndex as number]['slack'] > dateDifference &&
                        collection[fromTaskIdIndex as number]['slack'] !== 0) {
                        // execute if the offset value is not given.
                        if (fromDateArray1.length <= 1) {
                            if (collection[totaskId as number]['slack'] + dateDifference <= 0) {
                                collection[fromTaskIdIndex as number]['slack'] = 0;
                            }
                            else {
                                collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                            }
                        }
                    }
                    // execute if the offset value is given.
                    if (fromDateArray1.length > 1) {
                        collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                        collection[fromTaskIdIndex as number]['slack'] = collection[fromTaskIdIndex as number]['slack'] - (offsetInMillSec);
                        if (collection[fromTaskIdIndex as number]['slack'] <= 0) {
                            collection[fromTaskIdIndex as number]['slack'] = 0;
                        }
                    }
                    collection[fromTaskIdIndex as number]['fs'] = 1;
                    collection[fromTaskIdIndex as number]['fsslack'] = collection[fromTaskIdIndex as number]['slack'];
                    collection[fromTaskIdIndex as number]['enddate'] = fromIdFlatData.startDate;
                    if (fromIdFlatData.endDate >= checkEndDate) {
                        collection[fromTaskIdIndex as number]['slack'] = 0;
                    }
                }

                //  calculate slack value for the task contains predecessor connection in "start to start".
                if (fromDataPredecessor[i as number] === 'SS') {
                    // It execute if the task is in auto mode.
                    if (fromIdFlatData.isAutoSchedule) {
                        if (fromIdFlatData.startDate > toIdFlatData.startDate) {
                            dateDifference = -(this.parent.dataOperation.getDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                        }
                        else {
                            dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.startDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                        }
                        // It execute while the slack value is not set to the corresponding task.
                        if (isNullOrUndefined(collection[fromTaskIdIndex as number]['slack'])) {
                            if (fromDateArray1.length <= 1) {
                                if (collection[totaskId as number]['slack'] + dateDifference <= 0) {
                                    collection[fromTaskIdIndex as number]['slack'] = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                                }
                            }
                        }
                        //It execute while already the slack value is set and it is higher than the datedifference.
                        else if (collection[fromTaskIdIndex as number]['slack'] > dateDifference &&
                            collection[fromTaskIdIndex as number]['slack'] !== 0) {
                            if (fromDateArray1.length <= 1) {
                                if (collection[totaskId as number]['slack'] + dateDifference <= 0) {
                                    collection[fromTaskIdIndex as number]['slack'] = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                                }
                            }
                        }
                        // execute if the offset value is given.
                        if (fromDateArray1.length > 1) {
                            collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                            collection[fromTaskIdIndex as number]['slack'] = collection[fromTaskIdIndex as number]['slack'] - (offsetInMillSec);
                            if (collection[fromTaskIdIndex as number]['slack'] <= 0) {
                                collection[fromTaskIdIndex as number]['slack'] = 0;
                            }
                        }
                        collection[fromTaskIdIndex as number]['fs'] = 1;
                        collection[fromTaskIdIndex as number]['fsslack'] = collection[fromTaskIdIndex as number]['slack'];
                        collection[fromTaskIdIndex as number]['enddate'] = fromIdFlatData.startDate;
                    }
                    // It execute if the task is in not an auto mode task.
                    else if (!fromIdFlatData.isAutoSchedule) {
                        dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId as number]);
                        if (isNullOrUndefined(collection[fromTaskIdIndex as number]['slack'])) {
                            collection[fromTaskIdIndex as number]['slack'] = dateDifference;
                        }
                        else if (collection[fromTaskIdIndex as number]['slack'] > dateDifference &&
                            collection[fromTaskIdIndex as number]['slack'] !== 0) {
                            collection[fromTaskIdIndex as number]['slack'] = dateDifference;
                        }
                    }
                    if (fromIdFlatData.endDate >= checkEndDate && fromIdFlatData.endDate <= checkEndDate) {
                        collection[fromTaskIdIndex as number]['slack'] = 0;
                    }
                }

                //  calculate slack value for the task contains predecessor connection in "finish to finish".
                if (fromDataPredecessor[i as number] === 'FF') {
                    // execute if the previous task is from finish to start or finish to finish state.
                    if (collection[totaskId as number]['fs'] === 1 || collection[totaskId as number]['ff'] === 1 ||
                        collection[totaskId as number]['fs'] === -1) {
                        if (collection[totaskId as number]['fs'] === 1 || collection[totaskId as number]['ff'] === 1) {
                            prevTaskEnddate = toIdFlatData.endDate;
                            ffslack = collection[totaskId as number]['slack'];
                        }
                        if (collection[totaskId as number]['fs'] === -1) {
                            prevTaskEnddate = collection[totaskId as number]['enddate'];
                            ffslack = collection[totaskId as number]['slack'];
                        }
                        if (prevTaskEnddate > fromIdFlatData.endDate) {
                            dateDifference = -(this.getSlackDuration(fromIdFlatData.endDate, prevTaskEnddate, 'minute',
                                                                     flatRecords[indexFromTaskId as number]));
                        }
                        else {
                            dateDifference = this.getSlackDuration(prevTaskEnddate, fromIdFlatData.endDate, 'minute',
                                                                   flatRecords[indexFromTaskId as number]);
                        }
                        // set the slack value if the slack value is not set initially.
                        if (isNullOrUndefined(collection[fromTaskIdIndex as number]['slack'])) {
                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                if (ffslack - dateDifference < 0) {
                                    collection[fromTaskIdIndex as number]['slack'] = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex as number]['slack'] = ffslack - dateDifference;
                                }
                            }
                        }
                        // overright the slack value if the current calculated slack value is less than the previous slack value.
                        else if (collection[fromTaskIdIndex as number]['slack'] > dateDifference && collection[fromTaskIdIndex as number]['slack'] !== 0) {
                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                if (ffslack - dateDifference < 0) {
                                    collection[fromTaskIdIndex as number]['slack'] = 0;
                                }
                                else {
                                    collection[fromTaskIdIndex as number]['slack'] = ffslack - dateDifference;
                                }
                            }
                        }
                        // execute if the offset value is given.
                        if (fromDateArray1.length > 1) {
                            collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] - dateDifference;
                            collection[fromTaskIdIndex as number]['slack'] = collection[fromTaskIdIndex as number]['slack'] - (offsetInMillSec);
                            if (collection[fromTaskIdIndex as number]['slack'] <= 0) {
                                collection[fromTaskIdIndex as number]['slack'] = 0;
                            }
                        }
                        collection[fromTaskIdIndex as number]['ff'] = 1;
                        collection[fromTaskIdIndex as number]['enddate'] = prevTaskEnddate;
                        collection[fromTaskIdIndex as number]['fsslack'] = ffslack;
                    }
                    if (fromIdFlatData.endDate >= checkEndDate && fromIdFlatData.endDate <= checkEndDate) {
                        collection[fromTaskIdIndex as number]['slack'] = 0;
                    }
                }

                //  calculate slack value for the task contains predecessor connection in "start to finish".
                if (fromDataPredecessor[i as number] === 'SF') {
                    //It execute if the task is an auto mode task.
                    if (fromIdFlatData.isAutoSchedule) {
                        //execute if the slack value is not set initially.
                        if (isNullOrUndefined(collection[fromTaskIdIndex as number]['slack'])) {
                            // execute if the offset value is not given.
                            if (fromDateArray1.length <= 1) {
                                // execute if the previous task does no has sucessor.
                                if (isNullOrUndefined(collection[totaskId as number]['to'])) {
                                    dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute',
                                                                           flatRecords[indexFromTaskId as number]);
                                    collection[fromTaskIdIndex as number]['slack'] = dateDifference;
                                }
                                // execute if the previous task has sucessor.
                                else if (!isNullOrUndefined(collection[totaskId as number]['to'])) {
                                    if (toIdFlatData.endDate > fromIdFlatData.startDate) {
                                        dateDifference = -(this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                                    }
                                    else {
                                        dateDifference = this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute',
                                                                               flatRecords[indexFromTaskId as number]);
                                    }
                                    if (collection[totaskId as number]['slack'] + dateDifference <= 0) {
                                        collection[fromTaskIdIndex as number]['slack'] = 0;
                                    }
                                    else {
                                        collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                                    }
                                }
                            }
                            // execute if the offset value is given.
                            else if (fromDateArray1.length > 1) {
                                if (toIdFlatData.endDate >= fromIdFlatData.endDate) {
                                    if (fromIdFlatData.startDate > toIdFlatData.endDate) {
                                        dateDifference = -(this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute', flatRecords[indexFromTaskId as number]));
                                    }
                                    else {
                                        dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                                    }
                                } else {
                                    dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute',
                                                                           flatRecords[indexFromTaskId as number]);
                                }
                                collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                                collection[fromTaskIdIndex as number]['slack'] = collection[fromTaskIdIndex as number]['slack'] - (offsetInMillSec);
                                if (collection[fromTaskIdIndex as number]['slack'] <= 0) {
                                    collection[fromTaskIdIndex as number]['slack'] = 0;
                                }
                            }
                            collection[fromTaskIdIndex as number]['fs'] = 1;
                            collection[fromTaskIdIndex as number]['fsslack'] = collection[fromTaskIdIndex as number]['slack'];
                            collection[fromTaskIdIndex as number]['enddate'] = fromIdFlatData.startDate;
                        }
                        else {
                            if (fromDateArray1.length <= 1) {
                                if (isNullOrUndefined(collection[totaskId as number]['to'])) {
                                    dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId as number]);
                                } else if (!isNullOrUndefined(collection[totaskId as number]['to'])) {
                                    if (toIdFlatData.endDate > fromIdFlatData.startDate) {
                                        dateDifference = -(this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone));
                                    }
                                    else {
                                        dateDifference = this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute',
                                                                               flatRecords[indexFromTaskId as number]);
                                    }
                                }
                                // execute if the current calculated slack value is less than the previous slack value.
                                if (collection[fromTaskIdIndex as number]['slack'] > dateDifference && collection[fromTaskIdIndex as number]['slack'] !== 0) {
                                    if (isNullOrUndefined(collection[totaskId as number]['to'])) {
                                        collection[fromTaskIdIndex as number]['slack'] = dateDifference;
                                    } else if (!isNullOrUndefined(collection[totaskId as number]['to'])) {
                                        if (collection[totaskId as number]['slack'] + dateDifference <= 0) {
                                            collection[fromTaskIdIndex as number]['slack'] = 0;
                                        }
                                        else {
                                            collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                                        }
                                    }
                                }
                            } else if (fromDateArray1.length > 1) {
                                if (toIdFlatData.endDate > fromIdFlatData.endDate) {
                                    if (fromIdFlatData.startDate > toIdFlatData.endDate) {
                                        dateDifference = -(this.getSlackDuration(toIdFlatData.endDate, fromIdFlatData.startDate, 'minute', flatRecords[indexFromTaskId as number]));
                                    }
                                    else {
                                        dateDifference = this.parent.dataOperation.getDuration(fromIdFlatData.startDate, toIdFlatData.endDate, 'minute', fromIdFlatData.isAutoSchedule, fromIdFlatData.isMilestone);
                                    }
                                } else {
                                    dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId as number]);
                                }
                                // execute if the current calculated slack value is less than the previous slack value.
                                if (collection[fromTaskIdIndex as number]['slack'] > dateDifference && collection[fromTaskIdIndex as number]['slack'] !== 0) {
                                    collection[fromTaskIdIndex as number]['slack'] = collection[totaskId as number]['slack'] + dateDifference;
                                    collection[fromTaskIdIndex as number]['slack'] = collection[fromTaskIdIndex as number]['slack'] - (offsetInMillSec);
                                    if (collection[fromTaskIdIndex as number]['slack'] <= 0) {
                                        collection[fromTaskIdIndex as number]['slack'] = 0;
                                    }
                                }
                            }
                            collection[fromTaskIdIndex as number]['fs'] = 1;
                            collection[fromTaskIdIndex as number]['fsslack'] = collection[fromTaskIdIndex as number]['slack'];
                            collection[fromTaskIdIndex as number]['enddate'] = fromIdFlatData.startDate;
                        }
                    }
                    //It execute if the task is an auto mode task.
                    else if (!fromIdFlatData.isAutoSchedule) {
                        dateDifference = this.getSlackDuration(fromIdFlatData.endDate, checkEndDate, 'minute', flatRecords[indexFromTaskId as number]);
                        if (isNullOrUndefined(collection[fromTaskIdIndex as number]['slack'])) {
                            collection[fromTaskIdIndex as number]['slack'] = dateDifference;
                        }
                        else if (collection[fromTaskIdIndex as number]['slack'] > dateDifference && collection[fromTaskIdIndex as number]['slack'] !== 0) {
                            collection[fromTaskIdIndex as number]['slack'] = dateDifference;
                        }
                    }
                    if (fromIdFlatData.endDate >= checkEndDate && fromIdFlatData.endDate <= checkEndDate) {
                        collection[fromTaskIdIndex as number]['slack'] = 0;
                    }
                }
                if (collection[fromTaskIdIndex as number]['from']) {
                    fromDataObject.push({
                        fromdata: collection[fromTaskIdIndex as number]['from'], todateID: collection[fromTaskIdIndex as number]['taskid'],
                        fromDataPredecessor: collection[fromTaskIdIndex as number]['fromPredecessor']
                    });
                }
            }
        }
        if (fromDataObject) {
            fromDataObject.splice(0, 1);
            if (fromDataObject.length > 0) {
                this.slackCalculation(fromDataObject, collection, collectionTaskId, checkEndDate, flatRecords, modelRecordIds);
            }
        }
    }
    private getSlackDuration(sDate: Date, eDate: Date, durationUnit: string, record: IGanttData): number {
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
    private updateCriticalTasks(record: IGanttData, criticalPathIds: any): void {
        for (let i: number = 0; i < record.ganttProperties.predecessor.length; i++) {
            let fromRecord: IGanttData;
            if (this.parent.viewType === 'ProjectView') {
                fromRecord = this.parent.getRecordByID(record.ganttProperties.predecessor[i as number].from);
            }
            else {
                const resourceIndex: number = this.resourceCollectionIds.indexOf(
                    record.ganttProperties.predecessor[i as number].from.toString());
                fromRecord = this.parent.flatData[resourceIndex as number];
            }
            let durationDiff: number;
            if (record.ganttProperties.endDate.getTime() >= this.maxEndDate.getTime()) {
                record.ganttProperties.slack = record.slack = 0 + ' ' + record.ganttProperties.durationUnit;
                if (record.ganttProperties.progress < 100) {
                    record.isCritical = true;
                    record.ganttProperties.isCritical = true;
                    if (criticalPathIds.indexOf(record.ganttProperties.taskId) === -1) {
                        criticalPathIds.push(record.ganttProperties.taskId);
                    }
                }
            }
            if (fromRecord) {
                if (record.ganttProperties.predecessor[i as number].type === 'FS') {
                    durationDiff = this.parent.dataOperation.getDuration(
                        fromRecord.ganttProperties.endDate, record.ganttProperties.startDate,
                        fromRecord.ganttProperties.durationUnit, fromRecord.ganttProperties.isAutoSchedule, true);
                }
                else if (record.ganttProperties.predecessor[i as number].type === 'SS') {
                    durationDiff = this.parent.dataOperation.getDuration(
                        fromRecord.ganttProperties.startDate, record.ganttProperties.startDate,
                        fromRecord.ganttProperties.durationUnit, fromRecord.ganttProperties.isAutoSchedule, true);
                }
                else if (record.ganttProperties.predecessor[i as number].type === 'FF') {
                    durationDiff = this.parent.dataOperation.getDuration(
                        fromRecord.ganttProperties.endDate, record.ganttProperties.endDate,
                        fromRecord.ganttProperties.durationUnit, fromRecord.ganttProperties.isAutoSchedule, true);
                }
                else if (record.ganttProperties.predecessor[i as number].type === 'SF') {
                    durationDiff = this.parent.dataOperation.getDuration(
                        record.ganttProperties.endDate, fromRecord.ganttProperties.startDate,
                        fromRecord.ganttProperties.durationUnit, fromRecord.ganttProperties.isAutoSchedule, true);
                }
                if (durationDiff >= 0 && this.validatedids.indexOf(parseInt(fromRecord.ganttProperties.taskId, 10)) === -1 &&
                fromRecord.ganttProperties.taskId !== record.ganttProperties.taskId) {
                    fromRecord.ganttProperties.slack = record.ganttProperties.slack;
                    fromRecord.slack = record.slack;
                    fromRecord.isCritical = record.ganttProperties.isCritical;
                    fromRecord.ganttProperties.isCritical = record.ganttProperties.isCritical;
                    if (criticalPathIds.indexOf(fromRecord.ganttProperties.taskId) === -1 && fromRecord.ganttProperties.isCritical &&
                    fromRecord.ganttProperties.progress < 100) {
                        criticalPathIds.push(fromRecord.ganttProperties.taskId);
                        this.validatedids.push(parseInt(fromRecord.ganttProperties.taskId, 10));
                        if (this.criticalTasks.indexOf(fromRecord) === -1) {
                            this.criticalTasks.push(fromRecord);
                        }
                    }
                    if (fromRecord.ganttProperties.predecessorsName) {
                        this.updateCriticalTasks(fromRecord, criticalPathIds);
                    }
                }
            }
        }
    }
    /* eslint-disable-next-line */
    private finalCriticalPath(collection: object[], taskBeyondEnddate: number[], flatRecords: IGanttData[], modelRecordIds: string[], checkEndDate: Date) {
        /* eslint-disable-next-line */
        let criticalPathIds: any = [];
        let index: number;
        let predecessorFrom: number | string;
        for (let x: number = collection.length - 1; x >= 0; x--) {
            if (this.parent.viewType === 'ProjectView') {
                index = modelRecordIds.indexOf(collection[x as number]['taskid'].toString());
            }
            else {
                index = this.resourceCollectionIds.indexOf(collection[x as number]['taskid'].toString());
            }
            const predecessorLength: IPredecessor[] = flatRecords[index as number].ganttProperties.predecessor;
            const noSlackValue: string = 0 + ' ' + flatRecords[index as number].ganttProperties.durationUnit;
            if (predecessorLength && predecessorLength.length > 0) {
                for (let i: number = predecessorLength.length - 1; i >= 0; i--) {
                    let toID: number;
                    if (this.parent.viewType === 'ProjectView') {
                        toID = this.parent.ids.indexOf(predecessorLength[i as number].to);
                    }
                    else {
                        toID = this.resourceCollectionIds.indexOf(predecessorLength[i as number].to);
                    }
                    let dateDifference: number;
                    const currentData: ITaskData = flatRecords[index as number].ganttProperties;
                    if (toID !== -1) {
                        if (predecessorLength[i as number].type === 'FS') {
                            if (predecessorLength[i as number].to !== currentData.taskId.toString() || this.parent.viewType === 'ResourceView') {
                                /* eslint-disable-next-line */
                                dateDifference = this.parent.dataOperation.getDuration(currentData.endDate, flatRecords[toID as number].ganttProperties.startDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                            }
                            else {
                                toID = this.parent.ids.indexOf(predecessorLength[i as number].from);
                                if (toID !== -1) {
                                    dateDifference = this.parent.dataOperation.getDuration(
                                        flatRecords[toID as number].ganttProperties.endDate, currentData.startDate,
                                        currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                                    if (dateDifference === 0 && index !== toID && flatRecords[index as number].slack === noSlackValue) {
                                        flatRecords[toID as number].slack = flatRecords[index as number].slack;
                                        flatRecords[toID as number].ganttProperties.slack = flatRecords[index as number].slack;
                                    }
                                }
                            }
                            if (toID !== -1) {
                                if (dateDifference === 0 && index !== toID && flatRecords[index as number].slack !== noSlackValue) {
                                    flatRecords[index as number].slack = flatRecords[toID as number].slack;
                                    flatRecords[index as number].ganttProperties.slack = flatRecords[toID as number].slack;
                                }
                                else if (dateDifference !== 0 && index !== toID && flatRecords[toID as number].isCritical) {
                                    flatRecords[index as number].slack = dateDifference + ' ' + flatRecords[index as number].ganttProperties.durationUnit;
                                    flatRecords[index as number].ganttProperties.slack = dateDifference + ' ' + flatRecords[index as number].ganttProperties.durationUnit;
                                }
                            }
                        }
                        else if (predecessorLength[i as number].type === 'SF') {
                            /* eslint-disable-next-line */
                            dateDifference = this.parent.dataOperation.getDuration(currentData.startDate, flatRecords[toID as number].ganttProperties.endDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                        }
                        else if (predecessorLength[i as number].type === 'SS') {
                            /* eslint-disable-next-line */
                            dateDifference = this.parent.dataOperation.getDuration(currentData.startDate, flatRecords[toID as number].ganttProperties.startDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                        }
                        else {
                            /* eslint-disable-next-line */
                            dateDifference = this.parent.dataOperation.getDuration(currentData.endDate, flatRecords[toID as number].ganttProperties.endDate, currentData.durationUnit, currentData.isAutoSchedule, currentData.isMilestone);
                        }
                        if (typeof (flatRecords[index as number][this.parent.taskFields.id]) === 'number') {
                            predecessorFrom = parseInt(predecessorLength[i as number].from, 10);
                        } else {
                            predecessorFrom = predecessorLength[i as number].from;
                        }
                        if (predecessorFrom === flatRecords[index as number][this.parent.taskFields.id] &&
                            flatRecords[toID as number].slack === noSlackValue && dateDifference <= 0) {
                            flatRecords[index as number].slack = noSlackValue;
                            flatRecords[index as number].ganttProperties.slack = noSlackValue;
                        }
                    }
                }
            }
            if (flatRecords[index as number].slack === noSlackValue) {
                if (flatRecords[index as number].ganttProperties.progress < 100) {
                    flatRecords[index as number].isCritical = true;
                    flatRecords[index as number].ganttProperties.isCritical = true;
                    if (this.criticalTasks.indexOf(flatRecords[index as number]) === -1) {
                        this.criticalTasks.push(flatRecords[index as number]);
                    }
                    if (criticalPathIds.indexOf(collection[x as number]['taskid']) === -1) {
                        criticalPathIds.push(collection[x as number]['taskid']);
                    }
                }
            }
            if (flatRecords[index as number].ganttProperties.predecessor &&
                flatRecords[index as number].ganttProperties.predecessor.length > 0) {
                this.updateCriticalTasks(flatRecords[index as number], criticalPathIds);
            }
        }
        if (taskBeyondEnddate.length > 0) {
            for (let i: number = 0; i < taskBeyondEnddate.length; i++) {
                if (this.parent.viewType === 'ProjectView') {
                    index = modelRecordIds.indexOf(taskBeyondEnddate[i as number].toString());
                }
                else {
                    index = this.resourceCollectionIds.indexOf(taskBeyondEnddate[i as number].toString());
                }
                if (index !== -1 && flatRecords[index as number].ganttProperties.progress < 100) {
                    this.criticalTasks.push(flatRecords[index as number]);
                    if (criticalPathIds.indexOf(taskBeyondEnddate[i as number]) === -1) {
                        criticalPathIds = criticalPathIds.concat(taskBeyondEnddate[i as number]);
                    }
                }
            }
        }
        return criticalPathIds;
    }
    /* eslint-disable-next-line */
    public criticalConnectorLine(criticalPathIds: number[], collection: object[], condition: boolean, collectionTaskId: number[]) {
        this.parent.removeCriticalPathStyles();
        for (let i: number = 0; i < criticalPathIds.length; i++) {
            let criticalData: IGanttData;
            if (this.parent.viewType === 'ProjectView') {
                criticalData = this.parent.flatData[this.parent.ids.indexOf(criticalPathIds[i as number].toString())];
            }
            else {
                const currentRecords: IGanttData[] = this.parent.flatData.filter((data: IGanttData) => {
                    return (data.ganttProperties.taskId).toString() === criticalPathIds[i as number].toString();
                });
                for (let i: number = 0; i < currentRecords.length; i++) {
                    if (currentRecords[i as number].ganttProperties.isCritical ||
                        currentRecords[i as number].ganttProperties.endDate >= this.maxEndDate) {
                        criticalData = currentRecords[i as number];
                    }
                }
            }
            const index: number = this.parent.currentViewData.indexOf(criticalData);
            const element: HTMLElement = this.parent.getRowByIndex(index);
            let taskClass: string;
            const columnFields: TaskFieldsModel = this.parent.taskFields;
            if (criticalData && criticalData.parentItem) {
                const parentRecord: IGanttData[] = this.parent.currentViewData.filter((data: IGanttData) => {
                    return criticalData.parentItem.uniqueID === data.uniqueID;
                });
                const parentIndex: number = this.parent.flatData.indexOf(parentRecord[0]);
                const parentElement: HTMLElement = this.parent.getRowByIndex(parentIndex);
                if (parentElement) {
                    const parentTaskbarElement: NodeListOf<Element> = parentElement.querySelectorAll('.e-taskbar-main-container');
                    for (let i: number = 0; i < parentTaskbarElement.length; i++) {
                        if (parentTaskbarElement[i as number].getAttribute('rowuniqueid') === criticalData['rowUniqueID']) {
                            addClass(parentTaskbarElement[i as number].querySelectorAll('.e-gantt-child-taskbar-inner-div'), cls.criticalChildTaskBarInnerDiv);
                        }
                    }
                }
            }
            /* eslint-disable-next-line */
            if (this.parent.allowUnscheduledTasks && criticalData && !criticalData[columnFields.startDate] && !criticalData[columnFields.endDate] && criticalData[columnFields.duration]) {
                taskClass = cls.criticalUnscheduledTask;
            }
            else {
                taskClass = cls.criticalChildProgressBarInnerDiv;
            }
            if (element && (this.parent.viewType === 'ProjectView' || (this.parent.viewType === 'ResourceView' &&
                !criticalData.hasChildRecords))) {
                if (element.getElementsByClassName('e-gantt-milestone')[0]) {
                    addClass(element.querySelectorAll('.e-gantt-milestone'), cls.criticalMilestone);
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
            /* eslint-disable-next-line */
            let checkint: any;
            let values: string[];
            for (let i: number = 0; i < this.criticalPathCollection.length; i++) {
                index = collectionTaskId.indexOf(this.criticalPathCollection[i as number]);
                currentdata = collection[index as number];
                if (index !== -1 && currentdata['to']) {
                    checking = currentdata['to'].split(',');
                    for (let j: number = 0; j < checking.length; j++) {
                        values = checking[j as number].split('+');
                        if (checking[j as number].indexOf('-') >= 0) {
                            values = checking[j as number].split('-');
                        }
                        checkint = (values[0].replace(':', ''));
                        if (typeof (criticalPathIds[j as number]) === 'number') {
                            checkint = parseInt(values[0], 10);
                        }
                        if (criticalPathIds.indexOf(checkint) !== -1) {
                            const taskIdString: string = String(currentdata['taskid']);
                            const checkintString: string = String(checkint);
                            const lineElement: NodeList = this.parent.element.querySelectorAll('#ConnectorLineparent' +
                                taskIdString.replace(/([.])/g, '\\$1') + 'child' + checkintString.replace(/([.])/g, '\\$1'));
                            if (lineElement.length > 0) {
                                addClass(this.parent.element.querySelectorAll('#ConnectorLineparent' + taskIdString.replace(/([.])/g, '\\$1') + 'child' +
                                checkintString.replace(/([.])/g, '\\$1'))[0].querySelectorAll('.e-connector-line'), cls.criticalConnectorLineSVG);
                                addClass(this.parent.element.querySelectorAll('#ConnectorLineparent' + taskIdString.replace(/([.])/g, '\\$1') + 'child' +
                                checkintString.replace(/([.])/g, '\\$1'))[0].querySelectorAll('.e-connector-line-arrow'), cls.criticalConnectorArrowSVG);
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
