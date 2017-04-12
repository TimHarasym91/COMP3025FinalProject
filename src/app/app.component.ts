import { Component, Input } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Filters } from '../models/filters';
import { FilterService } from '../services/filter.service';
import { Home } from '../pages/home/home';
//import { Details } from '../pages/details/details';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = Home;
  @Input() filters: Filters;
  radiusKM: any;
  starRating: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public filterSerivce: FilterService, public menu: MenuController) {
    this.filters = new Filters();
    this.radiusKM = 1.5;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  radius(event) {
    this.filters.radius = event.value;
    this.radiusKM = event.value / 1000;
  }

  rating(event) {
    this.starRating = event.value / 10;
    this.filters.rating = this.starRating;
  }

  applyFilters(event) {
    if(this.filters.radius) {
      this.filterSerivce.setRadius(this.filters.radius);
    }
    if(this.filters.rating) {
      this.filterSerivce.setRating(this.filters.rating);
    }
    this.menu.close();
  }

}
