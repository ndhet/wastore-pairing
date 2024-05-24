const fs = require('fs')
const { reactProses, reactLove } = require('../lib/functions')
module.exports = {
    name: 'Stok',
    cmd: ['stok','stokakun','menu','start'],
    code: async({socket, from, m}) => {
        reactProses(socket, from, m.key)
        try{
            const dataAkun = fs.readFileSync(process.cwd() + '/akun/akun.json')
            const dataSold = fs.readFileSync(process.cwd() + '/db.json')
            const akun = JSON.parse(dataAkun)
            const order = JSON.parse(dataSold)
            
            let msg = '*STOK AKUN :*\n\n'
            msg += `> GMAIL : ${akun.gmail.length} SOLD : ${order.sold.gmail.length}\n`
            msg += `> GITHUB : ${akun.github.length} SOLD : ${order.sold.github.length}\n`
            msg += `> YTPREM : ${akun.ytprem.length} SOLD : ${order.sold.ytprem.length}\n\n`
            msg += '*PRICE :*\n\n'
            msg += '> 1 GMAIL Rp.1.500\n'
            msg += '> 1 GITHUB Rp.35.000\n'
            msg += '> 1 YTPREM Rp.5.000\n\n'
            msg += '_Silahkan order dengan cara mengirim command `.beli gmail 1` Setelah menscan QRIS, akun otomatis akan dikirim. Thanks_'
    
            socket.sendMessage(from, {text: msg}, {quoted: m})
            reactLove(socket, from, m.key)
        }catch(e){
            console.log(e)
        }
    }
}