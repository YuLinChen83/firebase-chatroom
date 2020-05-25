import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup, signInWithGoogle, signInWithGitHub } from "../helpers/auth";

const SignUpAndSignIn = () => {
  const [form, setForm] = useState({
    error: null,
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (async event => {
    event.preventDefault();
    setForm({ ...form, error: "" });
    try {
      await signup(form.email, form.password);
    } catch (error) {
      setForm({ ...form, error: error.message });
    }
  });

  const googleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setForm({ ...form, error: error.message });
    }
  }

  const githubSignIn = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.log(error)
      setForm({ ...form, error: error.message });
    }
  }

  return (
    <div className="container">
      <form className="mt-5 py-5 px-5" onSubmit={handleSubmit}>
        <h1>
          Sign Up to
          <Link className="title ml-2" to="/">Chatty</Link>
        </h1>
        <p className="lead">Fill in the form below to create an account.</p>
        <div className="form-group">
          <input className="form-control" placeholder="Email" name="email" type="email" onChange={handleChange} value={form.email}></input>
        </div>
        <div className="form-group">
          <input className="form-control" placeholder="Password" name="password" onChange={handleChange} value={form.password} type="password"></input>
        </div>
        <div className="form-group">
          {form.error ? <p className="text-danger">{form.error}</p> : null}
          <button className="btn btn-primary px-5" type="submit">Sign up</button>
        </div>
        <p>You can also sign up with any of these services</p>
        <button className="btn btn-danger mr-2" type="button" onClick={googleSignIn}>
          Sign up with Google
          </button>
        <button className="btn btn-secondary" type="button" onClick={githubSignIn}>
          Sign up with GitHub
          </button>
        <hr></hr>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default SignUpAndSignIn;