import { Component } from '@angular/core';
import {App, NavController} from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import { StartPage } from '../start/start'
import { UserIntroducePage } from '../user-introduce/user-introduce'
import { CredListPage } from '../credList/credList'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public user;

  constructor(public navCtrl: NavController, public imgService: ImgService, public memory: Memory,
              public app:App, public events: Events, public calculateService: CalculateService) {
    this.getUser();
    this.events.subscribe('e-user-self', () => {
      this.getUser();
    })
  }

  /**
   * 获取用户信息
   */
  getUser() {
    this.user = this.memory.getUser();
  }

  /**
   * 获取详细信息
   */
  getIntroduce() {
    this.navCtrl.push(UserIntroducePage);
  }

  /**
   * 进入信息认证详情界面
   */
  goToCredList() {
    this.navCtrl.push(CredListPage);
  }

  /**
   * 登出
   */
  logout() {
    // this.navCtrl.insert(0, StartPage);
    // this.navCtrl.pop();
    //window.location.reload();
    this.app.getRootNav().setRoot(StartPage);
    this.memory.setUser({});
  }

}
