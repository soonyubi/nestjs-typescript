

import  * as cluster from "cluster";
import * as os from "os";

export function runInCluster(bootstrap : ()=> Promise<void>){
    const numberOfCores = os.cpus.length;

    if(cluster.isMaster){
        for(let i = 0;i<numberOfCores;i++){
            console.log(i+1," thread running");
            cluster.fork();
        }
    }else{
        bootstrap();
    }


}