import { Injectable, signal, OnInit } from '@angular/core';
import { User, ApiUser } from '../../models';
import { tap, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3030/users';
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<User | null>(null); // Adjust type as necessary
  private _token = signal<string | null>(null);
  private _isAdmin = signal<boolean>(false); // Assuming you might need this for admin checks
  private _adminArr = ['admin@abv.bg', 'plamen@abv.bg'];

  public isLoggedIn = this._isLoggedIn.asReadonly();
  public currentUser = this._currentUser.asReadonly();
  public token = this._token.asReadonly();
  public isAdmin = this._isAdmin.asReadonly(); // Readonly signal for admin status  

constructor(private httpClient: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this._currentUser.set(user);
      this._isLoggedIn.set(true);
      this._token.set(this.getToken()); // Assuming getToken() returns a valid token
      this._isAdmin.set(this.isUserAdmin(user.email)); // Assuming user has an isAdmin property
    }
  }


login(email: string, password: string): Observable<User> {
    return this.httpClient.post<ApiUser>(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: false //It is not necessary to send cookies with this request
    }).pipe(
      map(apiUser => 
        {     const user = this.mapApiUserToUser(apiUser);
              this._token.set(apiUser.accessToken); // Store token in signal
              localStorage.setItem('token', apiUser.accessToken); // Persist token
              return user;
            }), 
      tap(user => {
        this._currentUser.set(user);
        this._isLoggedIn.set(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this._isAdmin.set(this.isUserAdmin(user.email)); // Check if the user is an admin
        console.log(`This is admin: ${this._isAdmin}`);
      })
    ); 
}

register(username: string, email: string, phone: string, password: string, rePassword: string): Observable<User> {
  return this.httpClient.post<ApiUser>(`${this.apiUrl}/register`, {
    username,
    email,
    tel: phone,
    password,
    rePassword
  }, {
      withCredentials: false //It is not necessary to send cookies with this request
    }).pipe(
        map(apiUser => 
          { const user = this.mapApiUserToUser(apiUser);
            this._token.set(apiUser.accessToken); // ✅ Store token
            localStorage.setItem('token', apiUser.accessToken); // ✅ Persist token
            console.log(`Token set: ${apiUser.accessToken}`); // ✅ Debugging log
            return user;
          }),
        tap(user => {
            this._currentUser.set(user);
            this._isLoggedIn.set(true);
            localStorage.setItem('currentUser', JSON.stringify(user));
        })
);

}

logout(): Observable<void> {
    const repsponse = this.httpClient.get<void>(`${this.apiUrl}/logout`, {}).pipe(
    tap(() => {
        this._currentUser.set(null);
        this._isLoggedIn.set(false);
        this._token.set(null); // Clear token signal
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token'); 
        this._isAdmin.set(false); // Clear admin status
        localStorage.clear(); // Clear all local storage
    })
);
console.log(`Logout called, current user: ${JSON.stringify(repsponse)}`); // Debugging log

return repsponse;
}

  getCurrentUserId(): string | null {
    return this._currentUser()?.id || null;
  }

                                                                        
  update(user: User): Observable<User> {
  if (!user || !user.id) {
      console.error('Invalid user object provided for update:', user);
      throw new Error('User ID is required for update.');
    }
    const request = this.httpClient.put<User>(`${this.apiUrl}/${(user.id)}`, { //localStorage.getItem(user.id)
        _id: user.id,
        username: user.username,
        email: user.email,
        tel: user.phone
    }, {
        withCredentials: false //It is not necessary to send cookies with this request
    })
  .pipe(
        //map(apiUser => this.mapApiUserToUser(apiUser)),
        tap(user => {
            this._currentUser.set(user);
            localStorage.setItem('currentUser', JSON.stringify(user))
        })
    );
    return request;
}

getToken(): string | null {
  return this._token() || localStorage.getItem('token'); // It could be refactore, so we return an empty string if not found
}

private isUserAdmin(email: string): boolean {
  return this._adminArr.includes(email);
}

private mapApiUserToUser(apiUser: ApiUser): User{
  
if (!apiUser || !apiUser._id) {
  const user = localStorage.getItem('currentUser');
  console.warn('Invalid apiUser:', apiUser._id); 
  console.warn('Invalid apiUser:', apiUser);
  throw new Error(`Cannot map user: _id is missing but check this locale ${JSON.stringify(user)}`); // Debugging log
}

  return <User> {
      id: apiUser._id,
      username: apiUser.username,
      email: apiUser.email,
      phone: apiUser.tel,
      accessToken: apiUser.accessToken
  };
}
}


