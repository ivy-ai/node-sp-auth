import got, { Options } from 'got';
export interface IConfiguration {
    requestOptions?: Options;
}
export declare let request: typeof got;
export declare function setup(config: IConfiguration): void;
