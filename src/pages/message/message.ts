import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {ContactPage} from "../contact/contact";

@Component({
  selector:'page-message',
  templateUrl:'message.html'
})

export class MessagePage{

  constructor(public navCtrl:NavController){
  }
  gotoContact(){
    this.navCtrl.push(ContactPage);
  }
}
