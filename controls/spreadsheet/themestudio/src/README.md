# Theme studio

Theme Studio for Syncfusion EJ2 and Blazor Components, can be used to customize a new theme from an existing theme. It does not support data visualization controls such as Chart, Diagram, Gauge, Range Navigator, and Maps.

The Syncfusion EJ2 and Blazor themes are developed under the SCSS environment. Each theme has a unique common variable list. When you change the common variable color code value, it will reflect in all the Syncfusion EJ2 and Blazor components. The common variable list is handled inside the Theme Studio application for customizing theme-based colors.

## Steps to download the themes

1. Open the Theme Studio site.
2. Select the needed components, themes, custom color & font and click the download option.
3. By clicking the download option, the popup will opens and it asks the `Include compatibility css` option. If you need the EJ1 and EJ2 themes compatibility, select the `Include compatibility css` option checkbox and download the themes.

## Downloaded themes folder structure

If you're downloaded the Fluent theme in Theme Studio with compatibility css, the downloaded file will be in the below structure.

```
Fluent Theme
|   fluent.scss
│   fluent.css
│   fluent.min.css
|   settings.json
|
│__ compatibility
│   │   fluent.scss
│   │   fluent.css
│   │   fluent.min.css
│   │
│   │__ individual-scss
│          (Component wise individual SCSS files)
|
|__ individual-scss
       (Component wise individual SCSS files)
```

The `individual-scss` folder contains the selected component wise scss files separately. You can use the individual theme SCSS file also by compiling it to CSS and referring it to your application.

The `settings.json` file contains the selected component, theme and custom font & color details. You can also have option to import the `settings.json` file in Theme Studio to download the themes with previously customized themes.
