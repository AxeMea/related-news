import {
    setupDB,
    getInstance
} from '../db.js'
import { ollamaRequest, commonPrompt, llmRequest } from '../utils.js'

import axios from 'axios'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'
import * as cheerio from 'cheerio';

const requestPcList = async (page = 1) => {
    return axios.get(`https://aitntnews.com/newList.html?typeId=1&page=${page}`);
}

const loop = async (page = 1) => {
    console.log(`第 ${page} 页：`)
    const instance = getInstance()

    const items = []
    const res = await requestPcList(page)

    const $ = cheerio.load(res.data)
    $('.news-item').each((i, el) => {
        const item = {
            id: randomUUID(),
            title: $(el).find('.h_tag').text(),
            long_summary: $(el).find('.news-description').text(),
            publish_time: $(el).text().match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)[0],
            link_info: {
                url: `https://aitntnews.com${$(el).find('a').attr('href')}`,
            },
            pic_style: 0
        }
        items.push(item)
    })

    const now = dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
    for (let item of items) {
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
                            source: 'aitntnews',
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
                        let realContent = $('.new-content').text()
                        realContent = realContent.replace(/\.[a-z]{2}.+/g, '')

                        newItem.content = realContent

                        const startTime = Date.now()
                        const prompt = `
\`\`\`
${realContent}
\`\`\`

${commonPrompt()}
`
                        try {
                            let aiSummary = await llmRequest(prompt)
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