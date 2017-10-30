什么是原型？

原型是一个对象，其他对象可以通过它实现属性继承。

任何一个对象都可以成为原型么？

是

哪些对象有原型

所有的对象在默认的情况下都有一个原型，因为原型本身也是对象，所以每个原型自身又有一个原型(只有一种例外，默认的对象原型在原型链的顶端。更多关于原型链的将在后面介绍)

好吧，再绕回来，那什么又是对象呢?

在javascript中，一个对象就是任何无序键值对的集合,如果它不是一个主数据类型(undefined，null，boolean，number，or string)，那它就是一个对象

你说每个对象都有一个原型，可是我当我写成({}).prototype 我得到了一个null，你说的不对吧？

忘记你已经学到的关于原型属性的一切，它可能就是你对原型困惑的根源所在。一个对象的真正原型是被对象内部的[[Prototype]]属性(property)所持有。ECMA引入了标准对象原型访问器Object.getPrototype(object)，到目前为止只有Firefox和chrome实现了此访问器。除了IE，其他的浏览器支持非标准的访问器__proto__，如果这两者都不起作用的，我们需要从对象的构造函数中找到的它原型属性。下面的代码展示了获取对象原型的方法

var a = {}; 

//Firefox 3.6 and Chrome 5 

Object.getPrototypeOf(a); //[object Object]   

//Firefox 3.6, Chrome 5 and Safari 4 

a.__proto__; //[object Object]   

//all browsers 

a.constructor.prototype; //[object Object]

ok，一切都进行的很好，但是false明明是一个主数据类型，可是false.__proto__却返回了一个值

当你试图获取一个主数据类型的原型时，它被强制转化成了一个对象

//(works in IE too, but only by accident) 
 
false.__proto__ === Boolean(false).__proto__; //true

我想在继承中使用原型，那我该怎么做？

如果仅仅只是因为一个实例而使用原型是没有多大意义的，这和直接添加属性到这个实例是一样的，假如我们已经创建了一个实例对象 ，我们想要继承一个已经存在的对象的功能比如说Array，我们可以像下面这样做( 在支持__proto__ 的浏览器中)

//unusual case and does not work in IE
var a = {};
a.__proto__ = Array.prototype;
a.length; //0

———————————————————————————————————–
 译者注:上面这个例子中，首先创建了一个对象a，然后通过a的原型来达到继承Array 这个已经存在的对象的功能
———————————————————————————————————–

原型真正魅力体现在多个实例共用一个通用原型的时候。原型对象(注:也就是某个对象的原型所引用的对象)的属性一旦定义，就可以被多个引用它的实例所继承(注:即这些实例对象的原型所指向的就是这个原型对象)，这种操作在性能和维护方面其意义是不言自明的

这也是构造函数的存在的原因么?

是的。构造函数提供了一种方便的跨浏览器机制，这种机制允许在创建实例时为实例提供一个通用的原型

在你能够提供一个例子之前，我需要知道constructor.prototype 属性究竟是什么？

首先，javascript并没有在构造函数(constructor)和其他函数之间做区分，所以说每个函数都有一个原型属性。反过来，如果不是函数，将不会有这样一个属性。请看下面的代码

//function will never be a constructor but it has a prototype property anyway 
 
Math.max.prototype; //[object Object] 
 
//function intended to be a constructor has a prototype too 
 
var A = function(name) { 
 
     this.name = name; 
 
} 
 
 A.prototype; //[object Object]   
 
 //Math is not a function so no prototype property 
 
 Math.prototype; //null

现在我们可以下个定义了：函数A的原型属性(prototype property )是一个对象，当这个函数被用作构造函数来创建实例时，该函数的原型属性将被作为原型赋值给所有对象实例(注:即所有实例的原型引用的是函数的原型属性)
———————————————————————————————————-
译者注:以下的代码更详细的说明这一切

//创建一个函数b
var b = function(){ var one; }
//使用b创建一个对象实例c
var c = new b();
//查看b 和c的构造函数
b.constructor;  // function Function() { [native code]}
b.constructor==Function.constructor; //true
c.constructor; //实例c的构造函数 即 b function(){ var one; }
c.constructor==b //true
//b是一个函数，查看b的原型如下
b.constructor.prototype // function (){}
b.__proto__  //function (){}

//b是一个函数，由于javascript没有在构造函数constructor和函数function之间做区分，所以函数像constructor一样，
//有一个原型属性，这和函数的原型(b.__proto__ 或者b.construtor.prototype)是不一样的
b.prototype //[object Object]   函数b的原型属性

b.prototype==b.constructor.prototype //fasle
b.prototype==b.__proto__  //false
b.__proto__==b.constructor.prototype //true

//c是一个由b创建的对象实例，查看c的原型如下
c.constructor.prototype //[object Object] 这是对象的原型
c.__proto__ //[object Object] 这是对象的原型

c.constructor.prototype==b.constructor.prototype;  //false  c的原型和b的原型比较
c.constructor.prototype==b.prototype;  //true c的原型和b的原型属性比较

//为函数b的原型属性添加一个属性max
b.prototype.max = 3
//实例c也有了一个属性max
c.max  //3
上面的例子中，对象实例c的原型和函数的b的原型属性是一样的，如果改变b的原型属性，则对象实例c
的原型也会改变
———————————————————————————————————-
理解一个函数的原型属性(function’s prototype property )其实和实际的原型(prototype)没有关系对我们来说至关重要

//(example fails in IE) 
 
 var A = function(name) { 
 
  this.name = name; 
 
} 
 
A.prototype == A.__proto__; //false 
 
 A.__proto__ == Function.prototype; //true - A's prototype is set to its constructor's prototype property


给个例子撒

你可能曾经上百次的像这样使用javascript，现在当你再次看到这样的代码的时候，你或许会有不同的理解

1
2
3
4
5
6
7
8
9
10
11
12
13
14
//Constructor. <em>this</em> is returned as new object and its internal [[prototype]] property will be set to the constructor's default prototype property
var Circle = function(radius) {
    this.radius = radius;
    //next line is implicit, added for illustration only
    //this.__proto__ = Circle.prototype;
 }    
//augment Circle's default prototype property thereby augmenting the prototype of each generated instance
Circle.prototype.area = function() {
    return Math.PI*this.radius*this.radius;
 }   
 //create two instances of a circle and make each leverage the common prototype
var a = new Circle(3), b = new Circle(4);
 a.area().toFixed(2); //28.27
 b.area().toFixed(2); //50.27

 棒极了。如果我更改了构造函数的原型，是否意味着已经存在的该构造函数的实例将获得构造函数的最新版本？

不一定。如果修改的是原型属性，那么这样的改变将会发生。因为在a实际被创建之后，a.__proto__是一个对A.prototype 的一个引用，。

var A = function(name) {
    this.name = name;
 }   
var a = new A('alpha');
a.name; //'alpha'   
 A.prototype.x = 23;   
a.x; //23

——————————————————————————————————
译者注:这个和上例中的一样，实例对象a的原型(a.__proto__)是对函数A的原型属性(A.prototype)的引用，所以如果修改的是A的原型属性，

改变将影响由A创建的对象实例a 在下面的例子中，但是对函数A的原型进行了修改，但是并没有反应到A所创建的实例a中

var A = function(name)
{
this.name = name;
}
var a = new A(‘alpha’);
a.name; //’alpha’

A.__proto__.max = 19880716;

a.max   //undefined

——————————————————————————————————

但是如果我现在替换A的原型属性为一个新的对象，实例对象的原型a.__proto__却仍然引用着原来它被创建时A的原型属性

var A = function(name) {
    this.name = name;
}  
 var a = new A('alpha');
a.name; //'alpha'   
 A.prototype = {x:23};    
 a.x; //null

 ——————————————————————————————————————
译者注：即如果在实例被创建之后，改变了函数的原型属性所指向的对象，也就是改变了创建实例时实例原型所指向的对象

但是这并不会影响已经创建的实例的原型。
——————————————————————————————————————-

一个默认的原型是什么样子的？

var A = function() {};
 A.prototype.constructor == A; //true
 var a = new A();
 a.constructor == A; //true (a's constructor property inherited from it's prototype)

instance of 和原型有什么关系

如果a的原型属于A的原型链，表达式 a instance of A 值为true。这意味着 我们可以对instance of 耍个诡计让它不在起作用

var A = function() {}   
 
 var a = new A(); 
 
 a.__proto__ == A.prototype; //true - so instanceof A will return true 
 
 a instanceof A; //true;   
 
//mess around with a's prototype 
 
 a.__proto__ = Function.prototype; 
 
 //a's prototype no longer in same prototype chain as A's prototype property 
 
 a instanceof A; //false


 还能使用原型做些什么呢?

记住我曾经所提到过的每个构造函数都有一个原型属性，它用来为每一个它所创建的实例提供原型。这同样也适用原生态的构造函数Function,String等，扩展这个属性，我们可以达到扩展指定构造函数的所有实例
我曾经在之前的很多文章中使用过这个技巧来演示函数的拓展。在tracer utility 这篇文章中所有的string实例都实现了times这个方法，对字符串本身进行指定数目的复制

String.prototype.times = function(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
 } 
 
"hello!".times(3); //"hello!hello!hello!"; 
 
"please...".times(6);//"please...please...please...please...please...please..."

告诉我继承是怎样通过原型来工作的。什么是原型链?

因为每个对象和原型都有一个原型(注:原型也是一个对象)，对象的原型指向对象的父，而父的原型又指向父的父，我们把这种通过原型层层连接起来的关系撑为原型链。这条链的末端一般总是默认的对象原型。

a.__proto__ = b; 
 
 b.__proto__ = c; 
 
 c.__proto__ = {}; //default object 
 
{}.__proto__.__proto__; //null

原型的继承机制是发生在内部且是隐式的.当想要获得一个对象a的属性foo的值，javascript会在原型链中查找foo的存在，如果找到则返回foo的值，否则undefined被返回。

赋值呢？

原型的继承 is not a player 当属性值被设置成a.foo=’bar’是直接给a的属性foo设置了一个值bar。为了把一个属性添加到原型中，你需要直接指定该原型。


