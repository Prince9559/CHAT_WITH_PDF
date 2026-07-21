import "./Chat.css";
import { useState } from "react";

function Chat({ pdfUploaded }) {

    const [question, setQuestion] = useState("");

    const askQuestion = () => {

        if (!pdfUploaded) {

            alert("Upload PDF First");

            return;

        }

        if (question === "") {

            alert("Enter Question");

            return;

        }

        console.log(question);

    };

    return (

        <div className="chat-container">

            <input

                type="text"

                value={question}

                placeholder="Ask Question..."

                onChange={(e) => setQuestion(e.target.value)}

            />

            <button

                onClick={askQuestion}

            >

                Ask

            </button>

        </div>

    );

}

export default Chat;