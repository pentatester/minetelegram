const noInstance = 'No instance selected / running.'

const helpText = `
Hi!
Commands :
/start <username> <server> <version> <password>
/select <username> - Select certain minecraft instance
/status - Show status of all minecraft instance
/helps - Show this message?

Instance commands :
/consume - Consume currently held  item
/equip <name> <destination> - Equip item from inventory
/inventory - Show current inventory
/use_item - Use / activate currently held  item
/toss <name> <amount> - Toss / throw item
/chest - Open chest / curently opened chest

/filter <text> - Filter chat / message, prevent sent to telegram
/listen - Toggle listen mode
/send <message> - Send message to chat
/quit - Quit current instance

  `

module.exports = { noInstance, helpText }
