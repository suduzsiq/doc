#Vue.JS
![](https://cn.vuejs.org/images/logo.png)
##什么是Vue？
> Vue是一套构建用户界面的渐进式框架，Vue的核心库只关注视图层，它不仅易于上手，还便于与第三方库或既有项目整合。

##Vue有什么特点？
* **简洁**
	* HTML模板 + JSON数据，再创建一个Vue实例，就这么简单
	* ![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/061049dc732742c71ca464f178692951001ef9c444501635dcdae0064095b9c7590d5a7ea6541a1866023941eae13f9f?pictype=scale&from=30113&version=2.0.0.2&uin=297382151&fname=437B3C09-CE5D-4BF2-978B-41497C2CDA6C.png&size=1024)
* **数据驱动**
	* 开发者只需关注页面数据流动，不需要关注DOM操作
	* 自动追踪依赖的模板表达式和计算属性
	* [实现原理](https://segmentfault.com/a/1190000006599500)（通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调）
	* ![](https://segmentfault.com/img/bVBQXk)
* **组件化**
	* 用解耦、可复用的组件来构造界面
	* ![](https://cn.vuejs.org/images/components.png)
* **轻量**
	* 30.33kb min+gzip，无依赖
* **快速**
	* Vue采用声明式渲染，数据和DOM已经被绑定在一起，所有的元素都是响应式的，当数据变动时能够精确有效的异步批量更新DOM
* **模块友好**
	* 官方提供命令行工具(CLI)，可用于快速搭建大型单页应用，通过NPM或Bower安装，无缝融入你的工作流
	* ![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/653ce9f4c128fe2b5f3791ae2791f66a9ec4b2e91cad432fd01ee29b597c60a965ec3d08d1750190ffec656f0320b657?pictype=scale&from=30113&version=2.0.0.2&uin=297382151&fname=D7BE0773-B9F0-4D83-A0A8-A87175F896F1.png&size=1024)
* **文档友好**
	* [https://cn.vuejs.org](https://cn.vuejs.org) 

##Vue能够做什么？
> 依托Vue的核心库再配合其他框架，我们能够快速搭建我们的应用

* **Vue-Router**（[https://router.vuejs.org/zh-cn/](https://router.vuejs.org/zh-cn/)）
	* vue-router用于设定访问路径，能够将组件components映射到路由routes
	* ![](http://images2015.cnblogs.com/blog/341820/201607/341820-20160721065506076-8242334.png)
* **Vuex**（[https://vuex.vuejs.org/zh-cn/](https://vuex.vuejs.org/zh-cn/)）
	* Vuex是一个专为Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化
	* ![](https://vuex.vuejs.org/zh-cn/images/flow.png)
* **Axios**（[Axios是一个基于Promise用于浏览器和Nodejs的HTTP客户端](http://www.jianshu.com/p/df464b26ae58)）
	* 从浏览器中创建XMLHttpRequest
	* 从Node.js发出http请求
	* 支持Promise API
	* 拦截请求和响应
	* 转换请求和响应数据
	* 取消请求
	* 自动转换JSON数据
	* 客户端支持防止CSRF/XSRF
* **Easy-Mock**（EasyMock是一个可视化，并且能快速生成模拟数据的服务，前端开发人员可以在脱离后端接口服务的情况下，快速开发）
	* ![](https://picabstract-preview-ftn.weiyun.com:8443/ftn_pic_abs_v2/cc22298b235a5572f09c68c81fa81d1edc3f3cab83d3939103d7a8b5b0da75d88ca289c3fcc6f5654377b8eb834837bd?pictype=scale&from=30113&version=2.0.0.2&uin=297382151&fname=BA70AE35-F912-4783-B228-3065D0280706.png&size=1024)
* **ECMA6**（不得不提，使用ES6的新特性进行项目开发，真的很爽）
	* ![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512226327&di=bbc175266cae29e570bc09fac8d696df&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.redwall.ee%2Fimages%2Fblog%2Ftarkvaratrendid2016%2Fes6.jpg)

##哪些公司在使用Vue？
* ![](https://camo.githubusercontent.com/462f24153b8e8739c8ea71f7102585c4cb0e1575/68747470733a2f2f63646e2e7261776769742e636f6d2f456c656d6546452f656c656d656e742f6465762f656c656d656e745f6c6f676f2e737667)
* ![](https://img.alicdn.com/tps/TB1zBLaPXXXXXXeXXXXXXXXXXXX-121-59.svg)
* ![](https://avatars2.githubusercontent.com/u/29660949?s=200&v=4)

##Vue的兼容性？
> Vue.js不支持IE8及其以下版本，因为Vue.js使用了IE8不能模拟的ECMAScript5特性
> 
> Vue.js支持所有兼容ECMAScript5的浏览器
> 
> Vue.js可以完美使用ES6的语法进行开发，Bebel提供了转码能力