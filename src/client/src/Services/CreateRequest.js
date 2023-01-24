function getCookie(name) {
    function escape(s) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

const HEADERS = () => {
    return new Headers({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token'),
    })
}

const basePath = 'http://127.0.0.1:8000'

const createRequest = ({path, method = 'GET', type = 'JSON', body}) => {
    return new Promise ((resolve, reject) => {
        fetch(`${basePath}${path}`, {
            method: method,
            headers: HEADERS(),
            body: body,
        })
        .then((res) => {
            if (res.status === 200) {
                resolve(res)
            } else {
                reject(res)
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}

export default createRequest
