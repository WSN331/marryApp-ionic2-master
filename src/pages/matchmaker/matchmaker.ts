import {Component} from "@angular/core";
import {AlertController, Events, NavController, NavParams} from "ionic-angular";

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
  public mySysTaLkId = "5a93eced1579a3003847f3c2";

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
  //获取对话
  public conversation = null;

  constructor(public navCtrl:NavController,public navParams:NavParams,public memory:Memory,
              public events: Events,public alertCtrl:AlertController,private myHttp:MyHttp,
              public imgService: ImgService) {
    //初始化
    this.initAVcom();

    //得到最近20条聊天记录
    this.receiveMessageList();

    //得到与系统的在线消息
    this.receiveMessage((msg,conversation)=> {
      this.subMsgList.push(msg);
      //及时更新页面
      this.ngFresh();
    });

    this.ngFresh();
  };

  /**
   * 界面刷新
   */
  ngFresh(){
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=>{
      this.gotoBottom();
      console.log("1");
    },1000);
  }

  public timer;

  //聊天窗口变换
  gotoBottom(){
    let div = document.getElementById('first');
    if(div!=null){
      div.scrollTop = div.scrollHeight;
    }
    clearInterval(this.timer);
  }

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
   * 读取最近聊天记录
   */
  receiveMessageList(){
    this.realTime.createIMClient(this.mySelf+'').then((my)=>{
      // 获取与系统之间的对话
      return my.getConversation(this.mySysTaLkId+'');
    }).then((conversation)=>{
      if(conversation!=null){
        this.conversation = conversation;
        this.getCloudMsgread(conversation);
      }
    }).catch(console.error);

    if(this.conversation!=null){
      //读取最近20条消息
      this.getCloudMsgread(this.conversation);

      // 进入到对话页面时标记其为已读
      this.conversation.read().then((conversation)=> {
        console.log('对话已标记为已读');
      }).catch(console.error.bind(console));
      clearInterval(this.timer);
    }
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

      this.ngFresh();

      this.realTime.createIMClient(this.mySelf+'').then((my)=>{
        // 获取与系统之间的对话
        return my.getConversation(this.mySysTaLkId+'');
      }).then((conversation)=>{
        // 发送消息
        return conversation.send(new AV.TextMessage(this.realSend));
      }).then((message) =>{
        console.log(this.mySelf+'&'+"系统", '发送成功！');
      }).catch(console.error);

      this.sendText = null;
    }
  }

  /**
   * 获取聊天记录(已读)
   */
  getCloudMsgread(conversation){
    conversation.queryMessages({
      limit: 20, // limit 取值范围 1~1000，默认 20
    }).then((messages)=>{
      // 获取消息
      for(let msg of messages){
        console.log(msg.from+"获取的消息");
        console.log(msg.toString());
        this.subMsgList.push(msg);
      }
      //及时更新页面
    }).catch(console.error.bind(console));
  }

  /**
   * 上线后接收信息
   */
  receiveMessage(callBack:Function){
    // Jerry 登录
    this.realTime.createIMClient(this.mySelf+'').then((my)=> {
      //监听与系统在线对话
      my.on('message', (message, conversation)=> {
        console.log('在线通信消息' + message.text+'--'+message.type);
        callBack(message,conversation);
      });
    }).catch(console.error);
  }

  /*
  * 将该页面拿出堆栈
  * */
  back(){
    this.navCtrl.pop();
  }

}

/*//http的头
public headers;
//获取广播消息的url
public broadURL = "https://ebxbjcmj.api.lncld.net/1.1/rtm/broadcast?conv_id="+this.mySysTaLkId;
//获取系统单独消息的url
public sysMsgURL = "https://ebxbjcmj.api.lncld.net/1.1/rtm/messages/history?convid=";*/

/*    //获取广播信息
    this.receiveBroadMsg((data)=>{
      console.log(data.length +"广播数组的长度");
      console.log(data[1]);
      for(let i = (data.length-1);i>=0;i--){
        console.log(data[i])
        this.subMsgList.push(data[i]);
      }
    });
    //获取系统与用户消息记录
    this.receiveOnlyMsg((data)=>{
      for(let i = (data.length-1);i>=0;i--){
        console.log(data[i])
        this.subMsgList.push(data[i]);
      }
    });*/

/*    this.headers  = new Headers();
    this.headers.append("X-LC-Id","EBxBJcMjbxzDsIiRPTUzfCNY-gzGzoHsz");
    this.headers.append("X-LC-Key","6qeIeUzo0pH82RWasc2JtcjL,master");*/
/*  /!**
   * 获取系统的广播消息
   *!/
  receiveBroadMsg(callBack:Function){
    let options = new RequestOptions({headers:this.headers});
    this.http.get(this.broadURL,options).subscribe((data)=>{
      console.log(data);
      this.parseJson(callBack,data);
    },(error)=>{
      console.log(error);
    })
  }

  /!**
   * 解析JSON数据
   *!/
  parseJson(callBack: Function, data: any){
      let body = JSON.parse(data._body);
      console.log(body);
      callBack(body);
  }

  /!**
   * 解析JSON数据直接输出
   *!/
  parseJsonTo(data:any){
    let body = JSON.parse(data);
    return body._lctext;
  }


  /!**
   * 获取系统的单独消息
   * 获取系统与用户的聊天消息记录
   *!/
  receiveOnlyMsg(callBack:Function){
    let options = new RequestOptions({headers:this.headers});
    let md5Str = Md5.hashStr(this.mySysTaLkId+":"+this.mySelf)
    console.log(md5Str+"-md5字符串-"+(this.mySysTaLkId+":"+this.mySelf));
    let myRealUrl = this.sysMsgURL+md5Str.toString();
    console.log(myRealUrl+"系统url")
    this.http.get(myRealUrl,options).subscribe((data)=>{
      console.log(data);
      this.parseJson(callBack,data);
    },(error)=>{
      console.log(error);
    })
  }*/
