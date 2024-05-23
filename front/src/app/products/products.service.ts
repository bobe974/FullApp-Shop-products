import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.class';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
//TODO changer la source de données de l'application web: fichier json -> API REST
    private static productslist: Product[] = null;
    private products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        if( ! ProductsService.productslist )
        {
            this.http.get<any>('http://localhost:3000/api/products').subscribe(data => {
                ProductsService.productslist = data.data;

                this.products$.next(ProductsService.productslist);
            });
        }
        else
        {
            this.products$.next(ProductsService.productslist);
        }

        return this.products$;
    }

    create(prod: Product): Observable<Product[]> {

        //ProductsService.productslist.push(prod);
        //this.products$.next(ProductsService.productslist);
        //return this.products$;
        const apiUrl = 'http://localhost:3000/api/products';
        console.log('Envoi du JSON:', JSON.stringify(prod));
        return this.http.post<Product[]>(apiUrl, prod);
    }
    

    update(prod: Product): Observable<Product[]> {
        const apiUrl = `http://localhost:3000/api/products/${prod.id}`;
        console.log('Envoi du JSON pour mise à jour:', JSON.stringify(prod));
        
        return new Observable(observer => {
            this.http.patch<Product>(apiUrl, prod).subscribe(
                updatedProduct => {
                    const index = ProductsService.productslist.findIndex(element => element.id === prod.id);
                    if (index !== -1) {
                        ProductsService.productslist[index] = updatedProduct;
                        this.products$.next(ProductsService.productslist);
                    }
                    observer.next(ProductsService.productslist);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                }
            );
        });
    }
    


    delete(id: number): Observable<Product[]> {
        const apiUrl = `http://localhost:3000/api/products/${id}`;
        console.log('Suppression du produit avec l\'ID:', id);
    
        return new Observable(observer => {
            this.http.delete(apiUrl).subscribe(
                () => {
                    ProductsService.productslist = ProductsService.productslist.filter(product => product.id !== id);
                    this.products$.next(ProductsService.productslist);
                    observer.next(ProductsService.productslist);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                }
            );
        });
    }
    
}
