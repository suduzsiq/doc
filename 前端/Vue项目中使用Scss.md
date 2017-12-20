#Vue项目中使用Scss
##一 概述
随着sass/less等css预处理器的出现，编写css变的越来越有乐趣。所以现在越来越多的人在项目中喜欢使用scss或者less。（我自己就是一个）。由于最近在写一个vue项目。所以就把写项目期间每天的一些知识点写在博客里。所以最近的博客应该都会和vue有关。今天要和大家分享的就是如何在vue项目中引入scss（引入less也类似）
##二 vue中引入scss
###2.1 vue-loader
在讲如何在vue项目中使用scss之前，我们先来简单了解一个概念，那就是vue-loader。vue-loader是什么东西呢？vue-loader其实就是一个webpack的loader。用来把vue组件转换成可部署的js,html,css模块。所以我们如果要想再vue项目中使用scss,肯定要告诉vue-loader怎么样解析我的scss文件。

不了解webpack的同学可以先去自行百度。我这里就放一张图，看完大家可以也就能知道webpack能做些什么事情了。
![](https://segmentfault.com/img/bVPh7j?w=750&h=359)
###2.2 loader配置
在webpack中，所有预处理器都要匹配相应的loader,vue-loader允许其他的webpack-loader处理组件中的一部分吗，然后它根据lang属性自动判断出要使用的loaders。所以，其实只要安装处理sass/scss的loader。就能在vue中使用scss了。
现在我们来安装sass/scss loader

```
npm install sass-loader node-sass --save-dev
```
###2.3 为什么无需配置
我们前面说到,vue-loader允许能根据lang属性自动判断出要使用的loaders。它是怎么样做到的？有这么神奇嘛？我们下面来看一看最核心部分的源代码

```
exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}
```
就是上述这段代码让vue-loader有了这种能力，它会根据不同的文件去使用不同的loader
###2.4 使用scss
这样你就可以愉快的使用scss了。

```
<style scoped lang="sass">
      xxxx
      xxxx
</style>
```