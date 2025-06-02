<script setup lang="ts">
import DashboardPage from '@/components/DashboardPage.vue';
import { Agent } from '@/utils/models/agent';
import FormDescription from '~/components/forms/FormDescription.vue';
import FormGroup from '~/components/forms/FormGroup.vue';
import FormInput from '~/components/forms/FormInput.vue';
import FormLabel from '~/components/forms/FormLabel.vue';
import FormPWInput from '~/components/forms/FormPWInput.vue';
import FormSelect from '~/components/forms/FormSelect.vue';
import FormSubmitBtn from '~/components/forms/FormSubmitBtn.vue';
import FormTextarea from '~/components/forms/FormTextarea.vue';
import { useAPI } from '~/composables/useAPI';
import { SessionStore } from '~/utils/userStore';

definePageMeta({
	layout: 'dashboard',
	middleware: 'auth',
});


const route = useRoute();
const agent_id = route.params.id;

const isNewAgent = agent_id === "new";

const initialNotification = ref<NotificationToastSettings | null>(null);

async function getAgent() {

    if (isNewAgent) {
        return new Agent({
            id: -1,
            name: "",
            description: "",
            type: "" as any,
            secret: crypto.randomUUID().replace(/-/g, '').substring(0, 16),
            ownerID: SessionStore.useUserInfo().userID,
            status: 'unknown',
        });
    }

    const response = await useAPI(`/api/agents/${agent_id}` as `/api/agents/:id`, {
        method: 'GET'
    });
        
    if (response.status !== "OK" || !response.data) {
        initialNotification.value = {
            message: `Error fetching agent: ${response?.message || 'unknown error'}`,
            type: 'error'
        };
        return {} as Agent;
    }
    return new Agent({
        ...response.data,
        status: 'unknown',
    });
}

const agent = reactive(await getAgent());

async function sumbitForm() {

    try {

        if (isNewAgent) {
            const response = await useAPI('/api/agents', {
                method: 'POST',
                body: JSON.stringify(agent)
            });

            if (response.status !== "OK" || !response.data) {
                useNotificationToast({
                    message: `Error creating agent: ${response?.message || 'unknown error'}`,
                    type: 'error'
                });
                return;
            }
            useNotificationToast({
                message: 'Agent created successfully',  
                type: 'success'
            });
            navigateTo(`/agents/${response.data}`, { replace: true });

        } else {

            const response = await useAPI(`/api/agents/${agent.id}`, {
                method: 'PUT',
                body: JSON.stringify(agent)
            });

            if (response.status !== "OK") {
                useNotificationToast({
                    message: `Error updating agent: ${response?.message || 'unknown error'}`,
                    type: 'error'
                });
                return;
            }
            useNotificationToast({
                message: 'Agent updated successfully',
                type: 'success'
            });
            navigateTo(`/agents/`);
        }

    } catch (error) {
        useNotificationToast({
            message: `Error: ${error instanceof Error ? error.message : 'unknown error'}`,
            type: 'error'
        });
    }

}

const isSubmitDisabled = computed(() => {
    return !agent.name || !agent.type || !agent.secret;
});

onMounted(() => {
    if (initialNotification.value && import.meta.client) {
        useNotificationToast(initialNotification.value);
        navigateTo('/agents');
    }
});

</script>

<template>

    <DashboardPage v-if="!initialNotification" :title="isNewAgent ? 'Create New Agent' : 'Edit Agent'" subtitle="Manage your agent details" image="bi bi-wifi">

        <form @submit.prevent="sumbitForm" autocomplete="off">

            <div class="box-container d-flex flex-column justify-content-center">

                <h4 class="text-white mb-4">Resource Details</h4>

                <div class="row">
                    <FormGroup class="col-md-6">
                        <FormLabel>Name</FormLabel>
                        <FormInput id="agentName" v-model="agent.name" placeholder="Enter agent name" required />
                        <FormDescription>
                            The name of the agent. This is used to identify the agent in the dashboard.
                        </FormDescription>
                    </FormGroup>
                    <FormGroup class="col-md-6">
                        <FormLabel class="form-label">Agent Type</FormLabel>
                        <FormSelect v-model="agent.type" required>
                            <option value="" disabled>Select Agent Type</option>
                            <option v-for="type in Agent.Utils.getAllAgentTypes()" :value="type.name">
                                {{ type.label }}
                            </option>
                        </FormSelect>
                    </FormGroup>
                    <FormGroup class="col-md-12">
                        <FormLabel class="form-label">Description</FormLabel>
                        <FormTextarea rows="2" v-model="agent.description" placeholder="Enter agent description"></FormTextarea>
                    </FormGroup>
                </div>

                <div v-if="isNewAgent" class="d-flex justify-content-end mt-4">
                    <FormSubmitBtn class="btn btn-primary text-right" type="submit" :disabled="isSubmitDisabled">
                        Create Agent
                    </FormSubmitBtn>
                </div>

            </div>

            <div v-if="!isNewAgent" class="box-container d-flex flex-column justify-content-center mt-4">

                <h4 class="text-white mb-4">Connection Details</h4>

                <div class="row mb-4">
                    <FormGroup class="col-md-6">
                        <FormLabel>Connection ID</FormLabel>
                        <FormInput v-model="agent.id" disabled />
                    </FormGroup>
                    <FormGroup class="col-md-6">
                        <FormLabel>Connection Secret</FormLabel>
                        <FormPWInput v-model="agent.secret" autocomplete="" required />
                    </FormGroup>
                </div>

                <div class="d-flex justify-content-end">
                    <FormSubmitBtn class="btn btn-primary text-right" type="submit" :disabled="isSubmitDisabled">
                        Update Agent
                    </FormSubmitBtn>
                </div>

            </div>

        </form>

    </DashboardPage>

    <div></div>

</template>

<style scoped>

</style>
