const axios = require('axios')

module.exports = {
    name : 'ceksaldo sshaxor',
    cmd : ['ceksaldo','info'],
    details : {},
    isOwner : false,
    code : async ({socket, m, from, full_args}) => {
        if(!full_args) return socket.sendMessage(from, {text : 'Tolong masukan username '})
        console.log(full_args)
        const res = await axios({
            method: 'post',
            url: 'https://vip.sshaxor.my.id/apiotp/otp',
            data : { username : full_args }
        })
        let text  = `*SSHAXOR BOT*\n`
        text += `\n`
        text += `*INFO ACCOUNT :* \n`
        text += `> Username : ${full_args} \n`
        text += `> Email : *${res.data.message[0].email}*\n`
        text += `> NoHP  : *${res.data.message[0].nomor}*\n`
        text += `> Saldo : Rp. *${res.data.message[0].saldo}*\n`
        text += '\n_Terimakasih sudah menggunakan layanan sshaxor, jangan bosan bosan topup kaka_'
        return socket.sendMessage(from, { text: text }, { quoted: m })
        console.log(res.data)
    }
}