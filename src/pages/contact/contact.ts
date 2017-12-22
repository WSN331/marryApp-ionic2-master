import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from "../../util/CalculateService";
import {HomeIntroducePage} from "../home-introduce/home-introduce";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  /**
   * 我喜欢的
   */
  public likeList;

  /**
   * 喜欢我的
   */
  public beLikeList;

  /**
   * 我收藏的
   */
  public collectList;

  constructor(public navCtrl: NavController, private myHttp : MyHttp, public imgService: ImgService, public memory: Memory,
              public calculateService:CalculateService) {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.getLikeList(refresher);
    this.getBeLikeList(refresher);
    this.getCollectList(refresher);
  }

  /**
   * 获取喜欢的列表
   */
  getLikeList(refresher?) {
    this.myHttp.post(MyHttp.URL_LIKE_LIST, {
      userId: this.memory.getUser().id
      /*userId:1*/
    }, (data) => {
      console.log(data)
      this.likeList = data.userList;
      if (typeof refresher !== 'undefined') {
        refresher.complete();
      }
    })
  }

  /**
   * 获取被喜欢的列表
   */
  getBeLikeList(refresher?) {
    this.myHttp.post(MyHttp.URL_BE_LIKE_LIST, {
      userId: this.memory.getUser().id
    }, (data) => {
      console.log(data)
      this.beLikeList = data.userList;
      if (typeof refresher !== 'undefined') {
        refresher.complete();
      }
    })
  }

  /**
   * 获取收藏的列表
   */
  getCollectList(refresher?) {
    this.myHttp.post(MyHttp.URL_COLLECT_LIST, {
      userId: this.memory.getUser().id
      /*userId:1*/
    }, (data) => {
      console.log(data)
      this.collectList = data.userList;
      if (typeof refresher !== 'undefined') {
        refresher.complete();
      }
    })
  }

  public select = "beLiked"
  /*
  * 将该页面拿出堆栈
  * */
  back(){
    this.navCtrl.pop();
  }
  /**
   * 进去详细界面
   * @param userId
   */
  getIntroduce(userId:any) {
    this.navCtrl.push(HomeIntroducePage, {otherUserId: userId})
  }

  /**
   * 不喜欢了
   */
  disLove(userId:any){
    this.myHttp.post(MyHttp.URL_DIS_LIKE, {
      userId: this.memory.getUser().id,
      toUserId: userId
    }, (data) => {
      this.doRefresh();
    })
  }

}
