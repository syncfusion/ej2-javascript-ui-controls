import { ProgressBar } from '../progressbar';
import { lineCapRadius, completeAngle } from '../model/constant';
import { getPathArc } from '../utils/helper';
import { PathOption } from '@syncfusion/ej2-svg-base';

/** 
 * Progressbar Segment 
 */
export class Segment {

    /** To render the linear segment */
    public createLinearSegment(progress: ProgressBar, id: string, width: number, opacity: number, thickness: number): Element {
        let locX: number = (progress.enableRtl) ? ((progress.cornerRadius === 'Round') ?
            (progress.progressRect.x + progress.progressRect.width) - ((lineCapRadius / 2) * thickness) :
            (progress.progressRect.x + progress.progressRect.width)) :
            ((progress.cornerRadius === 'Round') ? (progress.progressRect.x + (lineCapRadius / 2) * thickness) : progress.progressRect.x);
        let locY: number = (progress.progressRect.y + (progress.progressRect.height / 2));
        let gapWidth: number = (progress.gapWidth || progress.themeStyle.linearGapWidth);
        let avlWidth: number = progress.progressRect.width / progress.segmentCount;
        let avlSegWidth: number = (progress.progressRect.width - ((progress.segmentCount - 1) * gapWidth));
        avlSegWidth = (avlSegWidth -
            ((progress.cornerRadius === 'Round') ? progress.segmentCount * (lineCapRadius * thickness) : 0)) / progress.segmentCount;
        let gap: number = (progress.cornerRadius === 'Round') ? (gapWidth + (lineCapRadius * thickness)) : gapWidth;
        let segmentGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + id });
        let count: number = Math.ceil(width / avlWidth);
        let segWidth: number;
        let color: string;
        let j: number = 0;
        let option: PathOption;
        let segmentPath: Element;
        let tolWidth: number = (progress.cornerRadius === 'Round') ? (width - (lineCapRadius * thickness)) : width;
        let linearThickness: number = progress.progressThickness || progress.themeStyle.linearProgressThickness;
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
        value: number, opacity: number, thickness: number
    ): Element {
        let start: number = progress.startAngle;
        let totalAngle: number = progress.totalAngle;
        let end: number = this.widthToAngle(progress.minimum, progress.maximum, value, totalAngle);
        end -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progress.trackwidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        let size: number = (progress.trackwidth - (
            (progress.totalAngle === completeAngle) ? progress.segmentCount :
                progress.segmentCount - 1) * (progress.gapWidth || progress.themeStyle.circularGapWidth)
        );
        size = (size -
            ((progress.cornerRadius === 'Round') ?
                (((progress.totalAngle === completeAngle) ?
                    progress.segmentCount : progress.segmentCount - 1) * lineCapRadius * thickness) : 0)) / progress.segmentCount;
        let avlTolEnd: number = this.widthToAngle(0, progress.trackwidth, (progress.trackwidth / progress.segmentCount), totalAngle);
        avlTolEnd -= (progress.cornerRadius === 'Round' && progress.totalAngle === completeAngle) ?
            this.widthToAngle(0, progress.trackwidth, ((lineCapRadius / 2) * thickness), totalAngle) : 0;
        let avlEnd: number = this.widthToAngle(0, progress.trackwidth, size, totalAngle);
        let gap: number = this.widthToAngle(
            0, progress.trackwidth, (progress.gapWidth || progress.themeStyle.circularGapWidth), totalAngle
        );
        gap += (progress.cornerRadius === 'Round') ? this.widthToAngle(0, progress.trackwidth, (lineCapRadius * thickness), totalAngle) : 0;
        let segmentGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + id });
        let gapCount: number = Math.floor(end / avlTolEnd);
        let count: number = Math.ceil((end - gap * gapCount) / avlEnd);
        let segmentPath: string;
        let circularSegment: Element;
        let segmentEnd: number;
        let avlSegEnd: number = (start + ((progress.enableRtl) ? -avlEnd : avlEnd)) % 360;
        let color: string;
        let j: number = 0;
        let option: PathOption;
        let circularThickness: number = progress.progressThickness || progress.themeStyle.circularProgressThickness;
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
        let angle: number = ((value - min) / (max - min)) * totalAngle;
        return angle;
    }
}