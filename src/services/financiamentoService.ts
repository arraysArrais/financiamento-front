

//const baseUrl = 'http://localhost:3000';
const baseUrl = 'https://financiamento-api.fly.dev';

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
        baixaFatura: async (parcela_id: number | null, file: any) => {
            const formData = new FormData();
            formData.append('img_comprovante', file);

            try {
                const response = await fetch(`${baseUrl}/api/financiamento/baixa_parcela/${parcela_id}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                return response.json();
            } catch (error) {
                console.error('Erro ao realizar baixa na fatura:', error);
            }
        },
        getComprovante: async (parcela_id: number) => {
            return await request('get', `/api/financiamento/parcela/comprovante/${parcela_id}`, {}, localStorage.getItem('token'))
        },
        updateFinanciamento: async (financiamento_id: number, body: any) => {
            return await request('patch', `/api/financiamento/${financiamento_id}`, body, localStorage.getItem('token'))
        }
    }

}