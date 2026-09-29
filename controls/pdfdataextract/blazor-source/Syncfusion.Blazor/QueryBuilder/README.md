# Syncfusion&reg; Blazor QueryBuilder Component

The Syncfusion&reg; [Blazor QueryBuilder Component](https://www.syncfusion.com/blazor-components/blazor-query-builder?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) enables building and editing complex filter conditions with a visual interface. It generates structured JSON filters that convert to SQL queries, supports AND/OR logic grouping, and integrates seamlessly with data grids and charts for advanced data filtering in Blazor applications.

## Key Features

* **Visual Query Builder** – Intuitive UI for building complex filter conditions
* **Multiple Condition Types** – Support for various operators (equals, contains, between, etc.)
* **Grouping Logic** – Combine conditions with AND/OR operators
* **JSON Query Output** – Structured JSON filters for easy SQL query generation
* **Customizable Fields** – Define filterable columns and data types
* **Template Support** – Custom templates for values, operators, and conditions
* **Data Visualization Integration** – Works with DataGrid, Charts, and other components
* **Keyboard Navigation** – Full accessibility support

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)

![Blazor QueryBuilder](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-query-builder.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.QueryBuilder
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.QueryBuilder
```

## Add Stylesheet and Script References

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**: add these to `wwwroot/index.html`.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the Blazor QueryBuilder component in a Razor page:

```razor
<SfQueryBuilder TValue="EmployeeDetails">
    <QueryBuilderColumns>
        <QueryBuilderColumn Field="EmployeeID" Label="Employee ID" Type="ColumnType.Number"></QueryBuilderColumn>
        <QueryBuilderColumn Field="FirstName" Label="First Name" Type="ColumnType.String"></QueryBuilderColumn>
        <QueryBuilderColumn Field="TitleOfCourtesy" Label="Title of Courtesy" Type="ColumnType.Boolean" Values="Values"></QueryBuilderColumn>
        <QueryBuilderColumn Field="Title" Label="Title" Type="ColumnType.String"></QueryBuilderColumn>
        <QueryBuilderColumn Field="HireDate" Label="Hire Date" Type="ColumnType.Date"></QueryBuilderColumn>
        <QueryBuilderColumn Field="Country" Label="Country" Type="ColumnType.String"></QueryBuilderColumn>
        <QueryBuilderColumn Field="City" Label="City" Type="ColumnType.String"></QueryBuilderColumn>
    </QueryBuilderColumns>
</SfQueryBuilder>

@code {
    private string[] Values = new string[] { "Mr.", "Mrs." };
    public class EmployeeDetails
    {
        public int EmployeeID { get; set; }
        public string FirstName { get; set; }
        public bool TitleOfCourtesy { get; set; }
        public string Title { get; set; }
        public DateTime HireDate { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
    }
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/query-builder/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/query-builder/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.QueryBuilder.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-query-builder?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/query-builder/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/query-builder-ui?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)

## Support

* [Support Portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget). 

* [Purchase a License](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

* **Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)

* **Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)

* **Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-query-builder-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET