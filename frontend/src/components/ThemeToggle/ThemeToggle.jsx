import "./ThemeToggle.css";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle({ darkMode, setDarkMode }) {

    return (

        <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaMoon /> : <FaSun />}
        </button>

    );

}

export default ThemeToggle;