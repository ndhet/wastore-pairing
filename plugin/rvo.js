module.exports = {
    name: 'rvo',
    cmd: ['rvo','p'],
    code: async({socket, from, m, quoted}) => {
        if(m.message?.extendedTextMessage?.contextInfo.quotedMessage?.viewOnceMessageV2){
            console.log(m.message?.extendedTextMessage?.contextInfo.quotedMessage?.viewOnceMessageV2)
            //await socket.sendMessage(from, { forward: 'Sad' }, { quoted: m })
        }
    }
}