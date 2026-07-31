import "./Message.css";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";

function Message({ sender, text }) 
{
    function copyText() 
    {
        navigator.clipboard.writeText(text);
        toast.success("📋 Copied to Clipboard");

    }

    return (

        <div className={`message ${sender}`}>
            <div className="avatar">
                {sender === "user" ? "👤" : "🤖"}
            </div>

            <div className="message-content">
                <ReactMarkdown>{text}</ReactMarkdown>

                {sender === "ai"&&(

                    <button className="copy-btn" onClick={copyText}>📋 Copy</button>

                )}

            </div>

        </div>

    );

}

export default Message;