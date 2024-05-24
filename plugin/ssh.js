const {executeSSHCommand, reactProses } = require('../lib/functions.js')

module.exports = {
	name: 'Shs',
    cmd: 'ssh',
    isOwner: true,
	code: async ({ socket, from, m }) => {
        reactProses(socket, from, m.key)
		try {
            const result = await executeSSHCommand();
            const regex = /IP\s+:\s+[\s\S]*?UDPGW\s+:\s+(\d+)/;
            const match = result.match(regex);

            let msg =  match[0].replace(/\\n/g, '\n');
            

            // Format the server information
            
            socket.sendMessage(from, { text: msg })
            
			 // Menampilkan hasil di konsol
		} catch (error) {
			console.error('Error:', error); // Menampilkan error di konsol
		}
	}
};