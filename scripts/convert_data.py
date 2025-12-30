import numpy as np
import json
import os
import sys

def convert_npz_to_json():
    # 1. 查找 .npz 文件 (递归查找)
    data_dir = os.path.join("..", "h5model")
    npz_files = []
    
    print(f"正在 {data_dir} 中搜索 .npz 文件...")
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".npz"):
                npz_files.append(os.path.join(root, file))
    
    if not npz_files:
        print(f"错误：在 {data_dir} 及其子目录中未找到 .npz 文件。")
        print("请确保您的数据集已放入 h5model 文件夹中。")
        return

    print(f"找到 {len(npz_files)} 个数据文件。")

    # 优先选择一个  的样本作为测试，如果没找到就用第一个
    selected_file = npz_files[0]
    for f in npz_files:
        if "final" in f.lower(): #修改此处以选择特定文件
            selected_file = f
            break
            
    input_path = selected_file
    output_path = os.path.join("..", "public", "data", "test_sample.json")
    
    # 获取真实标签（从文件夹名）
    # 路径类似: ..\h5model\final_sharded_dataset\walk\processing_people7_walk_1.npz
    parent_dir = os.path.dirname(input_path)
    ground_truth = os.path.basename(parent_dir)
    
    print(f"正在读取数据文件: {input_path}")
    print(f"推测的真实标签 (Ground Truth): {ground_truth}")
    
    try:
        # 尝试使用 allow_pickle=True 读取，以防包含对象数组
        # 有些 .npz 文件可能损坏或格式特殊，增加错误处理
        try:
            data = np.load(input_path, allow_pickle=True)
        except Exception as load_err:
            print(f"标准加载失败: {load_err}")
            print("尝试作为普通二进制文件检查...")
            with open(input_path, 'rb') as f:
                header = f.read(10)
                print(f"文件头 (前10字节): {header}")
            raise load_err

        print("文件包含的键:", data.files)
            
        # 尝试自动找到数据键 (通常是 'arr_0', 'x_test', 'data' 等)
        # 这里假设数据是 5D 的体素数据
        target_key = None
        for key in data.files:
            shape = data[key].shape
            # 检查是否符合模型输入维度 (N, 60, 10, 32, 32, 1) 或类似
            # 忽略样本数量 N，检查后5维
            if len(shape) >= 5: 
                target_key = key
                break
        
        if not target_key:
            target_key = data.files[0] # 默认取第一个
            print(f"未找到明显符合形状的键，默认使用: {target_key}")
        else:
            print(f"自动选择数据键: {target_key}")

        dataset = data[target_key]
        print(f"原始数据形状: {dataset.shape}")

        # 取第一个样本
        sample = dataset[0]
        
        # 确保是 float32 类型
        sample = sample.astype(float)

        # 保存为 JSON
        sample_list = sample.tolist()
        
        # 确保输出目录存在
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, 'w') as f:
            json.dump(sample_list, f)
            
        print(f"转换成功！测试样本已保存至: {output_path}")
        print("现在您可以在网页中点击测试按钮来加载此数据了。")

    except Exception as e:
        print(f"转换失败: {e}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    convert_npz_to_json()
