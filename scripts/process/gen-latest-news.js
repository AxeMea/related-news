import {
    setupDB,
    getInstance
} from '../db.js'
import { Op } from 'sequelize'
import dayjs from 'dayjs'
import fs from 'fs'

const main = async () => {
    await setupDB()
    const instance = getInstance()

    const loop = async () => {
        console.log(`开始扫描 ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)
        const res = await instance.models.New.findAll({
            where: {
                ai_summary: {
                    [Op.not]: ''
                },
                news_publish_at: {
                    [Op.gt]: dayjs().subtract(7, 'day').format('YYYY-MM-DD 00:00:00')
                }
            }
        })

        const items = res.map(v => v.dataValues)
            .map(v => ({
                id: v.id,
                title: v.title,
                category: v.category,
                timestamp: dayjs(v.news_publish_at).format('YYYY-MM-DD HH:mm:ss'),
                source: v.source,
                content: v.ai_summary,
                url: v.link,
            })).sort((prev, next) => {
                return prev.timestamp > next.timestamp ? -1 : 1
            })

        fs.writeFileSync(`${process.cwd()}/articles/latest-news.json`, JSON.stringify(items, null, 2))

        setTimeout(() => {
            loop()
        }, 1000 * 30)
    }

    await loop()
}

main()