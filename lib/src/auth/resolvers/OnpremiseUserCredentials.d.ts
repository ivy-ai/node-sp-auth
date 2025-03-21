import { IAuthResolver } from './../IAuthResolver';
import { IOnpremiseUserCredentials } from './../IAuthOptions';
import { IAuthResponse } from './../IAuthResponse';
export declare class OnpremiseUserCredentials implements IAuthResolver {
    private _siteUrl;
    private _authOptions;
    constructor(_siteUrl: string, _authOptions: IOnpremiseUserCredentials);
    getAuth(): Promise<IAuthResponse>;
}
