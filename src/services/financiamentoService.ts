const baseUrl = 'http://localhost:3000';

const request = async (method: string, endpoint: string, params: any, token: string | null = null) => {
    method = method.toLowerCase();
    let fullUrl = baseUrl + endpoint;
    let body = null;

    if (method === 'get') {
        let queryString = new URLSearchParams(params).toString();
        fullUrl += '?' + queryString;
    }
    else {
        body = JSON.stringify(params);
    }

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    } as any;

    if (token) {
        headers['Authorization'] = 'Bearer ' + token
    }

    let req = await fetch(fullUrl, { method, headers, body });
    return await req.json();
}

export default () => {
    return {
        getFinanciamentos: async () => {
            return request('get', '/api/financiamento', {}, localStorage.getItem('token'))
        },
        getParcelas: async (financiamento_id: number) => {
            return await request('get', `/api/financiamento/parcelas/${financiamento_id}`, {}, localStorage.getItem('token'))
        },
    }

}