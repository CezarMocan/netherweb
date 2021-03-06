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

    getAnswersClientId() {
        return this.getSpecificClientId('ANSWERS')
    }

    getPapaClientId() {
        return this.getSpecificClientId('PAPA')
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

        // Events coming from questions client
        socket.on('clickedQuestion', this.questionAction(socket))

        // Events coming from the answers client
        socket.on('receivedAnswer', this.answerAction(socket))

        // Events coming from papa
        socket.on('updateInstallationState', this.updateInstallationState(socket))
        socket.on('playInstallationIntroSound', this.playInstallationIntroSound(socket))
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

    questionAction(socket) {
        return (message) => {
            const id = this.getAnswersClientId()
            if (!id) return
            if (!this.clients[id]) return  
            if (!this.clients[id].socket) return

            const targetSocket = this.clients[id].socket
            targetSocket.emit("action:question", { question: message.question })
        }
    }

    answerAction(socket) {
        return (message) => {
            const id = this.getQuestionsClientId()
            if (!id) return
            if (!this.clients[id]) return  
            if (!this.clients[id].socket) return

            const targetSocket = this.clients[id].socket
            targetSocket.emit("action:answer", { answer: message.answer })
        }
    }

    playInstallationIntroSound(socket) {
        return (message) => {
            const id = this.getAnswersClientId()
            if (!id) return
            if (!this.clients[id]) return  
            if (!this.clients[id].socket) return

            const targetSocket = this.clients[id].socket
            targetSocket.emit("speak:instructions", { })
        }
    }

    updateInstallationState(socket) {
        return (obj) => {
            const { state } = obj

            Object.values(this.clients).forEach(c => {
                if (!c.socket) return
                c.socket.emit("state:update", { state })
            })
        }
    }
}

export default new SocketManager()