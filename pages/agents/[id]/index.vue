<script setup lang="ts">
import DashboardPage from '@/components/DashboardPage.vue';
import { Agent } from '@/utils/models/agent';
import FormDescription from '~/components/forms/FormDescription.vue';
import FormInput from '~/components/forms/FormInput.vue';
import FormLabel from '~/components/forms/FormLabel.vue';

definePageMeta({
	layout: 'dashboard',
	middleware: 'auth',
});


const route = useRoute();
const id = route.params.id;

const agent = ref<Agent | null>(null);

const isNewAgent = id === "new";

async function getAgent() {

    if (isNewAgent) {
        return new Agent(
            -1,
            "",
            "" as any,
            "",
            "",
            "" as any
        );
    }

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


onMounted(async () => {
    try {
        agent.value = await getAgent();
        console.log('Agent:', agent);
    } catch (error) {
        console.error('Error fetching agent:', error);
    }
});


</script>

<template>

    <DashboardPage v-if="agent" title="Edit Agent" subtitle="Manage your agent details" image="bi bi-wifi">

        <div class="box-container">
            <h4 class="text-white mb-4">Resource Details</h4>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <FormLabel for="agentName">Name</FormLabel>
                    <FormInput id="agentName" v-model="agent.name" placeholder="Enter agent name" required />
                    <FormDescription>
                        The name of the agent. This is used to identify the agent in the dashboard.
                    </FormDescription>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="agentType" class="form-label text-white">Type</label>
                    <select class="form-select" id="agentType" v-model="agent.type">
                        <option value="chatgpt">ChatGPT</option>
                        <option value="gpt4">GPT-4</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
            </div>
        </div>

    </DashboardPage>

    <DashboardPage v-else title="Loading Agent..." subtitle="Please wait while we load the agent details." image="bi bi-hourglass-split">
        <p>Loading...</p>
    </DashboardPage>

    <div></div>

</template>

<style scoped>


.box-container {
    width: 100%;
    padding: 30px;
    background-color: #1a1b2e;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

</style>
