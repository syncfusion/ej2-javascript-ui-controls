# Syncfusion® Blazor Scheduler

Full-featured event calendar component for Blazor applications. Manage appointments and schedules with drag-and-drop, resizing, resource scheduling, and multiple calendar views.

![Blazor Scheduler](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-scheduler.png)

## Key Features

- Multiple calendar views (Day, Week, Work Week, Month, Agenda, Month Agenda, and Year)
- Drag-and-drop and resizing of events
- Resource scheduling with grouping
- Time zones and holiday support
- Customizable event templates and tooltips
- Repeat events and recurrence support
- Mobile-friendly with touch gestures
- Keyboard navigation and accessibility
- Export to ICS format

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Schedule
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Schedule
```

## Add Stylesheet and Script References

For **Blazor Web App / Blazor Server**, add these to `Components/App.razor` or `App.razor`:
For **Blazor WebAssembly**, add these to `wwwroot/index.html`:

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

2. Add the Scheduler component to your Razor page:

```razor
@using Syncfusion.Blazor.Schedule

<SfSchedule TValue="ScheduleData" Height="650px" @bind-SelectedDate="SelectedDate">
    <ScheduleViews>
        <ScheduleView Option="View.Day"></ScheduleView>
        <ScheduleView Option="View.Week"></ScheduleView>
        <ScheduleView Option="View.Month"></ScheduleView>
    </ScheduleViews>
    <ScheduleEventSettings DataSource="@Events"></ScheduleEventSettings>
</SfSchedule>

@code {
    private DateTime SelectedDate = new DateTime(2023, 7, 5);
    private List<ScheduleData> Events = new List<ScheduleData>
    {
        new ScheduleData { Id = 1, Subject = "Team Standup", StartTime = new DateTime(2023, 7, 5, 10, 0, 0), EndTime = new DateTime(2023, 7, 5, 10, 30, 0) },
        new ScheduleData { Id = 2, Subject = "Project Meeting", StartTime = new DateTime(2023, 7, 5, 14, 0, 0), EndTime = new DateTime(2023, 7, 5, 15, 0, 0) }
    };

    public class ScheduleData
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/scheduler/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/scheduler/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Schedule.SfSchedule-1.html)
- [Live Demos](https://blazor.syncfusion.com/demos/scheduler/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-scheduler?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-scheduler-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET