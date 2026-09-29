# Syncfusion® Blazor Gantt Chart

Professional project planning and scheduling component for Blazor applications. Display and manage hierarchical tasks with timelines, resource allocation, dependencies, and Gantt chart visualizations.

![Blazor Gantt Chart](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-gantt-chart.png)

## Key Features

- **Task Management**: Create, edit, and delete tasks with hierarchical structure
- **Timeline View**: Visual Gantt chart with customizable timeline scales
- **Resource Allocation**: Assign and manage resources across tasks
- **Dependencies**: Define and visualize task dependencies and relationships
- **Scheduling**: Auto-calculate dates based on duration and dependencies
- **Milestone Tracking**: Mark and track important project milestones
- **Drag and Drop**: Reschedule tasks by dragging on the timeline
- **Filtering and Sorting**: Filter tasks by status, resource, or custom criteria
- **Export**: Export project data to Excel, PDF, and other formats

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Gantt
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Gantt
```

## Add Stylesheet and Script References

For **Blazor Web App / Blazor Server**, add these to `Components/App.razor` or `App.razor`. For **Blazor WebAssembly**, add these to `wwwroot/index.html`:

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor service in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the Gantt Chart component to your Razor page:

```razor
@using Syncfusion.Blazor.Gantt

<SfGantt DataSource="@TaskCollection" Height="450px">
    <GanttTaskFields Id="TaskId" Name="TaskName" StartDate="StartDate" EndDate="EndDate" Duration="Duration" Progress="Progress" ParentID="ParentId"/>
    <GanttColumns>
        <GanttColumn Field="TaskId" HeaderText="Task ID" Width="100"/>
        <GanttColumn Field="TaskName" HeaderText="Task Name" Width="250"/>
        <GanttColumn Field="StartDate" HeaderText="Start Date" Format="yMd"/>
        <GanttColumn Field="EndDate" HeaderText="End Date" Format="yMd"/>
        <GanttColumn Field="Duration" HeaderText="Duration"/>
        <GanttColumn Field="Progress" HeaderText="Progress"/>
    </GanttColumns>
</SfGantt>

@code {
    private List<TaskData> TaskCollection = new();

    protected override void OnInitialized()
    {
        TaskCollection = new List<TaskData>
        {
            new TaskData() { TaskId = 1, TaskName = "Project initiation", StartDate = new DateTime(2024, 3, 29), EndDate = new DateTime(2024, 4, 2), Duration = 4 },
            new TaskData() { TaskId = 2, TaskName = "Identify site location", StartDate = new DateTime(2024, 3, 29), EndDate = new DateTime(2024, 3, 29), Duration = 4, Progress = 30, ParentId = 1 },
            new TaskData() { TaskId = 3, TaskName = "Perform soil test", StartDate = new DateTime(2024, 4, 3), EndDate = new DateTime(2024, 4, 4), Duration = 4, ParentId = 1 }
        };
    }

    public class TaskData
    {
        public int TaskId { get; set; }
        public string TaskName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Duration { get; set; }
        public int Progress { get; set; }
        public int ParentId { get; set; }
    }
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/gantt-chart/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/gantt-chart/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Gantt.SfGantt-1.html)
- [Live Demos](https://blazor.syncfusion.com/demos/gantt-chart/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-gantt-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-gantt-chart-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET