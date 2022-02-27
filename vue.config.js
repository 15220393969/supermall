module.exports = {
    configureWebpack: {
        resolve: {
            // 配置别名
            alias: {
                //内部已经配置好的别名
                // '@': 'src' ,  
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
            }
        }
    }
}