import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        messages: [...messages, userMessage],
        }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      const assistantMessage = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            <div className="logo-icon">AI</div>
            <span>Local AI</span>
          </div>

          <button className="new-chat" onClick={clearChat}>
            <span>＋</span>
            New chat
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="model-info">
            <div className="status-dot"></div>
            <div>
              <strong>Qwen2.5 1.5B</strong>
              <small>Running locally</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="chat-container">

        {/* Header */}
        <header className="chat-header">
          <div>
            <h2>Local AI</h2>
            <span>Qwen2.5 1.5B</span>
          </div>

          {messages.length > 0 && (
            <button className="clear-button" onClick={clearChat}>
              Clear chat
            </button>
          )}
        </header>

        {/* Messages */}
        <div className="messages-container">

          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>

              <h1>How can I help you?</h1>

              <p>
                Ask anything and get a response from your
                locally running AI model.
              </p>

              <div className="suggestions">
                <button
                  onClick={() =>
                    setInput("Explain JavaScript closures")
                  }
                >
                  Explain JavaScript closures
                </button>

                <button
                  onClick={() =>
                    setInput("What is REST API?")
                  }
                >
                  What is REST API?
                </button>

                <button
                  onClick={() =>
                    setInput("Explain React components")
                  }
                >
                  Explain React components
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                className={`message-row ${
                  msg.role === "user" ? "user-row" : "assistant-row"
                }`}
                key={index}
              >
                <div
                  className={`avatar ${
                    msg.role === "user"
                      ? "user-avatar"
                      : "assistant-avatar"
                  }`}
                >
                  {msg.role === "user" ? "U" : "AI"}
                </div>

                <div className="message-content">
                  <div className="message-role">
                    {msg.role === "user" ? "You" : "Local AI"}
                  </div>

                  <div className="message-text">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="message-row assistant-row">
              <div className="avatar assistant-avatar">AI</div>

              <div className="message-content">
                <div className="message-role">Local AI</div>

                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Local AI..."
              rows="1"
            />

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
            >
              ↑
            </button>

          </div>

          <p className="input-note">
            Qwen2.5 1.5B can make mistakes. Check important information.
          </p>
        </div>

      </main>
    </div>
  );
}

export default App;