import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
    },
    withCredentials: true,
});

export interface SiteData {
    settings: Record<string, string>;
    homepage: {
        hero_badge: string;
        hero_title: string;
        hero_highlight: string;
        hero_description: string;
        hero_cta_primary: string;
        hero_cta_secondary: string;
        hero_image_url: string | null;
        hero_slides_url: string[];
        stat_years: number;
        stat_clients: number;
        stat_provinces: number;
        stat_ontime: number;
        services_title: string;
        services_description: string;
        gallery_title: string;
        gallery_description: string;
    } | null;
    services: Array<{ id: number; title: string; description: string; image_url: string | null; icon: string; }>;
    about: { title: string; description_1: string; description_2: string; image_url: string | null; highlights: string[]; vision: string; } | null;
    advantages: Array<{ id: number; title: string; description: string; icon: string; color: string; }>;
    contact: { phone: string; email: string; address: string; maps_embed_url: string | null; office_hours: string; } | null;
    galleries: Array<{ id: number; title: string; description: string | null; type: 'photo' | 'video'; file_url: string | null; video_url: string | null; }>;
}

export const fetchSiteData = (): Promise<SiteData> => api.get('/site-data').then(r => r.data);

export const submitContact = (data: { name: string; phone: string; email?: string; message: string }) =>
    api.post('/contact', data).then(r => r.data);
