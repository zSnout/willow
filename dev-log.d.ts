export declare function devLog(type: string, action: string, name: string | undefined): void;
export declare function startDevScope(name: string | undefined): void;
export declare function endDevScope(name: string | undefined): void;
declare global {
    var __DEV__: boolean;
}
