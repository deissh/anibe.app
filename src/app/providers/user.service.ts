import { Injectable } from '@angular/core';
import { API } from './api.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Экземпляр класса для работы с апи через небольшую обертку
   */
  private api: API;
  private token: string;
  private ready: Promise<any>;

  constructor(
    private storage: Storage
  ) {
    this.api = new API({  });
    this.ready = this.setToken();
  }

  private async setToken() {
    this.token = await this.storage.get('token') || '';
  }

  public setAuth(u: string, p: string) {
    this.api = new API({
      auth: {
        username: u,
        password: p
      }
    });
  }

  /**
   * Авторизация и получение токена
   */
  public async auth(username: string, password: string) {
    this.api = new API({
      auth: {
        username,
        password
      }
    });
    const res = await this.api.post('/auth', {}, {
      auth: ''
    });

    return JSON.parse(res.data);
  }

  /**
   * @description получить текущего пользователя
   */
  public async getSelf() {
    await this.ready;
    const url = `/users/me`;

    const res = await this.api.get(url, {
      'Authorization': 'Bearer ' + this.token
    });
    return JSON.parse(res.data);
  }

  /**
   * @description получить информацию о пользователе
   * @param id uuid пользователя
   */
  public async get(id: string) {
    await this.ready;
    const url = `/users/${id}`;

    const res = await this.api.get(url, {
      'Authorization': 'Bearer ' + this.token
    });
    return JSON.parse(res.data);
  }
}
