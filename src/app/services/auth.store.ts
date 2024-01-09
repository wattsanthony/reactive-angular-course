import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

// Const for local storage
const AUTH_DATA = "auth_data";

@Injectable({
    providedIn: "root"
})
export class AuthStore{

    // Subject to hold user, initalized to null
    private subject = new BehaviorSubject<User>(null);

    // Observable for user
    user$:Observable<User> = this.subject.asObservable(); // Linked to subject

    // Observables for login/out
    isLoggedIn$:Observable<boolean>;
    isLoggedOut$:Observable<boolean>;

    // Constructor
    constructor(private http:HttpClient){

        // Check if user exists and save true/false
        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedin => !loggedin));

        // Check local storage for account login
        const user = localStorage.getItem(AUTH_DATA);

        // Check if user exists
        if(user){
            // Parse to JSON obj and set to subject
            this.subject.next(JSON.parse(user));
        }
    }

    // Login Function
    login(email:string, password:string):Observable<User>{

        // Post to api and return User
        return this.http.post<User>("api/login", {email, password})
        .pipe(
            // Set the returned user to subject
            tap(user => {
                this.subject.next(user);
                // Also save to local storage
                localStorage.setItem(AUTH_DATA, JSON.stringify(user));
            }),
            // Reuse this http every time
            shareReplay()
        );

    }

    // Logout Function
    logout(){
        // Clear subject
        this.subject.next(null);

        // Clear local storage
        localStorage.removeItem(AUTH_DATA);
    }
}