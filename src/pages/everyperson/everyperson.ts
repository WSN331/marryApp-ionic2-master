import {Component, ViewChild} from "@angular/core";
import {NavController} from "ionic-angular";
import {Memory} from "../../util/Memory";
import {HomePage} from "../home/home";

@Component({
  selector:'page-everyperson',
  templateUrl:'everyperson.html'
})

export class EverypersonPage{

  constructor(public navCtrl: NavController,public memory:Memory) {

  }

  goToManList(){
    this.memory.setSex(2);
    this.navCtrl.push(HomePage)
  }

  goToWomList(){
    this.memory.setSex(1);
    this.navCtrl.push(HomePage)
  }

}




