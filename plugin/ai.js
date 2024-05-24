const axios = require('axios')
const { reactProses, reactLove, reactSad } = require('../lib/functions.js')


module.exports = {
	name: 'ai bot',
	cmd: ['ai','babu','dul','abdul','bot','ded'],
	details: {},
	code: async({ socket, m, from, full_args}) => {
		reactProses(socket, from, m.key)
		try {
			const res = await axios.get(`https://itzpire.site/ai/gpt?model=gpt-4&q=${full_args}`)
			if(res.data.status === 'success'){
				socket.sendMessage(from, { text: res.data.data.response }, { quoted: m})
				reactLove(socket, from, m.key)
			}else{
				socket.sendMessage(from, { text: 'Apikey erro' }, { quoted: m})
				
				reactSad(socket, from, m.key)
			}
		}catch(e){
			socket.sendMessage(from, {text: 'Error sayang'})
		}
		
	}
}
