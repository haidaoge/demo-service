
module.exports = {
    configureWebpack: {
      devtool: 'source-map',
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
      }
      },
    devServer:{
      proxy: {
        '/api':{
            target: 'http://api.jiyiuav.com',
            // target:'http://localhost:8123',
            ws: true,
            changOrigin: true,
            pathRewrite: {
              '^/api': '' 
            }
           
         }
      }
    },
  }