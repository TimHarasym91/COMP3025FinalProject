import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';


@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class Details {

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad(){
    console.log('Success!');
  }
}
