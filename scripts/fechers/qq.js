import {
    setupDB,
    getInstance
} from '../db.js'
import { ollamaRequest, commonPrompt } from '../utils.js'

import axios from 'axios'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import * as cheerio from 'cheerio';

const requestPcList = async (page = 1) => {
    const params = JSON.parse("{\"base_req\":{\"from\":\"pc\"},\"forward\":\"2\",\"qimei36\":\"0_amAeipxHt906T\",\"device_id\":\"0_amAeipxHt906T\",\"flush_num\":50,\"channel_id\":\"news_news_tech\",\"item_count\":12,\"is_local_chlid\":\"0\"}")

    params.flush_num = page
    return fetch("https://i.news.qq.com/web_feed/getPCList", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": "pac_uid=0_amAeipxHt906T; omgid=0_f7XDZj3GfYRAH; current-city-name=changsha; _qimei_fingerprint=d8c6ad6c69d617d6bff66e73743d8a47; _qimei_q36=; _qimei_h38=8f95fa732b139d4ada30bcf30200000691970e; lcad_o_minduid=MZdAFJ-BEvoIRiV6t4vnEREO74AWM3iI; lcad_appuser=075B0B510DB82596; lcad_LZCturn=280; lcad_LPSJturn=886; lcad_LBSturn=552; lcad_LVINturn=503; lcad_LPHLSturn=823; lcad_LDERturn=34",
            "Referer": "https://news.qq.com/"
        },
        "body": JSON.stringify(params),
        "method": "POST"
    }).then(res => res.json());
}

const loop = async (page = 1) => {
    console.log(`第 ${page} 页：`)
    const instance = getInstance()
    const res = await requestPcList(page)
    const now = dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
    for (let item of res.data) {
        if (item.publish_time) {
            if (item.publish_time >= now) {
                if (item.pic_style === 0) {
                    const has = await instance.models.New.findOne({
                        where: {
                            source_news_id: item.id,
                            source: 'qq_news'
                        }
                    })

                    if (!has) {
                        const newItem = {
                            id: randomUUID(),
                            title: item.title,
                            content: item.content,
                            source: 'qq_news',
                            source_news_id: item.id,
                            long_summary: item.long_summary,
                            content: '',
                            ai_summary: '',
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            news_publish_at: item.publish_time,
                            link: item.link_info.url,
                        }

                        console.log(`正在解析 HTML 内容 ${newItem.link} ...`)
                        const content = (await axios.get(newItem.link)).data
                        const $ = cheerio.load(content)
                        let realContent = $('.rich_media_content').text()
                        realContent = realContent.replace(/\.[a-z]{2}.+/g, '')

                        newItem.content = realContent

                        console.log(`正在请求 LLM 模型 ...`)
                        const startTime = Date.now()
                        const prompt = `
\`\`\`
${realContent}
\`\`\`

${commonPrompt()}
`
                        try {
                            let aiSummary = await ollamaRequest(prompt)
                            const endTime = Date.now()
                            console.log(`请求耗时: ${endTime - startTime} 毫秒`)

                            if (aiSummary && !aiSummary.includes('无帮助')) {
                                const endStr = '</think>'
                                let index = aiSummary.indexOf(endStr)

                                if (index >= 0) {
                                    aiSummary = aiSummary.substring(index + endStr.length)
                                }

                                newItem.ai_summary = aiSummary
                            } else {
                                console.log(`AI 模型返回无帮助: ${aiSummary}`)
                            }

                            console.log(`正在创建数据库记录 ... ${newItem.id}`)
                            await instance.models.New.create(newItem)
                            console.log(newItem)
                        } catch (e) {
                            console.error(`请求 LLM 模型失败: ${e}`)
                        }
                    }
                }
            } else {
                console.log(`发布时间 ${item.publish_time}`)
                return
            }
        }
    }

    await loop(page + 1)
}

export const main = async () => {
    await setupDB()
    await loop()
}

main()