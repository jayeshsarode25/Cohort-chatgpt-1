const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const chatController = require('../controller/chat.controller');


const router = express.Router();

router.post('/',authMiddleware.authUser, chatController.createChat)

/* GET /api/chat/ */
router.get('/', authMiddleware.authUser, chatController.getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware.authUser, chatController.getMessages)



module.exports = router;