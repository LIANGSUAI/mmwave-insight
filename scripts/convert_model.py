import os
import sys
import subprocess

def install_tensorflowjs():
    print("正在安装 tensorflowjs...")
    try:
        # 使用清华镜像源加速安装，避免网络超时
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", 
            "tensorflowjs", 
            "-i", "https://pypi.tuna.tsinghua.edu.cn/simple"
        ])
        print("tensorflowjs 安装成功")
    except subprocess.CalledProcessError:
        print("安装 tensorflowjs 失败，请手动运行: pip install tensorflowjs -i https://pypi.tuna.tsinghua.edu.cn/simple")
        sys.exit(1)

def convert_model():
    # 检查是否安装了 tensorflowjs
    # 直接通过命令行检查，避免导入 python 包导致的不兼容错误
    import shutil
    if shutil.which("tensorflowjs_converter") is None:
        print("未找到 tensorflowjs_converter，尝试安装...")
        install_tensorflowjs()

    input_path = os.path.join("..", "h5model", "model_best_opt.h5")
    output_path = os.path.join("..", "public", "model")

    # 确保输出目录存在
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    print(f"正在将模型从 {input_path} 转换为 TF.js 格式...")
    print(f"输出目录: {output_path}")

    # 构建转换命令
    # tensorflowjs_converter --input_format keras input.h5 output_dir
    cmd = [
        "tensorflowjs_converter",
        "--input_format", "keras",
        input_path,
        output_path
    ]

    try:
        # 在 Windows 上，tensorflowjs_converter 可能是一个脚本，需要通过 python -m tensorflowjs.converters.converter 或者是直接调用
        # 更可靠的方法是使用 subprocess 调用命令行
        subprocess.check_call(cmd, shell=True)
        print("模型转换成功！")
        print(f"模型文件已保存到: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"模型转换失败: {e}")
        print("请确保您的 Python 环境中安装了 tensorflowjs，并且模型文件路径正确。")
    except Exception as e:
        print(f"发生错误: {e}")

if __name__ == "__main__":
    # 切换到脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    convert_model()
