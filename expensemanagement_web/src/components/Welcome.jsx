import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from '../api/signupService'; // import your API service

// --- Helper Components ---

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
const FormButton = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
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

// --- Main App Component ---

export default function Welcome() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currency, setCurrency] = useState('');
  const [signupStep, setSignupStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const countryData = data.map(country => ({
          name: country.name.common,
          currency: Object.keys(country.currencies)[0] || 'N/A'
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryData);
      } catch (error) {
        console.error("Could not fetch countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    const country = countries.find(c => c.name === countryName);
    if (country) setCurrency(country.currency);
    else setCurrency('');
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setSelectedCountry('');
    setCurrency('');
    setSignupStep(1);
  };

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = allUsers.find(u => u.email === formData.email && u.password === formData.password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      alert('Invalid credentials!');
    }
  };



const handleSignup = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  // Prepare data to send to backend
  const signupData = {
    name: formData.name,
    email: formData.email,
    password: formData.password,
    country: selectedCountry,
    currency: currency
  };

  try {
    const result = await signupUser(signupData);

    // store user info or token returned from API
    localStorage.setItem('currentUser', JSON.stringify(result.user));

    navigate('/dashboard');
  } catch (error) {
    alert(error.message); // show API error message
  }
};


  const handleNextStep = () => {
    if (selectedCountry && currency) setSignupStep(2);
    else alert('Please select a country.');
  };

  // Brand Panel
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

  // Form Panel
  const formPanel = (
    <div className="form-panel">
      <div className="form-container">
        <div>
          <h2 className="form-header">
            {isLoginView ? "Welcome Back!" : "Create Your Company"}
          </h2>
          <p className="form-subheader">
            {isLoginView ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleView} className="toggle-button">
              {isLoginView ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
        {isLoginView ? (
          <form onSubmit={handleLogin} className="login-form">
            <FormInput
              id="email"
              type="email"
              placeholder="Email address"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
              value={formData.email}
              onChange={handleInputChange}
            />
            <FormInput
              id="password"
              type="password"
              placeholder="Password"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              value={formData.password}
              onChange={handleInputChange}
            />
            <div className="forgot-password">
              <div className="forgot-text">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <FormButton type="submit">Sign In</FormButton>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="signup-form">
            {signupStep === 1 ? (
              <>
                <div className="form-input-container">
                  <div className="icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.737 16.95l.001-.001M16.263 16.95l.001-.001M12 21.05V17.5M4.5 10.5v-3.75a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v3.75" /></svg>
                  </div>
                  <select
                    id="country"
                    name="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="form-select"
                    style={{ userSelect: 'text' }}
                  >
                    <option value="" disabled>Select your country</option>
                    {countries.map(country => (
                      <option key={country.name} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                  <div className="arrow-container">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                {currency && (
                  <div className="currency-info">
                    <p>Your company's base currency will be: <span className="currency-span">{currency}</span></p>
                  </div>
                )}
                <FormButton onClick={handleNextStep}>Next</FormButton>
              </>
            ) : (
              <>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Company Name"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5m-5-4a1 1 0 01-1-1V7a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1m-5 0a1 1 0 00-1 1v2a1 1 0 001 1h5a1 1 0 001-1v-2a1 1 0 00-1-1m-5-4h.01" /></svg>}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <FormInput
                  id="email"
                  type="email"
                  placeholder="Email address"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <FormInput
                  id="password"
                  type="password"
                  placeholder="Password"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <FormInput
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <div className="button-group">
                  <FormButton onClick={() => setSignupStep(1)}>Back</FormButton>
                  <FormButton type="submit">Create Company</FormButton>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="root" style={{ userSelect: 'none' }}>
      {isLoginView ? (
        <>
          {brandPanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {brandPanel}
        </>
      )}
    </div>
  );
}