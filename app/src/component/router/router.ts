import { Routes } from "@angular/router";

import { MainComponent } from "../main/main.component";
import { PhotoComponent } from "../photo/photo.component";
import { MusicComponent } from "../music/music.component";
import { GameComponent } from "../game/game.component";

const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "photo", component: PhotoComponent },
    { path: "music", component: MusicComponent },
    { path: "game", component: GameComponent }
];

export { routes };
