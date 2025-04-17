import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [message, setMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.warning("⚠️ Please enter a message first.");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setResult(data);

    if (res.ok) {
      toast.success("✅ Feedback submitted successfully!");
    } else {
      toast.error("❌ Failed to submit feedback.");
    }

    setMessage("");
    fetchFeedback();
    setLoading(false);
  };

  const fetchFeedback = async () => {
    const res = await fetch("http://localhost:5000/api/feedback");
    const data = await res.json();
    setFeedbackList(data);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="App">
      <h1>💬 Smart Feedback App</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          placeholder="Enter your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? "Analyzing..." : "Submit"}
        </button>
      </form>

      {loading && <div className="spinner">🔍 Analyzing sentiment...</div>}

      {result && (
        <div
          className="result-box"
          style={{
            borderLeftColor: result.sentiment === "POSITIVE" ? "green" : "red",
            color: result.sentiment === "POSITIVE" ? "green" : "red",
          }}
        >
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Sentiment:</strong> {result.sentiment}</p>
        </div>
      )}

      <hr />
      <div>
        <h3>Previous Feedback</h3>
        {feedbackList.map((f) => (
          <div
            key={f.id}
            className={`feedback-item ${f.sentiment === "POSITIVE" ? "positive" : "negative"}`}
          >
            <p><strong>Message:</strong> {f.message}</p>
            <p><strong>Sentiment:</strong> {f.sentiment}</p>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default App;