export interface IBasicOAuthOption {
    clientId: string;
}
export interface IOnlineAddinCredentials extends IBasicOAuthOption {
    clientSecret: string;
    realm?: string;
}
export interface IOnPremiseAddinCredentials extends IBasicOAuthOption {
    realm: string;
    issuerId: string;
    rsaPrivateKeyPath: string;
    shaThumbprint: string;
}
export interface IUserCredentials {
    username: string;
    password: string;
    online?: boolean;
}
export interface IOnpremiseTmgCredentials extends IUserCredentials {
    tmg: boolean;
}
export interface IOnpremiseFbaCredentials extends IUserCredentials {
    fba: boolean;
}
export interface IOnpremiseUserCredentials extends IUserCredentials {
    domain?: string;
    workstation?: string;
    rejectUnauthorized?: boolean;
}
export interface IAdfsUserCredentials extends IUserCredentials {
    domain?: string;
    adfsCookie?: string;
    adfsUrl: string;
    relyingParty: string;
}
export interface IOnDemandCredentials {
    ondemand: boolean;
    electron?: string;
    force?: boolean;
    persist?: boolean;
    ttl?: number;
}
export declare type IAuthOptions = IOnlineAddinCredentials | IOnPremiseAddinCredentials | IUserCredentials | IOnpremiseUserCredentials | IAdfsUserCredentials | IOnDemandCredentials;
export declare function isOnPremUrl(siteUrl: string): boolean;
export declare function isAddinOnlyOnline(T: IAuthOptions): T is IOnlineAddinCredentials;
export declare function isAddinOnlyOnpremise(T: IAuthOptions): T is IOnPremiseAddinCredentials;
export declare function isUserCredentialsOnline(siteUrl: string, T: IAuthOptions): T is IUserCredentials;
export declare function isUserCredentialsOnpremise(siteUrl: string, T: IAuthOptions): T is IOnpremiseUserCredentials;
export declare function isTmgCredentialsOnpremise(siteUrl: string, T: IAuthOptions): T is IOnpremiseTmgCredentials;
export declare function isFbaCredentialsOnpremise(siteUrl: string, T: IAuthOptions): T is IOnpremiseFbaCredentials;
export declare function isAdfsCredentials(T: IAuthOptions): T is IAdfsUserCredentials;
export declare function isOndemandCredentials(T: IAuthOptions): T is IOnDemandCredentials;
