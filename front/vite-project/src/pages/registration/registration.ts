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
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })

    let result = await response.json()
    console.log(result.message)
}

btn.addEventListener('click', (e) => {
    console.log(authorization.getUser())
    postUser('http://localhost:2000/users/register', authorization.getUser())
    
})