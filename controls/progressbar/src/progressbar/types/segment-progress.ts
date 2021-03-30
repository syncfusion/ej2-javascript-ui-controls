/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
import { ProgressBar } from '../progressbar';
import { lineCapRadius, completeAngle } from '../model/constant';
import { getPathArc, Pos, degreeToLocation } from '../utils/helper';
import { PathOption, LinearGradient, GradientColor } from '@syncfusion/ej2-svg-base';
import { RangeColorModel } from '../model';

/**
 * Progressbar Segment
 */
export class Segment {

    /** To render the linear segment */
    public createLinearSegment(
        progress: ProgressBar, id: string, width: number, opacity: number, thickness: number, progressWidth: number
    ): Element {
        let locX: number = (progress.enableRtl) ? ((progress.cornerRadius === 'Round') ?
            (progress.progressRect.x + progress.progressRect.width) - ((lineCapRadius / 2) * thickness) :
            (progress.progressRect.x + progress.progressRect.width)) :
            ((progress.cornerRadius === 'Round') ? (progress.progressRect.x + (lineCapRadius / 2) * thickness) : progress.progressRect.x);
        const locY: number = (progress.progressRect.y + (progress.progressRect.height / 2));
        const gapWidth: number = (progress.gapWidth || progress.themeStyle.linearGapWidth);
        const avlWidth: number = progressWidth / progress.segmentCount;
        let avlSegWidth: number = (progressWidth - ((progress.segmentCount - 1) * gapWidth));
        avlSegWidth = (avlSegWidth -
            ((progress.cornerRadius === 'Round') ? progress.segmentCount * (lineCapRadius * thickness) : 0)) / progress.segmentCount;
        const gap: number = (progress.cornerRadius === 'Round') ? (gapWidth + (lineCapRadius * thickness)) : gapWidth;
        const segmentGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + id });
        const count: number = Math.ceil(width / avlWidth);
        let segWidth: number;
        let color: string;
        let j: number = 0;
        let option: PathOption;
        let segmentPath: Element;
        let tolWidth: number = (progress.cornerRadius === 'Round') ? (width - (lineCapRadius * thickness)) : width;
        const linearThickness: number = progress.progressThickness || progress.themeStyle.linearProgressThickness;
        for (let i: number = 0; i < count; i++) {
            segWidth = (tolWidth < avlSegWidth) ? tolWidth : avlSegWidth;
            if (j < progress.segmentColor.length) {
                color = progress.segmentColor[j];
                j++;
            } else {
                j = 0;
                color = progress.segmentColor[j];
                j++;
            }
            option = new PathOption(
                progress.element.id + id + i, 'none', linearThickness, color, opacity,
                '0', this.getLinearSegmentPath(locX, locY, segWidth, progress.enableRtl)
            );
            segmentPath = progress.renderer.drawPath(option);
            if (progress.cornerRadius === 'Round') {
                segmentPath.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(segmentPath);
            locX += (progress.enableRtl) ? -avlSegWidth - gap : avlSegWidth + gap;
            tolWidth -= avlSegWidth + gap;
            tolWidth = (tolWidth < 0) ? 0 : tolWidth;
        }
        return segmentGroup;
    }

    private getLinearSegmentPath(x: number, y: number, width: number, enableRtl: boolean): string {
        return 'M' + ' ' + x + ' ' + y + ' ' + 'L' + (x + ((enableRtl) ? -width : width)) + ' ' + y;
    }

    /** To render the circular segment */
    public createCircularSegment(
        progress: ProgressBar, id: string, x: number, y: number, r: number,
        value: number, opacity: number, thickness: number, totalAngle: number, progressWidth: number
    ): Element {
        let start: number = progress.startAngle;
        let end: number = this.widthToAngle(progress.minimum, progress.maximum, value, progress.totalAngle);
        end -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progressWidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        let size: number = (progressWidth - (
            (progress.totalAngle === completeAngle) ? progress.segmentCount :
                progress.segmentCount - 1) * (progress.gapWidth || progress.themeStyle.circularGapWidth)
        );
        size = (size -
            ((progress.cornerRadius === 'Round') ?
                (((progress.totalAngle === completeAngle) ?
                    progress.segmentCount : progress.segmentCount - 1) * lineCapRadius * thickness) : 0)) / progress.segmentCount;
        let avlTolEnd: number = this.widthToAngle(0, progressWidth, (progressWidth / progress.segmentCount), totalAngle);
        avlTolEnd -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progressWidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        const avlEnd: number = this.widthToAngle(0, progressWidth, size, totalAngle);
        let gap: number = this.widthToAngle(
            0, progressWidth, (progress.gapWidth || progress.themeStyle.circularGapWidth), totalAngle
        );
        gap += (progress.cornerRadius === 'Round') ? this.widthToAngle(0, progressWidth, (lineCapRadius * thickness), totalAngle) : 0;
        const segmentGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + id });
        const gapCount: number = Math.floor(end / avlTolEnd);
        const count: number = Math.ceil((end - gap * gapCount) / avlEnd);
        let segmentPath: string;
        let circularSegment: Element;
        let segmentEnd: number;
        let avlSegEnd: number = (start + ((progress.enableRtl) ? -avlEnd : avlEnd)) % 360;
        let color: string;
        let j: number = 0;
        let option: PathOption;
        const circularThickness: number = progress.progressThickness || progress.themeStyle.circularProgressThickness;
        for (let i: number = 0; i < count; i++) {
            segmentEnd = (progress.enableRtl) ? ((progress.startAngle - end > avlSegEnd) ? progress.startAngle - end : avlSegEnd) :
                ((progress.startAngle + end < avlSegEnd) ? progress.startAngle + end : avlSegEnd
                );
            segmentPath = getPathArc(x, y, r, start, segmentEnd, progress.enableRtl);
            if (j < progress.segmentColor.length) {
                color = progress.segmentColor[j];
                j++;
            } else {
                j = 0;
                color = progress.segmentColor[j];
                j++;
            }
            option = new PathOption(
                progress.element.id + id + i, 'none', circularThickness, color,
                opacity, '0', segmentPath
            );
            circularSegment = progress.renderer.drawPath(option);
            if (progress.cornerRadius === 'Round') {
                circularSegment.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(circularSegment);
            start = segmentEnd + ((progress.enableRtl) ? -gap : gap);
            avlSegEnd += (progress.enableRtl) ? -avlEnd - gap : avlEnd + gap;
        }
        return segmentGroup;
    }

    private widthToAngle(min: number, max: number, value: number, totalAngle: number): number {
        const angle: number = ((value - min) / (max - min)) * totalAngle;
        return angle;
    }

    public createLinearRange(totalWidth: number, progress: ProgressBar): Element {
        const posX: number = progress.progressRect.x + ((progress.enableRtl) ? progress.progressRect.width : 0);
        const startY: number = (progress.progressRect.y + (progress.progressRect.height / 2));
        const rangeGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearRangeGroup' });
        const range: RangeColorModel[] = progress.rangeColors;
        const thickness: number = progress.progressThickness || progress.themeStyle.linearProgressThickness;
        const opacity: number = progress.themeStyle.progressOpacity;
        const rangeMin: number = progress.minimum;
        const rangeMax: number = progress.value;
        const gradX: number = (progress.enableRtl) ? 0.1 : -0.1;
        let gradient: Element;
        let validRange: boolean;
        let rangePath: Element;
        let option: PathOption;
        let startPos: number;
        let endPos: number;
        let startX: number;
        let endX: number;
        let color: string;
        let endColor: string;
        for (let i: number = 0; i < range.length; i++) {
            validRange = (range[i].start >= rangeMin && range[i].start <= rangeMax &&
                range[i].end >= rangeMin && range[i].end <= rangeMax);
            startPos = totalWidth * progress.calculateProgressRange(range[i].start, rangeMin, rangeMax);
            endPos = totalWidth * progress.calculateProgressRange(range[i].end, rangeMin, rangeMax);
            startX = posX + ((progress.enableRtl) ? -startPos : startPos);
            endX = posX + ((progress.enableRtl) ? -endPos : endPos);
            startX = (validRange) ? ((progress.isGradient && i > 0) ? startX + gradX : startX) : posX;
            endX = (validRange) ? endX : posX;
            color = (progress.isGradient) ? 'url(#lineRangeGrad_' + i + ')' : range[i].color;
            option = new PathOption(
                progress.element.id + '_LinearRange_' + i, 'none', thickness, color, opacity,
                '0', 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + endX + ' ' + startY
            );
            rangePath = progress.renderer.drawPath(option);
            rangeGroup.appendChild(rangePath);
            if (progress.isGradient) {
                if (range.length - 1 === i) {
                    endColor = range[i].color;
                } else {
                    endColor = range[i + 1].color;
                }
                gradient = this.setLinearGradientColor(i, range[i].color, endColor, startX, endX, progress);
                rangeGroup.appendChild(gradient);
            }
        }
        return rangeGroup;
    }

    public createCircularRange(centerX: number, centerY: number, radius: number, progress: ProgressBar): Element {
        const rangeGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularRangeGroup' });
        const range: RangeColorModel[] = progress.rangeColors;
        const thickness: number = progress.progressThickness || progress.themeStyle.linearProgressThickness;
        const opacity: number = progress.themeStyle.progressOpacity;
        const rangeMin: number = progress.minimum;
        const rangeMax: number = progress.value;
        const start: number = progress.startAngle;
        const tolAngle: number = this.widthToAngle(progress.minimum, progress.maximum, progress.value, progress.totalAngle);
        let gradient: Element;
        let startAngle: number;
        let endAngle: number;
        let rangePath: Element;
        let isValidRange: boolean;
        let option: PathOption;
        let color: string;
        let endColor: string;
        for (let i: number = 0; i < range.length; i++) {
            isValidRange = (range[i].start >= rangeMin && range[i].start <= rangeMax &&
                range[i].end >= rangeMin && range[i].end <= rangeMax);
            startAngle = this.widthToAngle(rangeMin, rangeMax, range[i].start, tolAngle);
            endAngle = this.widthToAngle(rangeMin, rangeMax, range[i].end, tolAngle);
            startAngle = (isValidRange) ? (start + ((progress.enableRtl) ? -startAngle : startAngle)) % 360 : start;
            endAngle = (isValidRange) ? (start + ((progress.enableRtl) ? -endAngle : endAngle)) % 360 : start;
            color = (progress.isGradient) ? 'url(#circleRangeGrad_' + i + ')' : range[i].color;
            option = new PathOption(
                progress.element.id + '_CircularRange_' + i, 'none', thickness, color, opacity,
                '0', getPathArc(centerX, centerY, radius, startAngle, endAngle, progress.enableRtl)
            );
            rangePath = progress.renderer.drawPath(option);
            rangeGroup.appendChild(rangePath);
            if (progress.isGradient) {
                if (range.length - 1 === i) {
                    endColor = range[i].color;
                } else {
                    endColor = range[i + 1].color;
                }
                gradient = this.setCircularGradientColor(
                    i, range[i].color, endColor, startAngle, endAngle, radius, centerX, centerY, progress
                );
                rangeGroup.appendChild(gradient);
            }
        }
        return rangeGroup;
    }

    private setLinearGradientColor(
        id: number, startColor: string, endColor: string, start: number, end: number, progress: ProgressBar
    ): Element {
        const stopColor: GradientColor[] = [];
        const option: LinearGradient = { id: 'lineRangeGrad_' + id + '', x1: start.toString(), x2: end.toString() };
        stopColor[0] = { color: startColor, colorStop: '50%' };
        stopColor[1] = { color: endColor, colorStop: '100%' };
        const linearGradient: Element = progress.renderer.drawGradient('linearGradient', option, stopColor);
        linearGradient.firstElementChild.setAttribute('gradientUnits', 'userSpaceOnUse');
        return linearGradient;
    }

    private setCircularGradientColor(
        id: number, startColor: string, endColor: string,
        start: number, end: number, rad: number, x: number, y: number, progress: ProgressBar
    ): Element {
        const stopColor: GradientColor[] = [];
        const pos1: Pos = degreeToLocation(x, y, rad, start);
        const pos2: Pos = degreeToLocation(x, y, rad, end);
        const option: LinearGradient = {
            id: 'circleRangeGrad_' + id + '', x1: pos1.x.toString(), x2: pos2.x.toString(),
            y1: pos1.y.toString(), y2: pos2.y.toString()
        };
        stopColor[0] = { color: startColor, colorStop: '50%' };
        stopColor[1] = { color: endColor, colorStop: '100%' };
        const linearGradient: Element = progress.renderer.drawGradient('linearGradient', option, stopColor);
        linearGradient.firstElementChild.setAttribute('gradientUnits', 'userSpaceOnUse');
        return linearGradient;
    }
}
