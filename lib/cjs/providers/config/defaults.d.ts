import { HttpClientContextProps, jsonHttpResponseParser } from '.';
export declare const defaultHttpReqConfig: {
    baseUrl: string;
    globalParser: typeof jsonHttpResponseParser;
    reqOptions: {
        headers: {
            'Content-Type': string;
        };
    };
};
export declare const defaultClientProps: HttpClientContextProps;
