'use strict';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000/';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/meditated-db';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'mongodb://localhost/meditated-db-test';
exports.PORT = process.env.PORT || 8080;

exports.JWT_SECRET = 'unsecure';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
