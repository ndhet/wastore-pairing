const axios = require('axios')

module.exports = {
    name: 'addsaldo', // Untuk nama menunya
    cmd: ['addsaldo'], // Untuk Menambah beberapa cmd dalam 1 fitur
    details: {}, // Belum Tersedia Cuman Klo dh Paham pakai aja
    isOwner: true, // gunakan satu satu kalo ingin isGroup Jangan Pakai is Private
    code: async ({ socket, from, m, quoted, full_args }) => {
        let trx = ""
        if (!quoted && !full_args){
            return socket.sendMessage(from, {text: 'Mana nomor trx nya'}, {qouted: m})
        }else if(!quoted || full_args){
            trx = full_args
        }else if(quoted || !full_args){
            trx = quoted
        }

        const regex = /S\w+OR/g;
        const trxid = trx.match(regex);
        const res = await axios({
            method: 'post',
            url: 'https://vip.sshaxor.my.id/apiotp/addsaldo',
            data : { id : trxid[0] }
        })
        if(res.data.error == 0){
            socket.sendMessage(from, {text: res.data.message}, {qouted: m})
        }else{
            socket.sendMessage(from, {text: 'Gagal'}, {qouted: m})
        }
        
      //masukan fitur disini terserah lu 
    }
}