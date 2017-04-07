import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';


@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class Details {
  name: any;
  icon: any;
  rating: any;

public infoList:any;
  constructor(public navCtrl: NavController, public info:NavParams) {
    this.infoList = info.get("locationInfo");
    this.name = this.infoList.name;
    this.icon = this.infoList.icon;
    this.rating = this.infoList.rating;
  }

  ionViewDidLoad(){
    console.log(this.name);
  }
}
