import { IAuthResolver } from './../IAuthResolver';
import { IAdfsUserCredentials } from './../IAuthOptions';
import { IAuthResponse } from './../IAuthResponse';
export declare class AdfsCredentials implements IAuthResolver {
    private _siteUrl;
    private static CookieCache;
    private _authOptions;
    constructor(_siteUrl: string, _authOptions: IAdfsUserCredentials);
    getAuth(): Promise<IAuthResponse>;
    private postTokenData;
}
