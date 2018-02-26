import {Component} from "@angular/core";
import {AlertController, Events, NavController, NavParams} from "ionic-angular";
import { Http } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';


import * as AV from "leancloud-realtime"

import {Memory} from "../../util/Memory";
import {ImgService} from "../../util/ImgService";
import {MyHttp} from "../../util/MyHttp";



@Component({
  selector:'page-matchmaker',
  templateUrl:'matchmaker.html'
})

export class MatchmakerPage{

  constructor(public navCtrl:NavController,public navParams:NavParams,public memory:Memory,
              public events: Events,public alertCtrl:AlertController,private myHttp:MyHttp,
              public imgService: ImgService,private http:Http) {

  };

  /**
   * 短信验证REST API使用
   */
  sendMessage(){
/*    let url = "https://ebxbjcmj.api.lncld.net/1.1/requestSmsCode";
    let headers  = new Headers({'Content-Type':'application/json'});
    headers.append("X-LC-Id","EBxBJcMjbxzDsIiRPTUzfCNY-gzGzoHsz");
    headers.append("X-LC-Key","abhs8KVq3rqPpj9Lzubgi9tk");
    let options = new RequestOptions({headers:headers});
    this.http.post(url,JSON.stringify({"mobilePhoneNumber":"15728046598"}),options)
      .subscribe(data=>{
        console.log(data);
    },(error)=>{
      console.log(error);
    })*/
  }




  /*
  * 将该页面拿出堆栈
  * */
  back(){
    this.navCtrl.pop();
  }
}
