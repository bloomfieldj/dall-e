# Dall-E 2 AI Art Generator forked from https://github.com/domeccleston/dalle-2

All credit goes to the original repo's creator [Dom Eccleston](https://github.com/domeccleston)

This project will generate images from text using [OpenAi's Node.js library](https://www.npmjs.com/package/openai) directly without Qstash or Redis.

![OG Image](/public/ogimage.png)

## How it works

It uses an ML model from OpenAI called DALLE-2 to generate an image using AI with just a text description. When text is submitted, the application calls the OpenAI API through `/api/generate` and returns a URL for the generated image and loads it on the page once it's available.

## Running Locally

To run this locally, you'll need to sign up to https://openai.com and create a new API key ($18 of free credit is available for new users) and set OPENAI_API_KEY accordingly.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```

Fork the repo and deploy on Vercel to get started.
