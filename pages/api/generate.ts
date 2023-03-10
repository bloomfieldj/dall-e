import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import rateLimit from "../../utils/rate-limit";

const limiter = rateLimit({
  uniqueTokenPerInterval: 500, // 500 unique tokens per interval
  interval: 60000, // 1 minute
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = req.query;

  try {
    // Check if the user has exceeded maximum number of requests per minute
    await limiter.check(res, 5, "CACHE_TOKEN").catch((e) => {
      // 5 requests per minute
      return res.status(429).json({
        message:
          "Vous avez généré trop d'images, attendez une minute avant de réessayer.",
        description:
          "Vous avez généré trop d'images, attendez une minute avant de réessayer.",
      });
    });

    const response = await openai.createImage({
      prompt: prompt as string,
      n: 1,
      size: "1024x1024",
    });
    return res.status(202).json({ url: response.data.data[0].url });
  } catch (error) {
    return res.status(500).json({ message: error.message, type: "Erreur" });
  }
}
