import type {
  ChatPostMessageArguments,
  ChatPostMessageResponse,
} from "@slack/web-api";
import * as dotenv from "dotenv";

dotenv.config();

export async function slackPostMessage(
  slackChannel: string,
  header: string,
  text: string
): Promise<ChatPostMessageResponse> {
  const body: ChatPostMessageArguments = {
    channel: slackChannel,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: header || "",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: text ?? "The message is empty",
        },
      },
    ],
  };
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.SLACK_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(
      `Crisp responded with ${response.status}: ${response.statusText}`
    );
  }
  return response.json<ChatPostMessageResponse>();
}
