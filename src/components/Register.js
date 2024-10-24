import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    country: '',
    interests: []
  });
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({ name: '', email: '', password: '', gender: '', country: '', interests: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedInterests = [...formData.interests];

    if (checked) {
      updatedInterests.push(value);
    } else {
      updatedInterests = updatedInterests.filter((interest) => interest !== value);
    }

    setFormData({ ...formData, interests: updatedInterests });
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '', gender: '', country: '', interests: '' };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'At least one interest must be selected';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage('Registration successful! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setMessage('Registration failed. Please try again.');
        }
      })
      .catch((error) => setMessage('An error occurred. Please try again.'));
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="form-container">
      <h2 className="form-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Name<span className="text-danger">*</span>:
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>
              Email<span className="text-danger">*</span>:
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>
              Password<span className="text-danger">*</span>:
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <div className="radio-buttons">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                /> Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                /> Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleChange}
                /> Other
              </label>
            </div>
            {errors.gender && <p className="error-text">{errors.gender}</p>}
          </div>

          <div className="form-group">
            <label>
              Country<span className="text-danger">*</span>:
            </label>
            <select
              name="country"
              className="form-control"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select your country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
            {errors.country && <p className="error-text">{errors.country}</p>}
          </div>

          <div className="form-group">
            <label>
              Interests<span className="text-danger">*</span>:
            </label>
            <div className="checkbox-list">
              <label>
                <input
                  type="checkbox"
                  name="interests"
                  value="Sports"
                  checked={formData.interests.includes('Sports')}
                  onChange={handleCheckboxChange}
                /> Sports
              </label>
              <label>
                <input
                  type="checkbox"
                  name="interests"
                  value="Music"
                  checked={formData.interests.includes('Music')}
                  onChange={handleCheckboxChange}
                /> Music
              </label>
              <label>
                <input
                  type="checkbox"
                  name="interests"
                  value="Travel"
                  checked={formData.interests.includes('Travel')}
                  onChange={handleCheckboxChange}
                /> Travel
              </label>
              <label>
                <input
                  type="checkbox"
                  name="interests"
                  value="Reading"
                  checked={formData.interests.includes('Reading')}
                  onChange={handleCheckboxChange}
                /> Reading
              </label>
            </div>
            {errors.interests && <p className="error-text">{errors.interests}</p>}
          </div>

          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
