import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { HomePageComponent } from './home-page/home-page.component';
import { StatsPageComponent } from './stats-page/stats-page.component';
import { RulesPageComponent } from './rules-page/rules-page.component';

const routes: Routes = [
    { path: '', component: HomePageComponent},
    { path: 'game', component: GameComponent},
    { path: 'stats', component: StatsPageComponent},
    { path: 'rules', component: RulesPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
