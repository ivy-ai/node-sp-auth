import { IAuthResolver } from '../../IAuthResolver';
import { IAuthResponse } from '../../IAuthResponse';
import { IOnDemandCredentials } from '../../IAuthOptions';
export interface ICookie {
    httpOnly: boolean;
    name: string;
    value: string;
    expirationDate?: number;
}
export declare class OnDemand implements IAuthResolver {
    private _siteUrl;
    private _authOptions;
    private static CookieCache;
    private _cpass;
    constructor(_siteUrl: string, _authOptions: IOnDemandCredentials);
    getAuth(): Promise<IAuthResponse>;
    private getMaxExpiration;
    private saveAuthData;
    private getDataFilePath;
}
