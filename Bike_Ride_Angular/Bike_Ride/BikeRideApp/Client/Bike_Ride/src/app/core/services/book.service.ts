import { Injectable, OnInit, signal,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, BehaviorSubject, throwError, catchError, of } from 'rxjs';
import { Book } from '../../models/book.model';
import { BikeContent } from '../../features/bikesCs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  private apiUrl = 'http://localhost:3030/data/books';
  private _bookCounts = signal<Record<string, number>>({});

  private token = localStorage.getItem('token') || '';
  private currId= localStorage.getItem("currentUser") || '';
  
  constructor(private http: HttpClient) {
  
  }

    book(bikeId: string): Observable<Book> {
      const response = this.http.post<Book>(this.apiUrl, { bikeId }, { headers: { 'Content-Type': 'application/json' } }).pipe(
        tap(book => {
          console.log(`BookService -> New book created: ${JSON.stringify(book)}`);}),
        catchError(error => {
          console.error('BookService -> Error creating book:', error);
          return throwError(() => error);
        }));
      return response;
  }


  unbook(bookId: string): Observable<void> {
    console.log(`BookService: The token is: ${this.token} and ${this.currId}`);
    return this.http.delete<void>(`${this.apiUrl}/${bookId}`, {headers: { 'X-Authorization': this.token }});
  }

  getCount(bikeId: string): Observable<number> {
    const query = encodeURIComponent(`bikeId="${bikeId}"`);
    const url = `${this.apiUrl}?where=${query}`; 
    return this.http.get<Book[]>(url).pipe(
      map(likes=>likes.length),
      tap(count => {
        const current = this._bookCounts();
        this._bookCounts.set({ ...current, [bikeId]: count });
        console.log(`BookService -> Get count of Bookes: ${JSON.stringify(count)}`);
      })
    );
  }

  
  get bookCounts() {
    return this._bookCounts;
  }

  getUserBooks(userId: string | null, bikeId?: string): Observable<Book | null> {
    if (!userId) {
      return of(null);
    }
    console.log(`Book service: bikeId is: ${bikeId} and userId is ${userId}`);
    
    // const add = encodeURI('&load=author');
    // const query1 = encodeURIComponent(`bikeId="${bikeId}"`);
    // const query2 = encodeURIComponent(`=ownerId="${userId}"`);
    // return this.http.get<Book[]>(`${this.apiUrl}?where=${query1}${add}${query2}`).pipe(
    //   map(books => books[0] || null)
    // );

      const query = encodeURIComponent(`ownerId="${userId}"`);
      return this.http.get<Book[]>(`${this.apiUrl}?where=_${query}`).pipe(
        map(books => books[0] || null)
      );

  }

  
  getAllBookings(): Observable<Book[]> {
    console.log(`!!!Book service: userId is ${this.currId}`);
    return this.http.get<Book[]>(`${this.apiUrl}`);
  }


}
