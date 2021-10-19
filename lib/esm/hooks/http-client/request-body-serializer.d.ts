declare type ReqBodySerializerReturn = string | null | ArrayBuffer | Blob | FormData | URLSearchParams;
export declare function serializeRequestBody(body: BodyInit): ReqBodySerializerReturn;
export {};
