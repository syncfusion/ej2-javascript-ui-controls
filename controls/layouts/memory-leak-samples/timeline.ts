import { Timeline, TimelineItemModel } from '../src/timeline/index';

let timelineObj: Timeline;

document.getElementById('render').addEventListener('click', renderTimeline);
document.getElementById('destroy').addEventListener('click', destroyTimeline);

const gitHubRoadmap = [
    { icon: "sf-icon-commit", message: "Created 10 commits in 5 repositories" },
    { icon: "sf-icon-create", message: "Created 1 repository" },
    { icon: "sf-icon-pull", message: "Created a pull request in <u>organization/new-control-roadmap</u>" },
    { icon: "sf-icon-review", message: "Reviewed 3 pull requests in 2 repositories" }
];

const timelineItems: TimelineItemModel[] = gitHubRoadmap.map(({ icon, message }) => ({
    dotCss: icon,
    content: message
}));

function renderTimeline(): void {
    timelineObj = new Timeline({
        items: timelineItems,
        cssClass: 'custom-timeline',
        template: '#custom-template'
    });
    timelineObj.appendTo('#template');
}

function destroyTimeline(): void {
    if (timelineObj && !timelineObj.isDestroyed) {
        timelineObj.destroy();
        timelineObj = null;
    }
}