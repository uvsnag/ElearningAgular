import { Component } from "@angular/core";
// import { Product } from "../models/product";
import { Router } from "@angular/router";

@Component({
  selector: "e-learning",
  templateUrl: "e-learning.component.html"
})
export class Elearning {
    title ="elearning test!"
//   public products: Product[] = [
//     new Product(1, "Product 001"),
//     new Product(2, "Product 002"),
//     new Product(3, "Product 003"),
//     new Product(4, "Product 004"),
//     new Product(5, "Product 005"),
//     new Product(6, "Product 006"),
//     new Product(7, "Product 007"),
//     new Product(8, "Product 008")
//   ];

  constructor(public router: Router) {}

//   public gotoProductDetails(url, id) {
//     this.router.navigate([url, id]).then(e => {
//       if (e) {
//         console.log("Navigation is successful!");
//       } else {
//         console.log("Navigation has failed!");
//       }
//     });
//   }

//   public gotoProductDetailsV2(url, id) {
//     var myurl = `${url}/${id}`;
//     console.log(myurl);

//     this.router.navigateByUrl(myurl).then(e => {
//       if (e) {
//         console.log("Navigation is successful!");
//       } else {
//         console.log("Navigation has failed!");
//       }
//     });
//   }
}
