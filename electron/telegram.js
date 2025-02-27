const TelegramBot = require('node-telegram-bot-api')

class TelegramNotifier {
  constructor() {
    // Initialize with an empty token - will be set later
    this.token = ''
    this.chatId = ''
    this.bot = null
  }

  initialize(token, chatId) {
    this.token = token
    this.chatId = chatId
    this.bot = new TelegramBot(this.token, { polling: false })
  }

  async sendNotification(message) {
    if (!this.bot || !this.chatId) {
      console.warn('Telegram bot not properly initialized')
      return
    }

    try {
      await this.bot.sendMessage(this.chatId, message)
    } catch (error) {
      console.error('Failed to send Telegram notification:', error)
    }
  }

  async notifyTaskCompleted(taskTitle) {
    const message = `✅ : ${taskTitle}`
    await this.sendNotification(message)
  }
}

module.exports = new TelegramNotifier()