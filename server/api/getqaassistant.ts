import OpenAI from 'openai';
import { sleep } from 'openai/core';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    const run = await openai.beta.threads.createAndRun({
        assistant_id: "asst_mOWx3RKHDMgmmKybwKvIHSGL",
        tool_choice: { type: "function", function: { name: "questions_and_answers" } },
        thread: {
          messages: [{ role: "user", content: body.InputText }],
        },
      });
    
    //Check run status for the 1st time. Expected status is "requires_action"
    await sleep(3000);
    var run_status = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    
    while (run_status.status != "requires_action") {
        await sleep(1500);
        run_status = await openai.beta.threads.runs.retrieve(run.thread_id, run.id );
      };

    //Get function call id and use it to submit tool outputs
    const call_id = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    const call_output = await openai.beta.threads.runs.submitToolOutputs(run.thread_id, run.id, 
        {tool_outputs: [{tool_call_id: call_id.required_action?.submit_tool_outputs?.tool_calls[0].id, output: ""}] }
    );
    
    // Check run status for the 2nd time (before obtaining the final result). Expected status is "completed"
    await sleep(3000);
    while (run_status.status != "completed" && run.status != "failed") {
        await sleep(1500);
        run_status = await openai.beta.threads.runs.retrieve(run.thread_id, run.id );
      };
    
    const assistants_response = await openai.beta.threads.messages.list( run.thread_id );
    
    return JSON.parse(assistants_response.data[0].content[0].text.value);
});