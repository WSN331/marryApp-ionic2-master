import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'

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

  constructor(public navCtrl: NavController, private myHttp : MyHttp, public imgService: ImgService, public memory: Memory) {
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
    }, (data) => {
      console.log(data)
      this.collectList = data.userList;
      if (typeof refresher !== 'undefined') {
        refresher.complete();
      }
    })
  }


}
