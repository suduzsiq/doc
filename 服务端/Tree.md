#Tree
[http://blog.csdn.net/zhangzeyuaaa/article/details/24574769](http://blog.csdn.net/zhangzeyuaaa/article/details/24574769)

###Department
```

public class Department {

	private Integer id;

	private String name;

	private Integer parentId;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

}

```

###Tree
```
import java.util.ArrayList;
import java.util.List;

public class Tree {

	private Integer id;

	private String name;

	private List<Tree> child;

	public static Tree getTree(List<Department> departmentList) {
		Tree tree = new Tree();
		for (Department department : departmentList) {
			if (null == department.getParentId()) {
				tree = build(department, departmentList);
			}
		}
		return tree;
	}

	private static Tree build(Department department, List<Department> departmentList) {
		Tree node = new Tree();
		node.id = department.getId();
		node.name = department.getName();
		node.child = new ArrayList<Tree>();
		for (Department dept : departmentList) {
			if (node.id.equals(dept.getParentId())) {
				node.child.add(build(dept, departmentList));
			}
		}
		return node;
	}
}

```

###Test
```
import java.util.ArrayList;
import java.util.List;

public class Test {

	public static void main(String[] args) {
		Department d1 = new Department();
		d1.setId(1);
		d1.setName("集团");
		Department d11 = new Department();
		d11.setId(2);
		d11.setName("技术部");
		d11.setParentId(1);
		Department d12 = new Department();
		d12.setId(3);
		d12.setName("行政事业部");
		d12.setParentId(1);
		Department d111 = new Department();
		d111.setId(4);
		d111.setName("研发一组");
		d111.setParentId(2);
		Department d112 = new Department();
		d112.setId(5);
		d112.setName("研发二组");
		d112.setParentId(2);

		List<Department> departmentList = new ArrayList<Department>();
		departmentList.add(d1);
		departmentList.add(d11);
		departmentList.add(d12);
		departmentList.add(d111);
		departmentList.add(d112);

		Tree tree = Tree.getTree(departmentList);
		System.out.println(tree);
	}
}

```
