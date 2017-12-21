import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import { Events } from 'ionic-angular';

import {MyHttp} from '../../util/MyHttp';
import {Memory} from '../../util/Memory'
import {ImgService} from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

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
  public pageIndex;

  // @ViewChild("homeSlides") slides: Slides;

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public alertCtrl:AlertController, public memory:Memory,
              public imgService:ImgService, public loadingCtrl:LoadingController, public events: Events,
              public calculateService: CalculateService) {
    this.pageIndex = 1;
    this.getUserList();
    this.events.subscribe('e-home-list', () => {
      this.getUserList();
    })
  }

  nextPage() {
    if (this.calculateService.isVip(this.memory.getUser().vipTime)) {
      this.pageIndex ++;
      this.getUserList();
    } else {
      this.alertCtrl.create({
        message: '亲~请先购买VIP',
        buttons: [{
          text: 'OK',
          handler: ()=> {
          }
        }]
      }).present();
    }
  }

  /**
   * 获取用户列表
   */
  getUserList() {
    this.id = this.memory.getUser().id;
    console.log(this.id+"现在登录的id")
    if (!this.id) {
      //TODO: testtesttest
      this.id = this.memory.getSex();
      console.log(this.id+"观光的id")
    }
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    if (this.id) {
      this.myHttp.post(MyHttp.URL_USER_LIST, {
        userId: this.id,
        size: 10,
        index: this.pageIndex
      }, (data) => {

        loader.dismiss();
        console.log(data)
        if (data.listResult === '0') {
          this.userList = data.userList;
        } else if (data.listResult === '1'){
          this.alertCtrl.create({
            message: '没有更多用户啦',
            buttons: [{
              text: 'OK',
              handler: ()=> {
              }
            }]
          }).present();
        } else if (data.listResult === '2'){

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

        //提示用户有未读消息
        let isMsg = this.memory.getMsg();
        if(isMsg){
          this.searchPub("又有人找您啦~");
        }

      })
    }

  }

  /**
   *
   * @param userId
   */
  getIntroduce(userId:any) {
    if (!this.isLogin()) {
      this.goToLogin();
    } else if (!this.isCredMain()) {
      this.goToCred();
    } else {
      this.navCtrl.push(HomeIntroducePage, {otherUserId: userId})
    }
  }

  /**
   *
   * @returns {boolean}
     */
  isCredMain() {
    return this.memory.getUser().mainCredNum >= 3;
  }

  /**
   *
   */
  goToCred() {
    this.alertCtrl.create({
      message: '亲~请先认证信息才能查看更多完整信息',
      buttons: [{
        text: 'OK',
        handler: ()=> {

        }
      }]
    }).present();
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


  /**
   * 提示框
   * @param subTitle
   */
  searchPub(subTitle: string) {
    this.alertCtrl.create({
      title: "消息",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }
}
