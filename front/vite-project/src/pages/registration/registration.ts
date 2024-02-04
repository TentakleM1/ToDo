class Authorization {
    constructor(nameInput : string) {
        this.login = document.getElementById(nameInput);
        this.password = document.getElementById('password');
        this.repytPassword = document.getElementById('repytpassword');
        this.btn = document.getElementById('btn');

        this.loginWord = ''
        this.passwordWord = ''
        this.repytPasswordWord = ''

        this.login.addEventListener('keyup', e => {
            if(e.keyCode === 32) {
                this.login.value = this.loginWord
              } else {
                this.loginWord = this.login.value
              }
        })

        this.password.addEventListener('keyup', e => {
            if(e.keyCode === 32) {
                this.password.value = this.passwordWord
              } else {
                this.passwordWord = this.password.value
              }
        })

        this.repytPassword.addEventListener('keyup', e => {
            if(e.keyCode === 32) {
                this.repytPassword.value = this.repytPasswordWord
              } else {
                this.repytPasswordWord = this.repytPassword.value
              }
        })
    }

    getUser() {
        const user : {login: string, password: string, repytpassword: string} = {
            login: this.login.value,
            password: this.password.value,
            repytpassword: this.repytPassword.value
        }
        return user
    }

    getBtnElement() {
        return this.btn
    }

}

const authorization = new Authorization('login')

const btn = authorization.getBtnElement()

async function postUser(url, data) {
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if(!res.ok) {
            return Promise.reject(new Error(
                `Response faild: ${res.status} (${res.statusText})`
            ))
        }
        return res.text()
    })
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })
}

btn.addEventListener('click', (e) => {
    postUser('http://localhost:2000/users/register', authorization.getUser())
})