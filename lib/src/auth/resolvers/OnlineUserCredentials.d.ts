import { IUserCredentials } from './../IAuthOptions';
import { IAuthResponse } from './../IAuthResponse';
import { OnlineResolver } from './base/OnlineResolver';
export declare class OnlineUserCredentials extends OnlineResolver {
    private _authOptions;
    private static CookieCache;
    constructor(_siteUrl: string, _authOptions: IUserCredentials);
    getAuth(): Promise<IAuthResponse>;
    protected InitEndpointsMappings(): void;
    private getSecurityToken;
    private getSecurityTokenWithAdfs;
    private getSecurityTokenWithOnline;
    private postToken;
    private get MSOnlineSts();
    private get OnlineUserRealmEndpoint();
}
