import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {SafeUrl} from '@angular/platform-browser';
import {LoadingController} from 'ionic-angular';
import { Events } from 'ionic-angular';
// import { ViewChild } from '@angular/core';
// import { Slides } from 'ionic-angular';

import {MyHttp} from '../../util/MyHttp';
import {Memory} from '../../util/Memory'
import {ImgService} from '../../util/ImgService'

import {HomeIntroducePage} from '../../pages/home-introduce/home-introduce'
import {StartPage} from "../start/start";
import {SearchPage} from "../search/search";
import {UserDetailPage} from "../user-detail/user-detail"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  /**
   * 婚配对象列表
   */
  public userList = [];
  public id;

  // @ViewChild("homeSlides") slides: Slides;

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public alertCtrl:AlertController, public memory:Memory,
              private imgService:ImgService, public loadingCtrl:LoadingController, public events: Events) {
    this.getUserList();
    this.events.subscribe('e-home-list', () => {
      this.getUserList();
    })
  }

  // goToSlide(action: number) {
  //   console.log(this.sildes.getActiveIndex())
  //   this.slides.slideTo(this.sildes.getActiveIndex() + action);
  // }

  /**
   * 获取用户列表
   */
  getUserList() {
    this.id = this.memory.getUser().id;
    if (!this.id) {
      //TODO: testtesttest
      this.id = this.memory.getSex();
    }
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    if (this.id) {
      this.myHttp.post(MyHttp.URL_USER_LIST, {
        userId: this.id,
        size: 10,
        index: 1
      }, (data) => {
        loader.dismiss();
        console.log(data)
        if (data.listResult === '0') {
          this.userList = data.userList;
        } else if (data.listResult === '1'){
          this.alertCtrl.create({
            message: '亲~请先完善您的信息',
            buttons: [{
              text: 'OK',
              handler: ()=> {
                this.navCtrl.push(UserDetailPage);
              }
            }]
          }).present();
        }
      })
    }

  }

  /**
   *
   * @param image
   */
  changeImage(image:String):SafeUrl {
    return this.imgService.safeImage(image)
  }

  /**
   *
   * @param userId
   */
  getIntroduce(userId:any) {
    if (this.isLogin()) {
      this.navCtrl.push(HomeIntroducePage, {otherUserId: userId})
    } else {
      this.goToLogin();
    }
  }

  /**
   * 未登录
   */
  goToLogin() {
    this.alertCtrl.create({
      message: '亲~请先登录才能查看更多完整信息',
      buttons: [{
        text: 'OK',
        handler: ()=> {
          this.memory.setSex({});
          this.navCtrl.setRoot(StartPage);
        }
      }]
    }).present();
  }

  /**
   * 进入查询界面
   */
  goToSearch() {
    if (this.isLogin()) {
      this.navCtrl.push(SearchPage);
    } else {
      this.goToLogin()
    }
  }

  /**
   * 判断是否登录
   * @returns {any}
     */
  isLogin() {
    return this.memory.getUser().id ? true : false;
  }
}
