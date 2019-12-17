/**
 * batch-edit.ts file
 */
import { ITreeData } from '../base/interface';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeGrid } from '../base';
import * as events from '../base/constant';
import { BeforeBatchSaveArgs } from '@syncfusion/ej2-grids';
import { editAction } from './crud-actions';

export function batchSaveAction(control: TreeGrid) : void {
  let i: number; let batchChanges: Object = control.getBatchChanges();
  let addedRecords: string = 'addedRecords';
  if (batchChanges[addedRecords].length) {
    for (i = 0; i < batchChanges[addedRecords].length; i++) {
        control.notify(events.crudAction, { value: batchChanges[addedRecords][i], action: 'batchsave' });
    }
  }
}

export function beforeBatchSaveAction(e: BeforeBatchSaveArgs, control: TreeGrid): void {
  let changeRecords: string = 'changedRecords';
  let changedRecords: ITreeData[] = e.batchChanges[changeRecords];
  if (e.batchChanges[changeRecords].length) {
    let selectedIndex: number; let addRowIndex: number; let columnName: string;
    let isSelfReference: boolean = !isNullOrUndefined(control.parentIdMapping);
    for (let i: number = 0; i < changedRecords.length; i++) {
         editAction({ value: <ITreeData>changedRecords[i], action: 'edit' }, control,
                    isSelfReference, addRowIndex, selectedIndex, columnName);
    }
  }
}