<template>
    <div>
        <div :style="{ color: statusColor }">
            Status: {{ connectionStatus }}
        </div>

        <button class="mt-2 px-4 py-2 rounded btn btn-primary"
            :disabled="connectionStatus === 'Open' || connectionStatus === 'Connecting'" @click="connect">
            Connect
        </button>

        <div id="messages" class="mt-4">
            <div v-for="(msg, index) in messages" :key="index">
                📩 {{ msg }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import { EncodingUtils } from '~/shared/encoding'

const messages = ref<string[]>([])
const connectionStatus = ref<'Connecting' | 'Open' | 'Closed' | 'Error'>('Closed')

const statusColor = computed(() => {
    switch (connectionStatus.value) {
        case 'Connecting': return 'orange'
        case 'Open': return 'green'
        case 'Closed': return 'gray'
        case 'Error': return 'red'
    }
})

let socket: WebSocket | null = null


function connect() {
    if (connectionStatus.value === 'Open' || connectionStatus.value === 'Connecting') return

    connectionStatus.value = 'Connecting'
    socket = new WebSocket(`ws://localhost:3000/api/control-service?id=${EncodingUtils.toHex("1")}&secret=${EncodingUtils.toHex("123456")}`);
    console.log('Connecting to WebSocket server...')

    socket.onopen = () => {
        connectionStatus.value = 'Open'
    }

    socket.onmessage = async (event) => {

        const msg = event.data as string;
        messages.value.push(msg);

        const [type, id, payload] = msg.split(':', 2);
        
        const response = `${type}:${id}:${JSON.stringify({
            status: "success"
        })}`;

        console.log('Sending response:', response);
        socket?.send(response);
    }

    socket.onclose = () => {
        console.log('WebSocket connection closed', event)
        connectionStatus.value = 'Closed'
    }

    socket.onerror = () => {
        console.error('WebSocket error observed:', event)
        connectionStatus.value = 'Error'
    }
}

onMounted(() => {
    connect();
});

</script>
