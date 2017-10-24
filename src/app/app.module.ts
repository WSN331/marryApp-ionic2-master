import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { StartPage } from '../pages/start/start'
import { LoginPage } from '../pages/login/login'
import { RegisterPage } from '../pages/register/register'
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';
import { AboutPage } from '../pages/about/about';
import { HomeIntroducePage } from '../pages/home-introduce/home-introduce'
import { UserIntroducePage } from '../pages/user-introduce/user-introduce'
import { UserDetailPage } from '../pages/user-detail/user-detail'
import { CredListPage } from '../pages/credList/credList'
import { AddCredPage } from '../pages/addCred/addCred'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';

import { MyHttp } from '../util/MyHttp'
import { Memory } from '../util/Memory'
import { ImgService } from '../util/ImgService'
import {EveryPersonPage} from "../pages/every-person/every-person";
import {SearchPage} from "../pages/search/search";
import {MessagePage} from "../pages/message/message";
import {CalculateService} from '../util/CalculateService'

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    StartPage,
    LoginPage,
    RegisterPage,
    HomeIntroducePage,
    UserIntroducePage,
    UserDetailPage,
    EveryPersonPage,
    SearchPage,
    MessagePage,
    CredListPage,
    AddCredPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    StartPage,
    LoginPage,
    RegisterPage,
    HomeIntroducePage,
    UserIntroducePage,
    UserDetailPage,
    EveryPersonPage,
    SearchPage,
    MessagePage,
    CredListPage,
    AddCredPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MyHttp,
    Memory,
    ImgService,
    CalculateService
  ]
})
export class AppModule {}
