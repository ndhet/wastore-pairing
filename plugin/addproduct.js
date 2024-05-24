const fs = require('fs')
const { reactProses } = require('../lib/functions.js')

module.exports = {
    name: 'addproduct',
    cmd: ['addproduct','addemail','tambah'],
    isOwner: true,
    code: async({socket, m, full_args, from}) => {
        reactProses(socket, from, m.key)
        const [ product, emails ] = full_args.split(':')
        const item = emails.split('\n')
        let data = fs.readFileSync(process.cwd() + '/akun/akun.json', 'utf8')
        let akun = JSON.parse(data)
        reactProses(socket, from, m.key)
        if (product === 'gmail') {
            akun.gmail = akun.gmail.concat(item);
            fs.writeFile(process.cwd() + '/akun/akun.json', JSON.stringify(akun, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                socket.sendMessage(from, {text: "New Gmail data added successfully!"})
            });
        }else if(product === 'ytprem'){
            akun.ytprem = akun.ytprem.concat(item);
            fs.writeFile(process.cwd() + '/akun/akun.json', JSON.stringify(akun, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                socket.sendMessage(from, {text: "New Gmail data added successfully!"})
            });
        }
    }
}