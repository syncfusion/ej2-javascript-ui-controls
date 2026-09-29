# Angular Rich Text Editor UI

The Syncfusion Angular Rich Text Editor UI package provides an Angular wrapper for the Rich Text Editor UI component.

## Installation

Install the component and its peer dependencies from npm:

```bash
npm install @syncfusion/ej2-angular-richtexteditorui --save
```

## Setup

Import `RichTextEditorUIModule` in the application module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RichTextEditorUIModule } from '@syncfusion/ej2-angular-richtexteditorui';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, RichTextEditorUIModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

Add the component to a template:

```html
<ejs-richtexteditor-ui></ejs-richtexteditor-ui>
```

## Support

Product support is available through the [Syncfusion support portal](https://support.syncfusion.com/support/tickets/create).

## License

This is a commercial product and requires a Syncfusion license for possession or use. See the [Syncfusion EULA](https://www.syncfusion.com/eula/es/) for details.

Copyright Syncfusion Inc. All Rights Reserved.
