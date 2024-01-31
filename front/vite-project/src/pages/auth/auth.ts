import Authorization from "../../core/authorization/authorization"

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

    postUser('http://localhost:2000/users/login', authorization.getUser())
    
})