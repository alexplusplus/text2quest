<template>
    <div>
        <section class="p-4 mx-auto max-w-screen-xl gap-3">
        <div class="px-4 mx-auto max-w-screen-xl text-center py-2 lg:py-2">
            <fwb-heading tag="h2">Text2Quest</fwb-heading>
        </div>
        <fwb-textarea v-model="InputText" :rows="4" label="Input text (400-6000)" placeholder="Text..." />
        <div class="flex justify-between">
            <div class="flex justify-normal space-x-4">
                <fwb-select v-model="selected_api_method" :options="api_methods"  :disabled="requestInProgress"  class="my-4" />
                <fwb-button color="default" @click="GetQA()" :disabled="!isTextEntered || requestInProgress"  class="my-4">Get Q&A</fwb-button>
            </div>
            <fwb-button color="default" @click="resetAll()" :disabled="!InputText || requestInProgress" class="my-4">
                <svg class="w-[20px] h-[20px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
                </svg>
            </fwb-button>
        </div>

        <div class="inline-flex items-center justify-center w-full">
            <fwb-spinner v-if="requestInProgress" size="10" />
            <hr v-if="displayQA && !requestInProgress" class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700">
            <span v-if="displayQA && !requestInProgress" class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Please answer</span>
        </div>


        <div v-show="displayQA">
            <fwb-accordion v-if="qadata_json" :open-first-item="false">
                <fwb-accordion-panel v-for="(item, index) in qadata_json.questions_and_answers" :key="index">
                <fwb-accordion-header>{{item.question}}</fwb-accordion-header>
                <fwb-accordion-content>
                <div>
                    <p class="mb-2 text-gray-500 dark:text-gray-400">{{item.answer}}</p>
                </div>
                </fwb-accordion-content>
                </fwb-accordion-panel>
            </fwb-accordion>
        </div>

        </section>
    </div>
</template>

<script setup>
import { useFetch } from '@vueuse/core';
import '~/node_modules/flowbite-vue/dist/index.css';
import { onMounted } from 'vue'
import { useFlowbite } from '~/composables/useFlowbite';
import { FwbAccordion, FwbAccordionContent, FwbAccordionHeader, FwbAccordionPanel} from 'flowbite-vue';
import { FwbButton, FwbHeading, FwbTextarea, FwbSpinner, FwbSelect } from 'flowbite-vue';

onMounted(() => {
    useFlowbite(() => {
        initFlowbite();
    })
});

const InputText = ref('');
const qadata_json = ref('');
const requestInProgress = ref(false);
const displayQA = ref(false);

const isTextEntered = computed(() => {
  return InputText.value.length > 400 && InputText.value.length < 6000;
});
const selected_api_method = ref('chat')
const api_methods = [
  { value: 'chat', name: 'Chat' },
  { value: 'func', name: 'Function' },
  { value: 'asst', name: 'Assistant' },
];

async function GetQA() {
    requestInProgress.value = true;
    displayQA.value = false;
    if (selected_api_method.value === 'chat') {
        const { data: MainResponse } = await useFetch('/api/getqabasic').post({InputText: InputText.value}).json();
        qadata_json.value = await MainResponse.value;
    } else if (selected_api_method.value === 'func') {
        const { data: MainResponse } = await useFetch('/api/getqafunctioncalling').post({InputText: InputText.value}).json();
        qadata_json.value = await MainResponse.value;
    } else if (selected_api_method.value === 'asst') {
        const { data: MainResponse } = await useFetch('/api/getqaassistant').post({InputText: InputText.value}).json();
        qadata_json.value = await MainResponse.value;
    }

    requestInProgress.value = false;
    displayQA.value = true;
}

async function resetAll() {
    InputText.value = '';
    displayQA.value = false;
}
</script>