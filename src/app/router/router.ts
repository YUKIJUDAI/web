import { Routes } from '@angular/router';

import { MainComponent } from '../main/main.component';
import { PhotoComponent } from '../photo/photo.component';

const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'photo', component: PhotoComponent }
];

export { routes };