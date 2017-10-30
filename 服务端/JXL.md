#JXL
##创建文件
拟生成一个名为“test.xls”的Excel文件，其中第一个工作表被命名为“第一页”，大致效果如下：

```
package test;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import java.io.File;

public class CreateExcel {
    public static void main(String args[]) {
        try {
            //打开文件
            WritableWorkbook book = Workbook.createWorkbook(new File(" test.xls "));
            //生成名为“第一页”的工作表，参数0表示这是第一页
            WritableSheet sheet = book.createSheet(" 第一页 ", 0);
            //在Label对象的构造子中指名单元格位置是第一列第一行(0,0)
            //以及单元格内容为test
            Label label = new Label(0, 0, " test ");

            //将定义好的单元格添加到工作表中
            sheet.addCell(label);

            /**
             * 生成一个保存数字的单元格 必须使用Number的完整包路径，否则有语法歧义 单元格位置是第二列，第一行，值为789.123
             */
            jxl.write.Number number = new jxl.write.Number(1, 0, 555.12541);
            sheet.addCell(number);

            //写入数据并关闭文件
            book.write();
            book.close();

        } catch (Exception e) {
            System.out.println(e);
        }
    }
} 
```
编译执行后，会产生一个Excel文件。
 
##读取文件
以刚才我们创建的Excel文件为例，做一个简单的读取操作，程序代码如下：

```
package test;

import java.io.File;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;

public class ReadExcel {
    public static void main(String args[]) {
        try {
            Workbook book = Workbook.getWorkbook(new File(" test.xls "));
            //获得第一个工作表对象 
            Sheet sheet = book.getSheet(0);
            //得到第一列第一行的单元格 
            Cell cell1 = sheet.getCell(0, 0);
            String result = cell1.getContents();
            System.out.println(result);
            book.close();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
} 

```
程序执行结果：test

##修改文件
利用jExcelAPI可以修改已有的Excel文件，修改Excel文件的时候，除了打开文件的方式不同之外，
其他操作和创建Excel是一样的。下面的例子是在我们已经生成的Excel文件中添加一个工作表：
 
```
package test;

import java.io.File;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

public class UpdateExcel {
    public static void main(String args[]) {
        try {
            //Excel获得文件 
            Workbook wb = Workbook.getWorkbook(new File(" test.xls "));
            //打开一个文件的副本，并且指定数据写回到原文件 
            WritableWorkbook book = Workbook.createWorkbook(new File(" test.xls "), wb);
            //添加一个工作表 
            WritableSheet sheet = book.createSheet(" 第二页 ", 1);
            sheet.addCell(new Label(0, 0, " 第二页的测试数据 "));
            book.write();
            book.close();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}

```

##其他操作
###数据格式化
在Excel中不涉及复杂的数据类型，能够比较好的处理字串、数字和日期已经能够满足一般的应用。

字符串的格式化涉及到的是字体、粗细、字号等元素，这些功能主要由WritableFont和WritableCellFormat类来负责。假设我们在生成一个含有字串的单元格时，使用如下语句，为方便叙述，我们为每一行命令加了编号：
 
```
WritableFont font1 = new WritableFont(WritableFont.TIMES, 16, WritableFont.BOLD);

WritableCellFormat format1 = new WritableCellFormat(font1);

Label label = new Label(0, 0, "test", format1);
```
①指定了字串格式：字体为TIMES，字号16，加粗显示。WritableFont有非常丰富的构造子，供不同情况下使用，jExcelAPI的java-doc中有详细列表，这里不再列出

②处代码使用了WritableCellFormat类，这个类非常重要，通过它可以指定单元格的各种属性，后面的单元格格式化中会有更多描述。

③处使用了Label类的构造子，指定了字串被赋予那种格式

在WritableCellFormat类中，还有一个很重要的方法是指定数据的对齐方式，比如针对我们上面的实例，可以指定：

```
//把水平对齐方式指定为居中 
format1.setAlignment(jxl.format.Alignment.CENTRE);
//把垂直对齐方式指定为居中 
format1.setVerticalAlignment(jxl.format.VerticalAlignment.CENTRE);
```
###单元格操作
Excel中很重要的一部分是对单元格的操作，比如行高、列宽、单元格合并等，所幸jExcelAPI提供了这些支持。这些操作相对比较简单，下面只介绍一下相关的API。

1、合并单元格
```
WritableSheet.mergeCells( int  m, int  n, int  p, int  q); 
//作用是从(m,n)到(p,q)的单元格全部合并，比如： 
WritableSheet sheet = book.createSheet(“第一页”, 0 );
//合并第一列第一行到第六列第一行的所有单元格 
sheet.mergeCells( 0 , 0 , 5 , 0 );
```
合并既可以是横向的，也可以是纵向的。合并后的单元格不能再次进行合并，否则会触发异常。

2、行高和列宽

```
WritableSheet.setRowView( int  i, int  height);
//作用是指定第i+1行的高度，比如：
//将第一行的高度设为200 
sheet.setRowView( 0 , 200 );
WritableSheet.setColumnView( int  i, int  width);
//作用是指定第i+1列的宽度，比如：
//将第一列的宽度设为30 
sheet.setColumnView( 0 , 30 );
```

其中：如果读一个excel，需要知道它有多少行和多少列，如下操作：
```
Workbook book = Workbook.getWorkbook(new File(" 测试1.xls "));
//获得第一个工作表对象 
Sheet sheet = book.getSheet(0);
//得到第一列第一行的单元格 
int columnum = sheet.getColumns(); //得到列数 
int rownum = sheet.getRows(); //得到行数 
System.out.println(columnum);
System.out.println(rownum);
//循环进行读写
for(int i = 0; i<rownum; i ++){
    for (int j = 0; j < columnum; j++) {
        Cell cell1 = sheet.getCell(j, i);
        String result = cell1.getContents();
        System.out.print(result);
        System.out.print(" \t ");
    }
} 
book.close();
```
