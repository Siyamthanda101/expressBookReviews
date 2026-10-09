const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const booksApi = axios.create({
  baseURL: process.env.BOOKS_API_URL || "http://localhost:5000"
});

const getAllBooks = async () => (await booksApi.get("/")).data;
const getBookByISBN = async (isbn) => (await booksApi.get(`/isbn/${encodeURIComponent(isbn)}`)).data;
const getBooksByAuthor = async (author) => (await booksApi.get(`/author/${encodeURIComponent(author)}`)).data;
const getBooksByTitle = async (title) => (await booksApi.get(`/title/${encodeURIComponent(title)}`)).data;


public_users.post("/register", (req,res) => {
  const { username, password } = req.body || {};

  if (typeof username !== "string" || !username.trim() || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.json(books[req.params.isbn] || {});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const matchingBooks = {};
  Object.keys(books).forEach((key) => {
    if (books[key].author === req.params.author) {
      matchingBooks[key] = books[key];
    }
  });
  return res.json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const matchingBooks = {};
  Object.keys(books).forEach((key) => {
    if (books[key].title === req.params.title) {
      matchingBooks[key] = books[key];
    }
  });
  return res.json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.json(books[req.params.isbn]?.reviews || {});
});

module.exports.general = public_users;
module.exports.axiosClient = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};
