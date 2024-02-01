const baseUrl = import.meta.env.VITE_API_URL;

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

    method = method.toUpperCase();
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
            return await request('PATCH', `/api/financiamento/${financiamento_id}`, body, localStorage.getItem('token'))
        },
        deleteFinanciamento: async (financiamento_id: number) => {
            return await request('DELETE', `/api/financiamento/${financiamento_id}`, {}, localStorage.getItem('token'))
        },
        createFinanciamento: async(financiamento: any) =>{
            const formData = new FormData();
            for (let key in financiamento) {
                formData.append(key, financiamento[key]);
              }
              try {
                const response = await fetch(`${baseUrl}/api/financiamento/`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                return response.json();
            } catch (error) {
                console.error('Erro ao criar financiamento:', error);
            }
        },
        getUsers: async () =>{
            return request('get', '/api/user', {}, localStorage.getItem('token'))
        },
        getCodBarra: async (parcela_id: number) => {
            return request('get', `/api/financiamento/parcela/barcode/${parcela_id}`, {}, localStorage.getItem('token'))
        },
        updateFatura: async(parcela_id: number, body: any) => {
            return request('PATCH', `/api/financiamento/parcela/${parcela_id}`, body, localStorage.getItem('token'))
        }
    }

}