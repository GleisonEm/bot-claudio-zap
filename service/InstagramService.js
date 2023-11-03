const { default: axios } = require('axios');
const instagramDl = require('insta-scrapper-media');

class InstagramService {
    async getReelsBase64(
        url
    ) {
        console.log("insta url", url)
        const urlFormatted = url.replace(' ', '');
        const response = await instagramDl(urlFormatted);
        let data = response[0]

        if (!data.download_link) {
            return {
                message: "❌ Erro ao buscar o reels",
                ok: false
            };
        }

        return axios.get(
            data.download_link,
            { responseType: 'arraybuffer' }
        ).then((responseData) => {

            const videoBase64 = Buffer.from(responseData.data, 'binary').toString('base64');

            return {
                message: "Sucesso",
                ok: true,
                videoBase64: videoBase64
            };
        }).catch((error) => {
            console.error('Erro ao gerar o base64:', error);
            return {
                message: "❌ Erro ao buscar o base64",
                ok: false
            };
        });
    }
    async getReelsUrl(
        url
    ) {
        try {
            console.log("insta url", url)
            const urlFormatted = url.replace(' ', '');
            const response = await instagramDl(urlFormatted);
            let data = response[0]

            if (!data.download_link) {
                return {
                    message: "❌ Erro ao buscar o reels",
                    ok: false
                };
            }

            return {
                ok: true,
                url: data.download_link
            }
        } catch (e) {
            console.log('error ao nbuscar reels', e)
            return {
                message: "❌ Erro ao buscar o reels",
                ok: false
            };
        }
    }
    async getStoryUrl(
        url
    ) {
        try {
            console.log("insta url", url)
            const urlFormatted = url.replace(' ', '');
            return fetch(`https://igram.world/api/ig/story?url=${urlFormatted}`, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "max-age=0",
                    "if-none-match": "W/\"1cdb-QlpwgPaRnVU3P/tgDRq+XylzHGs\"",
                    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "cookie": "uid=89aae2f33f333c14; adsPopupClick=28; helperWidget=74; _ga=GA1.1.29585970.1698120881; _ym_uid=1698345024693205279; _ym_d=1698345024; _ym_isad=1; _ym_visorc=w; XSRF-TOKEN=eyJpdiI6InY2bHExeWxMdjZxRlJxa0pSdVY5ZkE9PSIsInZhbHVlIjoiUGJjWnU0SGcrQjlLK0RVZm5FbEdibk1uYmpFcHBiYXRIQjNwMGs4TXFvMUtKN3JEYVE2RUYxbW80QnpVM0FFVDNvamRoZjR0OVRjSXRoclFRbGI3cGVoMGVHR2RUU3pGeHBLaWJsN1hjdkFFUEt6bmxndTIrQnFjNmRuWHI2a1AiLCJtYWMiOiIwODJlMmI0ODJiNTU4YTk4Njc3ODI5OWI4YTQ0YzBhOGQ1M2YxY2Y0N2E5YmNhM2ZmODUwNzAxMGQzNmMxNzY3In0%3D; igram_world_clone_session=eyJpdiI6IkZkcDgyQStBVWxhVUtxbE1QeWlyOXc9PSIsInZhbHVlIjoiVzJQeTJSSmdwTFpcLzBaZG41SUpUZ2Ntd1hBNWRyT2NWR1FWd2w2Sys1M050aENlUkoxK0RcLzlxb2FXSEJpdmdKVmdRamhJUWRYamIxZk0xdEFnbXNXUU10alRPM2V0c1wvdnpIVGVLa01vSjNnMXRWVVBtOXRXM050N3hLWmJtUWEiLCJtYWMiOiJlNWY1Y2U0NzkyYjA1NDA5NDliMmE0ZDFmNTdmNGE2MThkMzA1ZmQ3Yjk2YjlhMWVhZDM2YWEzYmUyMDMyOWYwIn0%3D; _ga_99VS1KX9CV=GS1.1.1698345023.2.1.1698345095.0.0.0; _ga_V9ECHR065F=GS1.1.1698345024.2.1.1698345095.0.0.0; mp_ec0f5c39312fa476b16b86e4f6a1c9dd_mixpanel=%7B%22distinct_id%22%3A%20%22%24device%3A18b5fe4510c810-06f3d7f14ba4e-26031151-1fa400-18b5fe4510c811%22%2C%22%24device_id%22%3A%20%2218b5fe4510c810-06f3d7f14ba4e-26031151-1fa400-18b5fe4510c811%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%7D"
                },
                "body": null,
                "method": "GET"
            }).then(res => res.json()).then((data) => {
                const response = data.result[0];
                console.log(data.result)
                if (!response.video_versions) {
                    const imageStory = response.image_versions2.candidates[0]
                    if (imageStory) {
                        return {
                            ok: true,
                            url: imageStory.url
                        }
                    }
                    return {
                        message: "❌ Erro ao buscar o story",
                        ok: false
                    };
                }

                return {
                    ok: true,
                    url: response.video_versions.find(video => typeof video.url === 'string').url
                }
            })
        } catch (e) {
            console.log('error ao nbuscar story', e)
            return {
                message: "❌ Erro ao buscar o story+",
                ok: false
            };
        }
    }
}

module.exports = InstagramService;