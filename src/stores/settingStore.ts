import { defineStore } from 'pinia'
import { SettingConfig, Setting } from '../config/Config'


export const useSettingStore = defineStore('setting', {
    state: () => ({
        settingConfig: null as SettingConfig | null, 
        isLoading: false,
        error: null as string | null
    }),
    getters: {
        getSetting: (state): SettingConfig | null => state.settingConfig,
        settingContent: (state): SettingConfig  => {
            if (!state.settingConfig) {
                return {
                    setting: {
                        autostart: false,
                        dark: false,
                        showClock: true
                    }
                }
            } else {
                return state.settingConfig
            }
        }
    },
    actions: {
        async loadSetting(path: string) {
            this.isLoading = true
            this.error = null
            try {
                const settingDate = await window.electronAPI.getSetting(path)
                this.settingConfig = settingDate
                console.log('主配置加载:', settingDate)
            } catch (err) {
                this.error = (err as Error).message
                console.error('加载主配置失败:', err)
            } finally {
                this.isLoading = false
                console.log('主配置加载完成:', this.settingConfig)
            }
        }
    }
});