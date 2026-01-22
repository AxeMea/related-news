import { Sequelize, DataTypes }  from 'sequelize'
// const mysql = require('mysql2');

let instance = null

export const getInstance = () => {
    return instance
}

export const setupDB = async () => {
    instance = new Sequelize({
        username: 'root',
        password: '!Yuzheng8304',
        database: 'ai_news',
        host: '127.0.0.1', // 通常是腾讯云提供的公网地址或内网地址
        dialect: 'mysql', // 使用 mysql 方言
        port: 3306 // MySQL 默认端口，除非你更改了它
    });

    try {
        await instance.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    initModel()
}

export const initModel = () => {
    instance.define(
        'New',
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
            },
            content: {
                type: DataTypes.STRING,
            },
            source: {
                type: DataTypes.STRING,
            },
            long_summary: {
                type: DataTypes.STRING,
            },
            source_news_id: {
                type: DataTypes.STRING,
            },
            content: {
                type: DataTypes.STRING,
            },
            ai_summary: {
                type: DataTypes.STRING,
            },
            createdAt: {
                type: DataTypes.DATE
            },
            news_publish_at: {
                type: DataTypes.DATE,
            },
            link: {
                type: DataTypes.STRING,
            },
            updatedAt: {
                type: DataTypes.DATE
            }
        },
        {
        },
    );
}
