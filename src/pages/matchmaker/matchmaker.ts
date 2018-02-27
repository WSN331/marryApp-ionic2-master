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

  //系统对话id
  public mySysTaLkId = "5a93eced1579a3003847f3c";
  //实时通信
  public realTime;
  //登录用户
  public mySelf;
  //登录用户的信息
  public mySelfMsg={};
  //需要发送的信息
  public realSend;
  public sendText;
  //接收所有信息
  public subMsgList:any = [];

  constructor(public navCtrl:NavController,public navParams:NavParams,public memory:Memory,
              public events: Events,public alertCtrl:AlertController,private myHttp:MyHttp,
              public imgService: ImgService,private http:Http) {

/*    //初始化
    this.initAVcom();
    //获取广播信息
    this.receiveBroadMsg();
    //获取在线系统消息
    this.receiveOnlyMsg();*/
  };

  /**
   * 初始化LeanCloud消息机制
   */
  initAVcom(){
    this.realTime = this.memory.getTiming();
    this.mySelf = this.memory.getUser().id;
    //获取自己的信息
    this.getOtherPersonMsg(this.mySelf,(baseInfo)=>{
      console.log(baseInfo.nickName+"自己的信息BaseInfo");
      this.mySelfMsg = baseInfo;
    });
  }

  /**
   * 获取用户信息
   * @param otherUserId 需要获取信息
   * @param {Function} callBack
   */
  getOtherPersonMsg(otherUserId,callBack:Function) {
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.mySelf,
      otherUserId: otherUserId
    }, (data) => {
      console.log(data)
      let baseInfo = data.baseInfo || {};
      console.log(baseInfo);
      callBack(baseInfo);
    })
  }


  /**
   * 获取系统的广播消息
   */
  receiveBroadMsg(){
    let url = "https://ebxbjcmj.api.lncld.net/1.1/rtm/broadcast?conv_id="+this.mySysTaLkId;
    let headers  = new Headers();
    headers.append("X-LC-Id","EBxBJcMjbxzDsIiRPTUzfCNY-gzGzoHsz");
    headers.append("X-LC-Key","6qeIeUzo0pH82RWasc2JtcjL,master");
    let options = new RequestOptions({headers:headers});
    this.http.get(url,options).subscribe((data)=>{
      console.log(data);
    },(error)=>{
      console.log(error);
    })
  }

  /**
   * 获取系统的单独消息
   */
  receiveOnlyMsg(){

    let url = "https://ebxbjcmj.api.lncld.net/1.1/rtm/messages/history?convid="+this.mySysTaLkId;
    let headers  = new Headers();
    headers.append("X-LC-Id","EBxBJcMjbxzDsIiRPTUzfCNY-gzGzoHsz");
    headers.append("X-LC-Key","6qeIeUzo0pH82RWasc2JtcjL,master");
    let options = new RequestOptions({headers:headers});
    this.http.get(url,options).subscribe((data)=>{
      console.log(data);
    },(error)=>{
      console.log(error);
    })
  }

  /**
   * 通过REST API向系统发送消息
   */
  sendMessage(){
    // 用自己的id作为 clientId，获取 IMClient 对象实例
    if(this.sendText!=null && this.sendText.toString().trim()!=null){
      this.realSend = this.sendText;

      let msg = new AV.TextMessage(this.realSend);
      msg.from = this.mySelf;

      this.subMsgList.push(msg);

      //this.ngFresh();

      this.realTime.createIMClient(this.mySelf+'').then((my)=>{
        // 获取与系统之间的对话

        //监听与系统在线对话
/*        my.on('message', function(message, conversation) {
          console.log('Message received: ' + message.text);
        });*/
        return my.getConversion(this.mySysTaLkId);
      }).then((conversation)=>{
        // 发送消息
        return conversation.send(new AV.TextMessage(this.realSend));
      }).then((message) =>{
        console.log(this.mySelf+'&'+"系统", '发送成功！');
      }).catch(console.error);

      this.sendText = null;
    }
  }

  /*
  * 将该页面拿出堆栈
  * */
  back(){
    this.navCtrl.pop();
  }
}


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
/*    this.createTalk((data)=>{
     this.mySysTaLkId = data.objectId;
   })*/
/*  /!**
   * 创建系统对话
   *!/
  createTalk(success:Function){
    let sysTalkUrl = "https://ebxbjcmj.api.lncld.net/1.1/classes/_Conversation";
    let headers  = new Headers({'Content-Type':'application/json'});
    headers.append("X-LC-Id","EBxBJcMjbxzDsIiRPTUzfCNY-gzGzoHsz");
    headers.append("X-LC-Key","abhs8KVq3rqPpj9Lzubgi9tk");
    let options = new RequestOptions({headers:headers});
    let body = {"name":"系统通知","avatarURL":"http://ww1.sinaimg.cn/large/006y8lVajw1faip71wtc7j30200203ya.jpg", "sys": true};
    this.http.post(sysTalkUrl,JSON.stringify(body),options).subscribe(data=>{
      console.log(data);
      this.callBack(success,data);
    },(error)=>{
      console.log(error);
    });
  }

  callBack(success:Function,data:any){
    let body = JSON.parse(data._body);
    if(body.objectId != null && body.objectId != undefined){
      success(body);
    }
  }*/
