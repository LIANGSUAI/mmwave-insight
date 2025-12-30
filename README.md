<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1QHJP9f-96GECMYbRweSri70r1jLsfHjs

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 模型设置

本项目使用 TensorFlow.js 加载模型。由于浏览器无法直接加载 `.h5` (Keras) 模型，您需要将其转换为 TensorFlow.js 格式。

1. 确保您已安装 Python。
2. 运行转换脚本：
   ```bash
   python scripts/convert_model.py
   ```
   该脚本会自动安装 `tensorflowjs` 并将 `h5model/model_best_opt.h5` 转换为 `public/model/model.json`。

3. 启动应用后，系统会自动加载转换后的模型。
