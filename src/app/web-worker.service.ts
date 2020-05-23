import { Injectable } from '@angular/core';
import { from } from 'rxjs';

type CallbackFunction = () => void;

@Injectable({ providedIn: 'root' })
export class WebworkerService {
    private workerFunctionToUrlMap = new WeakMap<CallbackFunction, string>();
    private promiseToWorkerMap = new WeakMap<Promise<any>, Worker>();
    private index = 0;

    run<T>(workerFunction: (input: any) => T, data?: any) {
        const url = this.getOrCreateWorkerUrl(workerFunction);
        return from(this.runUrl(url, data) as Promise<T>);
    }

    runUrl(url: string, data?: any): Promise<any> {
        const worker = new Worker(url);
        const promise = this.createPromiseForWorker(worker, data);
        const promiseCleaner = this.createPromiseCleaner(promise);

        this.promiseToWorkerMap.set(promise, worker);

        promise.then(promiseCleaner).catch(promiseCleaner);

        return promise;
    }

    terminate<T>(promise: Promise<T>): Promise<T> {
        return this.removePromise(promise);
    }

    getWorker(promise: Promise<any>): Worker {
        return this.promiseToWorkerMap.get(promise);
    }

    private createPromiseForWorker<T>(worker: Worker, data: any) {
        return new Promise<T>((resolve, reject) => {
            worker.addEventListener('message', (event) => resolve(event.data));
            worker.addEventListener('error', reject);
            worker.postMessage(data);
        });
    }

    private getOrCreateWorkerUrl(fn: any): string {
        if (!this.workerFunctionToUrlMap.has(fn)) {
            const url = this.createWorkerUrl(fn);
            this.workerFunctionToUrlMap.set(fn, url);
            this.index++
            return url;
        }
        return this.workerFunctionToUrlMap.get(fn);
    }

    private createWorkerUrl(resolve: CallbackFunction): string {
        const resolveString = resolve.toString();
        const webWorkerTemplate = `
      self.addEventListener('message', function(e) {
        postMessage((${resolveString})(e.data));
      });
    `;
        const blob = new Blob([webWorkerTemplate], { type: 'text/javascript' });
        return URL.createObjectURL(blob);
    }

    private createPromiseCleaner<T>(promise: Promise<T>): (input: any) => T {
        return (event) => {
            this.removePromise(promise);
            return event;
        };
    }

    private removePromise<T>(promise: Promise<T>): Promise<T> {
        const worker = this.promiseToWorkerMap.get(promise);
        if (worker) {
            worker.terminate();
        }
        this.promiseToWorkerMap.delete(promise);
        return promise;
    }
}