import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {HomeIntroducePage} from "../home-introduce/home-introduce";

@Component({
  selector:"page-search",
  templateUrl:"search.html"
})

export class SearchPage{

  /**
   *
   */
  private userId;

  /**
   *
   * @type {{high: string, age: string, income: string, live: string}}
     */
  private searchItem = {
    high : '',
    age : '',
    income : '',
    live : ''
  }

  /**
   *
   * @type {{home: string, edu: string, constellation: string, zodiac: string, marriage: string}}
     */
  private vSearchItem = {
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
  goToIntroduce(){
    console.log(this.searchItem)
    console.log(this.vSearchItem)
    if(this.userId){
      this.navCtrl.push(HomeIntroducePage, {otherUserId: this.userId});
    }
  }

  /**
   * 退出
   */
  inputClear(){
    this.navCtrl.pop();
  }
}

