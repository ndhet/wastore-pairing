const axios = require('axios')
const fs = require('fs')
const md5 = require('md5')
const config = require('../config.js')
const { Client } = require('ssh2');

// Konfigurasi untuk koneksi SSH
const sshConfig = {
    host: '104.248.159.249',
    port: 22, // Port SSH biasanya 22
    username: 'root',
    password: 'Dedi100'
}

const baseurl = config.APIs.paydisini.baseUrl
const keyApi = config.APIs.paydisini.apikey

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getFile(vidurl) {
	const save = '/mnt/WaPairing/video.mp4'
	const res = await axios({
		url: vidurl,
		method: 'GET',
		responseType: 'stream'
	})
	res.data.pipe(fs.createWriteStream(save))
}

async function makeTransaction(uniqcode, price, noted){
	const sigcode = md5(keyApi + uniqcode + '11' + price + 300 + 'NewTransaction')
	
	const data = {
		'key': keyApi,
		'request': 'new',
		'unique_code': uniqcode,
		'service': 11,
		'amount': price,
		'note': noted,
		'valid_time': 300,
		'type_fee': 1,
		'payment_guide': true,
		'signature': sigcode,
		'return_url': 'https://vip.sshaxor.my.id'
	}
	const params = new URLSearchParams(Object.entries(data));
	try {
		const res = await axios({
			method: 'post',
			url : baseurl,
			data : params,
		})
		return res.data
	} catch (err) {
		return err
	}
}

function checkTransaction(uniqcode){
	const sigcode = md5(keyApi + uniqcode + 'StatusTransaction')
	const data = {
		'key': keyApi,
		'request': 'status',
		'unique_code': uniqcode,
		'signature': sigcode
	}
    const params = new URLSearchParams(Object.entries(data))
	try {
		let res = axios({
			method: 'POST',
			url: baseurl,
			data: params
		})
		return res
	} catch (err) {
		return err
	}
}

async function reactProses(socket, from, m) {
	const reactionMessage = {
		react: {
			text: "⏳",
			key: m
		}
	}
	const reactionAgain = {
		react: {
			text: "⌛",
			key: m
		}
	}
	socket.sendMessage(from, reactionMessage)
	await sleep(1200)
	socket.sendMessage(from, reactionAgain)
}

async function reactSad(socket, from, m) {
	const reactionMessage = {
		react: {
			text: "❌",
			key: m
		}
	}
	socket.sendMessage(from, reactionMessage)
}

async function reactLove(socket, from, m) {
	const reactionMessage = {
		react: {
			text: "✅",
			key: m
		}
	}
	await sleep(1500)
	socket.sendMessage(from, reactionMessage)
}

function executeSSHCommand() {
    return new Promise((resolve, reject) => {
    const conn = new Client();
    let result = '';

    conn.on('ready', function() {
        conn.shell(function(err, stream) {
            if (err) reject(err);

            stream.on('data', function(data) {
            // Tangani permintaan interaktif dari server
                const prompt = data.toString('utf8');
                if (prompt.includes('Username :')) {
                    stream.write('usernew\n');
                } else if (prompt.includes('Password :')) {
                    stream.write('123\n');
                } else if (prompt.includes('Expired :')) {
                    stream.write('30\n');
                    stream.end('exit\n')
                }
                result += data.toString('utf8');
            });


        // Menulis perintah 'add-ssh' ke koneksi SSH
            stream.write('add-ssh\n');
            stream.on('close', function() {
            conn.end(); // Tutup koneksi SSH setelah keluar dari sesi
            resolve(result); // Resolve dengan hasil eksekusi perintah
            });
        });
        }).connect(sshConfig);
    });
}

async function topupVip(user, price){
	try {
		const res = await axios({
			method: 'post',
			url: 'https://vip.sshaxor.my.id/apiotp/topup',
			data: {
				username: user,  // Fix the typo 'usernmae' to 'username'
				saldo: price,
				apikey: 'sshaxor'
			}
		})
		return res.data
	} catch (err) {
		return err
	}
}
module.exports = { makeTransaction, checkTransaction, reactProses, reactSad, reactLove, executeSSHCommand, topupVip, sleep}