import {Component, ViewChild} from "@angular/core";
import {AlertController, Events, NavController, NavParams, Content} from "ionic-angular";

import * as AV from "leancloud-realtime"

import {Memory} from "../../util/Memory";
import {ImgService} from "../../util/ImgService";
import {MyStorage} from "../../util/MyStorage";

import {HomeIntroducePage} from '../../pages/home-introduce/home-introduce'

@Component({
  selector: 'page-communicate',
  templateUrl: 'communicate.html'
})

export class CommunicatePage {
  @ViewChild(Content) content: Content;

  //实时通信
  public realTime;
  //登录用户
  public mySelf;
  //通话用户
  public otherSelf;
  //登录用户的信息
  public mySelfMsg = {};
  //通话用户的信息
  public otherSelfMsg = {};
  //需要发送的信息
  public realSend;
  public sendText;
  //正在交谈的对话
  public conversation = null;
  //接收所有信息
  public subMsgList:any = [];

  public timer;

  constructor(public navCtrl:NavController, public navParams:NavParams, public memory:Memory,
              public events:Events, public alertCtrl:AlertController,
              public imgService:ImgService, public myStorage: MyStorage) {
    this.initAVcom();
    //得到最近20条聊天记录
    this.receiveMessageList();
    //得到在线消息
    this.receiveMessage((msg, conversation)=> {
      this.subMsgList.push(msg);
      console.log("您好")
      //及时更新页面
      this.ngFresh();
    });
  }

  goToUserPage() {
    this.navCtrl.push(HomeIntroducePage, {baseInfo: this.otherSelfMsg})
  }

  /**
   * 界面刷新
   */
  ngFresh() {
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=> {
      this.goToBottom();
      this.myStorage.setMsgList(this.mySelf, this.otherSelf,this.subMsgList);
      console.log("1");
    }, 1000);
  }

  ngOnDestroy() {
    // 当前聊天的对话收到了消息立即标记为已读
    if (this.conversation != null) {
      this.conversation.read().then((conversation)=> {
        console.log('对话已标记为已读');
      }).catch(console.error.bind(console));
      //更新之前的页面
      this.events.publish("e-people",this.otherSelf);
    }
  }


  //聊天窗口变换
  goToBottom() {
    let div = document.getElementById('first');
    if (div != null) {
      div.scrollTop = div.scrollHeight;
    }
    clearInterval(this.timer);
  }

  /**
   * 初始化
   */
  // private myInfo;
  initAVcom() {
    this.realTime = this.memory.getTiming();
    this.mySelfMsg = this.memory.getUser();
    this.mySelf = this.mySelfMsg['id']
    this.otherSelfMsg = this.navParams.get('person');
    this.otherSelf = this.otherSelfMsg['id']
  }

  /**
   * 发送信息
   */
  sendMessage() {
    // 用自己的id作为 clientId，获取 IMClient 对象实例
    if (this.sendText != null && this.sendText.toString().trim() != null) {
      this.realSend = this.sendText;

      let msg = new AV.TextMessage(this.realSend);
      msg["from"] = this.mySelf;

      console.log(msg.from);
      console.log(msg.text);
      console.log(msg.timestamp);
      this.subMsgList.push({from: msg.from, text: msg.text, timestamp: msg.timestamp});

      this.ngFresh();

      this.realTime.createIMClient(this.mySelf + '').then((my)=> {
        // 创建与Jerry之间的对话
        return my.createConversation({
          members: [this.otherSelf + ''],
          name: this.mySelf + '&' + this.otherSelf,
          unique: true,
        })
      }).then((conversation)=> {
        // 发送消息
        return conversation.send(new AV.TextMessage(this.realSend));
      }).then((message) => {
        console.log(this.mySelf + '&' + this.otherSelf, '发送成功！');
      }).catch(console.error);

      this.sendText = null;
    }
  }

  /**
   * 读取最近聊天记录
   */
  receiveMessageList() {
    this.conversation = this.navParams.get('talkmsg');
    console.log(this.conversation);
    if (this.conversation == null) {
      this.realTime.createIMClient(this.mySelf + '').then((my)=> {
        // 创建与Jerry之间的对话
        return my.createConversation({
          members: [this.otherSelf + ''],
          name: this.mySelf + '&' + this.otherSelf,
          unique: true,
        })
      }).then((conversation)=> {
        this.conversation = conversation;
        console.log(this.conversation);
        this.readOldMessage();
      });

    } else {
      this.readOldMessage();
    }
  }

  /**
   * 读取聊天记录
   */
  readOldMessage() {
    //读取最近20条消息
    this.getCloudMsgread(this.conversation);

    // 进入到对话页面时标记其为已读
    this.conversation.read().then((conversation)=> {
      console.log('对话已标记为已读');
    }).catch(console.error.bind(console));

    this.ngFresh();
    //clearInterval(this.timer);
  }

  /**
   * 上线后接收信息
   */
  receiveMessage(callBack:Function) {
    // Jerry 登录
    this.realTime.createIMClient(this.mySelf + '').then((my)=> {
      //在线实时通信
      my.on('message', (message, conversation)=> {
        console.log('在线通信消息' + message.text + '--' + message.type);
        callBack(message, conversation);
      });
    }).catch(console.error);
  }

  /**
   * 获取聊天记录(已读)
   */
  getCloudMsgread(conversation) {
    let queryJson = {limit: 30};
    // this.myStorage.getMsgList(this.mySelf, this.otherSelf).then((data) => {
    //   let queryJson = {limit: 20};
    //   if (data != null) {
    //     this.subMsgList = data;
    //     console.log(data)
    //     let lastMessage = data[data.length - 1];
    //
    //     if (lastMessage != null && lastMessage['timestamp'] != null) {
    //       console.log((lastMessage['timestamp']))
    //       console.log(new Date(lastMessage['timestamp']))
    //       queryJson['afterTime'] = new Date(lastMessage['timestamp']);
    //     }
    //   }
    conversation.queryMessages(queryJson).then((messages)=> {
      // 获取消息
      for (let msg of messages) {
        console.log(msg.from);
        console.log(msg.text);
        console.log(msg.timestamp);
        this.subMsgList.push({from: msg.from, text: msg.text, timestamp: msg.timestamp});
      }

      //及时更新页面
    }).catch(console.error.bind(console));


    // });

  }


  /**
   * 发送图片消息
   */
  sendImgMsg() {
    this.alertCtrl.create({
      title: "消息",
      subTitle: "神秘功能敬请期待！",
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

  scrollTo() {
    window.addEventListener('native.keyboardshow', (e:any) => {
      this.content.scrollTo(0, e.keyboardHeight);
    });
  }

}
