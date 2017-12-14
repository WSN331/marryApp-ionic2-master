import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {StartPage} from "../pages/start/start";
import {RegisterPage} from "../pages/register/register";
import {UserIntroducePage} from "../pages/user-introduce/user-introduce";





@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = UserIntroducePage;
  rootPage:any = StartPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
