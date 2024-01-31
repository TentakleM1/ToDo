class Authorization {
    constructor(nameInput : string) {
        this.login = document.getElementById(nameInput);
        this.password = document.getElementById('password');
        this.btn = document.getElementById('btn');

        this.loginWord = ''
        this.passwordWord = ''

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
    }

    getUser() {
        const user : {login: string, password: string} = {
            login: this.login.value,
            password: this.password.value
        }

        return user
    }

    getBtnElement() {
        return this.btn
    }

}

export default Authorization