import axios from "axios";
import ollama from 'ollama'

export const openRouterRequest = async (content) => {
    let response = await axios({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: "POST",
        headers: {
            "Authorization": 'Bearer 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',
            "Content-Type": "application/json"
        },
        data: {
            "model": "z-ai/glm-4.5-air:free",
            "messages": [
                {
                    "role": "user",
                    "content": `${content}`,
                    // content: '你好'
                }
            ],
            "reasoning": { "enabled": false }
        }
    });


    return response.data.choices[0].message.content
}

export const ollamaRequest = async (content) => {
    const response = await ollama.chat({
        model: 'qwen3:30b',
        messages: [{ role: 'user', content }],
        stream: false,
        think: false
    })

    return response.message.content
}

export const llmRequest = async (content) => {
    let result = ''

    try {
        console.log(`正在请求 OpenRouter 模型 ...`)
        result = await openRouterRequest(content)
    } catch (e) {
        console.error(`openRouter 调用失败: ${e}`)

        try {
            console.log(`正在请求 Ollama 模型 ...`)
            result = await ollamaRequest(content)
        } catch (e) {
            console.error(`ollama 调用失败: ${e}`)
        }
    }

    return result
}

export const commonPrompt = () => {
    return `分析以上新闻:

- 我公司是做家政互联网平台，专注与保姆、月嫂、保洁服务。判断是否对平台业务模式创新、营收增长有帮助
- 如果有帮助，按如下内容顺序输出
    - 总结内容
    - 请说明具体结合业务可落地的方案
- 如果无帮助，直接回答“无帮助”`
}