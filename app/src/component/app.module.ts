import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { routes } from "./router/router";

import { HomeComponent } from "./home/home.component";
import { MainComponent } from "./main/main.component";
import { PhotoComponent } from "./photo/photo.component";
import { MusicComponent } from "./music/music.component";

@NgModule({
    declarations: [HomeComponent, MainComponent, PhotoComponent, MusicComponent],
    imports: [BrowserModule, HttpClientModule, FormsModule, RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [],
    bootstrap: [HomeComponent]
})
export class AppModule {}
