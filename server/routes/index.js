const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const backendArticle = require('../api/backend-article'),
      backendCategory = require('../api/backend-category'),
      backendUser = require('../api/backend-user'),
      frontendArticle = require('../api/frontend-article'),
      frontendComment = require('../api/frontend-comment'),
      frontendLike = require('../api/frontend-like'),
      frontendUser = require('../api/frontend-user'),
      isAdmin = require('./is-admin'),
      isUser = require('./is-user');

