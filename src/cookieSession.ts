import cookieSession from 'cookie-session';
import { cookie_key} from './keys';

export class CookieSession {
    public cookie:any;
    constructor(){
        this.cookie = cookieSession({
            // example maxAge - 24hrs * 60mins * 60secs * 1000ms
            maxAge: 24*60*60*1000,
            keys: [cookie_key],
        })
    }
}