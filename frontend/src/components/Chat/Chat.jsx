import "./Chat.css";
import axios from "axios";
import { useState } from "react";
import Message from "../Message/Message";

const API = "https://chat-with-pdf-t5h4.onrender.com/api";

function Chat() {

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    
    async function askQuestion() {

    if (!question.trim()) {
        alert("Enter a question");
        return;
    }

    const userMessage = {
        sender: "user",
        text: question
    };

    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {

        const { data } = await axios.post(`${API}/ask`, {
            question
        });

        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: data.answer
            }
        ]);

        setQuestion("");

    } catch (err) {

        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: "Something went wrong."
            }
        ]);

    } finally {

        setLoading(false);

    }

}

    return (
        <div className="chat-container">

            <div className="chat-box">

    {messages.map((msg, index) => (
        <Message
            key={index}
            sender={msg.sender}
            text={msg.text}
        />
    ))}

    {loading && (
        <Message
            sender="ai"
            text="Typing..."
        />
    )}

</div>

            <div className="chat-input">

                <input
                    type="text"
                    placeholder="Ask your question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <button onClick={askQuestion}>
                    Send
                </button>

            </div>

        </div>
    );
}

export default Chat;
