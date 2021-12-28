import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Elearning } from "./e-learning/e-learning.component";
import { AppComponent } from "./app.component";
// import { ProductListComponent } from "./product-list/product-list.component";
// import { ProductDetailComponent } from "./product-detail/product-detail.component";
const routes: Routes = [
  //   { path: "products", component: ProductListComponent },
  //   { path: "product/:id", component: ProductDetailComponent },
  { path: '', component: AppComponent },
  { path: 'test', component: Elearning },
  // { path: '**', component: AppComponent }
  //  { path: "", redirectTo: "", pathMatch: "full" }
  ];
// const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
