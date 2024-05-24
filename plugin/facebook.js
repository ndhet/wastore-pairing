const axios = require('axios')
const getFile = require('../lib/functions.js')

module.exports = {
	name: 'Facebook Downloader',
	cmd: ['fb','facebook'],
	details: {},
	code: async ({socket, m, from, full_args}) => {
		if(!full_args) return socket.sendMessage(from, {text: 'Mana Querynya'})
		try {
			const res = await axios.get(`https://itzpire.site/download/facebook?url=${full_args}`)
			await getFile(res.data.data.video_hd)
		}catch(err){
			console.log(err)
		}
	}
}
