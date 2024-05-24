const axios = require('axios')
const { makeTransaction, checkTransaction, reactProses, reactSad, reactLove, topupVip } = require('../lib/functions')

module.exports = {
    name: 'topup',
    cmd: ['topup','topupssh'],
    details: {},
    code: async({ socket, from, m, args }) => {
        reactProses(socket, from, m.key)
        if(!args) return socket.sendMessage(from, {text: 'Masukan username, Contoh : `.topup SalmaN 10000`'})
        if(!args[1]) return socket.sendMessage(from, {text: 'Masukan saldo, Contoh : `.topup SalmaN 10000`'})
        try {
            const user = args[0]
            const uniqcode = 'sshaxor_'+Math.floor(Math.random() * 100000)
            const saldo = args[1]
            const noted = `Topup VIPSShaxor Rp.${saldo}`

            const payment = await makeTransaction(uniqcode, saldo, noted)
            if (payment.success) {
                let guide = ''
                let msg = `*${payment.msg}*\n\n`
				msg += `> ID : ${payment.data.unique_code}\n`
				msg += '> Amount : Rp.' + payment.data.amount + '\n'
				msg += '> Payment : ' + payment.data.service_name + '\n'
				msg += '> Note : ' + payment.data.note + '\n'
				msg += '> Status : ' + payment.data.status + '\n'
				msg += '> Create : ' + payment.data.created_at + '\n'
				msg += '> Expired : ' + payment.data.expired + '\n\n'
				for(let i = 1; i < 7; i++){
                    guide += i + '. ' + payment.payment_guide[0].content[i] + '\n'
                }
				msg += '*Catatan :* \n' +guide + '\n\n'
				msg += '_Saldo akan terisi setelah anda menscan QRIS, Topup akan tercancel otomatis setelah 5 menit dibuat_, *Terimakasih*'
                socket.sendMessage(from, { image: { url: payment.data.qrcode_url }, caption : msg}, {quoted: m})
                
                const done = () => checkTransaction(uniqcode).then(
                    (res) => {
                        if (res.data.success) {
                            if (res.data.data.status === 'Pending') {
                                console.log('Menunggu Pembayaran 10 Detik...')
                                setTimeout(done, 10000)
                            }else if(res.data.data.status === 'Success'){
                                reactLove(socket, from, m.key)
                                console.log('Pembayaran diterima ...')
                                topupVip(user, saldo).then((data) => {
                                    if (data.error) {
                                        socket.sendMessage(from, {text: data.message})
                                    }else{
                                        let msg = '*TOPUP SUKSES :*\n\n'
                                        msg += `> ID : ${res.data.data.unique_code}\n`
                                        msg += '> Amount : Rp.' + res.data.data.balance + '\n'
                                        msg += '> Payment : ' + res.data.service.type + '\n'
                                        msg += '> Note : ' + res.data.data.note + '\n'
                                        msg += '> Status : ' + res.data.data.status + '\n\n'
                                        msg += data.message + '\n'
                                        msg += '*Catatan :* _Terimakasih telah topup di VIP kami, Semoga langganan terus yahh_'
                                        socket.sendMessage(from, {text: msg})
                                    }
                                })
                            }else{
                                reactSad(socket, from, m.key)
                                console.log('Order dibatalkan ...')
                            }
                        }else{
                            socket.sendMessage(from, {text: 'Metode Pembayaran error bang'})
                        }
                    }
                ).catch((err) => {
                    console.log(err)
                })
                done()
            }else{
                return socket.sendMessage(from, {text: 'Metode Pembayaran error bang'})
            }
        } catch (err) {
            socket.sendMessage(from, {text: 'Error !'})
        }
    }
}