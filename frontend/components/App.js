import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => {navigate('/articles')}
  

  

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.

    const token = localStorage.getItem('token')
    if (token) {
      localStorage.removeItem('token');
      setMessage('Goodbye!') 
    }
    redirectToLogin()
  }

  const login = async ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!

    setMessage('');
    setSpinnerOn(true);
    //launch a request using fetch
    try {
      const { data } = await axios.post(
        loginUrl, { username, password }
      )
      localStorage.setItem('token', data.token)
      setMessage(data.message)
      redirectToArticles()
    } catch (err) {
      console.log(err)
    }
    setSpinnerOn(false)
  }

  const getArticles = async () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!

    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token')
    if (!token) {
      redirectToLogin()
    } else {
      try {
        const { data } = await axios.get(
          articlesUrl, {headers: {Authorization: token}}
        )
        setArticles(data.articles)
        setMessage(data.message)
      } catch (err) {
        if(err?.response?.status == 401) logout()
      }
    }
    setSpinnerOn(false)

  }

  const postArticle =  async (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token')
    try {
      const {data} =  await axios.post (
        articlesUrl,
        article,
        {headers: {Authorization: token}}
      )   
      setMessage(data.message)
      setArticles([...articles, data.article])
    } catch (err) {
      if(err?.response?.status == 401) logout()
    }
    setSpinnerOn(false)
  }

  

  const updateArticle = async value => {
    // ✨ implement
    // You got this!
    
    const {article_id} = value
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem('token')
    try {
      const {data} = await axios.put (
        articlesUrl + '/' + article_id,
        value,
        {headers: {Authorization: token}}
      )   
      const newArray = articles.map(
        (a) => {
          if (a.article_id === data.article.article_id) {
            a = data.article   
          }
          return a
        }
      )
      setArticles(newArray)
      setMessage(data.message)  
    } catch (err) {
      if(err?.response?.status == 401) logout()
    }  
    setSpinnerOn(false)   
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on = {spinnerOn}/>
      <Message message = {message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login = {login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle = {postArticle} 
                currentArticle = {currentArticleId && articles.find(a => a.article_id == currentArticleId)} 
                updateArticle={updateArticle} 
              />
              <Articles 
                getArticles = {getArticles} 
                articles = {articles} 
                setCurrentArticleId={setCurrentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
