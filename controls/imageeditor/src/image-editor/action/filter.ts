import { ImageEditor, ImageFinetuneOption, CurrentObject, SelectionPoint, Point, ActivePoint, Adjustment, FinetuneSettingsModel } from '../index';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { FrameValue } from '../base';

export class Filter {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private adjustmentLevel: Adjustment = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0, blur: 0,
        exposure: 0, transparency: 100, sharpen: false, bw: false}; // for toolbar slider value
    private tempAdjustmentLevel: Adjustment = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0, blur: 0,
        exposure: 0, transparency: 100, sharpen: false, bw: false}; // for temp toolbar slider value
    private adjustmentValue: string = ''; // for internal slider value
    private isBrightnessAdjusted: boolean = false;
    private bevelFilter: string = 'none';
    private tempAdjVal: Adjustment = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0, blur: 0,
        exposure: 0, transparency: 100, sharpen: false, bw: false};
    private tempFilVal: string = '';

    constructor(parent: ImageEditor) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on('filter', this.filter, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('filter', this.filter);
        this.parent.off('destroyed', this.destroy);
    }

    private filter(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        this.updatePrivateVariables();
        switch (args.prop) {
        case 'finetuneImage':
            this.finetuneImage(args.value['option'] as ImageFinetuneOption, args.value['value'] as number);
            break;
        case 'applyImageFilter':
            this.setFilter(args.value['option'] as string);
            break;
        case 'update-finetunes':
            this.updateFinetunes();
            break;
        case 'set-adjustment':
            this.setAdjustment(args.value['operation'] as string);
            break;
        case 'initFilter':
            this.initFilter();
            break;
        case 'setCurrAdjValue':
            this.setCurrAdjValue(args.value['type'] as string, args.value['value'] as number);
            break;
        case 'updateAdj':
            this.updateAdj(args.value['type'] as string, args.value['value'] as number, args.value['isPreview'],
                           args.value['ctx']);
            break;
        case 'getCurrentObj':
            this.getCurrentObj(args.value['object']);
            break;
        case 'getAdjustmentLevel':
            if (isNullOrUndefined(this.parent.activeObj.opacity)) {
                this.adjustmentLevel.transparency = 100;
            } else {
                this.adjustmentLevel.transparency = this.parent.activeObj.opacity * 100;
            }
            args.value['obj']['adjustmentLevel'] = this.adjustmentLevel;
            break;
        case 'setAdjustmentLevel':
            this.adjustmentLevel = args.value['adjustmentLevel'];
            break;
        case 'getTempAdjustmentLevel':
            args.value['obj']['tempAdjustmentLevel'] = this.tempAdjustmentLevel;
            break;
        case 'setTempAdjustmentLevel':
            this.tempAdjustmentLevel = args.value['tempAdjustmentLevel'];
            break;
        case 'setAdjustmentValue':
            this.adjustmentValue = args.value['adjustmentValue'];
            break;
        case 'getBrightnessAdjusted':
            args.value['obj']['isBrightnessAdjusted'] = this.isBrightnessAdjusted;
            break;
        case 'setBrightnessAdjusted':
            this.isBrightnessAdjusted = args.value['isBrightnessAdjusted'];
            if (this.parent.currentFilter.split('_') && this.parent.currentFilter.split('_')[1] === 'cold') {
                this.isBrightnessAdjusted = false;
            }
            break;
        case 'getBevelFilter':
            args.value['obj']['bevelFilter'] = this.bevelFilter;
            break;
        case 'setBevelFilter':
            this.bevelFilter = args.value['bevelFilter'];
            break;
        case 'setTempAdjVal':
            this.tempAdjVal = extend({}, this.adjustmentLevel, {}, true) as Adjustment;
            break;
        case 'setTempFilVal':
            this.tempFilVal = this.parent.currentFilter;
            break;
        case 'reset':
            this.reset();
            break;
        case 'apply-filter':
            this.applyFilter(args.value['context'] as CanvasRenderingContext2D);
            break;
        }
    }

    private updatePrivateVariables(): void {
        const parent: ImageEditor = this.parent;
        if (parent.lowerCanvas) {this.lowerContext = parent.lowerCanvas.getContext('2d'); }
    }

    public getModuleName(): string {
        return 'filter';
    }

    private reset(): void {
        this.adjustmentLevel = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0,
            blur: 0, exposure: 0, transparency: 100, sharpen: false, bw: false};
        this.tempAdjustmentLevel = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0,
            blur: 0, exposure: 0, transparency: 100, sharpen: false, bw: false};
        this.adjustmentValue = this.parent.getDefaultFilter();
        this.isBrightnessAdjusted =  false; this.bevelFilter = 'none'; this.tempFilVal = '';
        this.tempAdjVal = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0,
            blur: 0, exposure: 0, transparency: 100, sharpen: false, bw: false};
    }

    private updateFinetunes(): void {
        const parent: ImageEditor = this.parent;
        const fs: FinetuneSettingsModel = parent.finetuneSettings;
        if (fs) {
            const propertiesToSet: string[] = ['brightness', 'contrast', 'hue', 'saturation', 'exposure', 'opacity', 'blur'];
            propertiesToSet.forEach((property: string) => {
                if (fs[property as string]) {
                    this.adjustmentLevel[property as string] = fs[property as string].defaultValue;
                    this.tempAdjustmentLevel[property as string] = fs[property as string].defaultValue;
                }
            });
            parent.notify('draw', { prop: 'isInitialLoading', onPropertyChange: false, value: { isInitialLoading: true } });
        }
    }

    private initFilter(): void {
        this.setFilterAdj('brightness', this.adjustmentLevel.brightness);
        this.setFilterAdj('contrast', this.adjustmentLevel.contrast);
        this.setFilterAdj('hue', this.adjustmentLevel.hue);
        this.setFilterAdj('saturation', this.adjustmentLevel.saturation);
        this.setFilterAdj('exposure', this.adjustmentLevel.exposure);
        this.setFilterAdj('opacity', this.adjustmentLevel.opacity);
        this.setFilterAdj('blur', this.adjustmentLevel.blur);
    }

    private updateAdj(type: string, value: number, isPreview?: boolean, ctx?: CanvasRenderingContext2D): void {
        const parent: ImageEditor = this.parent;
        this.lowerContext.clearRect(0, 0, parent.lowerCanvas.width, parent.lowerCanvas.height);
        let splitWords: string[] = this.lowerContext.filter.split(' ');
        let values: string[] = [];
        const brightness: number = this.getFilterValue(this.adjustmentLevel.brightness);
        const excludedTypes: string[] = ['brightness', 'contrast', 'hue', 'saturation', 'exposure', 'opacity', 'blur'];
        if (excludedTypes.indexOf(type) === -1) {
            if (isNullOrUndefined(isPreview) && (this.adjustmentLevel.sharpen || this.adjustmentLevel.bw)) {
                parent.isUndoRedo = true;
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                    value: {ctx: this.lowerContext, shape: 'iterate', pen: 'iterate', isPreventApply: null }});
                this.lowerContext.filter = temp;
                parent.isUndoRedo = false;
            }
        }
        let saturate: number; let bright: number; let saturatePercent: number; let contrast: number;
        let saturatePercentage: number;
        switch (type) {
        case 'brightness':
            value = this.getFilterValue(this.adjustmentLevel.exposure) +  (value * 0.005);
            splitWords[0] = 'brightness(' + value + ')';
            if (this.adjustmentLevel.brightness !== 0) {
                value = (this.adjustmentLevel.opacity / 100) - (this.adjustmentLevel.opacity * 0.3) / 100;
                splitWords[4] = 'opacity(' + value + ')';
            }
            else {
                value = this.adjustmentLevel.opacity / 100;
                splitWords[4] = 'opacity(' + value + ')';
            }
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'contrast':
            splitWords[1] = 'contrast(' + value + '%)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'hue':
            splitWords[2] = 'hue-rotate(' + value + 'deg)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'saturation':
            splitWords[3] = 'saturate(' + value + '%)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'opacity':
            if (parseFloat(splitWords[0].split('(')[1]) !== 1) {
                value -= 0.2;
            }
            if (value < 0) {value = 0; }
            splitWords[4] = 'opacity(' + value + ')';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'blur':
            splitWords[5] = 'blur(' + value + 'px)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'exposure':
            if (value > 1) {
                value -= 1; value += brightness;
            } else if (value < 1) {
                value = 1 - value; value = brightness - value;
            }
            splitWords[0] = 'brightness(' + value + ')';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'chrome':
            saturate = this.getSaturationFilterValue(this.adjustmentLevel.saturation);
            saturate *= 100;
            value = saturate + (saturate * 0.4);
            splitWords[3] = 'saturate(' + value + '%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'cold':
            // Adjusting Brightness
            bright = this.getFilterValue(this.adjustmentLevel.brightness);
            bright *= 100;
            value = bright * 0.9;
            value *= 0.01;
            splitWords[0] = 'brightness(' + value + ')';
            // Adjusting Contrast
            contrast = this.getFilterValue(this.adjustmentLevel.contrast);
            contrast *= 100;
            value = contrast + (contrast * 0.5);
            splitWords[1] = 'contrast(' + value + '%)';
            // Adjusting Saturation
            saturatePercentage = this.getSaturationFilterValue(this.adjustmentLevel.saturation);
            saturatePercentage *= 100;
            value = saturatePercentage;
            splitWords[3] = 'saturate(' + value + '%)';
            values = this.adjustmentValue.split(' ');
            splitWords[2] = values[2];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'warm':
            saturatePercent = this.getSaturationFilterValue(this.adjustmentLevel.saturation);
            saturatePercent *= 100;
            value = saturatePercent + (saturatePercent * 0.4);
            splitWords[3] = 'saturate(' + value + '%)';
            splitWords[6] = 'sepia(25%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'grayscale':
            splitWords[7] = 'grayscale(100%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[3] = values[3];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'sepia':
            splitWords[6] = 'sepia(100%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[3] = values[3];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[7] = 'grayscale(0%)';
            splitWords[8] = 'invert(0%)';
            break;
        case 'invert':
            splitWords[8] = 'invert(100%)';
            values = this.adjustmentValue.split(' ');
            splitWords[0] = values[0];
            splitWords[1] = values[1];
            splitWords[2] = values[2];
            splitWords[3] = values[3];
            splitWords[4] = values[4];
            splitWords[5] = values[5];
            splitWords[6] = 'sepia(0%)';
            splitWords[7] = 'grayscale(0%)';
            break;
        }
        if (type !== 'sharpen' && type !== 'blackandwhite') {
            if (isNullOrUndefined(isPreview)) {
                if (type === 'default') {
                    splitWords = this.getDefaultCurrentFilter(splitWords);
                }
                this.lowerContext.filter = splitWords.join(' ');
            }
            splitWords = this.setTempFilterValue(brightness, isPreview, splitWords, type);
            parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: true }});
            parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                value: {type: 'initial', isPreventDestination: null, isRotatePan: null} });
            let tempFilter: string;
            if (parent.frameObj.type === 'bevel') {
                tempFilter = this.lowerContext.filter;
                this.bevelFilter = tempFilter;
            }
            if (parent.transform.degree === 0 && parent.rotateFlipColl.length > 0) {
                parent.img.destLeft += parent.panPoint.totalPannedPoint.x;
                parent.img.destTop += parent.panPoint.totalPannedPoint.y;
            }
            parent.img.destLeft += parent.panPoint.totalPannedInternalPoint.x;
            parent.img.destTop += parent.panPoint.totalPannedInternalPoint.y;
            if (parent.transform.degree === 0) {
                parent.notify('transform', { prop: 'setDestPointsForFlipState', onPropertyChange: false });
            }
            parent.notify('draw', { prop: 'drawImage', onPropertyChange: false});
            parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
            parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: false }});
            if (parent.transform.degree === 0 && parent.rotateFlipColl.length > 0) {
                parent.img.destLeft += parent.panPoint.totalPannedPoint.x;
                parent.img.destTop += parent.panPoint.totalPannedPoint.y;
            }
            splitWords = this.setTempFilterValue(brightness, isPreview, splitWords, type);
            if (isNullOrUndefined(isPreview)) {this.lowerContext.filter = splitWords.join(' '); }
            parent.initialAdjustmentValue = splitWords.join(' ');
            tempFilter = this.lowerContext.filter;
            this.lowerContext.filter = 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
                'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
            this.bevelFilter = tempFilter;
            parent.notify('shape', { prop: 'drawAnnotations', onPropertyChange: false,
                value: {ctx: this.lowerContext, shape: 'iterate', pen: 'iterate', isPreventApply: null }});
            this.lowerContext.filter = tempFilter;
            parent.notify('draw', { prop: 'clearOuterCanvas', onPropertyChange: false, value: {context: this.lowerContext}});
            if ((parent.currSelectionPoint && parent.currSelectionPoint.shape === 'crop-circle') || parent.isCircleCrop) {
                parent.notify('crop', { prop: 'cropCircle', onPropertyChange: false,
                    value: {context: this.lowerContext, isSave: null, isFlip: null}});
            }
            this.isBrightnessAdjusted = brightness !== 1;
        }
        const filter: string = splitWords.join(' ');
        if (ctx) {
            ctx.filter = filter;
        }
    }

    private setTempFilterValue(brightness: number, isPreview: boolean, splitWords: string[], type: string): string[] {
        if (isPreview) {
            if (type === 'default') {
                splitWords = this.getDefaultCurrentFilter(splitWords);
            } else if (brightness !== 1) {
                const tempSplitWords: string[] = this.lowerContext.filter.split(' ');
                tempSplitWords[4] = splitWords[4];
                this.lowerContext.filter = tempSplitWords.join(' ');
            }
        }
        return splitWords;
    }

    private getDefaultCurrentFilter(splitWords: string[]): string[] {
        const values: string[] = this.adjustmentValue.split(' ');
        splitWords = [ values[0], values[1], values[2], values[3], values[4], values[5], 'sepia(0%)', 'grayscale(0%)', 'invert(0%)' ];
        return splitWords;
    }

    private getFilterValue(value: number): number {
        return (value === 0) ? 1 : 1 + ((value * 0.5) / 100);
    }

    private getSaturationFilterValue(value: number): number {
        return value === 0 ? 1 : 1 + (value / 100);
    }

    private setFilterAdj(type: string, value: number): void {
        const parent: ImageEditor = this.parent;
        parent.notify('freehand-draw', { prop: 'apply-pen-draw', onPropertyChange: false });
        this.adjustmentLevel[`${type}`] = value;
        switch (type) {
        case 'contrast':
        case 'exposure':
            value = this.getFilterValue(value);
            if (type === 'contrast') {value *= 100; }
            break;
        case 'hue':
            value *= 3;
            break;
        case 'saturation':
            value = this.getSaturationFilterValue(value) * 100;
            break;
        case 'opacity':
            if (value < 10) {
                value += 1;
            }
            value /= 100;
            break;
        case 'blur':
            if (value !== 0) {
                value /= 20;
                // Since 0.5 is not working in blur we consider from 1
                value += 0.5;
            }
            break;
        }
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        const prevObj: CurrentObject = this.getCurrentObj();
        prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = { selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: { obj: selPointCollObj } });
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.updateAdj(type, value);
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false, value: { operation: type, previousObj: prevObj,
            previousObjColl: prevObj.objColl, previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
            previousCropObj: prevCropObj, previousText: null, currentText: null, previousFilter: null, isCircleCrop: null
        }});
    }

    private setFilter(type: string): void {
        const parent: ImageEditor = this.parent;
        type = type.toLowerCase();
        parent.notify('freehand-draw', { prop: 'apply-pen-draw', onPropertyChange: false});
        const obj: Object = {currentFilter: this.parent.currentFilter };
        const prevFilter: string = obj['currentFilter'];
        const prevCropObj: CurrentObject = extend({}, parent.cropObj, {}, true) as CurrentObject;
        const prevObj: CurrentObject = this.getCurrentObj();
        prevObj.objColl = extend([], parent.objColl, [], true) as SelectionPoint[];
        prevObj.pointColl = extend([], parent.pointColl, [], true) as Point[];
        prevObj.afterCropActions = extend([], parent.afterCropActions, [], true) as string[];
        const selPointCollObj: Object = {selPointColl: null };
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false, value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.updateAdj(type, null);
        parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: type, previousObj: prevObj, previousObjColl: prevObj.objColl, previousPointColl: prevObj.pointColl,
                previousSelPointColl: prevObj.selPointColl, previousCropObj: prevCropObj, previousText: null,
                currentText: null, previousFilter: prevFilter, isCircleCrop: null}});
    }

    private setAdjustment(type: string): void {
        const splitWords: string[] = this.lowerContext.filter.split(' ');
        let value: number; let valueArr: string[];
        switch (type) {
        case 'brightness':
            valueArr = splitWords[0].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            this.adjustmentLevel.brightness = this.setFilterValue(value);
            break;
        case 'contrast':
            valueArr = splitWords[1].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value /= 100;
            this.adjustmentLevel.contrast = this.setFilterValue(value);
            break;
        case 'hue':
            valueArr = splitWords[2].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value /= 3;
            this.adjustmentLevel.hue = value;
            break;
        case 'saturation':
            valueArr = splitWords[3].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value /= 100;
            this.adjustmentLevel.saturation = this.setSaturationFilterValue(value);
            break;
        case 'opacity':
            valueArr = splitWords[4].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            if (value === 0.45) {value = 40; }
            else if (value === 0.40) {value = 30; }
            else if (value === 0.35) {value = 20; }
            else if (value === 0.30) {value = 10; }
            else if (value === 0.25) { value = 0; }
            else {value *= 100; }
            this.adjustmentLevel.opacity = value;
            break;
        case 'blur':
            valueArr = splitWords[5].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            value *= 20;
            this.adjustmentLevel.blur = value;
            break;
        case 'exposure':
            valueArr = splitWords[0].split('(');
            value = parseFloat(valueArr[1].split(')')[0]);
            this.adjustmentLevel.exposure = this.setFilterValue(value);
            break;
        }
    }

    private setFilterValue(value: number): number {
        return Math.round((value === 1) ? 0 : ((value - 1) * 100) / 0.5);
    }

    private setSaturationFilterValue(value: number): number {
        return Math.round((value === 1) ? 0 : (value - 1) * 100);
    }

    private finetuneImage(finetuneOption: ImageFinetuneOption, value: number): void {
        const parent: ImageEditor = this.parent;
        if (!parent.disabled && parent.isImageLoaded) {
            switch (finetuneOption.toLowerCase()) {
            case 'brightness':
                this.setFilterAdj('brightness', value);
                break;
            case 'contrast':
                this.setFilterAdj('contrast', value);
                break;
            case 'hue':
                this.setFilterAdj('hue', value);
                break;
            case 'saturation':
                this.setFilterAdj('saturation', value);
                break;
            case 'opacity':
                this.setFilterAdj('opacity', value);
                break;
            case 'blur':
                this.setFilterAdj('blur', value);
                break;
            case 'exposure':
                this.setFilterAdj('exposure', value);
                break;
            }
            this.parent.canvasFilter = this.lowerContext.filter;
            parent.notify('undo-redo', {prop: 'updateCurrUrc', value: {type: 'ok' }});
        }
    }

    private setCurrAdjValue(type: string, value: number): void {
        const parent: ImageEditor = this.parent;
        this.parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
        switch (type) {
        case 'brightness':
            this.setFilterAdj('brightness', value);
            break;
        case 'contrast':
            this.setFilterAdj('contrast', value);
            break;
        case 'hue':
            this.setFilterAdj('hue', value);
            break;
        case 'saturation':
            this.setFilterAdj('saturation', value);
            break;
        case 'opacity':
            this.setFilterAdj('opacity', value);
            break;
        case 'blur':
            this.setFilterAdj('blur', value);
            break;
        case 'exposure':
            this.setFilterAdj('exposure', value);
            break;
        }
        parent.isFinetuneBtnClick = true;
        parent.curFinetuneObjEvent = { finetune: parent.toPascalCase(type) as ImageFinetuneOption, value: value };
    }

    private getCurrentObj(dummyObj?: Object): CurrentObject {
        const parent: ImageEditor = this.parent;
        const tempFlipPanPointObj: Object = {point: null };
        parent.notify('crop', {prop: 'getTempFlipPanPoint', value: {obj: tempFlipPanPointObj }});
        const zoomObj: Object = {previousZoomValue: null };
        parent.notify('transform', {prop: 'getPreviousZoomValue', value: {obj: zoomObj }});
        const straightenObj: Object = {zoomFactor: null };
        parent.notify('draw', {prop: 'getStraightenInitZoom', value: {obj: straightenObj }});
        const bgObj: Object = { color: null };
        parent.notify('draw', { prop: 'getImageBackgroundColor', value: {obj: bgObj }});
        const obj: CurrentObject = {cropZoom: 0, defaultZoom: 0, totalPannedPoint: {x: 0, y: 0}, totalPannedClientPoint: {x: 0, y: 0},
            totalPannedInternalPoint: {x: 0, y: 0}, tempFlipPanPoint: {x: 0, y: 0}, activeObj: {} as SelectionPoint,
            rotateFlipColl: [], degree: 0, currFlipState: '', zoomFactor: 0, previousZoomValue : 0, straighten: 0,
            destPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint, frame: 'none',
            srcPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint, filter : '', isBrightAdjust: this.isBrightnessAdjusted,
            aspectWidth: null, aspectHeight: null, straightenZoom: 0, adjustmentLevel: extend({}, this.tempAdjVal, {}, true) as Adjustment,
            currentFilter: this.tempFilVal, imageSource: '', bgColor: '' };
        obj.cropZoom = parent.transform.cropZoomFactor; obj.defaultZoom = parent.transform.defaultZoomFactor;
        obj.zoomFactor = parent.zoomSettings.zoomFactor; obj.previousZoomValue = zoomObj['previousZoomValue'];
        obj.straightenZoom = straightenObj['zoomFactor'];
        obj.totalPannedPoint = extend({}, parent.panPoint.totalPannedPoint, {}, true) as Point;
        obj.totalPannedClientPoint = extend({}, parent.panPoint.totalPannedClientPoint, {}, true) as Point;
        obj.totalPannedInternalPoint = extend({}, parent.panPoint.totalPannedInternalPoint, {}, true) as Point;
        obj.tempFlipPanPoint = extend({}, tempFlipPanPointObj['point'], {}, true) as Point;
        obj.activeObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        obj.rotateFlipColl = extend([], parent.rotateFlipColl, [], true) as string[] | number[];
        obj.degree = parent.transform.degree; obj.straighten = parent.cropObj.straighten;
        obj.currFlipState = parent.transform.currFlipState;
        obj.destPoints = {startX: parent.img.destLeft, startY: parent.img.destTop, endX: 0, endY: 0,
            width: parent.img.destWidth, height: parent.img.destHeight};
        obj.srcPoints = {startX: parent.img.srcLeft, startY: parent.img.srcTop, endX: 0, endY: 0,
            width: parent.img.srcWidth, height: parent.img.srcHeight};
        obj.filter = this.lowerContext.filter; obj.aspectWidth = parent.aspectWidth; obj.aspectHeight = parent.aspectHeight;
        obj.frame = parent.frameObj.type;
        obj.frameObj = extend({}, parent.frameObj) as FrameValue;
        obj.imageSource = parent.baseImg.src;
        obj.bgColor = bgObj['color'];
        if (dummyObj) {dummyObj['currObj'] = obj; }
        return obj;
    }

    /* Filter safari related codes */
    private getValFromPercentage(percentage: string): number {
        let val: number = parseFloat(percentage);
        // check for percentages and divide by a hundred
        if (/%\s*?$/i.test(percentage)) {
            val /= 100;
        }
        return val;
    }

    private getValFromLength(length: string): number {
        return parseFloat(length);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private parseFilterString(filterString: string): any[] {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        let filterArray: any[] = [];
        if (filterString !== 'none') {
            filterArray = filterString.split(' ').map((filter: string) => {
                const [name, value] = filter.match(/([a-z-]+)\(([^)]+)\)/).slice(1, 3);
                return { filter: name, value: value };
            });
        }
        return filterArray;
    }

    private applyFilter(context: CanvasRenderingContext2D): void {
        const { height, width } = context.canvas;
        let imageData: ImageData = context.getImageData(0, 0, width, height);
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const filterArray: any[] = this.parseFilterString(context.filter);
        for (let i: number = 0, len: number = filterArray.length; i < len; i++) {
            switch (filterArray[i as number].filter) {
            case 'blur':
                imageData = this.blur(context, imageData, filterArray[i as number].value);
                break;
            case 'brightness':
                imageData = this.brightness(imageData, filterArray[i as number].value);
                break;
            case 'contrast':
                imageData = this.contrast(imageData, filterArray[i as number].value);
                break;
            case 'grayscale':
                imageData = this.grayscale(imageData, filterArray[i as number].value);
                break;
            case 'hue-rotate':
                imageData = this.hueRotate(imageData, filterArray[i as number].value);
                break;
            case 'invert':
                imageData = this.invert(imageData, filterArray[i as number].value);
                break;
            case 'opacity':
                imageData = this.opacity(imageData, filterArray[i as number].value);
                break;
            case 'saturate':
                imageData = this.saturate(context, imageData, filterArray[i as number].value);
                break;
            case 'sepia':
                imageData = this.sepia(imageData, filterArray[i as number].value);
                break;
            }
        }
        context.putImageData(imageData, 0, 0);
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private blur(context: CanvasRenderingContext2D, imageData: ImageData, radius: any = '0'): ImageData {
        let blurRadius: number = this.getValFromLength(radius); blurRadius = Math.floor(blurRadius);
        if (blurRadius <= 0) {
            return imageData;
        }
        const { height, width } = context.canvas;
        const { data } = imageData;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const blurredData: any = new Uint8ClampedArray(data.length);
        for (let y: number = 0; y < height; y++) {
            for (let x: number = 0; x < width; x++) {
                let r: number = 0; let g: number = 0;  let b: number = 0; let a: number = 0; let count: number = 0;
                for (let dy: number = -blurRadius; dy <= blurRadius; dy++) {
                    for (let dx: number = -blurRadius; dx <= blurRadius; dx++) {
                        const nx: number = x + dx;
                        const ny: number = y + dy;
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const offset: number = (ny * width + nx) * 4;
                            r += data[offset as number];
                            g += data[offset + 1];
                            b += data[offset + 2];
                            a += data[offset + 3];
                            count++;
                        }
                    }
                }
                const i: number = (y * width + x) * 4;
                blurredData[i as number] = r / count;
                blurredData[i + 1] = g / count;
                blurredData[i + 2] = b / count;
                blurredData[i + 3] = a / count;
            }
        }
        for (let i: number = 0; i < data.length; i++) {
            data[i as number] = blurredData[i as number];
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private brightness(imageData: ImageData, percentage: any = '1'): ImageData {
        const factor: number = this.getValFromPercentage(percentage);
        if (factor !== 1) {
            const { data } = imageData;
            const { length } = data;
            for (let i: number = 0; i < length; i += 4) {
                data[i + 0] *= factor; data[i + 1] *= factor; data[i + 2] *= factor;
            }
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private contrast(imageData: ImageData, percentage: any = '1'): ImageData {
        const factor: number = this.getValFromPercentage(percentage);
        if (factor !== 1) {
            const { data } = imageData;
            const { length } = data;
            for (let i: number = 0; i < length; i += 4) {
                data[i + 0] = ((data[i + 0] / 255 - 0.5) * factor + 0.5) * 255;
                data[i + 1] = ((data[i + 1] / 255 - 0.5) * factor + 0.5) * 255;
                data[i + 2] = ((data[i + 2] / 255 - 0.5) * factor + 0.5) * 255;
            }
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private grayscale(imageData: ImageData, percentage: any = '0'): ImageData {
        const factor: number = this.getValFromPercentage(percentage);
        if (factor > 0) {
            const { data } = imageData;
            const { length } = data;
            for (let i: number = 0; i < length; i += 4) {
                const r: number = data[i as number]; const g: number = data[i + 1]; const b: number = data[i + 2];
                // Calculate the grayscale value using the luminosity method
                const gray: number = 0.299 * r + 0.587 * g + 0.114 * b;
                // Blend the original color with the grayscale value based on the percentage
                data[i  as number] = r * (1 - factor) + gray * factor;
                data[i + 1] = g * (1 - factor) + gray * factor;
                data[i + 2] = b * (1 - factor) + gray * factor;
            }
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private hueRotate(imageData: ImageData, rotation: any = '0deg'): ImageData {
        const { data } = imageData;
        const angle: number = parseFloat(rotation) * (Math.PI / 180);
        if (angle > 0) {
            const cosA: number = Math.cos(angle);
            const sinA: number = Math.sin(angle);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            const matrix: any = [
                0.213 + cosA * 0.787 - sinA * 0.213, 0.715 - cosA * 0.715 - sinA * 0.715, 0.072 - cosA * 0.072 + sinA * 0.928,
                0.213 - cosA * 0.213 + sinA * 0.143, 0.715 + cosA * 0.285 + sinA * 0.140, 0.072 - cosA * 0.072 - sinA * 0.283,
                0.213 - cosA * 0.213 - sinA * 0.787, 0.715 - cosA * 0.715 + sinA * 0.715, 0.072 + cosA * 0.928 + sinA * 0.072
            ];
            for (let i: number = 0; i < data.length; i += 4) {
                const r: number = data[i as number];
                const g: number = data[i + 1];
                const b: number = data[i + 2];

                // Apply the hue rotation matrix
                data[i as number] = matrix[0] * r + matrix[1] * g + matrix[2] * b;
                data[i + 1] = matrix[3] * r + matrix[4] * g + matrix[5] * b;
                data[i + 2] = matrix[6] * r + matrix[7] * g + matrix[8] * b;
            }
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private invert(imageData: ImageData, percentage: any = '0'): ImageData {
        const factor: number = this.getValFromPercentage(percentage);
        if (factor > 0) {
            const { data } = imageData;
            const { length } = data;
            for (let i: number = 0; i < length; i += 4) {
                data[i + 0] = Math.abs(data[i + 0] - 255 * factor);
                data[i + 1] = Math.abs(data[i + 1] - 255 * factor);
                data[i + 2] = Math.abs(data[i + 2] - 255 * factor);
            }
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private opacity(imageData: ImageData, percentage: any = '0'): ImageData {
        const factor: number = this.getValFromPercentage(percentage);
        if (factor >= 0) {
            const { data } = imageData;
            const { length } = data;
            for (let i: number = 3; i < length; i += 4) {
                data[i as number] *= factor;
            }
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private saturate(context: CanvasRenderingContext2D, imageData: ImageData, percentage: any = '0'): ImageData {
        const factor: number = this.getValFromPercentage(percentage);
        if (factor !== 1) {
            const {width, height} = context.canvas;
            const { data } = imageData;
            const lumR: number = (1 - factor) * 0.3086; const lumG: number = (1 - factor) * 0.6094;
            const lumB: number = (1 - factor) * 0.082;
            // tslint:disable-next-line no-bitwise
            const shiftW: number = width << 2;
            for (let j: number = 0; j < height; j++) {
                const offset: number = j * shiftW;
                for (let i: number = 0; i < width; i++) {
                // tslint:disable-next-line no-bitwise
                    const pos: number = offset + (i << 2);
                    const r: number = data[pos + 0]; const g: number = data[pos + 1]; const b: number = data[pos + 2];
                    data[pos + 0] = (lumR + factor) * r + lumG * g + lumB * b;
                    data[pos + 1] = lumR * r + (lumG + factor) * g + lumB * b;
                    data[pos + 2] = lumR * r + lumG * g + (lumB + factor) * b;
                }
            }
        }
        return imageData;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    private sepia(imageData: ImageData, percentage: any = '0'): ImageData {
        let factor: number = this.getValFromPercentage(percentage);
        if (factor > 1) {
            factor = 1;
        }
        if (factor > 0) {
            const { data } = imageData;
            const { length } = data;
            for (let i: number = 0; i < length; i += 4) {
                const r: number = data[i + 0]; const g: number = data[i + 1]; const b: number = data[i + 2];
                data[i + 0] =
                  (0.393 * r + 0.769 * g + 0.189 * b) * factor + r * (1 - factor);
                data[i + 1] =
                  (0.349 * r + 0.686 * g + 0.168 * b) * factor + g * (1 - factor);
                data[i + 2] =
                  (0.272 * r + 0.534 * g + 0.131 * b) * factor + b * (1 - factor);
            }
        }
        return imageData;
    }
}
