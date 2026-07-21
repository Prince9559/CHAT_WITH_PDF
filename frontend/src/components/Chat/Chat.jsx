import "./Chat.css";
import axios from "axios";
import { useState } from "react";

const API = "https://chat-with-pdf-t5h4.onrender.com/api";

function Chat() {

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    async function askQuestion() {

        if (!question.trim()) {
            alert("Enter a question");
            return;
        }

        try {

            const { data } = await axios.post(`${API}/ask`, {
                question
            });

            setAnswer(data.answer);

        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }

    }

    return (
        <div className="chat-container">

            <input
                type="text"
                placeholder="Ask your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <button onClick={askQuestion}>
                Ask
            </button>

            {answer && (
                <div className="answer">
                    <h3>Answer</h3>
                    <p>{answer}</p>
                </div>
            )}

        </div>
    );
}

export default Chat;