import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from "../../util/CalculateService";
import {HomeIntroducePage} from "../home-introduce/home-introduce";

@Component({
  selector: 'page-black',
  templateUrl: 'black.html'
})
export class BlackPage {

  /**
   * 喜欢我的
   */
  public hateList;

  constructor(public navCtrl: NavController, private myHttp : MyHttp, public imgService: ImgService, public memory: Memory,
              public calculateService:CalculateService) {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.getHateList(refresher)
  }

  /**
   * 获取喜欢的列表
   */
  getHateList(refresher?) {
    this.myHttp.post(MyHttp.URL_HATE_LIST, {
      userId: this.memory.getUser().id
      /*userId:1*/
    }, (data) => {
      console.log(data)
      this.hateList = data.userList;
      if (typeof refresher !== 'undefined') {
        refresher.complete();
      }
    })
  }

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
   * 不讨厌了
   */
  disHate(userId:any){
    this.myHttp.post(MyHttp.URL_DIS_HATE, {
      userId: this.memory.getUser().id,
      toUserId: userId
    }, (data) => {
      this.doRefresh();
    })
  }

}
