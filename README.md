# mmWave Insight

**基于毫米波雷达的实时活动识别与可视化平台**

</div>

---

## 📖 项目简介

**mmWave Insight** 是一个集成了深度学习与实时可视化技术的毫米波雷达数据处理平台。该项目能够接收雷达点云数据，通过预训练的神经网络模型实时识别多种人体活动（如行走、跌倒、坐下、挥手等），并以直观的极坐标图表形式展示雷达探测结果。

### ✨ 核心特性

-   **实时点云可视化**：基于 Canvas 开发的高性能雷达极坐标图，支持多点云动态渲染。
-   **智能活动识别**：集成 TensorFlow.js，在浏览器端实现低延迟的人体行为识别。
-   **多维度数据监控**：实时展示活动置信度曲线，记录历史行为轨迹。
-   **仿真模拟系统**：内置模拟服务，支持在无硬件连接的情况下进行算法演示与开发。
-   **响应式设计**：适配不同屏幕尺寸，提供深色模式交互体验。

## 🛠️ 技术栈

-   **前端框架**: React 18 + TypeScript
-   **构建工具**: Vite
-   **AI 引擎**: TensorFlow.js
-   **样式处理**: Tailwind CSS
-   **数据可视化**: HTML5 Canvas + 自定义图表组件

## 🚀 快速开始

### 前置要求

-   [Node.js](https://nodejs.org/) (建议 v16.0 或更高版本)
-   [Python 3.8+](https://www.python.org/) (仅用于模型转换)

### 安装步骤

1.  **克隆仓库**
    ```bash
    git clone https://github.com/LIANGSUAI/mmwave-insight.git
    cd mmwave-insight
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    复制 `.env.example`（如果有）或创建 `.env.local`，并设置您的 API 密钥：
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

## 🧠 模型管理与转换

本项目使用 Keras 训练模型，并将其转换为 TensorFlow.js 格式以供前端调用。

1.  **准备模型**：确保原始模型文件位于 `h5model/model_best_opt.h5`。
2.  **执行转换**：
    ```bash
    python scripts/convert_model.py
    ```
    该脚本会自动安装必要的 Python 依赖，并将转换后的文件输出至 `public/model/` 目录。

## 📂 项目结构

```text
├── components/          # UI 组件 (雷达图、活动图表等)
├── h5model/             # 原始 H5 模型及训练数据集 (已忽略)
├── public/              # 静态资源及转换后的 TFJS 模型
├── scripts/             # 模型转换与数据处理脚本
├── services/            # 模拟数据流与业务逻辑
├── types.ts             # 全局 TypeScript 类型定义
└── App.tsx              # 应用主入口
```

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。
