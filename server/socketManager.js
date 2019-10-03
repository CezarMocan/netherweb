class SocketManager {
    constructor() {
        this.clients = {}
    }

    getSpecificClientId(type) {
        let obj = Object.values(this.clients).find(c => c.iam === type)
        return obj ? obj.id : null
    }

    getMouseClientId() {
        return this.getSpecificClientId('MOUSE')
    }

    getQuestionsClientId() {
        return this.getSpecificClientId('QUESTIONS')
    }

    addClient(socket) {
        this.clients[socket.id] = {
            id: socket.id,
            socket,
            iam: null
        }

        // Events coming from all clients
        socket.on('iam', this.onIam(socket))
        socket.on('disconnect', this.onDisconnect(socket))

        // Events coming from mouse client
        socket.on('mouseMove', this.mouseAction(socket, 'action:mouseMove'))
        socket.on('mouseClick', this.mouseAction(socket, 'action:mouseClick'))
    }

    onIam(socket) {
        return (message) => {
            console.log('id: ', socket.id, 'message: ', message)
            if (!this.clients[socket.id]) return
            this.clients[socket.id].iam = message.type
        }
    }

    onDisconnect(socket) { 
        return () => {
            delete this.clients[socket.id]
        }
    }

    mouseAction(socket, actionType) {
        return (message) => {
            const qid = this.getQuestionsClientId()
            if (!qid) return
            if (!this.clients[qid]) return  
            if (!this.clients[qid].socket) return

            const targetSocket = this.clients[qid].socket
            const { x, y } = message
            targetSocket.emit(actionType, { x, y })
        }
    }
}

export default new SocketManager()