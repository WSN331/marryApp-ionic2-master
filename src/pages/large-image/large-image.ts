import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ImgService } from "../../util/ImgService"

/**
 * Generated class for the LargeImagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-large-image',
  templateUrl: 'large-image.html',
})
export class LargeImagePage {

  private imageBase64;

  constructor(public navCtrl: NavController, public navParams: NavParams, public imgService:ImgService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LargeImagePage');
    this.imageBase64 = this.navParams.get("imageBase64");
  }

}
