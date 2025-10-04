import React, { useState, useEffect } from 'react';

// --- Helper Components (from your Welcome page for style consistency) ---

// Form input component
const FormInput = ({ id, type, placeholder, icon, value, onChange }) => (
  <div className="form-input-container">
    <div className="icon-container">
      {React.cloneElement(icon, { className: 'icon-svg' })}
    </div>
    <input
      id={id}
      name={id}
      type={type}
      required
      className="form-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ userSelect: 'text' }}
    />
  </div>
);

// Button component
const FormButton = ({ children, onClick, type = "button", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="form-button"
  >
    {children}
  </button>
);

// Quote Rotator Component
const QuoteRotator = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('https://api.quotable.io/quotes?tags=inspirational|business|success&limit=10');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setQuotes(data.results.map(q => ({ text: q.content, author: q.author })));
      } catch (error) {
        console.error("Could not fetch quotes:", error);
        // Fallback quotes
        setQuotes([
          { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
          { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
          { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
        ]);
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [quotes]);

  if (quotes.length === 0) return null;

  const { text, author } = quotes[currentQuoteIndex];
  return (
    <div className="quote-rotator">
      <p className="quote-text">"{text}"</p>
      <p className="quote-author">- {author}</p>
    </div>
  );
};


// --- Main ForgotPass Component ---

const App = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // In a real app, you would use useNavigate from react-router-dom
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
        // In a real app: setTimeout(() => navigate("/"), 2000);
        console.log("Password reset link sent. Redirecting...");
      } else {
        const data = await response.json();
        setMessage(data.error || "Email not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Brand Panel (Left Side)
  const brandPanel = (
    <div className="brand-panel">
      <div className="brand-content">
        <h1 className="brand-title">Expense<span className="brand-title-span">Flow</span></h1>
        <p className="brand-subtitle">Take control of your company's spending. Effortlessly.</p>
      </div>
      <QuoteRotator />
      <div className="background-texture"></div>
    </div>
  );

  // Form Panel (Right Side)
  const formPanel = (
    <div className="form-panel">
      <div className="form-container">
        <div>
          <h2 className="form-header">Forgot Password</h2>
          <p className="form-subheader">
            Enter your registered email to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <FormInput
            id="email"
            type="email"
            placeholder="Email address"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormButton type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </FormButton>
        </form>

        {message && <p className={`message ${message.includes('sent') ? 'message-success' : 'message-error'}`}>{message}</p>}
        
        <p className="back-link">
            {/* In a real app, this would be a <Link> from react-router-dom */}
            <a href="/" className="toggle-button">
              Back to Sign In
            </a>
        </p>

      </div>
    </div>
  );

  return (
    <div className="root" style={{ userSelect: 'none' }}>
      {brandPanel}
      {formPanel}
    </div>
  );
};

export default App;
