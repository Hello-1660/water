import { defineStore } from 'pinia'
import { UIConfig } from '../config/Config'


export const useUiConfigStore = defineStore('uiConfig', {
    state: () => ({
        uiConfig: null as UIConfig | null, // 存储UIConfig实例
        isLoading: false,
        error: null as string | null
    }),
    getters: {
        getUIConfig: (state): UIConfig | null => state.uiConfig,
        // 计算属性：直接获取time/date的样式（带缓存，依赖变化才重新计算）
        timeStyle: (state): Record<string, string> => {
            if (!state.uiConfig) {
                // 默认样式（兜底）
                return {
                    fontSize: '50px',
                    fontFamily: 'Arial',
                    color: '#fff'
                }
            }
            const timeConfig = state.uiConfig.mainConfig.time
            // 转换为CSS样式对象（直接供组件绑定）
            return {
                fontSize: `${timeConfig.fontSize}px`,
                fontFamily: timeConfig.fontFamily,
                color: timeConfig.fontColor
            };
        },
        dateStyle: (state): Record<string, string> => {
            if (!state.uiConfig) {
                return {
                    fontSize: '50px',
                    fontFamily: 'Arial',
                    color: '#fff'
                };
            }
            const dateConfig = state.uiConfig.mainConfig.date
            return {
                fontSize: `${dateConfig.fontSize}px`,
                fontFamily: dateConfig.fontFamily,
                color: dateConfig.fontColor
            }
        }
    },
    actions: {
        // 从主进程加载UIConfig
        async loadUiConfig(path: string) {
            this.isLoading = true
            this.error = null
            try {
                // 调用IPC获取UIConfig实例
                const uiConfig = await window.electronAPI.getConfig(path)
                this.uiConfig = uiConfig
                console.log('UI配置加载:', uiConfig)
            } catch (err) {
                this.error = (err as Error).message
                console.error('加载UI配置失败:', err)
            } finally {
                this.isLoading = false
                console.log('UI配置加载完成:', this.uiConfig)
            }
        }
    }
})