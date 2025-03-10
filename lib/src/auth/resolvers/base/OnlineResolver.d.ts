import { IAuthResolver } from '../../IAuthResolver';
import { IAuthResponse } from '../../IAuthResponse';
import { HostingEnvironment } from '../../HostingEnvironment';
export declare abstract class OnlineResolver implements IAuthResolver {
    protected _siteUrl: string;
    protected hostingEnvironment: HostingEnvironment;
    protected endpointsMappings: Map<HostingEnvironment, string>;
    constructor(_siteUrl: string);
    abstract getAuth(): Promise<IAuthResponse>;
    protected abstract InitEndpointsMappings(): void;
}
