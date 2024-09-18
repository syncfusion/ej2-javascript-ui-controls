import { ProgressBar} from '../src/index';
/**
 * Sample of Progress bar.
 */
let uploadProgress: ProgressBar = new ProgressBar({
        type: 'Linear',
        height: '60',
        value: 100,
        width:'600',
        progressThickness:10,
        trackThickness:10,
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        },
    });
    uploadProgress.appendTo('#lineardeterminate');
    let successProgress: ProgressBar = new ProgressBar({
        type: 'Linear',
        isIndeterminate: true,
        value: 20,
        width:'600',
        progressThickness:10,
        trackThickness:10,
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        },
    });
    successProgress.appendTo('#linearindeterminate');
    let warningsProgress: ProgressBar = new ProgressBar({
        type: 'Linear',
        height: '60',
        value: 40,
        secondaryProgress: 60,
        width:'600',
        progressThickness:10,
        trackThickness:10,
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        },
    });
    warningsProgress.appendTo('#linearbuffer');
    let errorProgress: ProgressBar = new ProgressBar({
        type: 'Linear',
        height: '60',
        segmentCount: 8,
        value: 100,
        width:'600',
        progressThickness:10,
        trackThickness:10,
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        },
    });
    errorProgress.appendTo('#linearsegment');

    let circluar: ProgressBar = new ProgressBar({
        type: 'Circular',
        value: 100,
        width: '160px',
        height: '160px',
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        }
    });
    circluar.appendTo('#circular-container');
    let rtl: ProgressBar = new ProgressBar({
        type: 'Circular',
        value: 70,
        secondaryProgress: 90,
        width: '160px',
        height: '160px',
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        },
    });
    rtl.appendTo('#rtl-container');
    let track: ProgressBar = new ProgressBar({
        type: 'Circular',
        value: 100,
        segmentCount: 4,
        width: '160px',
        height: '160px',
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        },
    });
    track.appendTo('#track-container');
    let rounded: ProgressBar = new ProgressBar({
        type: 'Circular',
        value: 20,
        width: '160px',
        height: '160px',
        cornerRadius: 'Round',
        isIndeterminate: true,
        animation: {
            enable: true,
            duration: 2000,
            delay: 0,
        },
    });
    rounded.appendTo('#rounded-container');
