import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

// Parse
import { Parse } from 'parse';

// Providers
import { ParseProvider } from '../../providers/parse/parse';
import { AuthProvider } from '../../providers/auth/auth';

// Pages
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  newScore = { playerName: null, score: null };
  newButton = { buttonName: null, action: null };
  buttons = [];
  orders = [];
  gameScores = [];

  constructor(private parseProvider: ParseProvider, private auth: AuthProvider, private navCtrl: NavController, private app: App) {
    this.listScores();
    this.listButtons();
    this.listOrders();
  }

  ionViewCanEnter(): boolean {
    return this.auth.authenticated();
  }

  public listOrders(): Promise<any> {
    let offset = this.orders.length;
    let limit = 5;
    return this.parseProvider.getOrders(offset, limit).then((result) => {
    
      console.log(result)
      for (let i = 0; i < result.length; i++) {
        let object = result[i];
        this.orders.push(object);
      }
    }, (error) => {
      console.log(error);
    });
  }

  public listButtons(): Promise<any> {
    let offset = this.buttons.length;
    let limit = 5;

    return this.parseProvider.getButtons(offset, limit).then((result) => {
      for (let i = 0; i < result.length; i++) {
        let object = result[i];
        this.buttons.push(object);
      }
    }, (error) => {
      console.log(error);
    });
  }

  public postOrder(Object) {
    console.log(Object);
    let newOrder = {
      threadId: Parse.User.current(),
      //sujetId: Object.get('buttonSujetId'),
      buttonId: Object,
      orderStatus: 'Created'
    }

    this.parseProvider.addOrder(newOrder).then((order) => {
      //this.orders.push(order);
      this.listOrders();
      /*
      function checkButton(button) {
        return button.orderStatus = button.id == newOrder.buttonId;
      }
      let index = this.buttons.findIndex(checkButton);
      this.buttons[index].orderStatus = 'Ordered';
      */
    }, (error) => {
      console.log(error);
      alert('Error adding order.');
    });
  }

  public postButton() {
    this.parseProvider.addButton(this.newButton).then((button) => {
      this.buttons.push(button);
      this.newButton.buttonName = null;
      this.newButton.action = null;
    }, (error) => {
      console.log(error);
      alert('Error adding button.');
    });
  }

  public listScores(): Promise<any> {
    let offset = this.gameScores.length;
    let limit = 10;
    return this.parseProvider.getGameScores(offset, limit).then((result) => {
      for (let i = 0; i < result.length; i++) {
        let object = result[i];
        this.gameScores.push(object);
      }
    }, (error) => {
      console.log(error);
    });
  }

  public postGameScore() {
    this.parseProvider.addGameScore(this.newScore).then((gameScore) => {
      this.gameScores.push(gameScore);
      this.newScore.playerName = null;
      this.newScore.score = null;
    }, (error) => {
      console.log(error);
      alert('Error adding score.');
    });
  }

  public signout() {
    this.auth.signout().subscribe(() => {
      this.app.getRootNav().setRoot(SigninPage);
    });
  }

}
