import {Component, ViewChild  } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Content } from 'ionic-angular';
import { Events } from 'ionic-angular';

import {MyHttp} from '../../util/MyHttp';
import {ImgService} from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import {StartPage} from "../start/start";

@Component({
  selector: 'page-goago',
  templateUrl: 'goago.html',
})

export class GoagoPage {
  @ViewChild(Content) content: Content;　　//获取界面Content的实例对象
  private PAGE_SIZE = 10;

  /**
   * 婚配对象列表
   */
  public userList = [];

  public pageIndex;

  public displayTitle = true;

  private showBtnGetMore = false;
  constructor(public navCtrl:NavController, private myHttp:MyHttp, public alertCtrl:AlertController,
              public imgService:ImgService, public events: Events, public calculateService: CalculateService,
              public navParams: NavParams) {
    this.pageIndex = 1;
    this.getUserList();
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe(event => {
      if (event.directionY == "down") {
        this.displayTitle = false;
        document.getElementById("head").style.opacity ="0";
      } else {
        this.displayTitle = true;
        document.getElementById("head").style.opacity ="1";
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
   * 获取用户列表
     */
  getUserList(notDialog?) {

    /**
     * 每次先获取一张
     */
    this.showBtnGetMore = false;
    if (notDialog == null) {
      notDialog = false;
    }
    this.getUserListStep(1, notDialog);
  }

  getUserListStep(i:number, notDialog) {
    this.doGetUserList(1, this.userList.length + 1,(userList)=>{
      this.userList = this.userList.concat(userList);
      if (i < this.PAGE_SIZE) {
        this.getUserListStep(i+1, true);
      } else {
        this.showBtnGetMore = true;
      }
    }, notDialog);
  }

  /**
   * 实施获取用户列表
   */
  doGetUserList(pageSize, pageIndex, funcAddList : Function, notDialog) {
    this.myHttp.post(MyHttp.URL_SEEEACHOTHER, {
      sex: this.navParams.get("sex"),
      size: pageSize,
      index: pageIndex
    }, (data) => {
      funcAddList(data.userList);
    }, null, notDialog);
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
          this.navCtrl.setRoot(StartPage);
        }
      }]
    }).present();
  }

}
