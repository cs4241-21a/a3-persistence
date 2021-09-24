class ClientService {
    static updateUser = (newUsername) => {
        username = newUsername;
    }

    static updateRoom = (newRoom) => {
        room = newRoom;
        if (room === 'Public') {
            document.getElementById('chatroomPublic').classList.add('active');
            document.getElementById('chatroomPrivate').classList.remove('active');
        } else {
            document.getElementById('chatroomPrivate').classList.add('active');
            document.getElementById('chatroomPublic').classList.remove('active');
        }
        renderChat(dataCache[room], true, true).then();
    }

    static login = async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('usernameInput');
        const secretInput = document.getElementById('secretInput');
        if (usernameInput.value && secretInput.value) {
            ApiService.login(usernameInput.value, secretInput.value).then(authenticated => {
                if (authenticated) {
                    window.location.href = "/";
                } else {
                    window.alert('Account password incorrect.');
                }
                secretInput.value = null;
            });
        }
        return false;
    }

    static logout = async () => {
        await ApiService.logout();
        window.location.href = '/';
    }

    static refresh = async () => {
        const refreshButton = document.getElementById('refreshButton');
        refreshButton.disabled = true;
        await renderChat(await ApiService.fetchData(room));
        refreshButton.disabled = false;
    }

    static addMessage = (e) => {
        e.preventDefault();
        const message = document.getElementById('messageInput');
        if (message.value.length > 0) {
            ApiService.addMessage(username, message.value, room).then();
            message.value = null;
        }
        return false;
    }

    static startPoll = (e) => {
        e.preventDefault();
        document.getElementsByClassName('chat__input message')[0].classList.add('disabled');
        document.getElementsByClassName('chat__input poll')[0].classList.add('enabled');
    }

    static cancelPoll = (e) => {
        if (e) {
            e.preventDefault();
        }
        document.getElementsByClassName('chat__input message')[0].classList.remove('disabled');
        document.getElementsByClassName('chat__input poll')[0].classList.remove('enabled');
    }

    static addPoll = (e) => {
        e.preventDefault();
        const question = document.getElementById('questionInput');
        const choices = [document.getElementById('choiceOneInput'), document.getElementById('choiceTwoInput'),
            document.getElementById('choiceThreeInput')].filter(c => c.value.length > 0);
        if (question.value.length > 0 && choices.length >= 2) {
            ApiService.addPoll(question.value, choices.map(c => c.value), room).then();
            question.value = null;
            choices.forEach(c => c.value = null);
            ClientService.cancelPoll(null);
        }
        return false;
    }

    static beginEdit = (id) => {
        ClientService.updateEditing(true, id);
    }

    static confirmEdit = (e, id) => {
        if (e) {
            e.preventDefault();
        }
        ClientService.updateEditing(false, id);
        ApiService.updateChat(id, document.getElementById(`contentInput#${id}`).value, room).then();
        return false;
    }

    static cancelEdit = (id) => {
        ClientService.updateEditing(false, id);
    }

    static deleteChat = (id) => {
        ApiService.deleteChat(id, room).then();
    }

    static vote = (e, id) => {
        e.preventDefault();
        const selectedInput = document.getElementById(`pollVotingForm#${id}`).querySelector('input[name=choice]:checked');
        if (selectedInput) {
            ApiService.voteForPoll(id, selectedInput.value, room).then();
        }
        return false;
    }

    static updateEditing = (editing, id) => {
        if (editing) {
            document.getElementById(`message#${id}`).classList.add('editing');
        } else {
            document.getElementById(`message#${id}`).classList.remove('editing');
        }
    }

}
