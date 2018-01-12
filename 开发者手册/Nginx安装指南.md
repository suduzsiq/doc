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

