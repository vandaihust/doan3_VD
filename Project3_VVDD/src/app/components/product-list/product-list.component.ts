import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  previousCategoryId = 1;
  searchMode = false;
  previousKeyword: string;
  // new properties for pagination
  thePageNumber = 1;
  thePageSize = 5;
  theTotalElements: number;
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1 ,
      this.thePageSize ,
      theKeyword)
      .subscribe(this.processResult()
    );
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    // this.thePageNumber = 1;
    // this.thePageSize = 5;
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber},
     thePageSize=${this.thePageSize},theToTalElements=${this.theTotalElements}`);
    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1 ,
                                               this.thePageSize ,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      // this.products = data;
      this.products = data.products;
      this.thePageNumber = data.currentPage + 1;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElement;
    };
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
  addToCart(theProduct: Product) {
    console.log(`Adding to cart ${theProduct.name} ${theProduct.unitPrice}`);
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
