import OpenAI from 'openai';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    const response = await openai.chat.completions.create({
    messages: [
        // { role: "user", content: "You are a helpful tutor who is supposed to help me memorize a text. To do this, you should ask three questions about the key ideas explained in the text and provide answers to these questions. Your response must be in json format, which is an array of pairs of questions and answers with a parent element named questions_and_answers. Your questions and answers must be in the same language as the input text, but names of json tags must always be in English. Your questions and answers should be about the following text: "+body.text }
        
          {
            role: "system",
            content: "You are a helpful tutor who is supposed to help me memorize a text. To do this, you should ask three questions about the key ideas explained in the text and provide answers to these questions. Your response must be in json format, which is an array of pairs of questions and answers with a parent element named questions_and_answers. Your questions and answers must be in the same language as the input text, but names of json tags must always be in English.",
          },
          { role: "user", content: "Please provide questions and answers about the following text: "+body.InputText },

        ],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
    });
    return JSON.parse(response.choices[0].message.content||"{}");
  })
