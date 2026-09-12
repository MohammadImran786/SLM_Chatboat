const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                message: "Messages are required"
            });
        }

        const prompt = `
You are a helpful AI assistant.
Answer clearly and concisely.
If you are unsure about something, say that you are unsure.

Conversation:

${messages
    .map((msg) => {
        return `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`;
    })
    .join("\n\n")}

Assistant:
`;

        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "qwen2.5:1.5b",
                    prompt: prompt,
                    stream: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Ollama request failed");
        }

        const data = await response.json();

        if (!data.response) {
            throw new Error("No response received from model");
        }

        res.json({
            response: data.response
        });

    } catch (error) {
        console.error("Chat error:", error);

        res.status(500).json({
            message: "Unable to generate response"
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});