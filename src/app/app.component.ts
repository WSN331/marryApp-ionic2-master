import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserDetailPage } from '../pages/user-detail/user-detail';
import { StartPage } from '../pages/start/start'
import {MessagePage} from "../pages/message/message";
import {ContactPage} from "../pages/contact/contact";
import {CommunicatePage} from "../pages/communicate/communicate";
import {PeoplePage} from "../pages/perlist/people";
import {LoginPage} from "../pages/login/login";
import {ForgetPage} from "../pages/forget/forget";
import {RegisterPage} from "../pages/register/register";
import {PayPage} from "../pages/purchase/pay";
import {SearchPage} from "../pages/search/search";
import {AboutPage} from "../pages/about/about";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = StartPage;
   rootPage:any = AboutPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
