import { onUnmounted } from 'vue';
//import rpc from 'rage-rpc';

let groupName = "";

export let setGroup = (_groupName) => {
    groupName = _groupName;

    onUnmounted(() => {
        setTimeout(() => {
            groupName = "";
        }, 0)
    });
}

export let executeClientToGroup = (eventName, ...args) => {
    //console.log(`[debug] Execute client ${eventName}: ${args}`);
    if(window.mp !== undefined) {
        window.mp.trigger("client" + groupName + eventName, ...args);
    }
}

export let executeClientAsyncToGroup = async (eventName, ...args) => {
    if(window.mp !== undefined) {
        //return await rpc.callClient("rpc" + groupName + eventName, ...args);
    }
    return null;
}

/////

export let executeClient = (eventName, ...args) => {
    //console.log(`[debug] Execute client ${eventName}: ${args}`);
    if(window.mp !== undefined) {
        window.mp.trigger(eventName, ...args);
    }
}

export let invokeMethod = (invokeName, ...args) => {
    //console.log(`[debug] Invoke method ${invokeName}: ${args}`);
    if(window.mp !== undefined) window.mp.invoke(invokeName, ...args);
}

export let executeClientAsync = async (eventName, ...args) => {
    if(window.mp !== undefined) {
        //return await rpc.callClient("rpc." + eventName, ...args);
    }
    return null;
}