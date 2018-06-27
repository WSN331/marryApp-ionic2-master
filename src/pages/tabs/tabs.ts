import {Component, ViewChild} from '@angular/core';
import {Platform, Tabs, Events} from "ionic-angular";

import { UserIntroducePage } from '../user-introduce/user-introduce';
import { HomePage } from '../home/home';
import {CommunicateService} from "../../util/CommunicateService";
import {Memory} from "../../util/Memory";
import {PeoplePage} from "../perlist/people";
import {MyHttp} from "../../util/MyHttp";


@Component({
  selector:'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
  @ViewChild('mainTabs') tabs:Tabs;

  tab1Root:any = HomePage;
  tab2Root:any = UserIntroducePage;
  tab3Root:any = PeoplePage;

  messageCount;

  icons: Array<string> = ["tab-home", "tab-message", "tab-user"];

  constructor(public comCate:CommunicateService,public memory:Memory,
              public platform: Platform, public events: Events,
              private myHttp : MyHttp) {
    //初始化聊天
    this.comCate.init();
    this.getHateList()
    this.receiveMessage();
    this.events.subscribe('e-tabs-message-change', (messageCount) => {
      this.receiveMessage();
      this.messageCount = messageCount;
    })
  }

  public realtime;
  public mySelf;
  public hateList;
  /**
   * 获取讨厌的列表
   */
  getHateList() {
    this.myHttp.post(MyHttp.URL_HATE_LIST, {
      userId: this.memory.getUser().id
      /*userId:1*/
    }, (data) => {
      console.log(data)
      this.hateList = data.userList;
    })
  }

  /**
   * 刚登录时查找未读信息是否存在,若存在则提醒用户
   */
  public receiveMessage(){
    this.realtime = this.memory.getTiming();
    if(this.realtime!=null){
      this.mySelf = this.memory.getUser().id;
      //登录并查询是否有未读消息
      console.log(this.messageCount)
      let count = 0;
      this.realtime.createIMClient(this.mySelf+'').then((my)=> {
        my.on('unreadmessagescountupdate', (conversations)=>{
          if(conversations.size > 0 && conversations != null){
            this.memory.setUnreadConversions(conversations)
            for(let conv of conversations) {
              console.log(conv.id, conv.name, conv.unreadMessagesCount+"这是查询未读消息的，请问哪里还有",conv);
              if(conv.unreadMessagesCount>0){
                console.log("您有未读消息请注意！");
                if(conv.id == "5a93eced1579a3003847f3c2"){
                  this.memory.setMsg(true);
                }
                count = count + 1;
                break
              }
            }
            this.messageCount = count == 0 ? null : count;
          }
        });
      }).catch(console.error);
    }
  }


}
