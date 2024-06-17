import React, { useState } from 'react';
import './App.css';

function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState('1.2');
  const [tdee, setTdee] = useState(null);
  const [email, setEmail] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Mifflin-St Jeor Equation for men
    const calculatedTdee = bmr * activity;
    setTdee(calculatedTdee.toFixed(2));
  };

  const handleMailchimpSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        mode: 'no-cors',
      });

      if (response.ok || response.status === 200 || response.status === 201) {
        setShowCalculator(true);
      } else {
        setErrorMessage('Subscription successful, but unable to verify. Proceeding to calculator.');
        setShowCalculator(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('There was an error with your subscription. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TDEE Calculator</h1>
        {!showCalculator ? (
          <div>
            <form
              onSubmit={handleMailchimpSubmit}
              action="https://jameslong.us21.list-manage.com/subscribe/post?u=80096b6605ad8d524518515e1&amp;id=b78285538c&amp;f_id=0067fee6f0"
              method="post"
            >
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="EMAIL"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div style={{ display: 'none' }} aria-hidden="true">
                <input type="text" name="b_xxxxxxxx_xxxxxxxxxx" tabIndex="-1" value="" />
              </div>
              <button type="submit">Subscribe</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="weight">Weight (kg):</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
              <label htmlFor="height">Height (cm):</label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
              <label htmlFor="activity">Activity Level:</label>
              <select
                id="activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                required
              >
                <option value="1.2">Sedentary</option>
                <option value="1.375">Lightly Active</option>
                <option value="1.55">Moderately Active</option>
                <option value="1.725">Very Active</option>
                <option value="1.9">Super Active</option>
              </select>
              <button type="submit">Calculate</button>
            </form>
            {tdee && <div>Your TDEE is {tdee} calories/day.</div>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
