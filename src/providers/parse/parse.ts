import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

// Parse
import { Parse } from 'parse';

// Constants
import { ENV } from '../../app/app.constant';

@Injectable()
export class ParseProvider {
  private parseAppId: string = ENV.parseAppId;
  private parseJavaScriptKey: string = ENV.parseJavaScriptKey;
  private parseServerUrl: string = ENV.parseServerUrl;

  constructor() {
    this.parseInitialize();
    console.log('Initiated App');
  }

  public getButtons(offset: number = 0, limit: number = 10): Promise<any> {
  
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const Button = Parse.Object.extend('Button');
        let query = new Parse.Query(Button);
        query.skip(offset);
        query.limit(limit);
        query.find().then((buttons) => {
          resolve(buttons);
        }, (error) => {
          reject(error);
        });
      }, 500);
    });
  }

  public getOrders(offset: number = 0, limit: number = 5): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const Order = Parse.Object.extend('Order');
        let query = new Parse.Query(Order);
        query.include("buttonId");
        //query.include("sujetId");
        query.skip(offset);
        query.limit(limit);
        query.find().then((results) => {
          /* Go Through Each Comment*/
    
          var ordersArray = new Array();
          for (let i = 0; i < results.length; i++) {
            /* Set obj to current comment*/
            var obj = results[i];
            /* Get Order's Name */
            var orderName = obj.get("buttonId").get("buttonName");
      
            /* Get Order's Message */
            //var orderDescription = obj.get("sujetId").get("sujetDescription");
            /* Get Order's Status */
            var orderStatus = obj.get("orderStatus");
            /* Let's Put the Comment Information in an Array as an Object*/
            
            ordersArray.push({
              name: orderName,
              //description: orderDescription,
              status: orderStatus
            });
            
          }
          resolve(ordersArray);
        }, (error) => {
          console.log(error);
          reject(error);
        });
      }, 500);
    });
  }

  public getSujets(offset: number = 0, limit: number = 10): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const Sujet = Parse.Object.extend('Sujet');
        let query = new Parse.Query(Sujet);
        query.skip(offset);
        query.limit(limit);
        query.find().then((sujets) => {
          resolve(sujets);
        }, (error) => {
          reject(error);
        });
      }, 500);
    });
  }

  public getGameScores(offset: number = 0, limit: number = 3): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const GameScore = Parse.Object.extend('GameScore');
        let query = new Parse.Query(GameScore);
        query.skip(offset);
        query.limit(limit);
        query.find().then((gameScores) => {
          resolve(gameScores);
        }, (error) => {
          reject(error);
        });
      }, 500);
    });
  }

  public addSujet(newSujet): Promise<any> {
    const Sujet = Parse.Object.extend('Sujet');
    //console.log(newSujet);
    let sujet = new Sujet();
    sujet.set('sujetOwner', newSujet.sujetOwner);
    sujet.set('sujetName', newSujet.sujetName);
    sujet.set('sujetAction', newSujet.sujetAction);
    sujet.set('sujetDescription', newSujet.sujetDescription);
    sujet.set('sujetVisibility', newSujet.sujetVisibility);
    sujet.set('sujetImageURL', newSujet.sujetImageURL);

    return sujet.save(null, {
      success: function (sujet) {
        console.log(sujet);
        return sujet;
      },
      error: function (sujet, error) {
        console.log(error);
        return error;
      }
    });
  }


  public addButton(newButton): Promise<any> {
    const Button = Parse.Object.extend('Button');
    let button = new Button();
    button.set('buttonOwner', newButton.buttonOwner);
    button.set('buttonName', newButton.buttonName);
    button.set('buttonAction', newButton.buttonAction);
    button.set('buttonSujetId', newButton.buttonSujetId);
    button.set('buttonDescription', newButton.buttonDescription);
    button.set('buttonImageURL', newButton.buttonImageURL);

    return button.save(null, {
      success: function (button) {
        console.log(button);
        return button;
      },
      error: function (button, error) {
        console.log(error);
        return error;
      }
    });
  }

  public addOrder(newOrder): Promise<any> {
    const Order = Parse.Object.extend('Order');
    //console.log("newOrder")
    //console.log(newOrder);
    let order = new Order();
    order.set('threadId', newOrder.threadId);
    //order.set('sujetId', newOrder.sujetId);
    order.set('buttonId', newOrder.buttonId);
    order.set('orderStatus', 'Pending');

    return order.save(null, {
      success: function (order) {
        //console.log("saved Order is :");
        //console.log(order);
        return order;
      },
      error: function (order, error) {
        console.log(error);
        return error;
      }
    });
  }

  public addGameScore(newScore): Promise<any> {
    const GameScore = Parse.Object.extend('GameScore');

    let gameScore = new GameScore();
    gameScore.set('score', parseInt(newScore.score));
    gameScore.set('playerName', newScore.playerName);
    gameScore.set('cheatMode', false);

    return gameScore.save(null, {
      success: function (gameScore) {
        console.log(gameScore);
        return gameScore;
      },
      error: function (gameScore, error) {
        console.log(error);
        return error;
      }
    });
  }



  public makeButton(Id): Promise<any> {
    //const Button = Parse.Object.extend('Button');

    return Parse.Cloud.run('makeButton', { objectId: Id }).then(function (result) {
      // make sure the set the email sent flag on the object
      console.log("result :" + JSON.stringify(result))
    }, function (error) {
      console.log("error :" + JSON.stringify(error)); // error
    });
  }



  private parseInitialize() {
    Parse.initialize(this.parseAppId, this.parseJavaScriptKey);
    Parse.serverURL = this.parseServerUrl;
  }

}
