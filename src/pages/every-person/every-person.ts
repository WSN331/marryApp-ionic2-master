import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {Memory} from "../../util/Memory";
import {GoagoPage} from "../goago/goago";

@Component({
  selector:'page-everyPerson',
  templateUrl:'every-person.html'
})

export class EveryPersonPage{

  constructor(public navCtrl: NavController,public memory:Memory) {

  }

  goToManList(){
    this.navCtrl.push(GoagoPage, {sex: 1})
  }

  goToWomList(){
    this.memory.setSex(0);
    this.navCtrl.push(GoagoPage, {sex: 0})
  }

  back(){
    this.navCtrl.pop();
  }
}




