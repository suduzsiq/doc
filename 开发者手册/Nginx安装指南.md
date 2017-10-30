#linux环境下安装nginx步骤
**开始前，请确认gcc g++开发类库是否装好，默认已经安装**
* ububtu平台编译环境可以使用以下指令

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

##一、选定安装文件目录
可以选择任何目录，本文选择  cd /usr/local/nginx

```
cd /usr/local/nginx
```
##二、安装PCRE库
[ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/ ](ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/ )下载最新的 PCRE 源码包，使用下面命令下载编译和安装 PCRE 包：（本文参照下载文件版本：pcre-8.37.tar.gz 经过验证未发现这个版本，若想下载最新版本请打开上面网址。本文选择pcre-8.39.tar.gz）

```
cd /usr/local/src
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.39.tar.gz
tar -zxvf pcre-8.37.tar.gz
cd pcre-8.34
./configure
make
make install
```
##三、安装zlib库
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
##四、安装openssl（某些vps默认没装ssl)
```
cd /usr/local/src
wget https://www.openssl.org/source/openssl-1.0.1t.tar.gz
tar -zxvf openssl-1.0.1t.tar.gz
```
##五、安装nginx
Nginx 一般有两个版本，分别是稳定版和开发版，您可以根据您的目的来选择这两个版本的其中一个，下面是把 Nginx 安装到 /usr/local/nginx 目录下的详细步骤：

```
cd /usr/local/nginx
wget http://nginx.org/download/nginx-1.1.10.tar.gz
tar -zxvf nginx-1.1.10.tar.gz
cd nginx-1.1.10
./configure
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
##六、启动nginx
因为可能apeache占用80端口，apeache端口尽量不要修改，我们选择修改nginx端口。

linux 修改路径/usr/local/nginx/conf/nginx.conf，Windows 下 安装目录\conf\nginx.conf。

修改端口为8090，localhost修改为你服务器ip地址。（成功就在眼前！！）

![](http://images2015.cnblogs.com/blog/1095329/201703/1095329-20170328193900029-2024017752.png)

启动nginx

```
netstat -ano|grep 80
```
如果查不到执行结果，则忽略上一步（ubuntu下必须用sudo启动，不然只能在前台运行）

```
sudo /usr/local/nginx/nginx
```
##七、nginx重启、关闭、启动
###启动
启动代码格式：nginx安装目录地址 -c nginx配置文件地址

```
[root@LinuxServer sbin]# /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```
###停止
nginx的停止有三种方式：

**从容停止**

1、查看进程号

```
[root@LinuxServer ~]# ps -ef|grep nginx
```
![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102182744854-1291053517.png)

2、杀死进程

```
[root@LinuxServer ~]# kill -QUIT 2072
```
![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102182652354-960281274.png)

**快速停止**

1、查看进程号

```
[root@LinuxServer ~]# ps -ef|grep nginx
```
![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102183103651-1859453208.png)

2、杀死进程

```
[root@LinuxServer ~]# kill -TERM 2132
或 [root@LinuxServer ~]# kill -INT 2132
```
![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102183340010-2024212451.png)

**强制停止**

```
[root@LinuxServer ~]# pkill -9 nginx
```
###重启
**1、验证nginx配置文件是否正确**

方法一：进入nginx安装目录sbin下，输入命令./nginx -t

看到如下显示nginx.conf syntax is ok

nginx.conf test is successful

说明配置文件正确！

![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102184633432-1268782338.png)

方法二：在启动命令-c前加-t
![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102185023385-456612180.png)

**2、重启Nginx服务**

方法一：进入nginx可执行目录sbin下，输入命令./nginx -s reload 即可

![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102185521057-1341380905.png)

方法二：查找当前nginx进程号，然后输入命令：kill -HUP 进程号 实现重启nginx服务

![](http://images2015.cnblogs.com/blog/848552/201601/848552-20160102185838167-234856506.png)
##八、配置代理
```
server {
        listen       80;
        server_name  localhost;

        add_header Access-Control-Allow-Origin *;

        location / {
            root   /var/www/orange;
            index  index.html index.htm;
        }

        location /orange/ {
            proxy_pass http://www.easy-mock.com/mock/59882d4ca1d30433d8582077/orange/;
            client_max_body_size    1000m;
        }
    }
```