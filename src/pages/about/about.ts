import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

// Providers
import { ParseProvider } from '../../providers/parse/parse';
import { AuthProvider } from '../../providers/auth/auth';

// Pages
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  newSujet = { sujetName: null, sujetAction: null, sujetDescription: null, sujetImageURL: null };
  newButton = { buttonName: null, buttonId: null, buttonAction: null };
  sujets = [];
  buttons = [];

  constructor(private parseProvider: ParseProvider, private auth: AuthProvider, private navCtrl: NavController, private app: App) {
    this.listSujets();
  }

  ionViewCanEnter(): boolean {
    return this.auth.authenticated();
  }

  public listSujets(): Promise<any> {
    let offset = this.sujets.length;
    let limit = 3;
    return this.parseProvider.getSujets(offset, limit).then((result) => {
      for (let i = 0; i < result.length; i++) {
        let object = result[i];
        this.sujets.push(object);
      }
    }, (error) => {
      console.log(error);
    });
  }

  public postSujet() {
    this.parseProvider.addSujet(this.newSujet).then((sujet) => {
      this.sujets.push(sujet);
      this.newSujet.sujetName = null;
      this.newSujet.sujetDescription = null;
      this.newSujet.sujetImageURL = null;
      this.newSujet.sujetAction = null;
    }, (error) => {
      console.log(error);
      alert('Error adding sujet.');
    });
  }


  public postButton(object) {
    console.log(object);
    console.log(object.id);

    let buttonSujet = {
      buttonAction: object.get('sujetAction'),
      buttonName: object.get('sujetName'),
      buttonSujetId: object.id,
      buttonImageURL: object.get('sujetImageURL'),
      buttonDescription: object.get('sujetDescription')
    };

    this.parseProvider.addButton(buttonSujet).then((button) => {
      this.buttons.push(button);
    }, (error) => {
      console.log(error);
      alert('Error adding button.');
    });
    console.log("Button is created: " + object);
  }


  public signout() {
    this.auth.signout().subscribe(() => {
      this.app.getRootNav().setRoot(SigninPage);
    });
  }

}
