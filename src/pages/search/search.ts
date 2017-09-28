import {Component} from "@angular/core";
import {selector} from "rxjs/operator/multicast";
import {NavController} from "ionic-angular";
import {HomeIntroducePage} from "../home-introduce/home-introduce";

@Component({
  selector:"page-search",
  templateUrl:"search.html"
})

export class SearchPage{

  private userid;

  private searchItem = {
    high : '',
    age : '',
    income : '',
    live : ''
  }
  private VsearchItem = {
    home :'',
    edu :'',
    constellation:'',
    zodiac:'',
    marriage:''
  }

  constructor(public navCtrl:NavController){
  }

  /**
   * 点击搜索id
   */
  gotoIntroduce(){
    if(this.userid){
      this.navCtrl.push(HomeIntroducePage, {otherUserId: this.userid});
    }
  }

  /**
   * 退出
   */
  inputClear(){
    this.navCtrl.pop();
  }
}

