import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

import {ContactPage} from "../contact/contact";
import {PeoplePage} from "../perlist/people";
import {Memory} from "../../util/Memory";

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})

export class MessagePage {

  constructor(public navCtrl:NavController,public memory:Memory) {
  }

  //心动记录
  goToContact() {
    this.navCtrl.push(ContactPage);
  }

  //最近访问
  goToPeople(){
    this.navCtrl.push(PeoplePage);
  }

}
