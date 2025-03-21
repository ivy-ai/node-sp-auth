import { IAuthResolver } from './../IAuthResolver';
import { IOnPremiseAddinCredentials } from './../IAuthOptions';
import { IAuthResponse } from './../IAuthResponse';
export declare class OnpremiseAddinOnly implements IAuthResolver {
    private _siteUrl;
    private _authOptions;
    private static TokenCache;
    constructor(_siteUrl: string, _authOptions: IOnPremiseAddinCredentials);
    getAuth(): Promise<IAuthResponse>;
}
