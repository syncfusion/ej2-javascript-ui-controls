import { ImageEditor, ImageFinetuneOption, CurrentObject, SelectionPoint, Point, ActivePoint, Adjustment, FinetuneSettingsModel } from '../index';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';

export class Filter {
    private parent: ImageEditor;
    private lowerContext: CanvasRenderingContext2D;
    private adjustmentLevel: Adjustment = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0, blur: 0,
        exposure: 0, sharpen: false, bw: false}; // for toolbar slider value
    private tempAdjustmentLevel: Adjustment = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0, blur: 0,
        exposure: 0, sharpen: false, bw: false}; // for temp toolbar slider value
    private adjustmentValue: string = ''; // for internal slider value
    private isBrightnessAdjusted: boolean = false;
    private appliedFilter: string = '';

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
        case 'updateBrightFilter':
            this.updateBrightFilter();
            break;
        case 'set-adjustment':
            this.setAdjustment(args.value['operation'] as string);
            break;
        case 'update-filter':
            this.updateFilter(args.value['operation'] as string, args.value['filter'] as string );
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
        case 'reset':
            this.reset();
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

    private updateBrightFilter(): void {
        const splitWords: string[] = this.lowerContext.filter.split(' ');
        if (this.isBrightnessAdjusted && splitWords.length > 0 && !isNullOrUndefined(splitWords[4])) {
            const opacityValue: number = parseFloat(splitWords[4].split('(')[1]);
            splitWords[4] = 'opacity(' + (opacityValue - 0.3) + ')';
            this.lowerContext.filter = splitWords.join(' ');
        }
    }

    private reset(): void {
        this.adjustmentLevel = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0,
            blur: 0, exposure: 0, sharpen: false, bw: false};
        this.tempAdjustmentLevel = {brightness: 0, contrast: 0, hue: 0, opacity: 100, saturation: 0,
            blur: 0, exposure: 0, sharpen: false, bw: false};
        this.adjustmentValue = this.parent.getDefaultFilter();
        this.isBrightnessAdjusted =  false; this.appliedFilter = '';
    }

    private updateFinetunes(): void {
        const parent: ImageEditor = this.parent;
        const fs: FinetuneSettingsModel = parent.finetuneSettings;
        if (fs) {
            if (fs.brightness) {
                this.adjustmentLevel.brightness = fs.brightness.defaultValue;
                this.tempAdjustmentLevel.brightness = fs.brightness.defaultValue;
            }
            if (fs.contrast) {
                this.adjustmentLevel.contrast = fs.contrast.defaultValue;
                this.tempAdjustmentLevel.contrast = fs.contrast.defaultValue;
            }
            if (fs.hue) {
                this.adjustmentLevel.hue = fs.hue.defaultValue;
                this.tempAdjustmentLevel.hue = fs.hue.defaultValue;
            }
            if (fs.saturation) {
                this.adjustmentLevel.saturation = fs.saturation.defaultValue;
                this.tempAdjustmentLevel.saturation = fs.saturation.defaultValue;
            }
            if (fs.exposure) {
                this.adjustmentLevel.exposure = fs.exposure.defaultValue;
                this.tempAdjustmentLevel.exposure = fs.exposure.defaultValue;
            }
            if (fs.opacity) {
                this.adjustmentLevel.opacity = fs.opacity.defaultValue;
                this.tempAdjustmentLevel.opacity = fs.opacity.defaultValue;
            }
            if (fs.blur) {
                this.adjustmentLevel.blur = fs.blur.defaultValue;
                this.tempAdjustmentLevel.blur = fs.blur.defaultValue;
            }
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
        let values: string[] = []; let opacityValue: number; let brightnessValue: number;
        if (splitWords[4]) {opacityValue = parseFloat(splitWords[4].split('(')[1]); }
        if (splitWords[0]) {brightnessValue = parseFloat(splitWords[0].split('(')[1]); }
        const brightness: number = this.getFilterValue(this.adjustmentLevel.brightness);
        const saturation: number = this.getFilterValue(this.adjustmentLevel.saturation);
        const excludedTypes: string[] = ['brightness', 'contrast', 'hue', 'saturation', 'exposure', 'opacity', 'blur'];
        if (excludedTypes.indexOf(type) === -1) {
            if (isNullOrUndefined(isPreview) && (this.adjustmentLevel.sharpen || this.adjustmentLevel.bw)) {
                parent.isUndoRedo = true;
                const temp: string = this.lowerContext.filter;
                this.lowerContext.filter = 'none';
                parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
                parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                    value: {context: this.lowerContext, points: null} });
                this.lowerContext.filter = temp;
                parent.isUndoRedo = false;
            }
        }
        if (brightness !== 1) {splitWords[4] = 'opacity(' + (opacityValue - 0.3) + ')'; }
        let saturate: number; let bright: number; let saturatePercent: number; let contrast: number;
        let saturatePercentage: number;
        switch (type) {
        case 'brightness':
            if (parseFloat(splitWords[3].split('(')[1]) !== 100) {
                value += 0.1;
            }
            splitWords[0] = 'brightness(' + value + ')';
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
            if (saturation !== 1) {
                splitWords[0] = 'brightness(' + (brightnessValue + 0.09) + ')';
            }
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'opacity':
            if (parseFloat(splitWords[0].split('(')[1]) !== 1) {
                value -= 0.2;
            }
            splitWords[4] = 'opacity(' + value + ')';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'blur':
            splitWords[5] = 'blur(' + value + 'px)';
            this.adjustmentValue = splitWords.join(' ');
            break;
        case 'exposure':
            if (brightness !== 1) {splitWords[4] = 'opacity(' + (opacityValue - 0.3) + ')'; }
            if (value > 1) {
                value -= 1; value += brightness;
            }
            else if (value < 1) {
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
            this.appliedFilter = this.lowerContext.filter;
            this.lowerContext.drawImage(parent.baseImg, parent.img.srcLeft, parent.img.srcTop, parent.img.srcWidth,
                                        parent.img.srcHeight, parent.img.destLeft, parent.img.destTop, parent.img.destWidth,
                                        parent.img.destHeight);
            parent.notify('draw', { prop: 'updateCurrTransState', onPropertyChange: false,
                value: {type: 'reverse', isPreventDestination: null, isRotatePan: null} });
            parent.notify('draw', { prop: 'setRotateZoom', onPropertyChange: false, value: {isRotateZoom: false }});
            if (brightness !== 1) {
                splitWords[4] = 'opacity(' + opacityValue + ')';
            } else if (saturation !== 1) {
                splitWords[0] = 'brightness(' + brightnessValue + ')';
            }
            if ((type === 'exposure' && brightness !== 1) || (type === 'saturation' && saturation !== 1)) {
                splitWords[0] = 'brightness(' + brightnessValue + ')';
            }
            splitWords = this.setTempFilterValue(brightness, isPreview, splitWords, type);
            if (isNullOrUndefined(isPreview)) {this.lowerContext.filter = splitWords.join(' '); }
            parent.initialAdjustmentValue = splitWords.join(' ');
            const tempFilter: string = this.lowerContext.filter;
            this.lowerContext.filter = 'brightness(' + 1 + ') ' + 'contrast(' + 100 + '%) ' + 'hue-rotate(' + 0 + 'deg) ' +
                'saturate(' + 100 + '%) ' + 'opacity(' + 1 + ') ' + 'blur(' + 0 + 'px) ' + 'sepia(0%) ' + 'grayscale(0%) ' + 'invert(0%)';
            parent.notify('shape', { prop: 'iterateObjColl', onPropertyChange: false});
            parent.notify('freehand-draw', { prop: 'freehandRedraw', onPropertyChange: false,
                value: {context: this.lowerContext, points: null} });
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
        splitWords = [
            values[0],
            values[1],
            values[2],
            values[3],
            values[4],
            values[5],
            'sepia(0%)',
            'grayscale(0%)',
            'invert(0%)'
        ];
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
        case 'brightness':
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
            if (value >= 50) {value /= 100; }
            else if (value === 40) {value = 0.45; }
            else if (value === 30) {value = 0.40; }
            else if (value === 20) {value = 0.35; }
            else if (value === 10) {value = 0.30; }
            else if (value === 0) {value = 0.25; }
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
        parent.notify('undo-redo', {
            prop: 'updateUndoRedoColl',
            onPropertyChange: false,
            value: {
                operation: type,
                previousObj: prevObj,
                previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl,
                previousSelPointColl: prevObj.selPointColl,
                previousCropObj: prevCropObj,
                previousText: null,
                currentText: null,
                previousFilter: null,
                isCircleCrop: null
            }
        });
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
        parent.notify('freehand-draw', { prop: 'getSelPointColl', onPropertyChange: false,
            value: {obj: selPointCollObj }});
        prevObj.selPointColl = extend([], selPointCollObj['selPointColl'], [], true) as Point[];
        this.updateAdj(type, null);
        parent.notify('draw', { prop: 'setImageEdited', onPropertyChange: false });
        parent.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
            value: {operation: type, previousObj: prevObj, previousObjColl: prevObj.objColl,
                previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                previousCropObj: prevCropObj, previousText: null,
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

    private updateFilter(type: string, previousFilter?: string): void {
        const parent: ImageEditor = this.parent;
        const validTypes: string[] = ['default', 'chrome', 'cold', 'warm', 'grayscale', 'blackandwhite', 'sepia', 'invert', 'sharpen'];
        if (validTypes.indexOf(type) !== -1) {
            const selEle: HTMLElement = parent.element.querySelector('.e-contextual-toolbar-wrapper .e-toolbar-item.e-selected');
            if (selEle) {selEle.classList.remove('e-selected'); }
            const filterCanvas: HTMLElement = document.getElementById(parent.element.id + '_' + type + 'Canvas');
            if (filterCanvas) { filterCanvas.parentElement.classList.add('e-selected'); }
            this.parent.currentFilter = previousFilter ? previousFilter : parent.element.id + '_' + type;
        }
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
    }

    private getCurrentObj(dummyObj?: Object): CurrentObject {
        const parent: ImageEditor = this.parent;
        const tempFlipPanPointObj: Object = {point: null };
        parent.notify('crop', {prop: 'getTempFlipPanPoint', value: {obj: tempFlipPanPointObj }});
        const zoomObj: Object = {previousZoomValue: null };
        parent.notify('transform', {prop: 'getPreviousZoomValue', value: {obj: zoomObj }});
        const obj: CurrentObject = {cropZoom: 0, defaultZoom: 0, totalPannedPoint: {x: 0, y: 0}, totalPannedClientPoint: {x: 0, y: 0},
            totalPannedInternalPoint: {x: 0, y: 0}, tempFlipPanPoint: {x: 0, y: 0}, activeObj: {} as SelectionPoint,
            rotateFlipColl: [], degree: 0, currFlipState: '', zoomFactor: 0, previousZoomValue : 0,
            destPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint,
            srcPoints: {startX: 0, startY: 0, width: 0, height: 0} as ActivePoint, filter : '', isBrightAdjust: this.isBrightnessAdjusted };
        obj.cropZoom = parent.transform.cropZoomFactor; obj.defaultZoom = parent.transform.defaultZoomFactor;
        obj.zoomFactor = parent.zoomSettings.zoomFactor; obj.previousZoomValue = zoomObj['previousZoomValue'];
        obj.totalPannedPoint = extend({}, parent.panPoint.totalPannedPoint, {}, true) as Point;
        obj.totalPannedClientPoint = extend({}, parent.panPoint.totalPannedClientPoint, {}, true) as Point;
        obj.totalPannedInternalPoint = extend({}, parent.panPoint.totalPannedInternalPoint, {}, true) as Point;
        obj.tempFlipPanPoint = extend({}, tempFlipPanPointObj['point'], {}, true) as Point;
        obj.activeObj = extend({}, parent.activeObj, {}, true) as SelectionPoint;
        obj.rotateFlipColl = extend([], parent.rotateFlipColl, [], true) as string[] | number[];
        obj.degree = parent.transform.degree;
        obj.currFlipState = parent.transform.currFlipState;
        obj.destPoints = {startX: parent.img.destLeft, startY: parent.img.destTop, endX: 0, endY: 0,
            width: parent.img.destWidth, height: parent.img.destHeight};
        obj.srcPoints = {startX: parent.img.srcLeft, startY: parent.img.srcTop, endX: 0, endY: 0,
            width: parent.img.srcWidth, height: parent.img.srcHeight};
        obj.filter = this.lowerContext.filter;
        if (dummyObj) {dummyObj['currObj'] = obj; }
        return obj;
    }
}
