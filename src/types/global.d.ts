/**
 * Global type declarations for browser extensions
 */

import { Eip1193Provider } from "ethers";

declare global {
    interface Window {
        ethereum?: Eip1193Provider & {
            on: (event: string, callback: (...args: unknown[]) => void) => void;
            removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        };
    }
}

export { };
