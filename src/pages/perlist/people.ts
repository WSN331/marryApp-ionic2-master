import {ChangeDetectorRef, Component} from "@angular/core";
import {AlertController, Events, NavController} from "ionic-angular";

import {Memory} from "../../util/Memory";
import {MyStorage} from "../../util/MyStorage";
import {MyHttp} from "../../util/MyHttp";
import {ImgService} from "../../util/ImgService";
import {CalculateService} from "../../util/CalculateService";

import {PayPage} from "../purchase/pay";
import {MatchmakerPage} from "../matchmaker/matchmaker";
import {CommunicatePage} from "../communicate/communicate";
import {HomeIntroducePage} from "../home-introduce/home-introduce";
import {ContactPage} from "../contact/contact";
import {CredListPage} from "../credList/credList";
import {MessagePage} from "../message/message";


@Component({
  selector: 'page-peoples',
  templateUrl: 'people.html'
})

export class PeoplePage {

  //通信初始化有关
  public realTime;
  //本人
  public mySelf;
  //通话记录
  public conversations:any = [];
  public timer;

  constructor(public navCtrl:NavController, public memory:Memory, public events:Events,
              public changeDetectorRef:ChangeDetectorRef, public myHttp:MyHttp,
              public imgService:ImgService, public calculateService:CalculateService,
              public alertCtrl:AlertController, public myStorage: MyStorage) {
    this.init()
    this.ngReFresh();
    this.events.subscribe('e-people', () => {
    });
  }

  /**
   * 初始化界面
   */
  init() {
    this.mySelf = this.memory.getUser().id;
    this.myStorage.getCommunicateList(this.mySelf).then((commList) => {
      if (commList != null) {
        this.conversations = commList
      }
    })

  }

  /**
   * 刷新
   */
  ngReFresh() {
    this.getCommunicateList();
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=> {
      this.changeDetectorRef.detectChanges();
      this.getCommunicateList(2);
      console.log("1");
      this.saveConversations();

    }, 2000);
  }

  /**
   * 存储聊天记录
   */
  saveConversations() {
    let commList = [];
    for (let conversation of this.conversations) {
      let comm = {
        baseInfo: conversation.baseInfo,
        isDefaultPic: conversation.isDefaultPic,
        show: conversation.show,
        talk: {
        }
      };
      commList[commList.length] = comm;
    }
    this.myStorage.setCommunicateList(this.mySelf, commList)
  }


  /**
   * 退出页面
   */
  ngOnDestroy() {
    if (this.timer) {
      this.changeDetectorRef.detach();
      clearInterval(this.timer);
    }
  }

  /**
   * 用户登录并监听消息
   */
  getCommunicateList(secondAgo?) {
    if (this.memory.getConversion().size > 0 && this.memory.getConversion() != null) {
      this.conversations = this.memory.getConversion();
    }
    this.realTime = this.memory.getTiming();
    this.mySelf = this.memory.getUser().id;

    this.realTime.createIMClient(this.mySelf + '').then((my)=> {

      let myQuery = my.getQuery();

      if (secondAgo != null && !isNaN(secondAgo)) {
        let time = new Date(Date.now() - secondAgo * 1000);
        myQuery.greaterThan('lm', time);
      }

      myQuery.limit(100).containsMembers([this.mySelf + '']).find().then((conversations)=> {
        for (var i = conversations.length-1; i>=0; i--) {
          this.showMember(conversations[i]);
        }
        // conversations.map((conversation)=> {
        //   this.showMember(conversation);
        // });
      }).catch(console.error.bind(console));
    }).catch(console.error);
  }

  /**
   * 开始对话
   */
  goToTalk(talk:any) {
    //如果当前用户是vip用户则可以开始聊天
    if (this.isVipOrNot()) {
      //通话对象
      let personId = null;
      let list = talk.members.toString().split(',');
      if (list != null) {
        for (let person of list) {
          if (person != this.mySelf) {
            personId = person;
          }
        }
      }
      //通话对象
      console.log(personId);
      if (personId != null) {

        this.navCtrl.push(CommunicatePage, {
          person: personId,
          talkmsg: talk
        });
      } else {
        console.log("聊天对象id有问题");
      }
    } else {
      //当前用户不是vip用户,那么就发出善意的提醒
      this.backMessage();
    }
  }


  /**
   * 获取对话人的姓名,图片
   * @param talk
   */
  showMember(talk:any) {
    let conversation:any = {
      baseInfo: '',
      detailInfo: '',
      talk: '',
      isDefaultPic: '',
      show: false
    }

    conversation.talk = talk;

    //对话人账户
    let otherPerson = null;
    let comPeople = talk.members.toString().split(',');
    for (let person of comPeople) {
      if (person != this.mySelf) {
        otherPerson = person.trim();
      }
    }

    if (otherPerson != null) {
      console.log(otherPerson + "对话人的id");
      this.addConversation(otherPerson, conversation);
      this.getUserInfo(otherPerson, (baseInfo, isDefaultPic, relation)=> {

        console.log(baseInfo.nickName + "用户姓名");
        conversation.baseInfo = baseInfo;
        conversation.isDefaultPic = isDefaultPic;

        if (relation != "2") {
          conversation.show = true;
        }
        this.memory.setConversion(this.conversations);
      })
    }
  }

  /**
   * 将聊天添加到列表中
   * @param personId
   * @param conversation
     */
  addConversation(personId, conversation) {
    for (let i = 0; i < this.conversations.length; i++) {
      let item = this.conversations[i];
      if (item["baseInfo"] != null && item["baseInfo"]["id"] == personId) {
        for (let j = i; j < this.conversations.length - 1; j++) {
          this.conversations[j] = this.conversations[j+1];
        }
        this.conversations.pop();
      }
    }
    var conList = [];
    conList.push(conversation);
    this.conversations = conList.concat(this.conversations)
  }

  /**
   * 获取用户信息
   */
  getUserInfo(otherUserId, callBack:Function) {
    console.log(this.memory.getUser().id + "-" + otherUserId + "对话")
    this.myHttp.post(MyHttp.URL_USER_BASE_INFO, {
      userId: this.memory.getUser().id,
      otherUserId: otherUserId
    }, (data) => {
      console.log(data)
      let baseInfo = data.baseInfo || {};
      // let detailInfo = data.detailInfo || {};
      let isDefaultPic = data.isNotChangeIcon;
      let relation = data.relation;
      callBack(baseInfo, isDefaultPic, relation);
    }, null, true)
  }

  /**
   * 去到个人详情界面
   */
  goToIntroduce(userId:any) {
    this.navCtrl.push(HomeIntroducePage, {otherUserId: userId});
  }

  /*
   * 将该页面拿出堆栈
   * */
  back() {
    this.navCtrl.pop();
  }

  /**
   * 判断当前用户是否是VIP用户
   */
  isVipOrNot():boolean {
    return this.calculateService.isVip(this.memory.getUser().vipTime)
  }


  /**
   *  成为VIP
   */
  backMessage() {
    let prompt = "亲~成为尊敬的Vip用户才能给对方发信息哦";
    this.alertCtrl.create({
      message: prompt,
      buttons: [
        {
          text: '狠心放弃'
        },
        {
          text: '立刻成为',
          handler: ()=> {
            //去到vip页面
            this.navCtrl.push(PayPage);
          }
        }

      ]
    }).present();
  }

  /**
   * 心动记录
   */
  goToContact() {
    if (!this.isCredMain()) {
      this.goToCred();
    } else {
      this.navCtrl.push(ContactPage);
      //红色小点显示
      this.memory.setLike(false);
    }
  }

  //最近访问
  public isShow = true;

  goToPeople() {
    if (!this.isCredMain()) {
      this.goToCred();
    } else {
      this.navCtrl.push(MessagePage);
      this.isShow = false;
      /*      this.memory.setMsg(false);*/
    }
  }

  //小红娘
  goToMatcher() {
    if (!this.isCredMain()) {
      this.goToCred();
    } else {
      this.navCtrl.push(MatchmakerPage);
      this.memory.setMsg(false);
    }
  }

  /**
   * 判断是否验证
   * @returns {boolean}
   */
  isCredMain() {
    return this.memory.getUser().mainCredNum >= 3;
  }

  /**
   * 认证信息提示
   */
  goToCred() {
    this.alertCtrl.create({
      message: '亲~请先认证信息才能查看更多内容',
      buttons: [
        {
          text: 'NO'
        },
        {
          text: 'OK',
          handler: ()=> {
            this.navCtrl.push(CredListPage);
          }
        }
      ]
    }).present();
  }


}

