import Authorization from "../../core/authorization/authorization"

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

    postUser('http://localhost:2000/users/login', authorization.getUser())
    
})