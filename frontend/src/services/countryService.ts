import { api } from "../lib/api";

export interface ApiCountry {
    id_pais: number;
    nombre: string;
    estado: boolean;
}

export interface CreateCountryPayload { 
    nombre: string; 
    estado?: boolean; 
}

export const countryService = {
    async getCountries() {
        const { data } = await api.get<ApiCountry[]>("/paises/");
        return data;
    },

    async createCountry(payload: CreateCountryPayload) {
        const { data } = await api.post<ApiCountry>("/paises/", payload);
        return data;
    },

    async updateCountry(id: number, payload: Partial<CreateCountryPayload>) { 
        const { data } = await api.patch<ApiCountry>(`/paises/${id}/`, payload); 
        return data; 
    },

    async deleteCountry(id: number) {
         await api.delete(`/paises/${id}/`); 
        },
};