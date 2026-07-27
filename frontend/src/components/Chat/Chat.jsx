import "./Chat.css";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Message from "../Message/Message";
import Loader from "../Loader/Loader";

const API = "https://chat-with-pdf-t5h4.onrender.com/api";

function Chat({ pdfUploaded }) {

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    async function askQuestion() {

        // PDF upload check
        if (!pdfUploaded) {
            toast.warning("📄 Please upload a PDF first");
            return;
        }

        // Empty question check
        if (!question.trim()) {
            toast.warning("⚠️ Please enter a question");
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

            console.error(err);

            toast.error("❌ Something went wrong");

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

                {loading && <Loader />}

                <div ref={bottomRef}></div>

            </div>

            <div className="chat-input">

                <input
                    type="text"
                    placeholder="Ask anything from your PDF..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            askQuestion();
                        }
                    }}
                    disabled={!pdfUploaded}
                />

                <button
                    onClick={askQuestion}
                    disabled={!pdfUploaded || loading}
                >
                    {loading
                        ? "Sending..."
                        : pdfUploaded
                        ? "Send"
                        : "Upload PDF First"}
                </button>

            </div>

        </div>
    );
}

export default Chat;