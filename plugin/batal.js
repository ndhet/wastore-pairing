const fs = require('fs')

module.exports = {
    name:'Batal',
    cmd: ['batal','batal'],
    code: async({socket, m, from}) => {
        let dataorder = JSON.parse(fs.readFileSync(process.cwd() + '/akun/openorder.json'))

        dataorder = dataorder.splice(from, 1)
        fs.writeFileSync(process.cwd() + '/akun/openorder.json', JSON.stringify(dataorder, null ,2))

        socket.sendMessage(from, {text: 'Orderan berhasil dibatalkan silahkan order ulang dengan mengetik `.beli product jumlah`'}, {quoted: m})
    }
}