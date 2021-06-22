import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> =  new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> =  new BehaviorSubject<number>(0);
  constructor() { }
  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let alreadyExistsInCart = false;
    let existingItemCart: CartItem;
    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      // for (const tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingItemCart = tempCartItem;
      //     break;
      //   }
      // //
      // }
      existingItemCart = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      // check we found it
      alreadyExistsInCart = (existingItemCart !== undefined);
    }
    if (alreadyExistsInCart) {
      // increment quantity
      existingItemCart.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    // compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;
    for (const currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    // publish the new value when subscribers will receive data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    // log cartdata debugg
    this.logCartDate(totalPriceValue, totalQuantityValue);
  }
  logCartDate(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the Cart');
    for (const tempCartItem of this.cartItems) {
      console.log(`name: ${tempCartItem.name}; quantity= ${tempCartItem.quantity}; unitPrice = ${tempCartItem.unitPrice}`);
      console.log(`totalPrice = ${totalPriceValue.toFixed(2)}; totalQuantity = ${totalQuantityValue}`);
    }
  }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

}
