import { contextBridge, ipcRenderer } from 'electron';

type TrpcInvokeInput = {
    path: string;
    input: unknown;
};

contextBridge.exposeInMainWorld('trpc', {
    invoke: async <TOutput>(op: TrpcInvokeInput): Promise<TOutput> => {
        return ipcRenderer.invoke('trpc:invoke', op);
    },
});

export {};
