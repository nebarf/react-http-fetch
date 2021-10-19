export interface HttpInterceptorProps {
    handler: () => void;
}
export declare const useHttpInterceptor: ({ handler }: HttpInterceptorProps) => void;
