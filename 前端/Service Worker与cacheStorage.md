#Service Worker与cacheStorage
##一、缓存和离线开发
说得HTML5离线开发，我们通常第一反应是使用html5 manifest缓存技术，此技术已经出现很多年了，我以前多次了解过，也见过一些实践案例，但是却从未在博客中介绍过，因为并不看好。

为什么不看好呢？用一句话解释就是“投入产出比有些低”。

对于web应用，掉线不能使用是理所当然的，绝不会有哪个开发人员会因为网页在没网的时候打不开被测试MM提bug，或者被用户投诉，所以，我们的web页面不支持离线完全不会有什么影响。但如果我们希望支持离线，会发现，我投入的精力和成本啊还真不小，就说一点，html5 manifest缓存技术需要服务端配合直接就让成本蹭蹭蹭的上去了，因为已经不仅仅是前端这一个工种的工作了，很可能就需要跨团队协作，这事情立马一下子就啰嗦了，开发时候啰嗦，以后维护也啰嗦。

而支持离线的收益，我估算了下，比支持无障碍访问收益还要低。所以，站在商业的角度讲，如果一项技术成本比较高，收益比较小，是并不建议实际应用的。开发人员喜欢在重要的项目中玩些时髦的酷酷的新技术自嗨是可以理解的，但前提是收益明显。如果只是自嗨，留下烂摊，有必要警惕了，业务意识和职业素养说明还有待提高。

铺垫这么多，就是要转折说下本文要介绍的缓存技术。

本文所要介绍的基于Service Worker和cacheStorage缓存及离线开发，套路非常固定，无侵入，且语言纯正，直接复制粘贴就可以实现缓存和离线功能，纯前端，无需服务器配合。一个看上去很酷的功能只要复制粘贴就可以实现，绝对是成本极低的，小白中的小白也能上手。

由于成本几乎可以忽略不计，此时离线功能支持的投入产出比相当高了，经验告诉我这种技术以后流行和普及的可能性非常高，于是迫不及待分享给大家。

在开始案例前，我们有必要先了解几个概念。
##通俗易懂的方式介绍Service Worker
Service Worker直白翻译就是“服务人员”，看似不经意的翻译，实际上却正道出了Service Worker的精髓所在。

举个例子，如果我们冲着叶修的集卡去麦当劳消费，如下图所示：
![](http://image.zhangxinxu.com/image/blog/201707/mdl-yexiu.jpg)

实际流程都是需要一个“服务人员”，客户点餐，付钱，服务人员提供食物和叶修卡，回到客户手上。

如果从最大化利用角度而言，这里的服务人员其实是多余的，客户直接付钱拿货更快捷，而这种直接请求的策略就是web请求的做法，客户端发送请求，服务器返回数据，客户端再显示。

这么多年下来，似乎web的这种数据请求策略没有任何问题，那为何现在要在中间加一个“服务人员”-Service Worker呢？

主要是用户应付一些特殊场景和需求，比方说离线处理（客官，这个卖完了），比方说消息推送（客官，你的汉堡好了……）等。而离线应用和消息推送正是目前native app相对于web app的优势所在。

所以，Service Worker出现的目的是让web app可以和native app开始真正意义上的竞争。

###Service Worker概念和用法
我们平常浏览器窗口中跑的页面运行的是主JavaScript线程，DOM和window全局变量都是可以访问的。而Service Worker是走的另外的线程，可以理解为在浏览器背后默默运行的一个线程，脱离浏览器窗体，因此，window以及DOM都是不能访问的，此时我们可以使用self访问全局上下文，可参见这篇短文：“[了解JS中的全局对象window.self和全局作用域self](http://www.zhangxinxu.com/wordpress/2017/07/js-window-self/)”。

由于Service Worker走的是另外的线程，因此，就算这个线程翻江倒海也不会阻塞主JavaScript线程，也就是不会引起浏览器页面加载的卡顿之类。同时，由于Service Worker设计为完全异步，同步API（如`XHR`和`localStorage`）不能在Service Worker中使用。

除了上面的些限制外，Service Worker对我们的协议也有要求，就是必须是https协议的，但本地开发也弄个https协议是很麻烦的，好在还算人性化，Service Worker在`http://localhost`或者`http://127.0.0.1`这种本地环境下的时候也是可以跑起来的。如果我们想做个demo之类的页面给其他小伙伴看，我们可以借助Github（因为是`https`协议的），例如我就专门建了个https-demo的小项目，专门用来放置一些需要https协议的demo页面，相信离不开https的技术场景以后会越来越多。

最后，Service workers大量使用Promise，因为通常它们会等待响应后继续，并根据响应返回一个成功或者失败的操作，这些场景非常适合Promise。如果对Promise不是很了解，可以先看我之前文章：“[ES6 JavaScript Promise](http://www.zhangxinxu.com/wordpress/?p=3975)的感性认知”，然后再看：“[JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)”。

###Service Worker的生命周期
我们直接看一个例子吧，如下HTML和JS代码：

```
<h3>一些提示信息</h3>
<ul>
    <li>浏览器是否支持：<span id="isSupport"></span></li>
    <li>service worker是否注册成功：<span id="isSuccess"></span></li>
    <li>当前注册状态：<span id="state"></span></li>
    <li>当前service worker状态：<span id="swState"></span></li>
</ul>
```
```
<script src="./static/jquery.min.js"></script>
<script>
if ('serviceWorker' in navigator) {
    $('#isSupport').text('支持');

    // 开始注册service workers
    navigator.serviceWorker.register('./sw-demo-cache.js', {
        scope: './'
    }).then(function (registration) {
        $('#isSuccess').text('注册成功');

        var serviceWorker;
        if (registration.installing) {
            serviceWorker = registration.installing;
            $('#state').text('installing');
        } else if (registration.waiting) {
            serviceWorker = registration.waiting;
            $('#state').text('waiting');
        } else if (registration.active) {
            serviceWorker = registration.active;
            $('#state').text('active');
        }
        if (serviceWorker) {
            $('#swState').text(serviceWorker.state);
            serviceWorker.addEventListener('statechange', function (e) {
                $('#swState').append('&emsp;状态变化为' + e.target.state);
            });
        }
    }).catch (function (error) {
        $('#isSuccess').text('注册没有成功');
    });
} else {
    $('#isSupport').text('不支持');
}
</script>
```

代码作用很简单，判断浏览器是否支持Service Worker以及记录Service Worker的生命周期（当前状态）。

在Chrome浏览器下，当我们第一次访问[含有上面代码的页面](https://zhangxinxu.github.io/https-demo/cache/start.html)时候，结果会是这样：

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-09_220939.png)

会看到：installing → installed → activating → activated。

这个状态变化过程实际上就是Service Worker生命周期的反应。

当我们再次刷新此页面，结果又会是这样：

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-09_221013.png)

直接显示注册成功状态。

Service Worker注册时候的生命周期是这样的：

* Download – 下载注册的JS文件
* Install – 安装
* Activate – 激活

一旦安装完成，如何注册的JS没有变化，则直接显示当前激活态。

然而，实际的开发场景要更加复杂，使得Service Worker还有其它一些状态。例如下图这样：

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-11_224143.png)

出现了`waiting`，这是怎么出现的呢？我们修改了Service Worker注册JS，然后重载的时候旧的Service Worker还在跑，新的Service Worker已经安装等待激活。我们打开开发者工具面板，Application → Service Workers，可能就会如下图这样：

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-11_225751.png)

此时，我们页面强刷下会变成这样，进行了激活

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-11_224316.png)

再次刷新又回到注册完毕状态。

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-11_224352.png)

然后，这些对应的状态，Service Worker是有对应的事件名进行捕获的，为：

```
self.addEventListener('install', function(event) { /* 安装后... */ });
```
```
self.addEventListener('activate', function(event) { /* 激活后... */ });
```

最后，Service Worker还支持fetch事件，来响应和拦截各种请求。

```
self.addEventListener('fetch', function(event) { /* 请求后... */ });
```

基本上，目前Service Worker的所有应用都是基于上面3个事件的，例如，本文要介绍的缓存和离线开发，'`install`'用来缓存文件，'`activate`'用来缓存更新，'`fetch`'用来拦截请求直接返回缓存数据。三者齐心，构成了完成的缓存控制结构。

###Service Worker的兼容性
桌面端Chrome和Firefox可用，IE不可用。移动端Chrome可用，以后估计会快速支持。
##三、了解Cache和CacheStorage
`Cache`和`CacheStorage`都是Service Worker API下的接口，截图如下：

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-11_235125.png)

其中，`Cache`直接和请求打交道，`CacheStorage`和`Cache`对象打交道，我们可以直接使用全局的`caches`属性访问`CacheStorage`，例如，虽然API上显示的是`CacheStorage.open()`，但我们实际使用的时候，直接`caches.open()`就可以了。

`Cache`和`CacheStorage`的出现让浏览器的缓存类型又多了一个：之前有memoryCache和diskCache，现在又多了个ServiceWorker cache。

至于`Cache`和`CacheStorage`具体的增删改查API直接去这里一个一个找，Service Worker API的知识体量实在惊人，若想要系统学习，那可要做好充足的心理准备了。

但是，如果我们只是希望在实际项目中应用一两点实用技巧，则要轻松很多。例如，我们希望在我们的PC项目后者移动端页面上渐进增强支持离线开发和更灵活的缓存控制，直接参照下面的套路即可！
##四、借助Service Worker和cacheStorage离线开发的固定套路
* 页面上注册一个Service Worker，例如：

```
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw-demo-cache.js');
}
```
* sw-demo-cache.js这个JS中复制如下代码：

```
var VERSION = 'v1';

// 缓存
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        './start.html',
        './static/jquery.min.js',
        './static/mm1.jpg'
      ]);
    })
  );
});

// 缓存更新
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(response) {
    caches.open(VERSION).then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('./static/mm1.jpg');
  }));
});
```

* 把`cache.addAll()`方法中缓存文件数组换成你希望缓存的文件数组。

恭喜你，简单3步曲，复制、粘贴、改路径。你的网站已经支持Service Worker缓存，甚至离线也可以自如访问，支持各种网站，PC和Mobile通杀，不支持的浏览器没有任何影响，支持的浏览器天然离线支持，想要更新缓存，`v1`换成`v2`就可以，so easy!。

眼见为实，您可以狠狠地点击这里：[借助Service Worker和cacheStorage缓存及离线开发demo](https://zhangxinxu.github.io/https-demo/cache/start.html)

进入页面，我们勾选network中的Offline，如下图：

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-09_221139.png)

结果刷新的时候，页面依然正常加载，如下gif截屏：

![](http://image.zhangxinxu.com/image/blog/201707/offline-load-s.gif)

我们离线功能就此达成，出乎意料的简单与实用。

##五、和PWA技术的关系
PWA全称为“Progressive Web Apps”，渐进式网页应用。功效显著，收益明显，如下图：

![](http://image.zhangxinxu.com/image/blog/201707/2017-07-12_003322.png)

PWA的核心技术包括：

* Web App Manifest – 在主屏幕添加app图标，定义手机标题栏颜色之类
* Service Worker – 缓存，离线开发，以及地理位置信息处理等
* App Shell – 先显示APP的主结构，再填充主数据，更快显示更好体验
* Push Notification – 消息推送，之前有写过“[简单了解HTML5中的Web Notification桌面通知](http://www.zhangxinxu.com/wordpress/2016/07/know-html5-web-notification/)”

有此可见，Service Worker仅仅是PWA技术中的一部分，但是又独立于PWA。也就是虽然PWA技术面向移动端，但是并不影响我们在桌面端渐进使用Service Worker，考虑到自己厂子用户70%~80%都是Chrome内核，收益或许会比预期的要高。

##六、Service Worker更多的应用场景
Service Worker除了可以缓存和离线开发，其可以应用的场景还有很多，举几个例子（参考自MDN）：

* 后台数据同步
* 响应来自其它源的资源请求，
* 集中接收计算成本高的数据更新，比如地理位置和陀螺仪信息，这样多个页面就可以利用同一组数据
* 在客户端进行CoffeeScript，LESS，CJS/AMD等模块编译和依赖管理（用于开发目的）
* 后台服务钩子
* 自定义模板用于特定URL模式
* 性能增强，比如预取用户可能需要的资源，比如相册中的后面数张图片

开动自己的脑力，很多想法直接就可以前端实现。

例如我想到了一个：重构人员写高保真原型的时候，模拟请求伪造数据的时候，可以不用依赖web环境，直接在Service Worker中拦截和返回模拟数据，于是整个项目只有干净的HTML、CSS和JS。





