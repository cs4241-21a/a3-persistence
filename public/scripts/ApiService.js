class ApiService {
  static fetchData = async (room) => {
    console.log(`Getting ${room} chat data...`);
    return await fetch(`/chat/${ room.toLowerCase() }`).then(async response => {
      if (response.ok) {
        const data = await response.json();
        console.log(JSON.parse(JSON.stringify(data)));
        return data;
      }
      console.log('Failed to get chat data.');
      return [];
    });
  }

  static addMessage = (username, content, room) => {
    return this.postChatData('POST', { content, room }, '/chat/message/add');
  }

  static addPoll = (content, choices, room) => {
    return this.postChatData('POST', { content, choices, room }, '/chat/poll/add');
  }

  static voteForPoll = (id, choice, room) => {
    return this.postChatData('POST', { id, choice, room }, '/chat/poll/vote');
  }

  static deleteChat = (id, room) => {
    return this.postChatData('DELETE', { id, room }, '/chat/delete', false);
  }

  static updateChat = (id, content, room) => {
    return this.postChatData('PUT', { id, content, room }, '/chat/update', false);
  }

  static postChatData = (method, data, endpoint, scrollAllowed = true) => {
    return new Promise(() => {
      const body = JSON.stringify(data);
      fetch(endpoint, { method: method, body,
        headers: new Headers({'content-type': 'application/json'})}).then(async response => {
        if (response.ok) {
          renderChat(await response.json(), scrollAllowed).then();
        } else {
          window.alert('Unauthorized error. Please login again.');
          location.reload();
        }
      });
    });
  }

  static login = (username, secret) => {
    return new Promise(resolve => {
      const body = JSON.stringify({ username, secret });
      fetch('/login', { method: 'POST', body, headers: new Headers({'content-type': 'application/json'})})
        .then(async response => {
          if (response.ok) {
            response.json().then(data => {
              if (data['newAccount']) {
                window.alert(`New account "${username}" created!`);
              }
            });
          }
          resolve(response.ok)
        });
    });
  }

  static logout = () => {
    return fetch('/logout', { method: 'POST' });
  }

  static getSession = () => {
    return new Promise(resolve => {
      fetch('/session', { method: 'GET' }).then(async response => {
        resolve(response.ok ? await response.json() : null)
      });
    });
  }
}
