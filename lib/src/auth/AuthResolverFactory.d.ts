import { IAuthResolver } from './IAuthResolver';
import * as authOptions from './IAuthOptions';
export declare class AuthResolverFactory {
    static resolve(siteUrl: string, options?: authOptions.IAuthOptions): IAuthResolver;
}
