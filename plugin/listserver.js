const axios = require('axios')

module.exports = {
    name : 'listserver',
    cmd : ['listserver'],
    details : {},
    code : async ({socket, m, from}) => {
        const res = await axios.get('https://vip.sshaxor.my.id/apiotp/listserver')
        let domain = ""
        let hostname = ""
        let servername = ""
        let region = ""
        let status = ""
        for(let i =0;i < res.data.message.length;i++){
            domain += '> ' +  res.data.message[i].Domain + '\n'
            hostname += '> ' +  res.data.message[i].HostName + '\n'
            servername += '> ' +  res.data.message[i].ServerName + '\n'
            region += '> ' +  res.data.message[i].Location + '\n'
            status += '> ' +  res.data.message[i].Status + '\n'
        }
        let msg = '`List Server` \n'
        msg += '`Server ada ' + res.data.message.length +'`\n\n'
        msg += '*NAMA :*\n' + servername + '\n'
        msg += '*HOSTNAME :*\n' + hostname + '\n'
        msg += '*DOMAIN :*\n' + domain + '\n'
        msg += '*REGION :*\n' + region + '\n'
        msg += '*STATUS :*\n' + status + '\n'
        msg += '*_CATATAN :_* `Jika status 1 ( satu ) maka server Aktif`'
        socket.sendMessage(from, {text: msg}, {qouted: m})
    }
}