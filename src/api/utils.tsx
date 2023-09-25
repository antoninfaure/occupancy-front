export const API_URL = process.env.REACT_APP_API_URL;

export function getRequest(URL: string, default_return : any = []) {
    return fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            throw error;
        });
}

export function postRequest(URL: string, body?: {}, contentTypeForm: boolean = false) {
    const params = {
        method: 'POST'
    } as any

    if (contentTypeForm) {
        params.body = body
    } else {
        params.body = JSON.stringify(body)
        params.headers = {
            'Content-Type': 'application/json',
        }
    }
    return fetch(URL, params)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.message);
                });
            }

            return response.json().then((data) => {
                return data;
            }).catch((e) => {
                return null;
            });
        })
        .catch((error) => {
            throw error;
        })
}

export function putRequest(URL: string, body?: {}, contentTypeForm: boolean = false) {
    const params = {
        method: 'PUT'
    } as any

    if (contentTypeForm) {
        params.body = body
    } else {
        params.body = JSON.stringify(body)
        params.headers = {
            'Content-Type': 'application/json',
        }
    }

    return fetch(URL, params)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.message);
                });
            }

            return response.json().then((data) => {
                return data;
            }).catch((e) => {
                return null;
            });
        })
        .catch((error) => {
            throw error;
        })
}

export function deleteRequest(URL: string, body?: {}) {
    return fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    throw new Error(errorData.message);
                });
            }

            return response.json().then((data) => {
                return data;
            }).catch((e) => {
                return null;
            });
        })
        .catch((error) => {
            throw error;
        })
}