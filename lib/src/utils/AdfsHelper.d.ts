import { IAdfsUserCredentials } from './../auth/IAuthOptions';
import { SamlAssertion } from './SamlAssertion';
export declare class AdfsHelper {
    static getSamlAssertion(credentials: IAdfsUserCredentials): Promise<SamlAssertion>;
}
