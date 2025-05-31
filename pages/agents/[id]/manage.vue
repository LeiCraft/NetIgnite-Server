<script setup lang="ts">
import DashboardPage from '@/components/DashboardPage.vue';
import { Agent } from '@/utils/models/agent';

definePageMeta({
	layout: 'dashboard',
	middleware: 'auth',
});


const route = useRoute();
const id = parseInt(route.params.id as string, 10);

const agent = ref<Agent | null>(null);

onMounted(async () => {

    async function getAgent() {
    const response = await $fetch(`/api/agents/${id}`, {
        method: 'GET'
    });
        
    if (!response || response.status !== "OK" || !response.data) {
        throw new Error((response as any)?.message || 'unknown error');
    }
    return Agent.fromData({
        ...response.data,
        status: 'unknown',
    });
}

    try {
        agent.value = await getAgent();
        console.log('Agent:', agent);
    } catch (error) {
        console.error('Error fetching agent:', error);
    }
});


</script>

<template>

    <DashboardPage v-if="agent" :title="agent.name + ' | Manage Agent'" :subtitle="`Manage Agent: ${agent.name}`" image="bi bi-wifi">


    </DashboardPage>

    <DashboardPage v-else title="Loading Agent..." subtitle="Please wait while we load the agent details." image="bi bi-hourglass-split">
        <p>Loading...</p>
    </DashboardPage>

    <div></div>

</template>

