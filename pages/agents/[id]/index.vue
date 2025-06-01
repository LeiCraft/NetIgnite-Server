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
import { SessionStore } from '~/utils/userStore';

definePageMeta({
	layout: 'dashboard',
	middleware: 'auth',
});


const route = useRoute();
const id = route.params.id;

const isNewAgent = id === "new";

async function getAgent() {

    if (isNewAgent) {
        return new Agent(
            -1,
            "",
            "" as any,
            "",
            crypto.randomUUID().replace(/-/g, '').substring(0, 16),
            SessionStore.useUserInfo().userID,
            "" as any
        );
    }

    const { data } = await useFetch(`/api/agents/${id}`, {
        method: 'GET'
    });
    const response = data.value;
        
    if (!response || response.status !== "OK" || !response.data) {
        throw new Error((response as any)?.message || 'unknown error');
    }
    return Agent.fromData({
        ...response.data,
        status: 'unknown',
    });
}

const agent = ref(await getAgent());

async function sumbitForm() {

    try {

        if (isNewAgent) {
            const response = await $fetch('/api/agents', {
                method: 'POST',
                body: JSON.stringify(agent.value)
            });

            if (!response || response.status !== "OK" || !response.data) {
                useNotificationToast({
                    message: `Error creating agent: ${response.message || 'unknown error'}`,
                    type: 'error'
                });
            } else {
                useNotificationToast({
                    message: 'Agent created successfully',  
                    type: 'success'
                });
                navigateTo(`/agents/${response.data}`);
            }

        } else {

            const { data } = await useFetch(`/api/agents/${id}`, {
                method: 'PUT',
                body: JSON.stringify(agent.value)
            });
            const response = data.value;

            if (!response || response.status !== "OK" || !response.data) {
                throw new Error((response as any)?.message || 'unknown error');
            }

            agent.value = Agent.fromData({
                ...response.data,
                status: 'unknown',
            });
        }

    } catch (error) {

    }

}

const isSubmitDisabled = computed(() => {
    return !agent.value.name || !agent.value.type || !agent.value.secret;
});

</script>

<template>

    <DashboardPage :title="isNewAgent ? 'Create New Agent' : 'Edit Agent'" subtitle="Manage your agent details" image="bi bi-wifi">

        <form @submit.prevent="sumbitForm" autocomplete="off">

            <div class="box-container d-flex flex-column justify-content-center">

                <h4 class="text-white mb-4">Resource Details</h4>

                <div class="row">
                    <FormGroup class="col-md-6">
                        <FormLabel for="agentName">Name</FormLabel>
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
                        <FormTextarea rows="2" v-model="agent.description" />
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


.box-container {
    width: 100%;
    padding: 30px;
    background-color: #1a1b2e;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
}

</style>
