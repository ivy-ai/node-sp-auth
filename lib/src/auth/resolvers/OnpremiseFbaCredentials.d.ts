import { IAuthResolver } from './../IAuthResolver';
import { IOnpremiseUserCredentials } from './../IAuthOptions';
import { IAuthResponse } from './../IAuthResponse';
export declare class OnpremiseFbaCredentials implements IAuthResolver {
    private _siteUrl;
    private _authOptions;
    private static CookieCache;
    constructor(_siteUrl: string, _authOptions: IOnpremiseUserCredentials);
    getAuth(): Promise<IAuthResponse>;
}
