const fs = require('fs')
const { makeTransaction, checkTransaction, reactProses, reactSad, reactLove, sleep } = require('../lib/functions.js')

module.exports = {
	name: 'order',
	cmd: ['order','beli'],
	details: {},
	code: async({ socket, m, from, args}) => {
		if(!args) return socket.sendMessage(from, {text: 'Tidak ada produck seperti ini'})
		if(!args[1]) return socket.sendMessage(from, {text: 'Input jumlah gmail yang akan dibeli'})
		const dataorder = fs.readFileSync(process.cwd() + '/akun/openorder.json')
		const checkOrderr = JSON.parse(dataorder)
		let dataorderan = JSON.parse(dataorder)
		const select = checkOrderr.includes(from)

		if(select) return socket.sendMessage(from, {text: 'Masih ada orderan yang belum diselesaikan silahkan ketik `.batal` untuk membatalkan orderan !'})
		dataorderan.push(from)
		fs.writeFileSync('./akun/openorder.json', JSON.stringify(dataorderan, null, 2), 'utf8')
		const product = args[0]
		const jml = args[1]
		const data = fs.readFileSync(process.cwd() + '/akun/akun.json')
		const akun = JSON.parse(data)
		const db = fs.readFileSync(process.cwd() + '/db.json')
		const acc = JSON.parse(db)
		
		if (product === 'gmail') {
			if (akun.gmail.length < jml) {
				return socket.sendMessage(from, { text: `Stok kurang dari ${jml}` })
			}else{
				const uniqcode = 'txn_' + Math.random().toString(36).substr(2, 9);
				const noted = `Pembelian ${jml} gmail`
				const res = await makeTransaction(uniqcode, 1500*jml, noted)
				reactProses(socket, from, m.key)
				if(res.success){
					let msg = `*${res.msg}*\n\n`
					let guide = ''
					msg += `> ID : ${res.data.unique_code}\n`
					msg += '> Amount : Rp.' + res.data.amount + '\n'
					msg += '> Payment : ' + res.data.service_name + '\n'
					msg += '> Note : ' + res.data.note + '\n'
					msg += '> Status : ' + res.data.status + '\n'
					msg += '> Create : ' + res.data.created_at + '\n'
					msg += '> Expired : ' + res.data.expired + '\n\n'
					for(let i = 1; i < 7; i++){
						guide += i + '. ' + res.payment_guide[0].content[i] + '\n'
					}
					msg += '*Catatan :* \n' +guide + '\n\n'
					msg += '_Akun akan segera dikirim setelah anda menscan QRIS, Orderan akan tercancel otomatis setelah 5 menit orderan dibuat_, *Terimakasih*'
					const response = await socket.sendMessage(from, { image: { url: res.data.qrcode_url }, caption : msg}, {quoted: m})
					
					const done = () => checkTransaction(uniqcode).then(
						(res) => {
							if (res.data.success) {
								if (res.data.data.status === 'Pending') {
									console.log('Menunggu Pembayaran 10 Detik...')
									setTimeout(done, 10000)
								}else if(res.data.data.status === 'Success'){
									reactLove(socket, from, m.key)
									console.log('Pembayaran diterima ...')
									const deal = akun.gmail.slice(0, jml)
									let gmail = ''
									
									deal.forEach((entry, index) => {
										const [email, password] = entry.split('|');
										gmail += `> Email : ${email} | ${password}` + '\n'
									});
									let msg = '*PESANAN SUKSES :*\n\n'
									msg += `> ID : ${res.data.data.unique_code}\n`
									msg += '> Amount : Rp.' + res.data.data.balance + '\n'
									msg += '> Payment : ' + res.data.service.type + '\n'
									msg += '> Note : ' + res.data.data.note + '\n'
									msg += '> Status : ' + res.data.data.status + '\n\n'
									msg += '*DATA AKUN :*\n\n'
									msg += gmail + '\n\n'
									msg += '*Catatan :* _Garansi 24Jam, Tidak bisa login atau suspend selama garansi aktif akan direplace. Thanks_'
									akun.gmail = akun.gmail.slice(jml)
									fs.writeFileSync(process.cwd() + '/akun/akun.json', JSON.stringify(akun, null, 2))
									socket.sendMessage(from, { text: msg }, {quoted: m})
									acc.sold.gmail = acc.sold.gmail.concat(deal);
									fs.writeFileSync(process.cwd() + '/db.json', JSON.stringify(acc, null, 2))
									dataorderan = dataorderan.splice(from, 1)
									fs.writeFileSync('./akun/openorder.json', JSON.stringify(dataorderan, null, 2), 'utf8')
									socket.sendMessage(from, { delete: response.key })
								}else{
									reactSad(socket, from, m.key)
									console.log('Order dibatalkan ...')
									sleep(5000)
									socket.sendMessage(from, { delete: response.key })
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
					console.log(res)
				}
			}
		}else if(product === 'ytprem'){
			console.log('ytprem')
		}else{
			socket.sendMessage(from, {text: 'Yang tersedia hanya gmail & ytprem kaka ! Thanks'}, {quoted: m}) 
		}
	}
}
