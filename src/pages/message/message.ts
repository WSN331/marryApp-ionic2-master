import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";

import {ContactPage} from "../contact/contact";
import {PeoplePage} from "../perlist/people";
import {Memory} from "../../util/Memory";
import {CredListPage} from "../credList/credList";
import {MyHttp} from "../../util/MyHttp";
import {ImgService} from "../../util/ImgService";
import {CalculateService} from "../../util/CalculateService";
import {HomeIntroducePage} from "../home-introduce/home-introduce";

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})

export class MessagePage {

  public visiterList;

  constructor(public navCtrl:NavController,public memory:Memory, private myHttp : MyHttp,
              public imgService: ImgService, public calculateService:CalculateService) {
    this.doRefresh();
  }

  /**
   * 下拉刷新界面
   * @param refresher
   */
  doRefresh(refresher?) {
    this.getVisiters(refresher);
  }

  /**
   * 获取访问过我的人
   */
  getVisiters(refresher?){
    this.myHttp.post(MyHttp.URL_VISITER, {
      userId: this.memory.getUser().id
      /*userId:1*/
    }, (data) => {
      console.log(data)
      this.visiterList = data.visiters;
      if (typeof refresher !== 'undefined') {
        refresher.complete();
      }
    })
  }

  /**
   * 进去详细界面
   * @param userId
   */
  getIntroduce(userId:any) {
    this.navCtrl.push(HomeIntroducePage, {otherUserId: userId})
  }



  /*
* 将该页面拿出堆栈
* */
  back(){
    this.navCtrl.pop();
  }
}
