import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services";

export const AuthenticationInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const token = authService.getToken();
    
if(token) {
    const authenticationRequest = req.clone({
            headers: req.headers.set('X-Authorization', token)
        });
    return next(authenticationRequest);
}
    
    return next(req);

}