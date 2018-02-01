import {Component, ViewChild } from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {LoadingController, Content } from 'ionic-angular';
import { Events } from 'ionic-angular';

import {MyHttp} from '../../util/MyHttp';
import {Memory} from '../../util/Memory'
import {ImgService} from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import {HomeIntroducePage} from '../../pages/home-introduce/home-introduce'
import {StartPage} from "../start/start";
import {UserDetailPage} from "../user-detail/user-detail"
import {CredListPage} from "../credList/credList";
import {PayPage} from "../purchase/pay";
import {SearchPage} from "../search/search";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(Content) content: Content;　　//获取界面Content的实例对象

  /**
   * 婚配对象列表
   */
  public userList = [];
  public id;
  public pageIndex;

  public displayTitle = true;

  public searchInfo =  {
    high : '',
    age : '',
    income : '',
    edu : ''
  };

  // @ViewChild("homeSlides") slides: Slides;

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public alertCtrl:AlertController,
              public memory:Memory, public imgService:ImgService, public loadingCtrl:LoadingController, public events: Events,
              public calculateService: CalculateService) {
    this.pageIndex = 1;
    this.getUserList();
    this.events.subscribe('e-home-list', () => {
      this.getUserList();
    });
    this.events.subscribe('e-home-search', (searchInfo)=>{
      this.searchInfo = searchInfo;
      this.userList = [];
      this.getUserList();
    })
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe(event => {
      console.log(event)
      if (event.directionY == "down") {
        this.displayTitle = false;
        document.getElementById("head").style.display="none";
      } else {
        this.displayTitle = true;
        document.getElementById("head").style.display="block";
      }
    });
  }

  doRefresh(refresher) {
    this.pageIndex = 1;
    this.userList = [];
    this.getUserList();
    setTimeout(() => {
      refresher.complete();
    },2000);
  }

  /**
   * 请先购买VIP
   */
  nextPage() {
    if (this.calculateService.isVip(this.memory.getUser().vipTime)) {
      this.pageIndex ++;
      this.getUserList();
    } else {
      this.alertCtrl.create({
        message: '亲~请先购买VIP',
        buttons: [{
          text:'NO'
        },
          {
            text: 'OK',
            handler: ()=> {
              this.navCtrl.push(PayPage);
            }
          }

        ]
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
      this.id = this.memory.getSex();
      console.log(this.id+"观光的id")
    }
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.searchInfo['userId'] = this.id;
    this.searchInfo['size'] = 10;
    this.searchInfo['index'] = this.pageIndex;
    if (this.id) {
      this.myHttp.post(MyHttp.URL_USER_SCREEN_LIST, this.searchInfo, (data) => {
        loader.dismiss();
        console.log(data)
        if (data.listResult === '0') {
          this.userList = this.userList.concat(data.userList);
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
      //是否登录
      this.goToLogin();
    } else if (!this.isCredMain()) {
      //是否通过认证
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
   * 认证信息提示
   */
  goToCred() {
    this.alertCtrl.create({
      message: '亲~请先认证信息才能查看更多完整信息',
      buttons: [
        {
          text: 'NO'
        },
        {
          text: 'OK',
          handler: ()=> {
            this.navCtrl.push(CredListPage);
          }
        }
      ]
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
    if (!this.isLogin()) {
      this.goToLogin()
    } else if(!this.isCredMain()){
      this.goToCred();
    }else{
      this.navCtrl.push(SearchPage);
    }
    /*this.searchPub("暂未开放");*/
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
