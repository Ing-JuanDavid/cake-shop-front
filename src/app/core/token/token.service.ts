import { Injectable } from '@angular/core';

interface JwtPayload {
  sub: string;
  name: string;
  roles: string[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  public decodeToken(token: string): JwtPayload | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      console.error('Token malformed: ', err);
      return null;
    }
  }

  public validateToken(token: string): JwtPayload | null {
    const payload = this.decodeToken(token);

    if(!payload) return null;

    if (payload.exp < Date.now() / 1000) {
      console.error('Token expired');
      return null;
    }

    if (!payload.roles || !payload.sub) {
      console.error('Token invalid');
      return null;
    }

    return payload;
  }
}
