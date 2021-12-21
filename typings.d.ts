declare module 'discord-hybrid-sharding' {
  import { EventEmitter } from 'events';
  import { ChildProcess } from 'child_process';
  import { Client as DJsClient } from "discord.js";
  export class Cluster extends EventEmitter {
    constructor(manager: Manager, id: number);
    private _evals: Map<string, Promise<any>>;
    private _exitListener: (...args: any[]) => void;
    private _fetches: Map<string, Promise<any>>;
    private _handleExit(respawn?: boolean): void;
    private _handleMessage(message: any): void;

    public args: string[];
    public execArgv: string[];
    public env: object;
    public id: number;
    public manager: Manager;
    public process: ChildProcess | null;
    public ready: boolean;
    public worker: any | null;
    public heartbeat: object;

    private _restarts: object;

    public eval(script: string): Promise<any>;
    public eval<T>(fn: (client: client) => T): Promise<T[]>;
    public fetchClientValue(prop: string): Promise<any>;
    public kill(): void;
    public respawn(delay?: number, spawnTimeout?: number): Promise<ChildProcess>;
    public send(message: any): Promise<Cluster>;
    public request(message: BaseMessage): Promise<BaseMessage>;
    public spawn(spawnTimeout?: number): Promise<ChildProcess>;

    private _checkIfClusterAlive(): Promise<any[]>;
    private _cleanupHearbeat(): Promise<any[]>;

    public on(event: 'spawn' | 'death', listener: (child: ChildProcess) => void): this;
    public on(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
    public on(event: 'error', listener: (error: Error) => void): this;
    public on(event: 'message', listener: (message: any) => void): this;
    public on(event: string, listener: (...args: any[]) => void): this;

    public once(event: 'spawn' | 'death', listener: (child: ChildProcess) => void): this;
    public once(event: 'disconnect' | 'ready' | 'reconnecting', listener: () => void): this;
    public once(event: 'error', listener: (error: Error) => void): this;
    public once(event: 'message', listener: (message: any) => void): this;
    public once(event: string, listener: (...args: any[]) => void): this;
  }

  export class Client extends EventEmitter{
    constructor(client: client, usev13?: boolean);
    private _handleMessage(message: any): void;
    private _respond(type: string, message: any): void;
    private _nonce: Map<string, Promise<any>>;

    public client: client;
    public readonly count: number;
    public readonly id: number;
    public readonly ids: number[];
    public readonly keepAliveInterval: number;
    public mode: ClusterManagerMode;
    public static getinfo: processData;
    public getinfo: processData;
    public parentPort: any | null;
    public evalOnManager(script: string): Promise<any[]>;
    public evalOnCluster(script: string, options: { cluster: number; timeout?: number }): Promise<any[]>;
    public evalOnCluster<T>(fn: (client: client) => T, options: { cluster: number; timeout?: number }): Promise<T>;
    public evalOnCluster<T>(fn: (client: client) => T, options: { cluster: number; timeout?: number }): Promise<any[]>;
    public broadcastEval(script: string): Promise<any[]>;
    public broadcastEval(script: string, cluster: number): Promise<any>;
    public broadcastEval<T>(fn: (client: client) => T): Promise<T[]>;
    public broadcastEval<T>(fn: (client: client) => T, options: {cluster: number, context: any}): Promise<T>;
    public fetchClientValues(prop: string): Promise<any[]>;
    public fetchClientValues(prop: string, cluster: number): Promise<any>;
    public respawnAll(clusterDelay?: number, respawnDelay?: number, spawnTimeout?: number): Promise<void>;
    public send(message: any): Promise<void>;
    public request(message: Object): Promise<BaseMessage>;

    private _heartbeatAckMessage(): Promise<any[]>;
    private _checkIfAckRecieved(): Promise<any[]>;
    private _checkIfClusterAlive(): Promise<any[]>;
    private _cleanupHearbeat(): Promise<any[]>;

    public static singleton(client: client, mode: ClusterManagerMode): client;
  }

  export class Manager extends EventEmitter {
    constructor(
      file: string,
      options?: {
        totalShards?: number | 'auto';
        totalClusters?: number | 'auto';
        shardsPerClusters?: number | 'auto';
        shardList?: number[] | 'auto';
        mode?: ClusterManagerMode;
        respawn?: boolean;
        shardArgs?: string[];
        token?: string;
        execArgv?: string[];
        usev13?: boolean;
        keepAlive?: keepAliveOptions;
      },
    );
    private _performOnShards(method: string, args: any[]): Promise<any[]>;
    private _performOnShards(method: string, args: any[], cluster: number): Promise<any>;
    private _nonce: Map<string, Promise<any>>;


    public file: string;
    public respawn: boolean;
    public shardArgs: string[];
    public clusters: Map<number, Cluster>;
    public token: string | null;
    public totalClusters: number | 'auto';
    public shardsPerClusters: number | 'auto';
    public totalShards: number | 'auto';
    public shardList: number[] | 'auto';
    public keepAlive: keepAliveOptions;
    public broadcast(message: any): Promise<Cluster[]>;
    public broadcastEval(script: string): Promise<any[]>;
    public broadcastEval(script: string, cluster: number): Promise<any>;
    public broadcastEval<T>(fn: (client: client) => T): Promise<T[]>;
    public broadcastEval<T>(fn: (client: client) => T, options: {cluster: number, context: any}): Promise<T>;
    public createCluster(id: number, clusterstospawn: number[], totalshards: number): Cluster;
    public fetchClientValues(prop: string): Promise<any[]>;
    public fetchClientValues(prop: string, cluster: number): Promise<any>;
    public evalOnManager(script: string): Promise<any[]>;
    private evalOnCluster(script: string, options: Object): Promise<any[]>;
    public respawnAll(
      clusterDelay?: number,
      respawnDelay?: number,
      spawnTimeout?: number,
    ): Promise<Map<number, Cluster>>;
    public spawn(amount?: number | 'auto', delay?: number, spawnTimeout?: number): Promise<Map<number, Cluster>>;

    public on(event: 'clusterCreate', listener: (cluster: Cluster) => void): this;
    public on(event: "debug", listener: (message: string) => void): this;

    public once(event: 'clusterCreate', listener: (cluster: Cluster) => void): this;
    public once(event: "debug", listener: (message: string) => void): this;
  }

  export class BaseMessage{
    public _sCustom: true;
    public nonce: String;
    private destructMessage(message: Object): Promise<Object>;
    public toJSON(): Promise<Object>;
  }

  export class IPCMessage{
    public instance: Cluster | Client;
    public raw: BaseMessage;
    public send(message: Object): Promise<Cluster|Client>;
    public request(message: Object): Promise<Object>;
    public reply(message: Object): Promise<Object>;

  }

  export class data {
    static SHARD_LIST: number[];
    static TOTAL_SHARDS: number;
    static CLUSTER_COUNT: number;
    static CLUSTER: number;
    static CLUSTER_MANAGER_MODE: ClusterManagerMode;
    static KEEP_ALIVE_INTERVAL: number;
  }


  type ClusterManagerMode = 'process' | 'worker';
  type client = DJsClient;
  export type processData = {
    SHARD_LIST: number[];
    TOTAL_SHARDS: number;
    CLUSTER_COUNT: number;
    CLUSTER: number;
    CLUSTER_MANAGER_MODE: ClusterManagerMode;
    KEEP_ALIVE_INTERVAL: number;
  }

  export type keepAliveOptions = {
    interval: number | 10000;
    maxClusterRestarts: number | 3;
    maxMissedHeartbeats: number | 5;
  }

}
