import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { BackgroundFetch } from '@ionic-native/background-fetch';


import { StartPage } from '../pages/start/start'
import { LoginPage } from '../pages/login/login'
import { RegisterPage } from '../pages/register/register'
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';
import { BlackPage } from '../pages/black/black';
import { AboutPage } from '../pages/about/about';
import { HomeIntroducePage } from '../pages/home-introduce/home-introduce'
import { UserIntroducePage } from '../pages/user-introduce/user-introduce'
import { UserDetailPage } from '../pages/user-detail/user-detail'
import { UserDetail1Page } from '../pages/user-detail1/user-detail1'
import { UserDetail2Page } from '../pages/user-detail2/user-detail2'
import { CredListPage } from '../pages/credList/credList'
import { AddCredPage } from '../pages/addCred/addCred'
import { AuthorInformationPage } from "../pages/authorInformation/authorInformation"
import { ControlImagePage } from "../pages/control-image/control-image"
import { AddTipPage } from "../pages/addTip/addTip"
import { SafePage } from "../pages/safe/safe"
import { DeleteUserPage } from "../pages/deleteUser/deleteUser"

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import {IonicStorageModule} from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Transfer } from '@ionic-native/transfer';
import { AppVersion } from '@ionic-native/app-version';
import { AppUpdate } from '@ionic-native/app-update';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

import { MyHttp } from '../util/MyHttp'
import { Memory } from '../util/Memory'
import { MyStorage } from '../util/MyStorage'
import { ImgService } from '../util/ImgService'
import {EveryPersonPage} from "../pages/every-person/every-person";
import {SearchPage} from "../pages/search/search";
import {MessagePage} from "../pages/message/message";
import {CalculateService} from '../util/CalculateService'
import {PeoplePage} from "../pages/perlist/people";
import {CommunicateService} from "../util/CommunicateService";
import {CommunicatePage} from "../pages/communicate/communicate";
import {PayPage} from "../pages/purchase/pay";
import {ForgetPage} from "../pages/forget/forget";
import {LargeImagePage} from "../pages/large-image/large-image"
import {MatchmakerPage} from "../pages/matchmaker/matchmaker";
import {GoagoPage} from "../pages/goago/goago";

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
    BlackPage,
    HomeIntroducePage,
    UserIntroducePage,
    UserDetailPage,
    UserDetail1Page,
    UserDetail2Page,
    EveryPersonPage,
    SearchPage,
    MessagePage,
    CredListPage,
    AddCredPage,
    PeoplePage,
    CommunicatePage,
    PayPage,
    AuthorInformationPage,
    ForgetPage,
    ControlImagePage,
    LargeImagePage,
    MatchmakerPage,
    AddTipPage,
    GoagoPage,
    SafePage,
    DeleteUserPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'arrow-back',
      tabsHideOnSubPages: 'true'
    }),
    IonicStorageModule.forRoot({
      name:'mydb',
      driverOrder:['indexeddb','sqlite','websql']
    }),
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
    BlackPage,
    UserDetail1Page,
    UserDetail2Page,
    EveryPersonPage,
    SearchPage,
    MessagePage,
    CredListPage,
    AddCredPage,
    PeoplePage,
    CommunicatePage,
    PayPage,
    AuthorInformationPage,
    ForgetPage,
    ControlImagePage,
    LargeImagePage,
    MatchmakerPage,
    AddTipPage,
    GoagoPage,
    SafePage,
    DeleteUserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    ImagePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MyHttp,
    Memory,
    MyStorage,
    ImgService,
    CalculateService,
    CommunicateService,
    AppVersion,
    File,
    FileOpener,
    Transfer,
    AppUpdate,
    InAppPurchase,
    BackgroundFetch
  ]
})
export class AppModule {}
