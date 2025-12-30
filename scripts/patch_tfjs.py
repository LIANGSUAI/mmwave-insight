import os
import sys
import site

def patch_tensorflowjs():
    # 获取 site-packages 路径
    site_packages = site.getsitepackages()
    target_file = None
    
    # 查找目标文件
    for sp in site_packages:
        potential_path = os.path.join(sp, "tensorflowjs", "converters", "tf_saved_model_conversion_v2.py")
        if os.path.exists(potential_path):
            target_file = potential_path
            break
    
    if not target_file:
        print("错误：未找到 tensorflowjs 安装路径。请确保已安装 tensorflowjs。")
        return

    print(f"找到目标文件: {target_file}")
    
    try:
        with open(target_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        patched = False
        for line in lines:
            if "import tensorflow_decision_forests" in line and not line.strip().startswith("#"):
                new_lines.append(f"# {line}") # 注释掉这一行
                patched = True
                print("已注释掉 import tensorflow_decision_forests")
            else:
                new_lines.append(line)
        
        if patched:
            with open(target_file, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print("修补成功！现在可以运行转换脚本了。")
        else:
            print("文件似乎已经被修补过，或者未找到目标导入语句。")
            
    except Exception as e:
        print(f"修补失败: {e}")

if __name__ == "__main__":
    patch_tensorflowjs()
