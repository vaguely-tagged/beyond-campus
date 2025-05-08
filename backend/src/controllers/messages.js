var express = require("express");
var router = express.Router();
var db = require("../models/db.js");
const bcrypt = require("bcrypt");
var path = require("path");
var authCheck = require("../utils/authCheck.js");
const generateAccessToken = require("../utils/generateAccessToken");
const { query, validationResult, check } = require("express-validator");
const Messages = require("../models/messages.model");

exports.getMessagePage = (req, res) => {
    if (authCheck.isOwner(req, res)) {
      res.sendFile(path.resolve("../public/messages.html"));
    }
    else {
      res.redirect("/main");
      return false;
    }
};

exports.getConversationPage = (req, res) => {
    if (authCheck.isOwner(req, res)) {
      res.sendFile(path.resolve("../public/conversation.html"));
    }
    else {
      res.redirect("/main");
      return false;
    }
};

exports.sendMessage = (req, res) => {
    Messages.sendMessage(req.session.nickname, req.body.user_id, req.body.body, (err, data) => {
      if (err) {
        res.status(500).send({
          message: "Error sending message",
        });
      } else {
        res.send({
          success: true,
          data: data,
        });
      }
    });
}

exports.getMessages = (req, res) => {
    Messages.getMessages(req.session.nickname,req.params.user_id, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error getting messages" });
        } else {
            res.send({
                success: true,
                data: data
            });
        }
    });
}

exports.getMessagePreviews = (req, res) => {
    Messages.getMessagePreviews(req.session.nickname, (err, data) => {
        if (err) {
            res.status(500).send({ message: "Error getting message previews" });
        } else {
            res.send({
                success: true,
                data: data
            });
        }
    });
}