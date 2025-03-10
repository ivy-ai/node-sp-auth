import { IOnlineAddinCredentials } from './../IAuthOptions';
import { IAuthResponse } from './../IAuthResponse';
import { OnlineResolver } from './base/OnlineResolver';
export declare class OnlineAddinOnly extends OnlineResolver {
    private _authOptions;
    private static TokenCache;
    constructor(_siteUrl: string, _authOptions: IOnlineAddinCredentials);
    getAuth(): Promise<IAuthResponse>;
    protected InitEndpointsMappings(): void;
    private getAuthUrl;
    private get AcsRealmUrl();
    private getRealm;
}
