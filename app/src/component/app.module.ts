import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { routes } from "./router/router";

import { AppComponent } from "./app.component";
import { MainComponent } from "./main/main.component";
import { PhotoComponent } from "./photo/photo.component";

@NgModule({
    declarations: [AppComponent, MainComponent, PhotoComponent],
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
