import { IAppToken } from '../auth/base/IAppToken';
import { IOnlineAddinCredentials } from '../index';
import { IAccessToken } from '../auth/base/IAccessToken';
import { IAuthData } from '../auth/base/IAuthData';
export declare class TokenHelper {
    static verifyAppToken(spAppToken: string, oauth: IOnlineAddinCredentials, audience?: string): IAppToken;
    static getUserAccessToken(spSiteUrl: string, authData: IAuthData, oauth: IOnlineAddinCredentials): Promise<IAccessToken>;
    static getAppOnlyAccessToken(spSiteUrl: string, authData: IAuthData, oauth: IOnlineAddinCredentials): Promise<IAccessToken>;
}
