# React Color Picker

A modern, interactive color picker built with React and Tailwind CSS. Features a beautiful UI with dynamic backgrounds, color previews, and seamless interactions.

![React Color Picker](./screenshot.png)

## ✨ Features

- 🌈 Dynamic Color Palette — Explore and pick from a vivid color range
- 🔍 Instant Color Search — Find colors by name or code
- 🎨 Live Color Preview — Instantly see your selected color
- 📱 Responsive Design — Works perfectly on all screen sizes
- 💾 Local Storage Save — Keeps your last selected color
- 🎯 Smart Contrast Detection — Auto-adjusts text color for readability
- 🔄 Random Color Mode — Discover new shades with one keypress
- 📋 One-Click Copy — Instantly copy color codes (HEX/RGB)
- ⌨️ Keyboard Shortcuts — Speed up your workflow
- 🪄 Gradient Backgrounds — Smooth transitions and aesthetic looks

## ⚡Tech Stack

| Technology          | Description                                   |
| ------------------- | --------------------------------------------- |
| ⚛️ **React**        | Frontend library for building interactive UIs |
| 💨 **Tailwind CSS** | Utility-first CSS framework for fast styling  |
| 🚀 **Vite**         | Super-fast bundler and development server     |


## ⌨️ Keyboard Shortcuts

| Key     | Action                         |
| ------- | ------------------------------ |
| `R`     | 🎲 Generate a random color     |
| `C`     | 📋 Copy the current color code |
| `← / →` | 🎯 Navigate between colors     |

## 🛠️ Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
cd React-First-Project/First_pro
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build

To create a production build:

```bash
npm run build
```

## Project Structure

```
src/
  ├── App.jsx        # Main application component
  ├── App.css        # Global styles
  └── assets/        # Static assets
```

## Color Utilities

The project includes several color utility functions:

- `hexToRgb`: Convert hex colors to RGB
- `getContrastColor`: Calculate contrast text color
- `shadeColor`: Generate lighter/darker color variants

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning or your own applications.
