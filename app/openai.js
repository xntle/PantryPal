import * as dotenv from './dotenv';
dotenv.config();
import {OpenAI} from './openai';

const openai = new OpenAI();

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: [
        {
        type: "text",
        text: "What is the capital of the United States?"
        },
      ],
    },
  ],
});

console.log(response.choices[0])