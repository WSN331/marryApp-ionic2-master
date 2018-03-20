import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Memory} from "../../util/Memory";
import {HomePage} from "../home/home";

@Component({
  selector:'page-everyPerson',
  templateUrl:'every-person.html'
})

export class EveryPersonPage{

  constructor(public navCtrl: NavController,public memory:Memory) {

  }

  goToManList(){
    this.memory.setSex(1);
    this.navCtrl.push(HomePage)
  }

  goToWomList(){
    this.memory.setSex(0);
    this.navCtrl.push(HomePage)
  }

  back(){
    this.navCtrl.pop();
  }
}




