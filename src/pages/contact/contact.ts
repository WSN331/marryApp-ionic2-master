import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from "../../util/CalculateService";
import {MyStorage} from "../../util/MyStorage"
import {HomeIntroducePage} from "../home-introduce/home-introduce";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  public userId;

  /**
   * 我喜欢的
   */
  public likeList = [];

  /**
   * 喜欢我的
   */
  public beLikeList = [];


  constructor(public navCtrl: NavController, private myHttp : MyHttp, public imgService: ImgService, public memory: Memory,
              public calculateService:CalculateService, public myStorage: MyStorage) {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.userId = this.memory.getUser().id;
    this.getLikeList(refresher);
    this.getBeLikeList(refresher);
  }

  /**
   * 获取喜欢的列表
   */
  getLikeList(refresher?) {
    this.myStorage.getLikeList(this.userId).then((data)=>{
      var beginId = 0;
      if (data != null) {
        this.likeList = data;
        beginId = Number(data[0]["indexId"]) + 1;
      }
      console.log(beginId);
      this.myHttp.post(MyHttp.URL_LIKE_LIST, {
        userId: this.userId,
        beginId: beginId
      }, (data) => {
        console.log(data)
        this.likeList = data.userList.concat(this.likeList);
        this.myStorage.setLikeList(this.userId, this.likeList);
        if (typeof refresher !== 'undefined') {
          refresher.complete();
        }
      });

      this.myHttp.post(MyHttp.URL_LIKE_LIST, {
        userId: this.userId,
        beginId: 0
      }, (data) => {
        console.log(data)
        this.likeList = data.userList;
        this.myStorage.setLikeList(this.userId, this.likeList);
        if (typeof refresher !== 'undefined') {
          refresher.complete();
        }
      }, null ,true)
    })

  }

  /**
   * 获取被喜欢的列表
   */
  getBeLikeList(refresher?) {
    this.myStorage.getBeLikeList(this.userId).then((data)=> {
      var beginId = 0;
      if (data != null) {
        this.beLikeList = data;
        beginId = Number(data[0]["indexId"]) + 1;
      }

      this.myHttp.post(MyHttp.URL_BE_LIKE_LIST, {
        userId: this.userId,
        beginId: beginId
      }, (data) => {
        console.log(data)
        this.beLikeList = data.userList.concat(this.beLikeList);
        this.myStorage.setBeLikeList(this.userId, this.beLikeList);
        if (typeof refresher !== 'undefined') {
          refresher.complete();
        }
      })

      this.myHttp.post(MyHttp.URL_BE_LIKE_LIST, {
        userId: this.userId,
        beginId: 0
      }, (data) => {
        console.log(data)
        this.beLikeList = data.userList;
        this.myStorage.setBeLikeList(this.userId, this.beLikeList);
        if (typeof refresher !== 'undefined') {
          refresher.complete();
        }
      }, null, true)
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
  getIntroduce(user:any) {
    this.navCtrl.push(HomeIntroducePage, {baseInfo: user})
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
