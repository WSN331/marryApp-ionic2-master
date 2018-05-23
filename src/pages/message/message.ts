import {Component} from "@angular/core";
import { NavController } from "ionic-angular";

import {Memory} from "../../util/Memory";
import {MyHttp} from "../../util/MyHttp";
import {MyStorage} from "../../util/MyStorage";
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
              public imgService: ImgService, public calculateService:CalculateService, public myStorage: MyStorage) {
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
      if (this.visiterList != null && this.visiterList.length > 0) {
        let last = this.visiterList[0];
        this.myStorage.setLastVisiterTime(this.memory.getUser().id, last['visitTime']);
      }
      if (typeof refresher !== 'undefined') {
        refresher.complete();
      }
    })
  }

  /**
   * 进去详细界面
   * @param userId
   */
  getIntroduce(user:any) {
    this.navCtrl.push(HomeIntroducePage, {baseInfo: user})
  }

  /*
* 将该页面拿出堆栈
* */
  back(){
    this.navCtrl.pop();
  }
}
