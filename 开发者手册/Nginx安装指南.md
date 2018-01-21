#linux环境下安装nginx步骤
##一、Nginx简介
Nginx是一个web服务器也可以用来做负载均衡及反向代理使用，目前使用最多的就是负载均衡，具体简介我就不介绍了百度一下有很多，下面直接进入安装步骤
##二、Nginx安装
**开始前，请确认gcc g++开发类库是否装好，默认已经安装**

* Ububtu平台编译环境可以使用以下指令

```
apt-get install build-essential
apt-get install libtool
```
* centos平台编译环境使用如下指令

```
//安装make：
yum -y install gcc automake autoconf libtool make
//安装g++:
yum install gcc gcc-c++
```

###1、选定安装文件目录
可以选择任何目录，本文选择  cd /usr/local/nginx

```
cd /usr/local/nginx
```
###2、安装pcre库
[ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/ ](ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/ )下载最新的 PCRE 源码包，使用下面命令下载编译和安装 PCRE 包：（本文参照下载文件版本：pcre-8.41.tar.gz 经过验证未发现这个版本，若想下载最新版本请打开上面网址。本文选择pcre-8.41.tar.gz）

```
cd /usr/local/src
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.41.tar.gz
tar -zxvf pcre-8.41.tar.gz
cd pcre-8.41
./configure
make
make install
```
###3、安装zlib库
[http://zlib.net/zlib-1.2.11.tar.gz](http://zlib.net/zlib-1.2.11.tar.gz) 下载最新的 zlib 源码包，使用下面命令下载编译和安装 zlib包：（本文参照下载文件版本：zlib-1.2.8.tar.gz 经过验证未发现这个版本，若想下载最新版本请打开上面网址。本文选择zlib-1.2.11.tar.gz ）

```
cd /usr/local/src
wget http://zlib.net/zlib-1.2.11.tar.gz
tar -zxvf zlib-1.2.11.tar.gz
cd zlib-1.2.11
./configure
make
make install
```
###4、安装openssl（某些vps默认没装ssl)
```
cd /usr/local/src
wget https://www.openssl.org/source/openssl-1.0.1t.tar.gz
tar -zxvf openssl-1.0.1t.tar.gz
./config
make
make install
```
###5、安装nginx
Nginx 一般有两个版本，分别是稳定版和开发版，您可以根据您的目的来选择这两个版本的其中一个，下面是把 Nginx 安装到 /usr/local/nginx 目录下的详细步骤：

```
cd /usr/local/nginx
wget http://nginx.org/download/nginx-1.1.10.tar.gz
tar -zxvf nginx-1.1.10.tar.gz
cd nginx-1.1.10
./configure --sbin-path=/usr/local/nginx/nginx \--conf-path=/usr/local/nginx/nginx.conf \--pid-path=/usr/local/nginx/nginx.pid \--with-http_ssl_module \--with-pcre=/usr/local/src/pcre-8.41 \--with-zlib=/usr/local/src/zlib-1.2.11 \--with-openssl=/usr/local/src/openssl-1.0.1t
make
make install
```
**注：这里可能会出现报错**
![](http://images2015.cnblogs.com/blog/1095329/201703/1095329-20170328192456889-1267494879.png)

按照第四步方法或者
ubuntu下

```
apt-get install openssl
apt-get install libssl-dev
```
centos下

```
yum -y install openssl openssl-devel
```
##三、启动Nginx
先找一下nginx安装到什么位置上了

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418154742915-713647057.png)

###启动nginx

```
netstat -ano|grep 80
```
如果查不到执行结果，则忽略上一步（ubuntu下必须用sudo启动，不然只能在前台运行）

```
sudo /usr/local/nginx/nginx
```

进入nginx目录并启动
![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418154804759-1842869219.png)

报错了，error while loading shared libraries: libpcre.so.1: cannot open shared object file: No such file or directory，按照下面方式解决

```
1.用whereis libpcre.so.1命令找到libpcre.so.1在哪里
2.用ln -s /usr/local/lib/libpcre.so.1 /lib64命令做个软连接就可以了
3.用sbin/nginx启动Nginx
4.用ps -aux | grep nginx查看状态

[root@localhost nginx]# whereis libpcre.so.1
[root@localhost nginx]# ln -s /usr/local/lib/libpcre.so.1 /lib64
[root@localhost nginx]# sbin/nginx
[root@localhost nginx]# ps -aux | grep nginx
```

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418162004024-2058687645.png)

进入Linux系统的图形界面，打开浏览器输入localhost会看到下图，说明nginx启动成功

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418162145790-461736932.png)

nginx的基本操作
```
启动
[root@localhost ~]# /usr/local/nginx/sbin/nginx
停止/重启
[root@localhost ~]# /usr/local/nginx/sbin/nginx -s stop(quit、reload)
命令帮助
[root@localhost ~]# /usr/local/nginx/sbin/nginx -h
验证配置文件
[root@localhost ~]# /usr/local/nginx/sbin/nginx -t
配置文件
[root@localhost ~]# vim /usr/local/nginx/conf/nginx.conf
```

##四、Nginx配置
###简单配置
打开nginx配置文件位于nginx目录下的conf文件夹下

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418164812196-1164065507.png)

简单介绍一下vim的语法

```
默认vim打开后是不能录入的，需要按键才能操作，具体如下：
开启编辑：按“i”或者“Insert”键
退出编辑：“Esc”键
退出vim：“:q”
保存vim：“:w”
保存退出vim：“:wq”
不保存退出vim：“:q!”
```

服务配置
```
server {
        listen       3000;
        server_name  localhost;

        add_header Access-Control-Allow-Origin *;

        location / {
            root   /var/www/orange;
            index  index.html index.htm;
        }

        location /orange/ {
	    proxy_ignore_client_abort on;
            proxy_pass https://www.easy-mock.com/mock/5a1e9b811f943e71b6c7b207/orange/;
            client_max_body_size    1000m;
        }

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        set $realip $remote_addr;
        if ($http_x_forwarded_for ~ "^(\d+\.\d+\.\d+\.\d+)") {
          set $realip $1;
        }
        fastcgi_param REMOTE_ADDR $realip;
    }
```

###开启外网访问
在Linux系统中默认有防火墙Iptables管理者所有的端口，只启用默认远程连接22端口其他都关闭，咱们上面设置的80等等也是关闭的，所以我们需要先把应用的端口开启

####方法一
直接关闭防火墙，这样性能较好，但安全性较差，如果有前置防火墙可以采取这种方式

```
关闭防火墙
[root@localhost ~]# service iptables stop
关闭开机自启动防火墙
[root@localhost ~]# chkconfig iptables off
[root@localhost ~]# chkconfig --list|grep ipt
```

下面是防火墙的其他操作命令

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418175910868-1921833075.png)

####方法二
将开启的端口加入防火墙白名单中，这种方式较安全但性能也相对较差

```
编辑防火墙白名单
[root@localhost ~]# vim /etc/sysconfig/iptables
增加下面一行代码
-A INPUT -p tcp -m state -- state NEW -m tcp --dport 80 -j ACCEPT
保存退出，重启防火墙
[root@localhost ~]# service iptables restart
```
![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418180736931-1955851185.png)

Linux配置完毕了，使用另一台电脑而非安装nginx的电脑，我是用的windows系统，配置一下host在“C:\Windows\System32\drivers\etc”下的hosts中配置一下域名重定向

```
10.11.13.22 nginx.test.com nginx.test1.com nginx.test2.com
```

然后cmd再ping一下这个域名是否正确指向了这个IP上

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418174908977-27238342.png)

正确指向后在telnet一下80端口看一下是否可以与端口通信（如果telnet提示没有此命令是没有安装客户端，在启用或禁用windows功能处安装后再操作即可）

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418175445712-2089843604.png)

得到以下界面及代表通信成功

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418175512790-352719306.png)

打开这台Windows系统内的浏览器，输入nginx.test.com会得到以下结果，就说明外网访问成功

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170418181546415-521855633.png)

到此Nginx服务器雏形部署完成。

###配置文件

```
#user  nobody; # 用户权限
worker_processes  auto;  # 工作进程的数量
#worker_cpu_affinity auto;

#全局错误日志及PID文件
error_log  logs/error.log;  # 日志输出
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    #epoll是多路复用IO(I/O Multiplexing)中的一种方式,
    #use 设置用于复用客户端线程的轮询方法。如果你使用Linux 2.6+，你应该使用epoll。如果你使用*BSD，你应该使用kqueue。
    use   epoll; # IOCP[window] , kqueue[bsd] , epoll[linux] 

    #单个后台worker process进程的最大并发链接数
    worker_connections  1024;

    #multi_accept 告诉nginx收到一个新连接通知后接受尽可能多的连接。
    multi_accept on;


    # 并发总数是 worker_processes 和 worker_connections 的乘积
    # 即 max_clients = worker_processes * worker_connections
    # 在设置了反向代理的情况下，max_clients = worker_processes * worker_connections / 4  为什么
    # 为什么上面反向代理要除以4，应该说是一个经验值
    # 根据以上条件，正常情况下的Nginx Server可以应付的最大连接数为：4 * 8000 = 32000
    # worker_connections 值的设置跟物理内存大小有关
    # 因为并发受IO约束，max_clients的值须小于系统可以打开的最大文件数
    # 而系统可以打开的最大文件数和内存大小成正比，一般1GB内存的机器上可以打开的文件数大约是10万左右
    # 我们来看看360M内存的VPS可以打开的文件句柄数是多少：
    # $ cat /proc/sys/fs/file-max
    # 输出 34336
    # 32000 < 34336，即并发连接总数小于系统可以打开的文件句柄总数，这样就在操作系统可以承受的范围之内
    # 所以，worker_connections 的值需根据 worker_processes 进程数目和系统可以打开的最大文件总数进行适当地进行设置
    # 使得并发总数小于操作系统可以打开的最大文件数目
    # 其实质也就是根据主机的物理CPU和内存进行配置
    # 当然，理论上的并发总数可能会和实际有所偏差，因为主机还有其他的工作进程需要消耗系统资源。
    # ulimit -SHn 65535
}


http {
    include       mime.types; #设定mime类型,类型由mime.type文件定义
    default_type  application/octet-stream;

    #设定日志格式
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #设置nginx是否将存储访问日志。关闭这个选项可以让读取磁盘IO操作更快
    #access_log  logs/access.log  main;

     #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，
    #对于普通应用，必须设为 on,
    #如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，
    #以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    # 高效文件传输
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    # types_hash_max_size 影响散列表的冲突率。types_hash_max_size越大，就会消耗更多的内存，但散列key的冲突率会降低，检索速度就更快。types_hash_max_size越小，消耗的内存就越小，但散列key的冲突率可能上升。
    types_hash_max_size 2048;

    #连接超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip  on;
    gzip_disable "MSIE [1-6].";
    gzip_comp_level  6;
    gzip_min_length  1000; #置对数据启用压缩的最少字节数。如果一个请求小于1000字节，我们最好不要压缩它，因为压缩这些小的数据会降低处理此请求的所有进程的速度。
    gzip_proxied     expired no-cache no-store private auth;
    gzip_types       text/plain application/x-javascript text/xml text/css application/xml;

    #Buffers：另一个很重要的参数为buffer，如果buffer太小，Nginx会不停的写一些临时文件，这样会导致磁盘不停的去读写，现在我们先了解设置buffer的一些相关参数：
    #client_body_buffer_size:允许客户端请求的最大单个文件字节数
    #client_header_buffer_size:用于设置客户端请求的Header头缓冲区大小，大部分情况1KB大小足够
    #client_max_body_size:设置客户端能够上传的文件大小，默认为1m
    #large_client_header_buffers:该指令用于设置客户端请求的Header头缓冲区大小
    #设定请求缓冲
    client_body_buffer_size 10K;
    client_header_buffer_size 1k;
    client_max_body_size 8m;
    large_client_header_buffers 2 1k;


    map $http_user_agent $outdated {  # 判断浏览器版本
            default                    0;
            "~MSIE [6-9].[0-9]"        1;
            "~MSIE 10.0"               1;
    }

    # weight：轮询权值，默认值为1。
    # down：表示当前的server暂时不参与负载。
    # max_fails：允许请求失败的次数，默认为1。当超过最大次数时，返回 proxy_next_upstream 模块定义的错误。
    # fail_timeout：有两层含义，一是在fail_timeout时间内最多容许max_fails次失败；二是在经历了max_fails次失败以后，30s时间内不分配请求到这台服务器。
    # backup ： 备份机器。当其他所有的非 backup 机器出现故障的时候，才会请求backup机器，因此这台机器的压力最轻。
    # max_conns： 限制同时连接到某台后端服务器的连接数，默认为 0。即无限制。
    # proxy_next_upstream ： 这个指令属于 http_proxy 模块的，指定后端返回什么样的异常响应

    #负载均衡
    #upstream DataBase {
    #    ip_hash; # 每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题。
    #    server 10.xx.xx.xx weight=1 max_fails=2 fail_timeout=30s;
    #    server 10.xx.xx.xx;
    #    server 10.xx.xx.xx;
    #}

    server {
        listen       80; #端口号
          server_name  v.fpdiov.com; #域名


        location /api {  #代理API
            proxy_pass   http://api.fpdiov.com:8090;
        #    proxy_set_header Host      $host;
        #    proxy_set_header X-Real-IP $remote_addr; #在web服务器端获得用户的真实ip
        #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_redirect     off;
            proxy_connect_timeout 600; #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_read_timeout 600; #连接成功后，后端服务器响应时间(代理接收超时)
            proxy_send_timeout 600; #后端服务器数据回传时间(代理发送超时)
            proxy_buffer_size 32k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 32k; #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
            proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
            proxy_temp_file_write_size 64k; #设定缓存文件夹大小，大于这个值，将从upstream服>务器传
            keepalive_requests 500;
            proxy_http_version 1.1;
            proxy_ignore_client_abort on;
        }

        location ^~ / {
            root /mnt/www/fpd-car-manage-frontend; #启动根目录
            if ($outdated = 1){
                rewrite ^ http://oisbyqrnc.bkt.clouddn.com redirect;  #判断浏览器版本跳转
            }
            index index.html; #默认访问页面
            try_files $uri $uri/ /index.html;
        }
    }


    #server {
    #    listen       80; #侦听80端口
    #    server_name  localhost; #访问域名

        #charset koi8-r; # 字符集

        #access_log  logs/host.access.log  main;

        #location / {
        #    root   html;
        #    index  index.html index.htm;
        #}

        #error_page  404              /404.html; #　错误页面

        # redirect server error pages to the static page /50x.html
        #
        #error_page   500 502 503 504  /50x.html;
        #location = /50x.html {
        #    root   html;
        #}

        #静态文件，nginx自己处理
        #location ~ ^/(images|javascript|js|css|flash|media|static)/ {

            #过期30天，静态文件不怎么更新，过期可以设大一点，
            #如果频繁更新，则可以设置得小一点。
        #   expires 30d;
        #}

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    #}


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #启用 https, 使用 http/2 协议, nginx 1.9.11 启用 http/2 会有bug, 已在 1.9.12 版本中修复.
    #    listen       443 ssl;
    #    server_name  localhost;
    #     ssl on;
    #    ssl_certificate      cert.pem; #证书路径;
    #    ssl_certificate_key  cert.key; #私钥路径;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5; #指定的套件加密算法
    #    ssl_prefer_server_ciphers  on; # 设置协商加密算法时，优先使用我们服务端的加密套件，而不是客户端浏览器的加密套件。
    #    ssl_session_timeout 60m;  #缓存有效期
    #    ssl_session_cache shared:SSL:10m;  #储存SSL会话的缓存类型和大小
    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

##五、Nginx负载均衡配置
Nginx集反向代理和负载均衡于一身，在配置文件中修改配就可以实现

首先我们打开配置文件

```
[root@localhost nginx]# vim conf/nginx.conf
```

每一个server就是一个虚拟主机，我们有一个当作web服务器来使用

```
listen 80;代表监听80端口
server_name xxx.com;代表外网访问的域名
location / {};代表一个过滤器，/匹配所有请求，我们还可以根据自己的情况定义不同的过滤，比如对静态文件js、css、image制定专属过滤
root html;代表站点根目录
index index.html;代表默认主页
```
![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170419164359634-2043724986.png)

这样配置完毕我们输入域名就可以访问到该站点了。

负载均衡功能往往在接收到某个请求后分配到后端的多台服务器上，那我们就需要upstream{}块来配合使用

```
upstream xxx{};upstream模块是命名一个后端服务器组，组名必须为后端服务器站点域名，内部可以写多台服务器ip和port，还可以设置跳转规则及权重等等
ip_hash;代表使用ip地址方式分配跳转后端服务器，同一ip请求每次都会访问同一台后端服务器
server;代表后端服务器地址

server{};server模块依然是接收外部请求的部分
server_name;代表外网访问域名
location / {};同样代表过滤器，用于制定不同请求的不同操作
proxy_pass;代表后端服务器组名，此组名必须为后端服务器站点域名

server_name和upstream{}的组名可以不一致，server_name是外网访问接收请求的域名，upstream{}的组名是跳转后端服务器时站点访问的域名
```

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170419165116649-972950787.png)

配置一下Windows的host将我们要访问的域名aaa.test.com指向Linux

因为硬件有限，我是将Windows中的IIS作为Nginx的后端服务器，所以配置一下IIS的站点域名

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170419171121993-488143433.png)

打开cmd再ping一下aaa.test.com确实指向Linux系统了，再打开浏览器输入aaa.test.com会显示bbb这个站点就代表负载成功了。

![](https://images2015.cnblogs.com/blog/172889/201704/172889-20170419171408649-130031505.png)

##六、配置站点密码访问
###安装 htpasswd 工具
####Ububtu平台
```
apt-get install apache2-utils
```
####CenterOS平台
```
yum  -y install httpd-tools
```

###设置账号密码
```
htpasswd -c /usr/local/nginx/htpasswd userName
```

###修改 nginx 配置文件
```
location / {
    root   html;
    index  index.html index.htm index index.jpg;
    auth_basic 'Restricted';
    auth_basic_user_file htpasswd;
  }
```

###htpasswd选项参数
```
htpasswd命令选项参数说明
-c 创建一个加密文件
-n 不更新加密文件，只将htpasswd命令加密后的用户名密码显示在屏幕上
-m 默认htpassswd命令采用MD5算法对密码进行加密
-d htpassswd命令采用CRYPT算法对密码进行加密
-p htpassswd命令不对密码进行进行加密，即明文密码
-s htpassswd命令采用SHA算法对密码进行加密
-b htpassswd命令行中一并输入用户名和密码而不是根据提示输入密码
-D 删除指定的用户
```

###htpasswd例子
####a、如何利用htpasswd命令添加用户？
```
htpasswd -bc ./.passwd tonyzhang pass
```
在当前目录下生成一个.passwd文件，用户名tonyzhang ，密码：pass，默认采用MD5加密方式

####b、如何在原有密码文件中增加下一个用户？
```
htpasswd -b ./.passwd onlyzq pass
```
去掉c选项，即可在第一个用户之后添加第二个用户，依此类推

####c、如何不更新密码文件，只显示加密后的用户名和密码？
```
htpasswd -nb tonyzhang pass
```
不更新.passwd文件，只在屏幕上输出用户名和经过加密后的密码

####d、如何利用htpasswd命令删除用户名和密码？
```
htpasswd -D .passwd tonyzhang
```

####e、如何利用 htpasswd 命令修改密码？
```
htpasswd -D .passwd tonyzhang
htpasswd -b .passwd tonyzhang pass
```

